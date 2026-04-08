// src/components/SearchBar.js
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const SearchBar = ({ 
  onSearch, 
  placeholder = "Search recipes...",
  isLoading = false,
  initialValue = '',
}) => {
  const [searchText, setSearchText] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const inputRef = useRef(null);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: isFocused ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isFocused]);

  const handleSearch = () => {
    if (searchText.trim()) {
      onSearch(searchText.trim());
      inputRef.current?.blur();
    }
  };

  const handleClear = () => {
    setSearchText('');
    onSearch('');
  };

  return (
    <Animated.View style={[
      styles.container,
      isFocused && styles.containerFocused,
      { transform: [{ scale: fadeAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1.02]
      })}]}
    ]}>
      <Icon name="search-outline" size={20} color="#666" style={styles.searchIcon} />
      
      <TextInput
        ref={inputRef}
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={searchText}
        onChangeText={setSearchText}
        onSubmitEditing={handleSearch}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
      />
      
      {isLoading ? (
        <ActivityIndicator size="small" color="#FF6B6B" style={styles.rightIcon} />
      ) : searchText.length > 0 ? (
        <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
          <Icon name="close-circle" size={20} color="#999" />
        </TouchableOpacity>
      ) : null}
      
      {searchText.length > 0 && (
        <TouchableOpacity 
          style={styles.searchButton}
          onPress={handleSearch}
          activeOpacity={0.8}
        >
          <Icon name="arrow-forward" size={20} color="#FFF" />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginHorizontal: 20,
    marginVertical: 10,
    height: 50,
    borderWidth: 1,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  containerFocused: {
    borderColor: '#FF6B6B',
    backgroundColor: '#FFF',
    shadowOpacity: 0.2,
    elevation: 5,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 10,
  },
  rightIcon: {
    marginLeft: 10,
  },
  clearButton: {
    padding: 5,
  },
  searchButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
});

export default SearchBar;