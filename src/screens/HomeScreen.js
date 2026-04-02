// src/screens/HomeScreen.js
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Image,
} from 'react-native';
import { colors, spacing, typography, borderRadius } from '../styles/globalStyles';
import RecipeCard from '../components/RecipeCard';

// 🔵 DUMMY DATA - We'll replace with real API later
const DUMMY_RECIPES = [
  {
    id: '1',
    name: 'Spaghetti Carbonara',
    image: 'https://i.pinimg.com/1200x/b7/db/e4/b7dbe4396c13edf660484a51cbb012ca.jpg',
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
    image: 'https://i.pinimg.com/736x/25/e7/cf/25e7cfa7ca6ad24beb494ce927b6059b.jpg',
    time: '10 mins',
    difficulty: 'Easy',
    rating: 4.4,
  },
  {
    id: '4',
    name: 'Beef Burger',
    image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?w=500',
    time: '20 mins',
    difficulty: 'Medium',
    rating: 4.7,
  },
  {
    id: '5',
    name: 'Caesar Salad',
    image: 'https://i.pinimg.com/736x/49/65/df/4965dfde907d9ac3064060845b0c116d.jpg',
    time: '15 mins',
    difficulty: 'Easy',
    rating: 4.5,
  },
  {
    id: '6',
    name: 'Chocolate Cake',
    image: 'https://i.pinimg.com/1200x/61/b9/66/61b966e7e91ee86f59d0af148a9a6d38.jpg',
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
  const [favorites, setFavorites] = useState([]);
  const [trendingRecipes, setTrendingRecipes] = useState([]);

  // Load recipes on screen open
  useEffect(() => {
    loadRecipes();
  }, []);

  // Simulate API call with dummy data
  const loadRecipes = async () => {
    setLoading(true);
    
    setTimeout(() => {
      setRecipes(DUMMY_RECIPES);
      setTrendingRecipes(DUMMY_RECIPES.slice(0, 3));
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

  // Render trending item
  const renderTrending = ({ item }) => (
    <TouchableOpacity 
      style={styles.trendingCard}
      onPress={() => handleRecipePress(item)}
    >
      <Image 
        source={{ uri: item.image }} 
        style={styles.trendingImage}
      />
      <Text style={styles.trendingName} numberOfLines={1}>{item.name}</Text>
      <Text style={styles.trendingTime}>⏱️ {item.time}</Text>
    </TouchableOpacity>
  );

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

  // Render recipe card with filtering
  const renderRecipe = ({ item }) => {
    // Filter logic
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'italian' && !item.name.toLowerCase().includes('spaghetti')) {
        return null;
      }
      if (selectedCategory === 'indian' && !item.name.toLowerCase().includes('tikka')) {
        return null;
      }
      if (selectedCategory === 'healthy' && !item.name.toLowerCase().includes('avocado')) {
        return null;
      }
      if (selectedCategory === 'dessert' && !item.name.toLowerCase().includes('chocolate')) {
        return null;
      }
      if (selectedCategory === 'quick' && parseInt(item.time) > 20) {
        return null;
      }
    }

    return (
      <RecipeCard
        recipe={item}
        onPress={() => handleRecipePress(item)}
        isFavorite={isFavorite(item.id)}
        onFavoritePress={() => toggleFavorite(item.id)}
      />
    );
  };

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
    <FlatList
      data={recipes}
      renderItem={renderRecipe}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      contentContainerStyle={styles.recipesList}
      ListHeaderComponent={
        <>
          {/* Full Width Featured Image with Overlay */}
          {trendingRecipes.length > 0 && (
            <View style={styles.fullImageContainer}>
              <Image 
                source={{ uri: trendingRecipes[0].image }} 
                style={styles.fullImage}
              />
              <View style={styles.overlay}>
                {/* Top Section */}
                <View>
                  <View style={styles.chefBadge}>
                    <MaterialCommunityIcons name="chef-hat" size={18} color="#FFFFFF" />
                    <Text style={styles.chefBadgeText}>Hello, Chef!</Text>
                  </View>
                </View>
                
                {/* Bottom Section */}
                <View style={styles.bottomSection}>
                  
                  <Text style={styles.overlayRecipeName}>{trendingRecipes[0].name}</Text>
                  <View style={styles.actionButtonsRow}>
                    <TouchableOpacity 
                      style={styles.startCookingButton}
                      onPress={() => handleRecipePress(trendingRecipes[0])}
                    >
                      <MaterialCommunityIcons name="timer" size={18} color="#000000" />
                      <Text style={styles.startCookingText}>Start Cooking</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.favoriteIconButton}
                      onPress={() => toggleFavorite(trendingRecipes[0].id)}
                    >
                      <Ionicons 
                        name={isFavorite(trendingRecipes[0].id) ? 'heart' : 'heart-outline'} 
                        size={28} 
                        color={isFavorite(trendingRecipes[0].id) ? colors.primary : '#FFFFFF'} 
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          )}

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
        </>
      }
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
  // Full Image Container
  fullImageContainer: {
    width: '100%',
    height: 450,
    position: 'relative',
    marginBottom: spacing.md,
  },
  fullImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    paddingLeft: 0,      
    paddingRight: spacing.sm,
    justifyContent: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  
  overlaySubtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: -4,  // ← Add this
    lineHeight: 32,
  },
  spacer: {
    flex: 1,
  },
  recipeSection: {
    marginBottom: spacing.lg,
  },
  featuredBadge: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
  },
  featuredBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },

  // Trending Section
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  sectionTitle: {
    ...typography.headline,
    fontWeight: 'bold',
    marginBottom: 0,
  },
  trendingList: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  trendingCard: {
    width: 140,
    marginRight: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  trendingImage: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
  },
  trendingName: {
    ...typography.body,
    fontWeight: '600',
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
  },
  trendingTime: {
    ...typography.caption,
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.sm,
  },
  // Categories
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
    backgroundColor: '#FF5252',
    borderColor: '#FF5252',
  },
  categoryText: {
    ...typography.body,
    color: colors.text,
  },
  categoryTextActive: {
    color: colors.background,
    fontWeight: '600',
  },
  // Recipes List
  recipesList: {
    paddingBottom: spacing.xl,
  },

  chefBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: 50,
    width: '100%',  // ← Makes it full width
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
    justifyContent: 'flex-start',
},
chefBadgeText: {
  color: '#FFFFFF',
  fontSize: 15,
  fontWeight: '600',
  marginLeft: spacing.xs,
},
bottomSection: {
  marginTop: 'auto',
  marginBottom: 20,
  paddingHorizontal: spacing.lg,
},
recipeNameRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: spacing.sm,
  gap: 8,
},
favoriteIconButton: {
  padding: spacing.xs,
},
overlayRecipeName: {
  fontSize: 22,
  fontWeight: 'bold',
  color: '#FFFFFF',
  marginBottom: 12,
  flexWrap: 'wrap',  // ← Add this
  width: '100%', 
},
startCookingButton: {
  flexDirection: 'row',        
  alignItems: 'center',        
  gap: 8,   
  backgroundColor: 'rgba(192, 192, 192, 0.81)',
  paddingVertical: spacing.sm,
  paddingHorizontal: spacing.lg,
  borderRadius: 50, 
  flex: 1, 
  justifyContent: 'center',
},
startCookingText: {
  color: '#000000',
  fontSize: 16,
  fontWeight: '600',
},
actionButtonsRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: spacing.md,
},
});

export default HomeScreen;