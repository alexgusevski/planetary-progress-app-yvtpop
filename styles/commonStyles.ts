
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

// Planetary Labour Clicker Theme - Dark, minimalist, intelligence-focused
export const colors = {
  primary: '#4A90E2',      // Bright blue for primary actions
  secondary: '#2C5F8D',    // Darker blue for secondary elements
  accent: '#7EC8E3',       // Light blue accent
  background: '#0A0E1A',   // Very dark blue-black background
  backgroundAlt: '#141B2D', // Slightly lighter dark background
  text: '#E8EAF0',         // Light grey-white text
  textSecondary: '#8B92A8', // Muted grey for secondary text
  card: '#1A2332',         // Dark card background
  highlight: '#5BA3D0',    // Highlight color for active states
  success: '#4CAF50',      // Green for unlocked/completed
  locked: '#3A4556',       // Grey for locked items
};

export const buttonStyles = StyleSheet.create({
  instructionsButton: {
    backgroundColor: colors.primary,
    alignSelf: 'center',
    width: '100%',
  },
  backButton: {
    backgroundColor: colors.backgroundAlt,
    alignSelf: 'center',
    width: '100%',
  },
});

export const commonStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 800,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    color: colors.text,
    marginBottom: 10
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
    lineHeight: 24,
    textAlign: 'center',
  },
  section: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: colors.backgroundAlt,
    borderColor: colors.secondary,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginVertical: 8,
    width: '100%',
    boxShadow: '0px 2px 3px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  icon: {
    width: 60,
    height: 60,
    tintColor: "white",
  },
});
