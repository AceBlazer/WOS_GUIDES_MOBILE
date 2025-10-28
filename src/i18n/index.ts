import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {I18nManager} from 'react-native';

// Import translations
import en from './locales/en.json';
import fr from './locales/fr.json';
import ar from './locales/ar.json';
import it from './locales/it.json';
import de from './locales/de.json';
import zh from './locales/zh.json';
import ru from './locales/ru.json';

const LANGUAGE_STORAGE_KEY = '@app_language';

// Resources for all supported languages
const resources = {
  en: {translation: en},
  fr: {translation: fr},
  ar: {translation: ar},
  it: {translation: it},
  de: {translation: de},
  zh: {translation: zh},
  ru: {translation: ru},
};

// Get the best available language based on device locale
const getDeviceLanguage = (): string => {
  const locales = RNLocalize.getLocales();
  if (locales && locales.length > 0) {
    const deviceLanguage = locales[0].languageCode;
    // Check if device language is supported
    if (Object.keys(resources).includes(deviceLanguage)) {
      return deviceLanguage;
    }
  }
  return 'en'; // Fallback to English
};

// Initialize i18n with saved language or device language
const initI18n = async () => {
  let savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (!savedLanguage) {
    savedLanguage = getDeviceLanguage();
  }

  // Set RTL based on saved/device language
  const isRTL = savedLanguage === 'ar';
  I18nManager.allowRTL(true);
  if (I18nManager.isRTL !== isRTL) {
    I18nManager.forceRTL(isRTL);
  }

  i18n.use(initReactI18next).init({
    compatibilityJSON: 'v3',
    resources,
    lng: savedLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    react: {
      useSuspense: false,
    },
  });
};

// Change language and save to storage
export const changeLanguage = async (language: string) => {
  await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  await i18n.changeLanguage(language);
};

// Get current language
export const getCurrentLanguage = (): string => {
  return i18n.language || 'en';
};

// Check if current language is RTL
export const isRTL = (): boolean => {
  return i18n.language === 'ar';
};

initI18n();

export default i18n;
