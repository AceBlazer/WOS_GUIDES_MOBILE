import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { changeLanguage } from '../i18n';
import { updateRTLBasedOnLanguage } from '../utils/rtl';
import { theme } from '../styles/theme';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
];

interface CompactLanguageSelectorProps {
  onLanguageChange?: () => void;
}

export const CompactLanguageSelector: React.FC<CompactLanguageSelectorProps> = ({
  onLanguageChange,
}) => {
  const { i18n } = useTranslation();
  const queryClient = useQueryClient();
  const [modalVisible, setModalVisible] = useState(false);

  const currentLanguage = LANGUAGES.find(lang => lang.code === i18n.language) || LANGUAGES[0];

  const handleLanguageSelect = async (languageCode: string) => {
    try {
      const previousLanguage = i18n.language;
      await changeLanguage(languageCode);
      setModalVisible(false);

      // Invalidate all queries to refetch with new language
      queryClient.invalidateQueries();

      // Check if we need to change RTL direction
      const wasRTL = previousLanguage === 'ar';
      const isRTL = languageCode === 'ar';

      if (wasRTL !== isRTL) {
        // RTL direction change requires restart
        await updateRTLBasedOnLanguage(true);
      }

      onLanguageChange?.();
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  const renderLanguageItem = ({ item }: { item: Language }) => {
    const isSelected = item.code === i18n.language;

    return (
      <TouchableOpacity
        style={[styles.languageItem, isSelected && styles.selectedLanguageItem]}
        onPress={() => handleLanguageSelect(item.code)}
      >
        <Text style={styles.flag}>{item.flag}</Text>
        <View style={styles.languageInfo}>
          <Text style={[styles.languageName, isSelected && styles.selectedLanguageName]}>
            {item.nativeName}
          </Text>
          <Text style={[styles.languageCode, isSelected && styles.selectedLanguageCode]}>
            {item.name}
          </Text>
        </View>
        {isSelected && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>
    );
  };

  return (
    <>
      <TouchableOpacity
        style={styles.compactButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.flag}>{currentLanguage.flag}</Text>
        <Text style={styles.languageCode}>{currentLanguage.code.toUpperCase()}</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>🌐 Select Language</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={LANGUAGES}
              renderItem={renderLanguageItem}
              keyExtractor={item => item.code}
              style={styles.languageList}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  compactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundLight,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 4,
  },
  flag: {
    fontSize: 16,
  },
  languageCode: {
    fontSize: theme.typography.sizes.xs,
    fontFamily: theme.typography.fontFamily.medium,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textSecondary,
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.backgroundCard,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    maxHeight: '70%',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalTitle: {
    fontSize: theme.typography.sizes.xl,
    fontFamily: theme.typography.fontFamily.bold,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textPrimary,
  },
  closeButton: {
    padding: theme.spacing.sm,
  },
  closeButtonText: {
    fontSize: theme.typography.sizes.xl,
    color: theme.colors.textSecondary,
  },
  languageList: {
    paddingVertical: theme.spacing.sm,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    gap: theme.spacing.md,
  },
  selectedLanguageItem: {
    backgroundColor: theme.colors.backgroundLight,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: theme.typography.sizes.lg,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.textPrimary,
    marginBottom: 2,
  },
  selectedLanguageName: {
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
  },
  selectedLanguageCode: {
    color: theme.colors.primary,
  },
  checkmark: {
    fontSize: theme.typography.sizes.xl,
    color: theme.colors.primary,
    fontWeight: theme.typography.weights.bold,
  },
});

export default CompactLanguageSelector;
