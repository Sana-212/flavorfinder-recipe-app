// components/RecipeCard.js
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { spacing, borderRadius, typography } from '../styles/globalStyles';

const RecipeCard = ({ recipe, onPress, isFavorite, onFavoritePress, colors }) => {
  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.surface }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Image */}
      <Image source={{ uri: recipe.image }} style={styles.image} />

      {/* Favorite button */}
      <TouchableOpacity
        style={[styles.favoriteButton, { backgroundColor: colors.surface }]}
        onPress={onFavoritePress}
      >
        <Ionicons
          name={isFavorite ? 'heart' : 'heart-outline'}
          size={22}
          color={isFavorite ? colors.primary : colors.textLight}
        />
      </TouchableOpacity>

      {/* Info */}
      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
          {recipe.name}
        </Text>

        <View style={styles.details}>
          <Text style={[styles.meta, { color: colors.textLight }]}>⏱️ {recipe.time}</Text>
          <Text style={[styles.meta, { color: colors.textLight }]}>🍳 {recipe.difficulty}</Text>
        </View>

        {recipe.rating && (
          <Text style={[styles.rating, { color: colors.warning }]}>⭐ {recipe.rating}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
card: {
    borderRadius: borderRadius.md,
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    overflow: 'hidden',
    // Remove shadow for dark mode or keep it very subtle
    elevation: 4, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
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
    borderRadius: borderRadius.xl,
    padding: spacing.sm,
    opacity: 0.92,
  },
  info: {
    padding: spacing.md,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  details: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xs,
  },
  meta: {
    ...typography.caption,
  },
  rating: {
    ...typography.caption,
    marginTop: spacing.xs,
  },
});

export default RecipeCard;