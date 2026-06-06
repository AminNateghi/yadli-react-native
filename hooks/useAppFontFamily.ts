import { getAppFontFamily } from '@/constants/theme';
import { useData } from '@/contexts/DataContext';

export const useAppFontFamily = () => {
  const { language } = useData();
  return getAppFontFamily(language);
};
