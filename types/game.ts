
// Game state types for Planetary Labour Clicker

export interface ProgressNode {
  id: string;
  title: string;
  description: string;
  cost: number;
  unlocked: boolean;
  benefit: {
    type: 'clickBonus' | 'passiveIncome' | 'multiplier';
    value: number;
  };
  flavorText?: string;
  prerequisite?: string; // ID of node that must be unlocked first
}

export interface GameState {
  labourUnits: number;
  totalLabourEarned: number;
  clickPower: number;
  passiveIncomePerSecond: number;
  globalMultiplier: number;
  unlockedNodes: string[];
  lastSaveTime: number;
}
