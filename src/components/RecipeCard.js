// src/components/RecipeCard.js
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { colors, spacing, borderRadius, typography } from '../styles/globalStyles';

const RecipeCard = ({ recipe, onPress, isFavorite, onFavoritePress }) => {
  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Recipe Image */}
      <Image 
        source={{ uri: recipe.image }} 
        style={styles.image}
        //defaultSource={require('../assets/placeholder.png')} // Optional placeholder
      />
      
      {/* Favorite Button (Heart) */}
      <TouchableOpacity 
  style={styles.favoriteButton}
  onPress={onFavoritePress}
>
  <Ionicons 
  name={isFavorite ? 'heart' : 'heart-outline'} 
  size={24} 
  color={isFavorite ? colors.primary : colors.textLight} 
/>
</TouchableOpacity>
      
      {/* Recipe Info */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {recipe.name}
        </Text>
        
        <View style={styles.details}>
          <Text style={styles.time}>⏱️ {recipe.time}</Text>
          <Text style={styles.difficulty}>🍳 {recipe.difficulty}</Text>
        </View>
        
        {/* Rating Stars (Optional) */}
        {recipe.rating && (
          <View style={styles.rating}>
            <Text style={styles.ratingText}>⭐ {recipe.rating}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  favoriteButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: borderRadius.xl,
    padding: spacing.sm,
  },
  heartIcon: {
    fontSize: 24,
  },
  info: {
    padding: spacing.md,
  },
  name: {
    ...typography.headline,
    marginBottom: spacing.xs,
  },
  details: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  time: {
    ...typography.caption,
    marginRight: spacing.md,
  },
  difficulty: {
    ...typography.caption,
  },
  rating: {
    marginTop: spacing.xs,
  },
  ratingText: {
    ...typography.caption,
    color: colors.warning,
  },
});

export default RecipeCard;