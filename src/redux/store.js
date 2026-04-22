// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import favoritesReducer from './favoritesSlice';  
import { recipeApi } from './recipeApiSlice'; 
import profileReducer from './profileSlice'     

export const store = configureStore({
  reducer: {
    favorites: favoritesReducer,  
     profile: profileReducer,                      
    [recipeApi.reducerPath]: recipeApi.reducer,       
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(recipeApi.middleware), 
});