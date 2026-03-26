// src/screens/HomeScreen.js

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { colors, spacing, typography } from '../styles/globalStyles';
import RecipeCard from '../components/RecipeCard';

// 🔵 DUMMY DATA - We'll replace with real API later
const DUMMY_RECIPES = [
  {
    id: '1',
    name: 'Spaghetti Carbonara',
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=500',
    time: '25 mins',
    difficulty: 'Easy',
    rating: 4.8,
  },
  {
    id: '2',
    name: 'Chicken Tikka Masala',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500',
    time: '40 mins',
    difficulty: 'Medium',
    rating: 4.6,
  },
  {
    id: '3',
    name: 'Avocado Toast',
    image: 'https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=500',
    time: '10 mins',
    difficulty: 'Easy',
    rating: 4.4,
  },
  {
    id: '4',
    name: 'Beef Burger',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500',
    time: '20 mins',
    difficulty: 'Medium',
    rating: 4.7,
  },
  {
    id: '5',
    name: 'Caesar Salad',
    image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=500',
    time: '15 mins',
    difficulty: 'Easy',
    rating: 4.5,
  },
  {
    id: '6',
    name: 'Chocolate Cake',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500',
    time: '50 mins',
    difficulty: 'Hard',
    rating: 4.9,
  },
];

// Category data
const CATEGORIES = [
  { id: '1', name: '🍔 All', key: 'all' },
  { id: '2', name: '🍕 Italian', key: 'italian' },
  { id: '3', name: '🍛 Indian', key: 'indian' },
  { id: '4', name: '🥗 Healthy', key: 'healthy' },
  { id: '5', name: '🍰 Dessert', key: 'dessert' },
  { id: '6', name: '⏱️ Quick', key: 'quick' },
];

const HomeScreen = ({ navigation }) => {
  // State
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState([]); // Temporary - will use Redux later

  // Load recipes on screen open
  useEffect(() => {
    loadRecipes();
  }, []);

  // Simulate API call with dummy data
  const loadRecipes = async () => {
    setLoading(true);
    
    // Simulate network delay (remove when using real API)
    setTimeout(() => {
      setRecipes(DUMMY_RECIPES);
      setLoading(false);
    }, 1000);
  };

  // Pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await loadRecipes();
    setRefreshing(false);
  };

  // Check if recipe is favorite
  const isFavorite = (recipeId) => {
    return favorites.includes(recipeId);
  };

  // Toggle favorite
  const toggleFavorite = (recipeId) => {
    if (favorites.includes(recipeId)) {
      setFavorites(favorites.filter(id => id !== recipeId));
    } else {
      setFavorites([...favorites, recipeId]);
    }
  };

  // Handle recipe press - navigate to details
  const handleRecipePress = (recipe) => {
    navigation.navigate('RecipeDetail', { recipe });
  };

  // Render category chip
  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryChip,
        selectedCategory === item.key && styles.categoryChipActive,
      ]}
      onPress={() => setSelectedCategory(item.key)}
    >
      <Text
        style={[
          styles.categoryText,
          selectedCategory === item.key && styles.categoryTextActive,
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  // Render recipe card
  const renderRecipe = ({ item }) => (
    <RecipeCard
      recipe={item}
      onPress={() => handleRecipePress(item)}
      isFavorite={isFavorite(item.id)}
      onFavoritePress={() => toggleFavorite(item.id)}
    />
  );

  // Loading state
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Finding delicious recipes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, Chef! 👨‍🍳</Text>
        <Text style={styles.subtitle}>What would you like to cook today?</Text>
      </View>

      {/* Categories Row */}
      <View style={styles.categoriesContainer}>
        <FlatList
          horizontal
          data={CATEGORIES}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Recipes List */}
      <FlatList
        data={recipes}
        renderItem={renderRecipe}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.recipesList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    ...typography.body,
    marginTop: spacing.md,
    color: colors.textLight,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  greeting: {
    ...typography.title,
  },
  subtitle: {
    ...typography.body,
    color: colors.textLight,
    marginTop: spacing.xs,
  },
  categoriesContainer: {
    marginBottom: spacing.sm,
  },
  categoriesList: {
    paddingHorizontal: spacing.lg,
  },
  categoryChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.surface,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    ...typography.body,
    color: colors.text,
  },
  categoryTextActive: {
    color: colors.background,
    fontWeight: '600',
  },
  recipesList: {
    paddingBottom: spacing.xl,
  },
});

export default HomeScreen;