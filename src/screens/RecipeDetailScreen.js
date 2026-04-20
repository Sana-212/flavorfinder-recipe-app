import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Image,
  SafeAreaView,
  StatusBar,
  TextInput,
} from "react-native";
import recipeAPI from "../services/api";
import { useSelector, useDispatch } from "react-redux";
import { addFavorites, removeFavorites } from "../redux/favoritesSlice";

const RecipeDetailScreen = ({ navigation, route }) => {
  const recipeId = route?.params?.recipeId;

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const favoriteItems = useSelector((state) => state.favorites.items);

  const transformRecipe = (recipe) => ({
    id: recipe.idMeal,
    name: recipe.strMeal,
    image: recipe.strMealThumb,
    time: "30 mins",
    difficulty: "Medium",
    rating: 4.5,
    category: recipe.strCategory?.toLowerCase() || "",
    instructions: recipe.strInstructions,
    raw: recipe,
  });

  const isFavorite = (recipeId) => {
    return favoriteItems.some((item) => item.id === recipeId);
  };

  const toggleFavorite = (recipe) => {
    if (isFavorite(recipe.id)) {
      dispatch(removeFavorites(recipe.id));
    } else {
      dispatch(addFavorites(recipe));
    }
  };

  const getSteps = (instructions) => {
    if (!instructions) return [];
    return instructions
      .split("\n")
      .map((step) => step.trim())
      .filter((step) => step.length > 0)
      .filter((step) => !step.toLowerCase().match(/^step\s*\d+\.?$/))
      .filter((step) => !step.match(/^\d+\.?$/));
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

  const fetchWithTimeout = (promise, ms = 8000) => {
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), ms)
    );
    return Promise.race([promise, timeout]);
  };

  const fetchRecipeDetail = async (id) => {
    try {
      const data = await fetchWithTimeout(recipeAPI.getRecipeById(id));
      const mealData = Array.isArray(data) ? data[0] : data;
      setRecipe(transformRecipe(mealData));
    } catch (err) {
      console.log("Error loading recipe: ", err);
      setError(err.message || "Loading failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!recipeId) {
      setError("No recipe ID provided");
      setLoading(false);
      return;
    }
    fetchRecipeDetail(recipeId);
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text style={styles.loadingText}>Loading recipe details...</Text>
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Something Went Wrong</Text>
        <Text style={styles.text}>{error}</Text>
      </View>
    );
  }
  if (!recipe) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Not found</Text>
        <Text style={styles.text}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      bounces={false}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.imageContainer}>
        <Image
         source={{ uri: recipe.image }} style={styles.headerImage} />
      
        <View style={styles.imageOverlay}></View>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
       <TouchableOpacity
          style={[
            styles.heartButton,
            isFavorite(recipe.id) && styles.heartButtonActive,
          ]}
          onPress={() => toggleFavorite(recipe)}
        >
          <Text style={styles.heartText}>
            {isFavorite(recipe.id) ? "❤️" : "🤍"}
          </Text>
        </TouchableOpacity>
        <Text style={styles.overlayRecipeName}>{recipe.name}</Text>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>⭐</Text>
            <Text style={styles.statValue}>4.5</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>⏱️</Text>
            <Text style={styles.statValue}>30 m</Text>
            <Text style={styles.statLabel}>Total time</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>📊</Text>
            <Text style={styles.statValue}>Medium</Text>
            <Text style={styles.statLabel}>Difficulty</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>🍽️</Text>
            <Text style={styles.statValue}>1</Text>
            <Text style={styles.statLabel}>Servings</Text>
          </View>
        </View>
      </View>

      <View style={styles.contentCard}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients </Text>
          {getIngredients(recipe.raw).map((item, index) => (
            <View key={index} style={styles.ingredientRow}>
              <Text style={styles.ingredientName}>{item.name}</Text>
              <Text style={styles.ingredientMeasure}>{item.measure}</Text>
            </View>
          ))}
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          {getSteps(recipe.instructions).map((step, index) => (
            <View key={index} style={styles.stepRow}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },

  imageContainer: {
    width: "100%",
    height: 420,
  },
  headerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    alignSelf: "center",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "100%",
    backgroundColor: "rgba(78, 78, 78, 0.18)",
  },

  backButton: {
    position: "absolute",
    top: 50,
    left: 16,
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 34,
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  backText: {
    fontSize: 32,
    fontWeight: "300",
    color: "#333",
    lineHeight: 34,
    marginLeft: -2,
    paddingBottom: 3,
  },
  heartButton: {
    position: "absolute",
    top: 50,
    right: 16,
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 22,
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  heartText: {
    fontSize: 20,
  },
  overlayRecipeName: {
    position: "absolute",
    bottom: 100, // sits above stats row
    left: 16,
    right: 16,
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    zIndex: 5,
  },

  statsRow: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 45,
    paddingHorizontal: 8,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  statValue: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    color: "rgba(255,255,255,0.7)",
  },

  contentCard: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    marginTop: -35,
    paddingTop: 22,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 21,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 20,
  },

  ingredientRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  ingredientName: {
    fontSize: 15,
    color: "#333",
    flex: 1,
  },
  ingredientMeasure: {
    fontSize: 14,
    color: "#FF6B6B",
    fontWeight: "600",
  },

  stepRow: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "flex-start",
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FF6B6B",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
    marginTop: 1,
  },
  stepNumberText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    color: "#444",
    lineHeight: 24,
  },
  heartButtonActive: {
    color: "rgba(138, 4, 4, 0.15)",
  },
});

export default RecipeDetailScreen;
