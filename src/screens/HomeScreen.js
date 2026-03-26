import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) { 
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to FlavorFinder</Text>
      <Button 
        title="Go to Recipe Details" 
        onPress={() => navigation.navigate('RecipeDetail')} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, marginBottom: 20 }
});
//button is used to show recipes detail screen