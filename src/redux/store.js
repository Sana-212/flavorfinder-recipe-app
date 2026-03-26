import { configureStore } from '@reduxjs/toolkit';

const rootReducer = (state = {}, action) => state;

export const store = configureStore({
  reducer: rootReducer,
});