
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Platform,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { colors } from '@/styles/commonStyles';
import { useGameState } from '@/hooks/useGameState';
import { formatNumber, formatNumberWithCommas } from '@/utils/formatNumber';
import * as Haptics from 'expo-haptics';

export default function LabourScreen() {
  const theme = useTheme();
  const { gameState, isLoaded, performLabour } = useGameState();

  const handleLabourClick = () => {
    console.log('User tapped Perform Labour button');
    performLabour();
    
    // Haptic feedback
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  if (!isLoaded) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const labourPerClick = gameState.clickPower * gameState.globalMultiplier;
  const passivePerSecond = gameState.passiveIncomePerSecond * gameState.globalMultiplier;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header with Labour Units */}
      <View style={styles.header}>
        <Text style={styles.gameTitle}>Planetary Labour</Text>
        <View style={styles.labourDisplay}>
          <Text style={styles.labourLabel}>Labour Units</Text>
          <Text style={styles.labourAmount}>{formatNumber(gameState.labourUnits)}</Text>
          <Text style={styles.labourExact}>({formatNumberWithCommas(gameState.labourUnits)})</Text>
        </View>
      </View>

      {/* Main Click Button */}
      <View style={styles.clickArea}>
        <Pressable
          style={({ pressed }) => [
            styles.labourButton,
            pressed && styles.labourButtonPressed,
          ]}
          onPress={handleLabourClick}
        >
          <Text style={styles.labourButtonText}>Perform Labour</Text>
          <Text style={styles.labourButtonSubtext}>+{labourPerClick.toFixed(1)} per click</Text>
        </Pressable>
      </View>

      {/* Stats Display */}
      <View style={styles.statsContainer}>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Click Power:</Text>
          <Text style={styles.statValue}>{gameState.clickPower.toFixed(1)}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Passive Income:</Text>
          <Text style={styles.statValue}>{passivePerSecond.toFixed(1)}/s</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Global Multiplier:</Text>
          <Text style={styles.statValue}>{gameState.globalMultiplier.toFixed(2)}x</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Total Earned:</Text>
          <Text style={styles.statValue}>{formatNumber(gameState.totalLabourEarned)}</Text>
        </View>
      </View>

      {/* Flavor text */}
      <View style={styles.flavorContainer}>
        <Text style={styles.flavorText}>
          Intelligence as labour. Planning as power. Progress as purpose.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 48 : 0,
    paddingBottom: 100,
  },
  loadingText: {
    color: colors.text,
    fontSize: 18,
    textAlign: 'center',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  gameTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 20,
    letterSpacing: 1,
  },
  labourDisplay: {
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.primary,
    minWidth: 280,
  },
  labourLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  labourAmount: {
    fontSize: 48,
    fontWeight: '900',
    color: colors.primary,
    marginBottom: 4,
  },
  labourExact: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  clickArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  labourButton: {
    backgroundColor: colors.primary,
    paddingVertical: 40,
    paddingHorizontal: 60,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 280,
    minHeight: 180,
    borderWidth: 3,
    borderColor: colors.highlight,
    boxShadow: '0px 8px 20px rgba(74, 144, 226, 0.4)',
    elevation: 8,
  },
  labourButtonPressed: {
    transform: [{ scale: 0.95 }],
    opacity: 0.8,
  },
  labourButtonText: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  labourButtonSubtext: {
    fontSize: 16,
    color: colors.accent,
    textAlign: 'center',
  },
  statsContainer: {
    paddingHorizontal: 40,
    paddingVertical: 20,
    backgroundColor: colors.backgroundAlt,
    marginHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '700',
  },
  flavorContainer: {
    paddingHorizontal: 40,
    paddingVertical: 20,
    alignItems: 'center',
  },
  flavorText: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 20,
  },
});
