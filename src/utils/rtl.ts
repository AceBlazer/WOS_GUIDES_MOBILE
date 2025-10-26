import {I18nManager, Alert} from 'react-native';
import RNRestart from 'react-native-restart';
import i18n from '../i18n';

/**
 * Sets the RTL layout direction for the app
 * @param isRTL - Whether the app should use RTL layout
 * @param showAlert - Whether to show restart confirmation
 */
export const setRTL = async (isRTL: boolean, showAlert: boolean = true) => {
  if (I18nManager.isRTL !== isRTL) {
    I18nManager.allowRTL(isRTL);
    I18nManager.forceRTL(isRTL);

    if (showAlert) {
      // Show alert and restart app
      Alert.alert(
        i18n.t('common.restartRequired'),
        i18n.t('common.restartMessage'),
        [
          {
            text: i18n.t('common.restartNow'),
            onPress: () => {
              setTimeout(() => {
                RNRestart.restart();
              }, 100);
            },
          },
        ],
        { cancelable: false }
      );
    }
  }
};

/**
 * Updates RTL based on current language
 * @param showAlert - Whether to show restart confirmation
 */
export const updateRTLBasedOnLanguage = async (showAlert: boolean = false) => {
  const currentLanguage = i18n.language;
  const isRTL = currentLanguage === 'ar';
  await setRTL(isRTL, showAlert);
};

/**
 * Checks if current language is RTL
 */
export const isRTLLanguage = (): boolean => {
  return i18n.language === 'ar';
};
