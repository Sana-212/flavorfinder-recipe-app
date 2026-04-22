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
// Add this import at the top
import { useSafeAreaInsets } from 'react-native-safe-area-context';



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
 const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
     headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.tabBarBorder,
          borderTopWidth: 1,
          
          // FIX: This adds space at the bottom so mobile icons don't overlap
          paddingBottom: insets.bottom > 0 ? insets.bottom : 6, 
          paddingTop: 2,
          
          // FIX: Increase height to account for the extra safe area padding
          height: insets.bottom > 0 ? 45 + insets.bottom : 50, 
          
          // Keep the bar visible and positioned correctly
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          elevation: 4, // Adds shadow on Android to separate from system bar
        },

        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginBottom: insets.bottom > 0 ? 0 : 5, // Extra spacing for older phones
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