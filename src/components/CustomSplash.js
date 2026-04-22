import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { height } = Dimensions.get('window');

export default function CustomSplash({ onFinish }) {
  // Animation Values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    // Start Animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    // Finish splash after 3.5 seconds (5 is a bit long for modern UX)
    const timer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View style={styles.container}>
      <LinearGradient
        // Subtle gradient from a slightly darker red to your primary red
        colors={['#FF5252', '#D32F2F']}
        style={styles.gradient}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
          <Image 
            source={require('../../assets/splash icon.png')} 
            style={styles.icon}
          />
          <Text style={styles.title}>flayr</Text>
          
          <View style={styles.divider} />
          
          <Text style={styles.tagline}>FLAVOR IN EVERY BITE</Text>
        </Animated.View>

        {/* Optional: Footer text for a professional touch */}
        <Text style={styles.footerText}>Part of CanTech Studio</Text>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  icon: {
    width: 140,
    height: 140,
    marginBottom: 20,
    resizeMode: 'contain',
    // Minimal shadow for the icon
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  title: {
    fontSize: 48,
    fontWeight: '900', // Heavy weight for the logo
    color: '#FFFFFF',
    letterSpacing: -1.5, // Tight letter spacing is very modern
  },
  divider: {
    width: 40,
    height: 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
    marginVertical: 15,
    opacity: 0.5,
  },
  tagline: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 3, // Wide letter spacing for the tagline
    textTransform: 'uppercase', // All caps tagline looks cleaner
    opacity: 0.9,
  },
  footerText: {
    position: 'absolute',
    bottom: 50,
    fontSize: 10,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 1,
    textTransform: 'uppercase',
  }
});