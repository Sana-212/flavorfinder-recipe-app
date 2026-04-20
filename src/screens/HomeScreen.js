import recipeAPI from "../services/api";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Image,
} from "react-native";
import {
  colors,
  spacing,
  typography,
  borderRadius,
} from "../styles/globalStyles";
import RecipeCard from "../components/RecipeCard";
import { useSelector,useDispatch } from 'react-redux';
import { addFavorites,removeFavorites } from '../redux/favoritesSlice';


const HomeScreen = ({ navigation }) => {
  // State
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [trendingRecipes, setTrendingRecipes] = useState([]);
  const [categories, setCategories] = useState([]);

const dispatch = useDispatch();
  const favoriteItems = useSelector((state)=> state.favorites.items)

  useEffect(() => {
    if (selectedCategory === "all") {
      loadRecipes();
    } else {
      loadRecipesByCategory(selectedCategory);
    }
  }, [selectedCategory]);

  useEffect(()=>{
    loadCategories()
  },[])

  const loadRecipes = async () => {
    setLoading(true);
    try {
      const data = await recipeAPI.getRandomRecipes(6);

      const formattedRecipes = data.map((recipe) => ({
        id: recipe.idMeal,
        name: recipe.strMeal,
        image: recipe.strMealThumb,
        time: "30 mins",
        difficulty: "Medium",
        rating: 4.5,
        category: recipe.strCategory?.toLowerCase() || "",
      }));

      setRecipes(formattedRecipes);
      setTrendingRecipes(formattedRecipes.slice(0, 3));
    } catch (error) {
      console.error("Error loading recipes:", error);
      // Fallback to dummy data if API fails
      setRecipes(DUMMY_RECIPES);
      setTrendingRecipes(DUMMY_RECIPES.slice(0, 3));
    } finally {
      setLoading(false);
    }
  };

  const loadRecipesByCategory = async (category) => {
    setLoading(true);
    try {
      const data = await recipeAPI.getRecipesByCategory(category);
      const formattedRecipes = data.map((recipe) => ({
        id: recipe.idMeal,
        name: recipe.strMeal,
        image: recipe.strMealThumb,
        time: "30 mins",
        difficulty: "Medium",
        rating: 4.5,
        category: category,
      }));
      setRecipes(formattedRecipes);
    } catch (err) {
      console.log("Error loading category recipes: ", err);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await recipeAPI.getCategories();

      const formattedCategories = data.map((cat) => ({
        id: cat.idCategory.toString(),
        name: cat.strCategory,
        key: cat.strCategory.toLowerCase(),
      }));

      const addAllOption = { id: '0', name: "🍔 All", key: "all" };
      setCategories([addAllOption, ...formattedCategories]);
    } catch (err) {
      console.log("Error loading categories:", err);
    }
  };

  // Pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await loadRecipes();
    setRefreshing(false);
  };

  const isFavorite=(recipeId)=>{
return favoriteItems?.some((item)=> item.id === recipeId)
}

