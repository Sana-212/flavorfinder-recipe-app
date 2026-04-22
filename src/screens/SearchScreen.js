// screens/SearchScreen.js
import React, { useState } from "react";
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ActivityIndicator, RefreshControl, SafeAreaView,
  StatusBar, TextInput,
} from "react-native";
import { spacing, typography, borderRadius } from "../styles/globalStyles";
import { useTheme } from "../hooks/useTheme";
import RecipeCard from "../components/RecipeCard";
import { useSelector, useDispatch } from "react-redux";
import { addFavorites, removeFavorites } from "../redux/favoritesSlice";
import {
  useSearchRecipesQuery,
  useGetRandomRecipesQuery,
} from "../redux/recipeApiSlice";

const SearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);
  const { colors } = useTheme();

  const dispatch = useDispatch();
  const favoriteItems = useSelector((state) => state.favorites.items);

  const {
    data: randomMeals = [],
    isLoading: randomLoading,
    isFetching: randomFetching,
    refetch: refetchRandom,
  } = useGetRandomRecipesQuery(5, { skip: searchQuery.trim().length > 0 });

  const {
    data: searchResults = [],
    isLoading: searchLoading,
    isFetching: searchFetching,
    refetch: refetchSearch,
  } = useSearchRecipesQuery(searchQuery, {
    skip: searchQuery.trim().length === 0,
  });

  const transformRecipe = (meal) => ({
    id: meal.idMeal,
    name: meal.strMeal,
    image: meal.strMealThumb,
    time: "30 mins",
    difficulty: "Medium",
    rating: 4.5,
    category: meal.strCategory?.toLowerCase() || "",
  });

  const rawRecipes = searchQuery.trim() ? searchResults : randomMeals;
  const recipes = rawRecipes.map(transformRecipe);
  const isLoading = randomLoading || searchLoading;
  const isRefreshing = randomFetching || searchFetching;

  const handleSearch = (query) => {
    const trimmed = query.trim();
    if (!trimmed) { setSearchQuery(""); return; }
    setSearchQuery(trimmed);
    if (!recentSearches.includes(trimmed)) {
      setRecentSearches((prev) => [trimmed, ...prev].slice(0, 5));
    }
  };

  const handleClear = () => { setInputValue(""); setSearchQuery(""); };
  const onRefresh = () => { if (searchQuery) refetchSearch(); else refetchRandom(); };

  const isFavorite = (recipeId) => favoriteItems.some((item) => item.id === recipeId);
  const toggleFavorite = (recipe) => {
    if (isFavorite(recipe.id)) dispatch(removeFavorites(recipe.id));
    else dispatch(addFavorites({ ...recipe }));
  };
  const handleRecipePress = (recipe) => navigation.navigate("RecipeDetail", { recipeId: recipe.id });

  const renderRecipe = ({ item }) => (
    <RecipeCard
      recipe={item}
      onPress={() => handleRecipePress(item)}
      isFavorite={isFavorite(item.id)}
      onFavoritePress={() => toggleFavorite(item)}
       colors={colors} 
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>🍳</Text>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        {searchQuery ? "No recipes found" : "No recipes available"}
      </Text>
      <Text style={[styles.emptyMessage, { color: colors.textLight }]}>
        {searchQuery
          ? `Try "chicken", "pasta", or "cake"`
          : "Pull down to refresh"}
      </Text>
      {!searchQuery && (
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: colors.primary }]}
          onPress={refetchRandom}
        >
          <Text style={styles.retryButtonText}>Refresh</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (isLoading && recipes.length === 0) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={colors.statusBar} backgroundColor={colors.background} />
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textLight }]}>
          Loading delicious recipes...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.statusBar} backgroundColor={colors.background} />

      {/* Search bar */}
      <View style={styles.topPadding}>
        <View style={styles.searchContainer}>
          <View style={[styles.searchInputContainer, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }]}>
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search recipes..."
              placeholderTextColor={colors.textLight}
              value={inputValue}
              onChangeText={setInputValue}
              onSubmitEditing={() => handleSearch(inputValue)}
              returnKeyType="search"
              autoCorrect={false}
              autoCapitalize="none"
            />
            {inputValue.length > 0 && (
              <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
                <Text style={[styles.clearButtonText, { color: colors.textLight }]}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            style={[styles.searchButton, { backgroundColor: colors.primary }]}
            onPress={() => handleSearch(inputValue)}
          >
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent searches */}
      {recentSearches.length > 0 && !searchQuery && (
        <View style={styles.recentSearches}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent</Text>
          <View style={styles.recentTags}>
            {recentSearches.map((search, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.recentTag, { backgroundColor: colors.surfaceAlt, borderColor: colors.border, borderWidth: 1 }]}
                onPress={() => { setInputValue(search); handleSearch(search); }}
              >
                <Text style={[styles.recentTagText, { color: colors.textSecondary }]}>{search}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        {searchQuery ? `Results for "${searchQuery}"` : "Discover Recipes"}
      </Text>
      <Text style={[styles.resultCount, { color: colors.textLight }]}>
        {recipes.length} recipes found
      </Text>

      <FlatList
        data={recipes}
        renderItem={renderRecipe}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 12, ...typography.body },
  listContent: { paddingBottom: 20 ,marginHorizontal:5  },
  topPadding: { marginTop: 40 },
  searchContainer: {
    flexDirection: "row", paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm, gap: spacing.sm,
  },
  searchInputContainer: {
    flex: 1, flexDirection: "row", alignItems: "center",
    borderRadius: 25, paddingHorizontal: 15, height: 44,
  },
  searchInput: { flex: 1, ...typography.body },
  clearButton: { padding: 5 },
  clearButtonText: { fontSize: 16 },
  searchButton: {
    borderRadius: 25, paddingHorizontal: 20,
    justifyContent: "center", alignItems: "center",
  },
  searchButtonText: { color: "#FFF", fontSize: 15, fontWeight: "600" },
  recentSearches: { marginHorizontal: spacing.md, marginBottom: spacing.md },
  recentTags: { flexDirection: "row", flexWrap: "wrap", marginTop: 6, gap: 6 },
  recentTag: { borderRadius: borderRadius.xl, paddingHorizontal: 14, paddingVertical: 6 },
  recentTagText: { ...typography.body },
  sectionTitle: { ...typography.h3, marginHorizontal: spacing.lg, marginTop: 5, marginBottom: 4 },
  resultCount: { ...typography.caption, marginHorizontal: spacing.lg, marginBottom: spacing.sm },
  emptyContainer: { alignItems: "center", paddingVertical: 60, paddingHorizontal: 40 },
  emptyEmoji: { fontSize: 56, marginBottom: 16 },
  emptyTitle: { ...typography.h3, marginBottom: 8 },
  emptyMessage: { ...typography.body, textAlign: "center" },
  retryButton: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 25, marginTop: 16 },
  retryButtonText: { color: "#FFF", fontSize: 15, fontWeight: "600" },
});

export default SearchScreen;