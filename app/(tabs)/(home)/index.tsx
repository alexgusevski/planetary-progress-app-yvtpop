
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Platform,
  Animated,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { colors } from '@/styles/commonStyles';
import { useGameStateContext } from '@/contexts/GameStateContext';
import { formatNumber, formatNumberWithCommas } from '@/utils/formatNumber';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

export default function LabourScreen() {
  const theme = useTheme();
  const { gameState, isLoaded, performLabour } = useGameStateContext();
  
  // Animation values
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  // Pulsing animation for the main button
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, []);

  // Glow animation
  useEffect(() => {
    const glow = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    );
    glow.start();

    return () => glow.stop();
  }, []);

  // Floating animation for stats
  useEffect(() => {
    const float = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -8,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    );
    float.start();

    return () => float.stop();
  }, []);

  const handleLabourClick = () => {
    console.log('User tapped Perform Labour button');
    performLabour();
    
    // Enhanced haptic feedback
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    // Button press animation
    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 0.92,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(pulseAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
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

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  return (
    <LinearGradient
      colors={['#0A0E1A', '#141B2D', '#0A0E1A']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Animated background circles */}
      <Animated.View style={[styles.backgroundCircle, styles.circle1, { opacity: glowOpacity }]} />
      <Animated.View style={[styles.backgroundCircle, styles.circle2, { opacity: glowOpacity }]} />

      {/* Header with Labour Units */}
      <View style={styles.header}>
        <Text style={styles.gameTitle}>⚡ Planetary Labour ⚡</Text>
        
        <Animated.View style={[styles.labourDisplayWrapper, { transform: [{ translateY: floatAnim }] }]}>
          <LinearGradient
            colors={['#1A2332', '#0F1621']}
            style={styles.labourDisplay}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.labourDisplayInner}>
              <Text style={styles.labourLabel}>LABOUR UNITS</Text>
              <Text style={styles.labourAmount}>{formatNumber(gameState.labourUnits)}</Text>
              <Text style={styles.labourExact}>({formatNumberWithCommas(gameState.labourUnits)})</Text>
            </View>
            
            {/* Animated border glow */}
            <Animated.View style={[styles.glowBorder, { opacity: glowOpacity }]} />
          </LinearGradient>
        </Animated.View>
      </View>

      {/* Main Click Button */}
      <View style={styles.clickArea}>
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <Pressable
            style={({ pressed }) => [
              styles.labourButtonWrapper,
              pressed && styles.labourButtonPressed,
            ]}
            onPress={handleLabourClick}
          >
            <LinearGradient
              colors={['#5BA3D0', '#4A90E2', '#2C5F8D']}
              style={styles.labourButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {/* Inner glow effect */}
              <Animated.View style={[styles.buttonGlow, { opacity: glowOpacity }]} />
              
              <View style={styles.buttonContent}>
                <Text style={styles.labourButtonText}>⚙️ Perform Labour ⚙️</Text>
                <View style={styles.buttonDivider} />
                <Text style={styles.labourButtonSubtext}>+{labourPerClick.toFixed(1)} per click</Text>
              </View>
            </LinearGradient>
          </Pressable>
        </Animated.View>

        {/* Passive income indicator */}
        {passivePerSecond > 0 && (
          <Animated.View style={[styles.passiveIndicator, { opacity: glowOpacity }]}>
            <Text style={styles.passiveText}>
              ⏱️ +{passivePerSecond.toFixed(1)}/s passive
            </Text>
          </Animated.View>
        )}
      </View>

      {/* Stats Display */}
      <Animated.View style={[styles.statsWrapper, { transform: [{ translateY: floatAnim }] }]}>
        <LinearGradient
          colors={['#1A2332', '#141B2D']}
          style={styles.statsContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>👆</Text>
              <Text style={styles.statLabel}>Click Power</Text>
              <Text style={styles.statValue}>{gameState.clickPower.toFixed(1)}</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>⚡</Text>
              <Text style={styles.statLabel}>Passive Income</Text>
              <Text style={styles.statValue}>{passivePerSecond.toFixed(1)}/s</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>✨</Text>
              <Text style={styles.statLabel}>Multiplier</Text>
              <Text style={styles.statValue}>{gameState.globalMultiplier.toFixed(2)}x</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>💎</Text>
              <Text style={styles.statLabel}>Total Earned</Text>
              <Text style={styles.statValue}>{formatNumber(gameState.totalLabourEarned)}</Text>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Flavor text */}
      <View style={styles.flavorContainer}>
        <Text style={styles.flavorText}>
          Intelligence as labour · Planning as power · Progress as purpose
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 48 : 0,
    paddingBottom: 100,
  },
  backgroundCircle: {
    position: 'absolute',
    borderRadius: 1000,
    backgroundColor: '#4A90E2',
  },
  circle1: {
    width: 300,
    height: 300,
    top: -100,
    right: -100,
    opacity: 0.1,
  },
  circle2: {
    width: 400,
    height: 400,
    bottom: -150,
    left: -150,
    opacity: 0.08,
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
    fontSize: 32,
    fontWeight: '900',
    color: colors.text,
    marginBottom: 24,
    letterSpacing: 2,
    textShadowColor: 'rgba(74, 144, 226, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  labourDisplayWrapper: {
    width: '100%',
    maxWidth: 340,
  },
  labourDisplay: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(74, 144, 226, 0.3)',
  },
  labourDisplayInner: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 40,
  },
  glowBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#4A90E2',
  },
  labourLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 8,
    fontWeight: '700',
  },
  labourAmount: {
    fontSize: 52,
    fontWeight: '900',
    color: '#4A90E2',
    marginBottom: 6,
    textShadowColor: 'rgba(74, 144, 226, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  labourExact: {
    fontSize: 11,
    color: colors.textSecondary,
    opacity: 0.7,
  },
  clickArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  labourButtonWrapper: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  labourButtonPressed: {
    opacity: 0.9,
  },
  labourButton: {
    paddingVertical: 50,
    paddingHorizontal: 60,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 300,
    minHeight: 200,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    ...Platform.select({
      ios: {
        shadowColor: '#4A90E2',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.6,
        shadowRadius: 20,
      },
      android: {
        elevation: 12,
      },
      web: {
        boxShadow: '0px 10px 40px rgba(74, 144, 226, 0.5)',
      },
    }),
  },
  buttonGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 24,
  },
  buttonContent: {
    alignItems: 'center',
  },
  labourButtonText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  buttonDivider: {
    width: 60,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginVertical: 8,
    borderRadius: 1,
  },
  labourButtonSubtext: {
    fontSize: 16,
    color: '#E8EAF0',
    textAlign: 'center',
    fontWeight: '600',
    opacity: 0.9,
  },
  passiveIndicator: {
    marginTop: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(74, 144, 226, 0.2)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(74, 144, 226, 0.4)',
  },
  passiveText: {
    color: '#7EC8E3',
    fontSize: 14,
    fontWeight: '600',
  },
  statsWrapper: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statsContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(74, 144, 226, 0.2)',
    padding: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: 'rgba(26, 35, 50, 0.6)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(74, 144, 226, 0.15)',
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 18,
    color: '#4A90E2',
    fontWeight: '800',
    textAlign: 'center',
  },
  flavorContainer: {
    paddingHorizontal: 40,
    paddingVertical: 16,
    alignItems: 'center',
  },
  flavorText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 18,
    opacity: 0.7,
    letterSpacing: 0.5,
  },
});
