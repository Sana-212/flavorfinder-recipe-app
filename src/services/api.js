// src/services/api.js
const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

// Helper function for API calls
const fetchAPI = async (endpoint, errorMessage = 'Failed to fetch data') => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`${errorMessage}:`, error);
    throw error;
  }
};

// Create the recipeAPI object
export const recipeAPI = {
  // Search recipes by name
  searchRecipes: async (query) => {
    try {
      const data = await fetchAPI(`/search.php?s=${query}`, 'Search failed');
      return data.meals || [];
    } catch (error) {
      throw error;
    }
  },

  // Get recipe by ID
  getRecipeById: async (id) => {
    try {
      const data = await fetchAPI(`/lookup.php?i=${id}`, 'Failed to get recipe');
      return data.meals ? data.meals[0] : null;
    } catch (error) {
      throw error;
    }
  },

  // Get random recipes
  getRandomRecipes: async (count = 10) => {
    try {
      console.log(`Fetching ${count} random recipes...`);
      const promises = [];
      for (let i = 0; i < count; i++) {
        promises.push(
          fetch(`${BASE_URL}/random.php`)
            .then(res => res.json())
            .catch(err => {
              console.error('Random recipe fetch error:', err);
              return { meals: null };
            })
        );
      }
      const results = await Promise.all(promises);
      const recipes = results
        .map(data => data.meals ? data.meals[0] : null)
        .filter(recipe => recipe !== null);
      console.log(`Found ${recipes.length} random recipes`);
      return recipes;
    } catch (error) {
      console.error('Random recipes error:', error);
      throw new Error('Failed to load random recipes');
    }
  },

  // Filter by category
  getRecipesByCategory: async (category) => {
    try {
      const data = await fetchAPI(`/filter.php?c=${category}`, 'Failed to filter');
      const allMeals= data.meals || [];

      const shuffled = allMeals.sort(()=>Math.random()-0.5)
      return shuffled.slice(0,10)
    } catch (error) {
      throw error;
    }
  },

  // Get all categories
  getCategories: async () => {
    try {
      const data = await fetchAPI('/categories.php', 'Failed to get categories');
    const allCategories = data.categories || [];
    
    const shuffled = allCategories.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 7);
    } catch (error) {
      throw error;
    }
  },
};

export default recipeAPI;