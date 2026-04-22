// navigation/AppNavigator.js
// ThemedTabs reads from Redux via useTheme() so the tab bar
// background, border, and icons all switch with dark mode.

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';

import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import RecipeDetailScreen from '../screens/RecipeDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
  </Stack.Navigator>
);

const SearchStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Search" component={SearchScreen} />
    <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
  </Stack.Navigator>
);

const FavoritesStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Favorites" component={FavoritesScreen} />
    <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
  </Stack.Navigator>
);

// ── This component is inside Provider so useTheme() works ────
const ThemedTabs = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        // ── Tab bar container ──────────────────────────────
        tabBarStyle: {
          backgroundColor: colors.tabBar,       // ← dark: #1A1A1A, light: #FFFFFF
          borderTopColor: colors.tabBarBorder,   // ← dark: #2A2A2A, light: #E8E4DF
          borderTopWidth: 1,
          paddingBottom: 6,
          paddingTop: 6,
          height: 60,
        },

        // ── Icon + label colors ────────────────────────────
        tabBarActiveTintColor: colors.primary,   // ← always #FF5252
        tabBarInactiveTintColor: colors.textLight,

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },

        // ── Icons ─────────────────────────────────────────
        tabBarIcon: ({ focused, color, size }) => {
          const iconMap = {
            HomeTab:      focused ? 'home'         : 'home-outline',
            SearchTab:    focused ? 'search'        : 'search-outline',
            FavoritesTab: focused ? 'heart'         : 'heart-outline',
            ProfileTab:   focused ? 'person'        : 'person-outline',
          };
          return <Ionicons name={iconMap[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="HomeTab"      component={HomeStack}      options={{ title: 'Home' }} />
      <Tab.Screen name="SearchTab"    component={SearchStack}    options={{ title: 'Search' }} />
      <Tab.Screen name="FavoritesTab" component={FavoritesStack} options={{ title: 'Favorites' }} />
      <Tab.Screen name="ProfileTab"   component={ProfileScreen}  options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => (
  <NavigationContainer>
    <ThemedTabs />
  </NavigationContainer>
);

export default AppNavigator;