
import { useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameState } from '@/types/game';
import { progressNodes } from '@/data/progressNodes';

const STORAGE_KEY = '@planetary_labour_game_state';
const SAVE_INTERVAL = 5000; // Save every 5 seconds

const initialGameState: GameState = {
  labourUnits: 0,
  totalLabourEarned: 0,
  clickPower: 1,
  passiveIncomePerSecond: 0,
  globalMultiplier: 1,
  unlockedNodes: [],
  lastSaveTime: Date.now(),
};

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [isLoaded, setIsLoaded] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load game state from storage
  useEffect(() => {
    console.log('Loading game state from storage');
    loadGameState();
  }, []);

  // Passive income ticker
  useEffect(() => {
    if (!isLoaded) return;

    const interval = setInterval(() => {
      setGameState(prev => {
        const passiveIncome = prev.passiveIncomePerSecond * prev.globalMultiplier;
        if (passiveIncome > 0) {
          console.log(`Passive income tick: +${passiveIncome.toFixed(2)} Labour Units`);
          return {
            ...prev,
            labourUnits: prev.labourUnits + passiveIncome,
            totalLabourEarned: prev.totalLabourEarned + passiveIncome,
          };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isLoaded, gameState.passiveIncomePerSecond, gameState.globalMultiplier]);

  // Auto-save
  useEffect(() => {
    if (!isLoaded) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveGameState(gameState);
    }, SAVE_INTERVAL);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [gameState, isLoaded]);

  const loadGameState = async () => {
    try {
      const savedState = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedState) {
        const parsed: GameState = JSON.parse(savedState);
        
        // Calculate offline progress
        const now = Date.now();
        const timeDiff = (now - parsed.lastSaveTime) / 1000; // seconds
        const offlineIncome = parsed.passiveIncomePerSecond * parsed.globalMultiplier * timeDiff;
        
        if (offlineIncome > 0) {
          console.log(`Offline progress: +${offlineIncome.toFixed(2)} Labour Units (${timeDiff.toFixed(0)}s)`);
        }
        
        setGameState({
          ...parsed,
          labourUnits: parsed.labourUnits + offlineIncome,
          totalLabourEarned: parsed.totalLabourEarned + offlineIncome,
          lastSaveTime: now,
        });
      }
      setIsLoaded(true);
    } catch (error) {
      console.error('Failed to load game state:', error);
      setIsLoaded(true);
    }
  };

  const saveGameState = async (state: GameState) => {
    try {
      const stateToSave = {
        ...state,
        lastSaveTime: Date.now(),
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
      console.log('Game state saved');
    } catch (error) {
      console.error('Failed to save game state:', error);
    }
  };

  const performLabour = useCallback(() => {
    console.log('User performed labour (clicked button)');
    setGameState(prev => {
      const labourGained = prev.clickPower * prev.globalMultiplier;
      return {
        ...prev,
        labourUnits: prev.labourUnits + labourGained,
        totalLabourEarned: prev.totalLabourEarned + labourGained,
      };
    });
  }, []);

  const unlockNode = useCallback((nodeId: string) => {
    const node = progressNodes.find(n => n.id === nodeId);
    if (!node) {
      console.error('Node not found:', nodeId);
      return false;
    }

    if (gameState.unlockedNodes.includes(nodeId)) {
      console.log('Node already unlocked:', nodeId);
      return false;
    }

    if (gameState.labourUnits < node.cost) {
      console.log('Not enough Labour Units to unlock:', nodeId);
      return false;
    }

    // Check prerequisite
    if (node.prerequisite && !gameState.unlockedNodes.includes(node.prerequisite)) {
      console.log('Prerequisite not met for:', nodeId);
      return false;
    }

    console.log(`Unlocking node: ${node.title} for ${node.cost} Labour Units`);

    setGameState(prev => {
      let newState = {
        ...prev,
        labourUnits: prev.labourUnits - node.cost,
        unlockedNodes: [...prev.unlockedNodes, nodeId],
      };

      // Apply benefits
      switch (node.benefit.type) {
        case 'clickBonus':
          newState.clickPower = prev.clickPower + node.benefit.value;
          console.log(`Click power increased by ${node.benefit.value} to ${newState.clickPower}`);
          break;
        case 'passiveIncome':
          newState.passiveIncomePerSecond = prev.passiveIncomePerSecond + node.benefit.value;
          console.log(`Passive income increased by ${node.benefit.value}/s to ${newState.passiveIncomePerSecond}/s`);
          break;
        case 'multiplier':
          newState.globalMultiplier = prev.globalMultiplier * node.benefit.value;
          console.log(`Global multiplier increased by ${node.benefit.value}x to ${newState.globalMultiplier.toFixed(2)}x`);
          break;
      }

      return newState;
    });

    return true;
  }, [gameState]);

  const resetGame = useCallback(async () => {
    console.log('Resetting game state');
    setGameState(initialGameState);
    await AsyncStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    gameState,
    isLoaded,
    performLabour,
    unlockNode,
    resetGame,
  };
}
