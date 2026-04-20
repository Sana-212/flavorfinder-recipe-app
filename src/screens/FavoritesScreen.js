import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import {
  colors,
  spacing,
  typography,
  borderRadius,
} from "../styles/globalStyles";
import { useDispatch, useSelector } from "react-redux";
import { removeFavorites } from "../redux/favoritesSlice";
import RecipeCard from "../components/RecipeCard";

const FavoritesScreen = ({ navigation }) => {
  const dispatch = useDispatch();
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
      />
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Favorites</Text>
      <FlatList
        data={favoriteItems}
        renderItem={renderRecipe}
        keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No favorites yet! 💔</Text>
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
  container: {
    flex: 1,
    backgroundColor: colors.background || "#FFF",
    marginTop: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    margin: spacing.md,
    color: colors.text || "#333",
  },
  listContent: {
    paddingBottom: spacing.lg,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: colors.textLight || "#999",
    textAlign: "center",
  },
});

export default FavoritesScreen;
