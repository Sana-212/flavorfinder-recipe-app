

import { useSelector } from 'react-redux';
import { lightColors, darkColors } from '../styles/globalStyles';

export const useTheme = () => {
  const isDarkMode = useSelector((state) => state.profile.isDarkMode);
  return {
    colors: isDarkMode ? darkColors : lightColors,
    isDarkMode,
  };
};