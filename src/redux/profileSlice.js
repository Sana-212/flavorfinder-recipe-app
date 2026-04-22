import { createSlice } from '@reduxjs/toolkit';

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    name: '',
    isDarkMode: false,
  },
  reducers: {
    setName: (state, action) => {
      state.name = action.payload;
    },
    toggleTheme: (state) => {
      state.isDarkMode = !state.isDarkMode;
    },
  },
});

export const { setName, toggleTheme } = profileSlice.actions;
export default profileSlice.reducer;