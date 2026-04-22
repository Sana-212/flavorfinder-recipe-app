import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function CustomSplash({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onFinish) {
        onFinish();
      }
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [onFinish]);

  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/splash icon.png')} 
        style={styles.icon}
      />
      <Text style={styles.title}>flayr</Text>
      <Text style={styles.tagline}>Flavor in every bite.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0785a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 120,
    height: 120,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
});