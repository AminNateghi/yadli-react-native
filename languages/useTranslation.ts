import { useData } from '@/contexts/DataContext';
import { NestedKeyOf, TranslationKeys } from './TranslationKeys';
import langEn from './i18n/en.json';
import langFa from './i18n/fa.json';

type Props = {
  [key: string]: string | Props;
};

const translationLoaders: Record<string, () => { default: Props }> = {
  en: () => ({ default: langEn }),
  fa: () => ({ default: langFa }),
};

const getNestedValue = (obj: Props, key: string): string | undefined => {
  return key?.split('.').reduce((acc, part) => {
    if (acc && typeof acc === 'object') {
      return acc[part as keyof typeof acc];
    }
    return undefined;
  }, obj as any);
};

export const useTranslation = () => {
  const { language } = useData();

  const t = (key: NestedKeyOf<TranslationKeys>): string => {
    const module = translationLoaders[language]?.();
    const dict = module?.default;

    if (!dict) return key;

    const translated = getNestedValue(dict, key);
    return translated ?? key;
  };

  const tString = (key: string): string => {
    const module = translationLoaders[language]?.();
    const dict = module?.default;

    if (!dict) return key;

    const translated = getNestedValue(dict, key);
    return translated ?? key;
  };

  const isRTL = t('app.rtl') === 'true';

  return { t, tString, isRTL };
};
