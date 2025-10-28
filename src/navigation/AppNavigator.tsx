import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform, View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../styles/theme';

import type {
  RootTabParamList,
  GuidesStackParamList,
  ToolsStackParamList,
} from '../types/navigation';

// Screen imports
import GuidesScreen from '../screens/GuidesScreen';
import CategoryGuidesScreen from '../screens/CategoryGuidesScreen';
import GuideDetailScreen from '../screens/GuideDetailScreen';
import ToolsScreen from '../screens/ToolsScreen';
import AutoClickerScreen from '../screens/AutoClickerScreen';
import UnderDevelopmentScreen from '../screens/UnderDevelopmentScreen';
import PlaceholderScreen from '../screens/PlaceholderScreen';

const Tab = createBottomTabNavigator<RootTabParamList>();
const GuidesStack = createNativeStackNavigator<GuidesStackParamList>();
const ToolsStack = createNativeStackNavigator<ToolsStackParamList>();

// Custom Tab Bar Icon component with separator
const TabIcon = ({ name, focused }: { name: string; focused: boolean }) => {
  const getIconConfig = (
    tabName: string,
  ): { name: string; focused: string; unfocused: string } => {
    switch (tabName) {
      case 'Guides':
        return {
          name: 'Guides',
          focused: 'book-open-variant',
          unfocused: 'book-multiple',
        };
      case 'Tools':
        return { name: 'Tools', focused: 'toolbox', unfocused: 'cog' };
      case 'Shop':
        return { name: 'Shop', focused: 'cart', unfocused: 'store' };
      case 'SupportDevs':
        return {
          name: 'SupportDevs',
          focused: 'heart',
          unfocused: 'heart-outline',
        };
      default:
        return {
          name: 'Default',
          focused: 'cellphone',
          unfocused: 'cellphone',
        };
    }
  };

  const iconConfig = getIconConfig(name);
  const iconName = focused ? iconConfig.focused : iconConfig.unfocused;
  const showSeparator = name !== 'SupportDevs'; // Don't show separator on last tab

  return (
    <View style={styles.tabIconContainer}>
      <MaterialCommunityIcons
        name={iconName}
        size={24}
        color="#FFFFFF"
        style={{
          opacity: focused ? 1 : 0.7,
        }}
      />
      {showSeparator && <View style={styles.tabSeparator} />}
    </View>
  );
};

// Guides Stack Navigator
function GuidesStackNavigator() {
  return (
    <GuidesStack.Navigator>
      <GuidesStack.Screen
        name="GuidesMain"
        component={GuidesScreen}
        options={{ headerShown: false }}
      />
      <GuidesStack.Screen
        name="CategoryGuides"
        component={CategoryGuidesScreen}
        options={{ headerShown: false }}
      />
      <GuidesStack.Screen
        name="GuideDetail"
        component={GuideDetailScreen}
        options={{ headerShown: false }}
      />
    </GuidesStack.Navigator>
  );
}

// Tools Stack Navigator
function ToolsStackNavigator() {
  return (
    <ToolsStack.Navigator>
      <ToolsStack.Screen
        name="ToolsMain"
        component={ToolsScreen}
        options={{ headerShown: false }}
      />
      <ToolsStack.Screen
        name="AutoClicker"
        component={AutoClickerScreen}
        options={{ title: 'Auto Clicker' }}
      />
      <ToolsStack.Screen
        name="BlacklistTracker"
        options={{ title: 'Blacklist Tracker' }}
      >
        {() => (
          <PlaceholderScreen
            title="Blacklist Tracker"
            subtitle="Player Tracking Tool"
            description="Keep track of problematic players and alliances. Report system and player database coming soon!"
          />
        )}
      </ToolsStack.Screen>
      <ToolsStack.Screen
        name="Notifications"
        options={{ title: 'Notifications' }}
      >
        {() => (
          <PlaceholderScreen
            title="Notifications"
            subtitle="Game Updates & Alerts"
            description="Subscribe to important game updates, event notifications, and maintenance alerts."
          />
        )}
      </ToolsStack.Screen>
    </ToolsStack.Navigator>
  );
}

// Main App Navigator
function AppNavigator() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => (
          <TabIcon name={route.name} focused={focused} />
        ),
        tabBarActiveTintColor: '#FFFFFF', // White when active
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.7)', // Semi-transparent white when inactive
        tabBarStyle: {
          backgroundColor: '#3E93E3', // New blue background
          borderTopWidth: 2,
          borderTopColor: '#6FB3F5', // Lighter blue horizontal line at top
          paddingTop: 8,
          paddingBottom: Math.max(insets.bottom, 8),
          height: 65 + Math.max(insets.bottom - 5, 0),
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          letterSpacing: 0.3,
          marginTop: 4,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Guides"
        component={GuidesStackNavigator}
        options={{ tabBarLabel: t('tabs.guides') }}
      />
      <Tab.Screen
        name="Tools"
        component={ToolsStackNavigator}
        options={{ tabBarLabel: t('tabs.tools') }}
      />
      <Tab.Screen name="Shop" options={{ tabBarLabel: t('tabs.shop') }}>
        {() => (
          <UnderDevelopmentScreen
            title={t('tabs.shop')}
            subtitle="Coming Soon"
          />
        )}
      </Tab.Screen>
      <Tab.Screen
        name="SupportDevs"
        options={{ tabBarLabel: t('tabs.support') }}
      >
        {() => (
          <UnderDevelopmentScreen
            title={t('tabs.support')}
            subtitle="Help Us Grow"
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabIconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  tabSeparator: {
    position: 'absolute',
    right: -30,
    top: '50%',
    marginTop: -20,
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
});

export default AppNavigator;
