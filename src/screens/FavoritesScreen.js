// screens/FavoritesScreen.js
import React from "react";
import { View, Text, StyleSheet, FlatList, StatusBar } from "react-native";
import { spacing, typography } from "../styles/globalStyles";
import { useTheme } from "../hooks/useTheme";
import { useDispatch, useSelector } from "react-redux";
import { removeFavorites } from "../redux/favoritesSlice";
import RecipeCard from "../components/RecipeCard";

const FavoritesScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const favoriteItems = useSelector((state) => state.favorites.items);

  const handleRecipePress = (recipe) => {
    if (!recipe?.id) return;
    navigation.navigate("RecipeDetail", { recipeId: recipe.id });
  };

  const handleRemove = (recipeId) => {
    if (!recipeId) return;
    dispatch(removeFavorites(recipeId));
  };

  const renderRecipe = ({ item }) => {
    if (!item || !item.id) return null;
    return (
      <RecipeCard
        recipe={item}
        onPress={() => handleRecipePress(item)}
        isFavorite={true}
        onFavoritePress={() => handleRemove(item.id)}
         colors={colors} 
      />
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.statusBar} backgroundColor={colors.background} />
      <Text style={[styles.title, { color: colors.text }]}>My Favorites</Text>
      <FlatList
        data={favoriteItems}
        renderItem={renderRecipe}
        keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>💔</Text>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No favorites yet</Text>
            <Text style={[styles.emptyText, { color: colors.textLight }]}>
              Tap the heart on any recipe to save it here
            </Text>
          </View>
        }
        contentContainerStyle={[
          styles.listContent,
          favoriteItems.length === 0 && { flexGrow: 1 },
        ]}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, marginTop: 40 },
  title: { ...typography.h2, margin: spacing.md },
  listContent: { paddingBottom: spacing.lg ,marginHorizontal:5 },
  emptyContainer: {
    flex: 1, justifyContent: "center", alignItems: "center",
    paddingHorizontal: 40, gap: 8,
  },
  emptyEmoji: { fontSize: 52, marginBottom: 8 },
  emptyTitle: { ...typography.h3, textAlign: "center" },
  emptyText: { ...typography.body, textAlign: "center", lineHeight: 22 },
});

export default FavoritesScreen;