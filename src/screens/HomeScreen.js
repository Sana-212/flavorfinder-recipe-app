// screens/HomeScreen.js
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  View, Text, FlatList, TouchableOpacity,
  ActivityIndicator, RefreshControl, StyleSheet, Image, StatusBar,
} from "react-native";
import { spacing, typography, borderRadius } from "../styles/globalStyles";
import { useTheme } from "../hooks/useTheme";
import RecipeCard from "../components/RecipeCard";
import { useSelector, useDispatch } from "react-redux";
import { addFavorites, removeFavorites } from "../redux/favoritesSlice";
import {
  useGetRandomRecipesQuery,
  useGetCategoriesQuery,
  useGetRecipesByCategoryQuery,
} from "../redux/recipeApiSlice";

const HomeScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { colors, isDarkMode } = useTheme();

  const dispatch = useDispatch();
  const favoriteItems = useSelector((state) => state.favorites.items);
  const { name } = useSelector((state) => state.profile);

  const {
    data: randomMeals = [],
    isLoading: randomLoading,
    isFetching: randomFetching,
    refetch: refetchRandom,
  } = useGetRandomRecipesQuery(6, { skip: selectedCategory !== "all" });

  const { data: categories = [], isLoading: categoriesLoading } = useGetCategoriesQuery();

  const {
    data: categoryMeals = [],
    isLoading: categoryLoading,
    isFetching: categoryFetching,
    refetch: refetchCategory,
  } = useGetRecipesByCategoryQuery(selectedCategory, {
    skip: selectedCategory === "all",
  });

  const formatMeals = (meals, category = "") =>
    meals.map((meal) => ({
      id: meal.idMeal,
      name: meal.strMeal,
      image: meal.strMealThumb,
      time: "30 mins",
      difficulty: "Medium",
      rating: 4.5,
      category: category || meal.strCategory?.toLowerCase() || "",
    }));

  const recipes =
    selectedCategory === "all"
      ? formatMeals(randomMeals)
      : formatMeals(categoryMeals, selectedCategory);

  const trendingRecipes = recipes.slice(0, 3);
  const isRefreshing = randomFetching || categoryFetching;

  const onRefresh = () => {
    if (selectedCategory === "all") refetchRandom();
    else refetchCategory();
  };

  const isLoading =
    categoriesLoading ||
    (selectedCategory === "all" ? randomLoading : categoryLoading);

  const isSwitchingCategory =
    selectedCategory !== "all" && categoryFetching && categoryMeals.length === 0;

  const isFavorite = (recipeId) => favoriteItems?.some((item) => item.id === recipeId);

  const toggleFavorite = (recipe) => {
    if (isFavorite(recipe.id)) dispatch(removeFavorites(recipe.id));
    else dispatch(addFavorites({ ...recipe }));
  };

  const handleRecipePress = (recipe) => {
    navigation.navigate("RecipeDetail", { recipeId: recipe.id });
  };

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryChip,
        { backgroundColor: colors.surface, borderColor: colors.border },
        selectedCategory === item.key && { backgroundColor: colors.primary, borderColor: colors.primary },
      ]}
      onPress={() => setSelectedCategory(item.key)}
    >
      <Text
        style={[
          styles.categoryText,
          { color: colors.text },
          selectedCategory === item.key && { color: '#FFFFFF', fontWeight: '600' },
        ]}
      >
        {item.strCategory}
      </Text>
    </TouchableOpacity>
  );

  const renderRecipe = ({ item }) => (
    <RecipeCard
      recipe={item}
      onPress={() => handleRecipePress(item)}
      isFavorite={isFavorite(item.id)}
      onFavoritePress={() => toggleFavorite(item)}
       colors={colors} 
    />
  );

  if (isLoading || isSwitchingCategory) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={colors.statusBar} backgroundColor={colors.background} />
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textLight }]}>
          {isLoading ? "Finding delicious recipes..." : "Loading recipes..."}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.statusBar} backgroundColor={colors.background} />
      <FlatList
        data={recipes}
        renderItem={renderRecipe}
        keyExtractor={(item) => item.id?.toString()}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        contentContainerStyle={styles.recipesList}
        ListHeaderComponent={
          <>
            {trendingRecipes.length > 0 && (
              <View style={styles.fullImageContainer}>
                <Image source={{ uri: trendingRecipes[0].image }} style={styles.fullImage} />
                <View style={styles.overlay}>
                  <View>
                    <View style={styles.chefBadge}>
                      <MaterialCommunityIcons name="chef-hat" size={18} color="#FFFFFF" />
                      <Text style={styles.chefBadgeText}>
                        Hello, {name ? name : "Chef"}!
                      </Text>
                    </View>
                  </View>
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
                        onPress={() => toggleFavorite(trendingRecipes[0])}
                      >
                        <Ionicons
                          name={isFavorite(trendingRecipes[0].id) ? "heart" : "heart-outline"}
                          size={28}
                          color={isFavorite(trendingRecipes[0].id) ? colors.primary : "#FFFFFF"}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            )}

            <View style={styles.categoriesContainer}>
              <FlatList
                horizontal
                data={categories}
                renderItem={renderCategory}
                keyExtractor={(item) => item.idCategory?.toString()}
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

// Static styles (no colors here — colors applied inline above)
const styles = StyleSheet.create({
  container: { flex: 1 },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { ...typography.body, marginTop: spacing.md },
  fullImageContainer: { width: "100%", height: 450, position: "relative", marginBottom: spacing.md },
  fullImage: { width: "100%", height: "100%", resizeMode: "cover", borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  overlay: {
    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
    paddingTop: spacing.sm, paddingBottom: spacing.sm,
    paddingLeft: 0, paddingRight: spacing.sm,
    justifyContent: "flex-start",
    backgroundColor: "rgba(0,0,0,0.46)",
    borderBottomLeftRadius: 28, borderBottomRightRadius: 28,
  },
  categoriesContainer: { marginBottom: spacing.sm },
  categoriesList: { paddingHorizontal: spacing.lg },
  categoryChip: {
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    borderRadius: borderRadius.xl, marginRight: spacing.sm,
    borderWidth: 1,
  },
  categoryText: { ...typography.body },
  recipesList: { paddingBottom: spacing.xl  },
  chefBadge: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: spacing.md, paddingVertical: spacing.md,
    borderRadius: 50, width: "95%", marginTop: 40,
    marginBottom: spacing.sm, justifyContent: "flex-start", alignSelf: "center",
  },
  chefBadgeText: { color: "#FFFFFF", fontSize: 15, fontWeight: "600", marginLeft: spacing.xs },
  bottomSection: { marginTop: "auto", marginBottom: 20, paddingHorizontal: spacing.lg },
  favoriteIconButton: {
    backgroundColor: "rgba(255,255,255,0.85)", borderRadius: 22,
    width: 44, height: 44, justifyContent: "center", alignItems: "center",
  },
  overlayRecipeName: { fontSize: 22, fontWeight: "bold", color: "#FFFFFF", marginBottom: 12, width: "100%" },
  startCookingButton: {
    flexDirection: "row", alignItems: "center", gap: 5,
    backgroundColor: "rgba(245,243,243,0.81)",
    paddingVertical: 11, paddingHorizontal: spacing.lg,
    borderRadius: 50, flex: 1, justifyContent: "center",
  },
  startCookingText: { color: "#000000", fontSize: 14, fontWeight: "500" },
  actionButtonsRow: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between", gap: spacing.md,
  },
});

export default HomeScreen;