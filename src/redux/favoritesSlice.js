import { createSlice } from "@reduxjs/toolkit";

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: {
    items: [],
  },
  reducers: {
    addFavorites: (state, action) => {
      const alreadyExists = state.items.find(
        (meal) => meal.id === action.payload.id
      );
      if (!alreadyExists) {
        state.items.push(action.payload);
      }
    },
    removeFavorites:(state,action)=>{
        state.items = state.items.filter((meal)=>meal.id !== action.payload)
    }
  },
});

export const {addFavorites,removeFavorites} = favoritesSlice.actions;
export default favoritesSlice.reducer

