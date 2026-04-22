// screens/RecipeDetailScreen.js
import React from "react";
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, ActivityIndicator, Image, StatusBar,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { addFavorites, removeFavorites } from "../redux/favoritesSlice";
import { useGetRecipeByIdQuery } from "../redux/recipeApiSlice";
import { useTheme } from "../hooks/useTheme";
import { spacing, typography, borderRadius } from "../styles/globalStyles";
import { Ionicons } from "@expo/vector-icons";

const RecipeDetailScreen = ({ navigation, route }) => {
  const recipeId = route?.params?.recipeId;
  const { colors } = useTheme();

  const dispatch = useDispatch();
  const favoriteItems = useSelector((state) => state.favorites.items);

  const { data: rawMeal, isLoading, error } = useGetRecipeByIdQuery(recipeId, {
    skip: !recipeId,
  });

  const recipe = rawMeal
    ? {
        id: rawMeal.idMeal,
        name: rawMeal.strMeal,
        image: rawMeal.strMealThumb,
        time: "30 mins",
        difficulty: "Medium",
        rating: 4.5,
        category: rawMeal.strCategory?.toLowerCase() || "",
        instructions: rawMeal.strInstructions,
        raw: rawMeal,
      }
    : null;

  const isFavorite = (id) => favoriteItems.some((item) => item.id === id);
  const toggleFavorite = (recipe) => {
    if (isFavorite(recipe.id)) dispatch(removeFavorites(recipe.id));
    else dispatch(addFavorites(recipe));
  };

  const getSteps = (instructions) => {
    if (!instructions) return [];
    return instructions
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .filter((s) => !s.toLowerCase().match(/^step\s*\d+\.?$/))
      .filter((s) => !s.match(/^\d+\.?$/));
  };

  const getIngredients = (rawObject) => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = rawObject[`strIngredient${i}`];
      const measure = rawObject[`strMeasure${i}`];
      if (ingredient && ingredient.trim() !== "") {
        ingredients.push({ name: ingredient, measure: measure || "" });
      }
    }
    return ingredients;
  };

  if (!recipeId) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>No recipe ID provided</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={colors.statusBar} backgroundColor={colors.background} />
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textLight }]}>
          Loading recipe details...
        </Text>
      </View>
    );
  }

  if (error || !recipe) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>Something went wrong</Text>
        <Text style={[styles.loadingText, { color: colors.textLight }]}>
          {error?.error || "Recipe not found"}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      bounces={false}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle="light-content" />

      {/* ── Hero image ───────────────────────────────────────────── */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: recipe.image }} style={styles.headerImage} />
        <View style={styles.imageOverlay} />

        {/* Back button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={22} color="#333" />
        </TouchableOpacity>

        {/* Favorite button */}
        <TouchableOpacity
          style={[
            styles.heartButton,
            isFavorite(recipe.id) && { backgroundColor: 'rgba(255,82,82,0.15)' },
          ]}
          onPress={() => toggleFavorite(recipe)}
        >
          <Ionicons
            name={isFavorite(recipe.id) ? "heart" : "heart-outline"}
            size={22}
            color={isFavorite(recipe.id) ? colors.primary : "#333"}
          />
        </TouchableOpacity>

        {/* Recipe name overlay */}
        <Text style={styles.overlayRecipeName}>{recipe.name}</Text>

        {/* Stats row */}
        <View style={styles.statsRow}>
          {[
            { icon: "⭐", value: "4.5", label: "Rating" },
            { icon: "⏱️", value: "30 m", label: "Total time" },
            { icon: "📊", value: "Medium", label: "Difficulty" },
            { icon: "🍽️", value: "1", label: "Servings" },
          ].map((stat, i) => (
            <React.Fragment key={i}>
              {i > 0 && <View style={styles.statDivider} />}
              <View style={styles.statItem}>
                <Text>{stat.icon}</Text>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            </React.Fragment>
          ))}
        </View>
      </View>

      {/* ── Content card ─────────────────────────────────────────── */}
      <View style={[styles.contentCard, { backgroundColor: colors.background }]}>

        {/* Ingredients */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Ingredients</Text>
          {getIngredients(recipe.raw).map((item, index) => (
            <View
              key={index}
              style={[styles.ingredientRow, { borderBottomColor: colors.border }]}
            >
              <View style={styles.ingredientDot} />
              <Text style={[styles.ingredientName, { color: colors.text }]}>{item.name}</Text>
              <Text style={[styles.ingredientMeasure, { color: colors.primary }]}>
                {item.measure}
              </Text>
            </View>
          ))}
        </View>

        {/* Instructions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Instructions</Text>
          {getSteps(recipe.instructions).map((step, index) => (
            <View key={index} style={styles.stepRow}>
              <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <Text style={[styles.stepText, { color: colors.textSecondary }]}>{step}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", gap: 8 },
  errorText: { ...typography.h3 },
  loadingText: { ...typography.body, marginTop: spacing.sm },

  // Hero
  imageContainer: { width: "100%", height: 420 },
  headerImage: { width: "100%", height: "100%", resizeMode: "cover" },
  imageOverlay: {
    position: "absolute", bottom: 0, left: 0, right: 0, height: "100%",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  backButton: {
    position: "absolute", top: 50, left: 16,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 34, width: 44, height: 44,
    justifyContent: "center", alignItems: "center", zIndex: 10,
  },
  heartButton: {
    position: "absolute", top: 50, right: 16,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 22, width: 44, height: 44,
    justifyContent: "center", alignItems: "center", zIndex: 10,
  },
  overlayRecipeName: {
    position: "absolute", bottom: 100, left: 16, right: 16,
    fontSize: 24, fontWeight: "bold", color: "#fff", zIndex: 5,
  },
  statsRow: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    flexDirection: "row", justifyContent: "space-around",
    alignItems: "center", paddingVertical: 45, paddingHorizontal: 8,
  },
  statItem: { alignItems: "center", flex: 1, gap: 2 },
  statDivider: { width: 1, height: 30, backgroundColor: "rgba(255,255,255,0.3)" },
  statValue: { fontSize: 12, fontWeight: "bold", color: "#fff" },
  statLabel: { fontSize: 10, color: "rgba(255,255,255,0.7)" },

  // Content
  contentCard: {
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    marginTop: -28, paddingTop: 24,
    paddingHorizontal: spacing.lg, paddingBottom: 48,
  },
  section: { marginBottom: spacing.lg },
  sectionTitle: { ...typography.h2, marginBottom: spacing.lg },
  ingredientRow: {
    flexDirection: "row", alignItems: "center",
    paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, gap: spacing.sm,
  },
  ingredientDot: {
    width: 6, height: 6, borderRadius: 3, backgroundColor: '#FF5252',
  },
  ingredientName: { ...typography.body, flex: 1 },
  ingredientMeasure: { ...typography.bodyMedium, fontWeight: "600" },
  stepRow: { flexDirection: "row", marginBottom: spacing.lg, alignItems: "flex-start" },
  stepNumber: {
    width: 32, height: 32, borderRadius: 16,
    justifyContent: "center", alignItems: "center",
    marginRight: 14, marginTop: 1, flexShrink: 0,
  },
  stepNumberText: { color: "#fff", fontSize: 14, fontWeight: "bold" },
  stepText: { flex: 1, ...typography.body, lineHeight: 24 },
});

export default RecipeDetailScreen;