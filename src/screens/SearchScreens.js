// src/screens/SearchScreens.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Image,
  SafeAreaView,
  StatusBar,
  TextInput,
} from 'react-native';
import RecipeCard from '../components/RecipeCard';
import recipeAPI from '../services/api';

const SearchScreen = ({ navigation }) => {
  const [recipes, setRecipes] = useState([]);
  const [favorites,setFavorites]=useState([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);

const transformRecipe = (recipe) => ({
  id: recipe.idMeal,
  name: recipe.strMeal,
  image: recipe.strMealThumb,
  time: '30 mins',
  difficulty: 'Medium',
  rating: 4.5,
  category: recipe.strCategory?.toLowerCase() || ''
});

  // Load random recipes on mount
  useEffect(() => {
    loadRandomRecipes();
  }, []);


  const loadRandomRecipes = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading random recipes...');
      
      const data = await recipeAPI.getRandomRecipes(5);
      console.log('Recipes loaded:', data.length);
      
   setRecipes(data.map(transformRecipe))

    } catch (err) {
      console.error('Error loading searched recipes:', err);
      setError(err.message || 'Failed to load recipes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    if (!query || !query.trim()) {
      loadRandomRecipes();
      setSearchQuery('');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSearchQuery(query);
      
      console.log('Searching for:', query);
      const results = await recipeAPI.searchRecipes(query);
      console.log('Search results:', results.length);
      
      setRecipes(results.map(transformRecipe));
      
      // Save to recent searches if results found
      if (results.length > 0 && !recentSearches.includes(query)) {
        setRecentSearches(prev => [query, ...prev].slice(0, 5));
      }
      
      // Show message if no results
      if (results.length === 0) {
        setError(`No recipes found for "${query}". Try a different search term.`);
      }
    } catch (err) {
      console.error('Search failed:', err);
      setError(err.message || 'Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (searchQuery) {
      await handleSearch(searchQuery);
    } else {
      await loadRandomRecipes();
    }
    setRefreshing(false);
  }, [searchQuery]);

  const handleRecipePress = (recipe) => {
    navigation.navigate('RecipeDetail', { recipeId :recipe.id });
  };
const isFavorite=(recipeId)=>{
return favorites.includes(recipeId)
}

const toggleFavorite=(recipeId)=>{
if(favorites.includes(recipeId)){
  setFavorites(favorites.filter(id => id !== recipeId))
}else{
  setFavorites([...favorites,recipeId])
}
}

  const renderRecipe = ({ item }) => {
  return (
  <RecipeCard
  recipe={item}
  onPress={()=>handleRecipePress(item)}
  isFavorite={isFavorite(item.id)}
  onFavoritePress={()=>{toggleFavorite(item.id)}}/>
);
}

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>🍳</Text>
      <Text style={styles.emptyTitle}>
        {searchQuery ? 'No recipes found' : 'No recipes available'}
      </Text>
      <Text style={styles.emptyMessage}>
        {searchQuery 
          ? `Try searching with different keywords like "chicken", "pasta", or "cake"`
          : 'Pull down to refresh or try searching for your favorite recipes.'}
      </Text>
      {!searchQuery && (
        <TouchableOpacity style={styles.retryButton} onPress={loadRandomRecipes}>
          <Text style={styles.retryButtonText}>Refresh</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorEmoji}>⚠️</Text>
      <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
      <Text style={styles.errorMessage}>{error}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={loadRandomRecipes}>
        <Text style={styles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading && !refreshing && recipes.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text style={styles.loadingText}>Loading delicious recipes...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
       <View style={styles.searchContainer}>
      <View style={styles.searchInputContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search recipes..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={() => handleSearch(searchQuery)}
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => {
              setSearchQuery('');
              loadRandomRecipes();
            }}
          >
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity
        style={styles.searchButton}
        onPress={() => handleSearch(searchQuery)}
      >
        <Text style={styles.searchButtonText}>Search</Text>
      </TouchableOpacity>
    </View>

    {/* Recent searches also outside FlatList */}
    {recentSearches.length > 0 && !searchQuery && (
      <View style={styles.recentSearches}>
        <Text style={styles.sectionTitle}>Recent Searches</Text>
        <View style={styles.recentTags}>
          {recentSearches.map((search, index) => (
            <TouchableOpacity
              key={index}
              style={styles.recentTag}
              onPress={() => handleSearch(search)}
            >
              <Text style={styles.recentTagText}>{search}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    )}

    <Text style={styles.sectionTitle}>
      {searchQuery ? `Results for "${searchQuery}"` : 'Discover Recipes'}
    </Text>
    <Text style={styles.resultCount}>{recipes.length} recipes found</Text>

      <FlatList
        data={recipes}
        renderItem={renderRecipe}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={error ? renderErrorState : renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#FF6B6B']}
            tintColor="#FF6B6B"
          />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  listContent: {
    paddingBottom: 20,
  },
  header: {
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 10,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 50,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 10,
  },
  clearButton: {
    padding: 5,
  },
  clearButtonText: {
    fontSize: 16,
    color: '#999',
  },
  searchButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 25,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
  },
  searchButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  recentSearches: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  recentTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  recentTag: {
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  recentTagText: {
    fontSize: 14,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 5,
    color: '#333',
  },
  resultCount: {
    fontSize: 14,
    color: '#999',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  recipeCard: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginVertical: 8,
    backgroundColor: '#FFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  recipeImage: {
    width: 100,
    height: 100,
  },
  recipeInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  recipeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  recipeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recipeCategory: {
    fontSize: 12,
    color: '#FF6B6B',
    backgroundColor: '#FFF0F0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 8,
  },
  recipeArea: {
    fontSize: 12,
    color: '#999',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  errorEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 10,
  },
  retryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SearchScreen;