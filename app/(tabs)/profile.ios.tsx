
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { colors } from '@/styles/commonStyles';
import { useGameState } from '@/hooks/useGameState';
import { progressNodes } from '@/data/progressNodes';
import { formatNumber } from '@/utils/formatNumber';
import { IconSymbol } from '@/components/IconSymbol';
import * as Haptics from 'expo-haptics';

export default function ProgressTreeScreen() {
  const theme = useTheme();
  const { gameState, unlockNode } = useGameState();
  const [lastUnlockedMessage, setLastUnlockedMessage] = useState<string | null>(null);

  const handleUnlockNode = (nodeId: string) => {
    console.log('User attempting to unlock node:', nodeId);
    const node = progressNodes.find(n => n.id === nodeId);
    
    if (!node) return;

    // Check if already unlocked
    if (gameState.unlockedNodes.includes(nodeId)) {
      console.log('Node already unlocked');
      return;
    }

    // Check prerequisite
    if (node.prerequisite && !gameState.unlockedNodes.includes(node.prerequisite)) {
      Alert.alert('Locked', 'You must unlock the previous node first.');
      return;
    }

    // Check cost
    if (gameState.labourUnits < node.cost) {
      Alert.alert('Insufficient Labour', `You need ${formatNumber(node.cost)} Labour Units.`);
      return;
    }

    // Unlock the node
    const success = unlockNode(nodeId);
    if (success) {
      console.log('Node unlocked successfully:', node.title);
      if (node.flavorText) {
        setLastUnlockedMessage(node.flavorText);
        setTimeout(() => setLastUnlockedMessage(null), 5000);
      }
      
      // Haptic feedback
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const isNodeAvailable = (node: typeof progressNodes[0]) => {
    if (!node.prerequisite) return true;
    return gameState.unlockedNodes.includes(node.prerequisite);
  };

  const isNodeUnlocked = (nodeId: string) => {
    return gameState.unlockedNodes.includes(nodeId);
  };

  const getBenefitText = (node: typeof progressNodes[0]) => {
    switch (node.benefit.type) {
      case 'clickBonus':
        return `+${node.benefit.value} Labour per click`;
      case 'passiveIncome':
        return `+${node.benefit.value} Labour per second`;
      case 'multiplier':
        return `${node.benefit.value}x Global Multiplier`;
      default:
        return '';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Progress Tree</Text>
          <Text style={styles.subtitle}>Unlock nodes to scale your labour</Text>
        </View>

        {/* Flavor text message */}
        {lastUnlockedMessage && (
          <View style={styles.flavorMessageContainer}>
            <Text style={styles.flavorMessage}>{lastUnlockedMessage}</Text>
          </View>
        )}

        {/* Progress Nodes */}
        <View style={styles.nodesContainer}>
          {progressNodes.map((node, index) => {
            const unlocked = isNodeUnlocked(node.id);
            const available = isNodeAvailable(node);
            const canAfford = gameState.labourUnits >= node.cost;

            return (
              <React.Fragment key={node.id}>
                <TouchableOpacity
                  style={[
                    styles.nodeCard,
                    unlocked && styles.nodeCardUnlocked,
                    !available && styles.nodeCardLocked,
                  ]}
                  onPress={() => handleUnlockNode(node.id)}
                  disabled={unlocked || !available}
                  activeOpacity={0.7}
                >
                  {/* Status Icon */}
                  <View style={styles.nodeIconContainer}>
                    {unlocked ? (
                      <IconSymbol
                        ios_icon_name="checkmark.circle.fill"
                        android_material_icon_name="check-circle"
                        size={32}
                        color={colors.success}
                      />
                    ) : available ? (
                      <IconSymbol
                        ios_icon_name="circle"
                        android_material_icon_name="radio-button-unchecked"
                        size={32}
                        color={canAfford ? colors.primary : colors.textSecondary}
                      />
                    ) : (
                      <IconSymbol
                        ios_icon_name="lock.fill"
                        android_material_icon_name="lock"
                        size={32}
                        color={colors.locked}
                      />
                    )}
                  </View>

                  {/* Node Content */}
                  <View style={styles.nodeContent}>
                    <Text style={[
                      styles.nodeTitle,
                      unlocked && styles.nodeTitleUnlocked,
                      !available && styles.nodeTitleLocked,
                    ]}>
                      {node.title}
                    </Text>
                    <Text style={[
                      styles.nodeDescription,
                      !available && styles.nodeDescriptionLocked,
                    ]}>
                      {node.description}
                    </Text>
                    <Text style={[
                      styles.nodeBenefit,
                      unlocked && styles.nodeBenefitUnlocked,
                    ]}>
                      {getBenefitText(node)}
                    </Text>
                    {!unlocked && (
                      <View style={styles.costContainer}>
                        <Text style={[
                          styles.costText,
                          canAfford ? styles.costTextAffordable : styles.costTextExpensive,
                        ]}>
                          Cost: {formatNumber(node.cost)} Labour
                        </Text>
                      </View>
                    )}
                    {unlocked && (
                      <Text style={styles.unlockedText}>✓ UNLOCKED</Text>
                    )}
                  </View>
                </TouchableOpacity>

                {/* Connection line */}
                {index < progressNodes.length - 1 && (
                  <View style={styles.connectionLine} />
                )}
              </React.Fragment>
            );
          })}
        </View>

        {/* Bottom padding for tab bar */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  flavorMessageContainer: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.highlight,
  },
  flavorMessage: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  nodesContainer: {
    width: '100%',
  },
  nodeCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 2,
    borderColor: colors.secondary,
  },
  nodeCardUnlocked: {
    borderColor: colors.success,
    backgroundColor: colors.backgroundAlt,
  },
  nodeCardLocked: {
    borderColor: colors.locked,
    opacity: 0.6,
  },
  nodeIconContainer: {
    marginRight: 16,
    marginTop: 4,
  },
  nodeContent: {
    flex: 1,
  },
  nodeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  nodeTitleUnlocked: {
    color: colors.success,
  },
  nodeTitleLocked: {
    color: colors.textSecondary,
  },
  nodeDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  nodeDescriptionLocked: {
    color: colors.locked,
  },
  nodeBenefit: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: 8,
  },
  nodeBenefitUnlocked: {
    color: colors.success,
  },
  costContainer: {
    marginTop: 4,
  },
  costText: {
    fontSize: 14,
    fontWeight: '700',
  },
  costTextAffordable: {
    color: colors.primary,
  },
  costTextExpensive: {
    color: colors.textSecondary,
  },
  unlockedText: {
    fontSize: 12,
    color: colors.success,
    fontWeight: '700',
    marginTop: 4,
  },
  connectionLine: {
    width: 2,
    height: 20,
    backgroundColor: colors.secondary,
    alignSelf: 'center',
    marginVertical: 4,
  },
});
