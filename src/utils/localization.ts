import {useTranslation} from 'react-i18next';
import {LocalizedText} from '../types/api';

/**
 * Gets the localized text based on a specific language
 * Falls back to English if the language is not available
 * @param localizedText - Object containing text in multiple languages or a plain string
 * @param currentLanguage - The language code to use
 * @returns The text in the specified language or English as fallback
 */
const getTextForLanguage = (
  localizedText: LocalizedText | string | undefined | null,
  currentLanguage: string,
): string => {
  // Handle null or undefined
  if (!localizedText) {
    console.warn('getLocalizedText: localizedText is null or undefined');
    return '';
  }

  // Handle if it's still a plain string (backwards compatibility)
  if (typeof localizedText === 'string') {
    return localizedText;
  }

  // Get the text for the current language, fallback to English
  const text = localizedText[currentLanguage as keyof LocalizedText] || localizedText.en;

  // If still no text, try to get any available language
  if (!text) {
    const availableLanguages = ['en', 'fr', 'ar', 'it', 'de', 'zh', 'ru'] as const;
    for (const lang of availableLanguages) {
      if (localizedText[lang]) {
        console.warn(`getLocalizedText: Using ${lang} as fallback for missing ${currentLanguage}`);
        return localizedText[lang];
      }
    }
    console.warn('getLocalizedText: No text available in any language');
    return '';
  }

  return text;
};

/**
 * Hook that returns a function to get localized text
 * Automatically re-renders when language changes
 * @returns A function that takes LocalizedText and returns the localized string
 */
export const useLocalizedText = () => {
  const {i18n} = useTranslation();

  return (localizedText: LocalizedText | string | undefined | null): string => {
    return getTextForLanguage(localizedText, i18n.language || 'en');
  };
};

/**
 * Legacy function for getting localized text (non-reactive)
 * Use useLocalizedText hook instead for reactive behavior
 * @deprecated Use useLocalizedText hook in components
 */
export const getLocalizedText = (
  localizedText: LocalizedText | string | undefined | null,
): string => {
  // This will use the current language but won't trigger re-renders
  // Only use this in non-component contexts
  return getTextForLanguage(localizedText, 'en');
};