const toggleFavorite=(recipe)=>{
if (isFavorite(recipe.id)){
  dispatch(removeFavorites(recipe.id))
}else{
    dispatch(addFavorites({
     ...recipe
    }))
  }
}

  // Handle recipe press - navigate to details
  const handleRecipePress = (recipe) => {
    navigation.navigate("RecipeDetail", { recipeId:recipe.id });
  };

  // Render trending item
  const renderTrending = ({ item }) => (
    <TouchableOpacity
      style={styles.trendingCard}
      onPress={() => handleRecipePress(item)}
    >
      <Image source={{ uri: item.image }} style={styles.trendingImage} />
      <Text style={styles.trendingName} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={styles.trendingTime}>⏱️ {item.time}</Text>
    </TouchableOpacity>
  );

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
    return (
      <RecipeCard
        recipe={item}
        onPress={() => handleRecipePress(item)}
        isFavorite={isFavorite(item.id)}
        onFavoritePress={() => toggleFavorite(item)}
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
        keyExtractor={(item) => item.id || item?.id?.toString()}
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
                      <MaterialCommunityIcons
                        name="chef-hat"
                        size={18}
                        color="#FFFFFF"
                      />
                      <Text style={styles.chefBadgeText}>Hello, Chef!</Text>
                    </View>
                  </View>

                  {/* Bottom Section */}
                  <View style={styles.bottomSection}>
                    <Text style={styles.overlayRecipeName}>
                      {trendingRecipes[0].name}
                    </Text>
                    <View style={styles.actionButtonsRow}>
                      <TouchableOpacity
                        style={styles.startCookingButton}
                        onPress={() => handleRecipePress(trendingRecipes[0])}
                      >
                        <MaterialCommunityIcons
                          name="timer"
                          size={18}
                          color="#000000"
                        />
                        <Text style={styles.startCookingText}>
                          Start Cooking
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.favoriteIconButton}
                        onPress={() => toggleFavorite(trendingRecipes[0])}
                      >
                        <Ionicons
                          name={
                            isFavorite(trendingRecipes[0].id)
                              ? "heart"
                              : "heart-outline"
                          }
                          size={28}
                          color={
                            isFavorite(trendingRecipes[0].id)
                              ? colors.primary
                              : "#FFFFFF"
                          }
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
                data={categories}
                renderItem={renderCategory}
                keyExtractor={(item) => item?.id?.toString()}
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  loadingText: {
    ...typography.body,
    marginTop: spacing.md,
    color: colors.textLight,
  },
  // Full Image Container
  fullImageContainer: {
    width: "100%",
    height: 450,
    position: "relative",
    marginBottom: spacing.md,
  },
  fullImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
     borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    paddingLeft: 0,
    paddingRight: spacing.sm,
    justifyContent: "flex-start",
    backgroundColor: "rgba(0, 0, 0, 0.46)",
     borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  overlaySubtitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: -4, // ← Add this
    lineHeight: 32,
  },
  spacer: {
    flex: 1,
  },
  recipeSection: {
    marginBottom: spacing.lg,
  },
  featuredBadge: {
    backgroundColor: "rgba(255,255,255,0.3)",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    alignSelf: "flex-start",
    marginBottom: spacing.sm,
  },
  featuredBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },

  // Trending Section
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  sectionTitle: {
    ...typography.headline,
    fontWeight: "bold",
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
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  trendingImage: {
    width: "100%",
    height: 100,
    resizeMode: "cover",
  },
  trendingName: {
    ...typography.body,
    fontWeight: "600",
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
    backgroundColor: "#FF5252",
    borderColor: "#FF5252",
  },
  categoryText: {
    ...typography.body,
    color: colors.text,
  },
  categoryTextActive: {
    color: colors.background,
    fontWeight: "600",
  },
  // Recipes List
  recipesList: {
    paddingBottom: spacing.xl,
  },

  chefBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: 50,
    width: "95%", // ← Makes it full width
    marginTop: 40,
    marginBottom: spacing.sm,
    justifyContent: "flex-start",
    alignSelf: 'center',
  },
  chefBadgeText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
    marginLeft: spacing.xs,
  },
  bottomSection: {
    marginTop: "auto",
    marginBottom: 20,
    paddingHorizontal: spacing.lg,
  },
  recipeNameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
    gap: 8,
  },
  favoriteIconButton: {
      backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 22,
    width: 44,
    height: 44,
     justifyContent: 'center', 
  alignItems: 'center',
  },
  overlayRecipeName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 12,
    flexWrap: "wrap", 
    width: "100%",
  },
  startCookingButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(245, 243, 243, 0.81)",
    paddingVertical: 11,
    paddingHorizontal: spacing.lg,
    borderRadius: 50,
    flex:1,
    justifyContent: "center",
  },
  startCookingText: {
    color: "#000000",
    fontSize: 14,
    fontWeight: "500",
  },
  actionButtonsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
});

export default HomeScreen;
