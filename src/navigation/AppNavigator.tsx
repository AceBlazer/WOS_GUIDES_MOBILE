import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { theme } from '../styles/theme';

import type { RootTabParamList, GuidesStackParamList, ToolsStackParamList } from '../types/navigation';

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

// Custom Tab Bar Icon component
const TabIcon = ({ name, focused }: { name: string; focused: boolean }) => {
  const getIcon = (tabName: string) => {
    switch (tabName) {
      case 'Guides': return focused ? '📖' : '📚';
      case 'Tools': return focused ? '🛠️' : '⚙️';
      case 'Shop': return focused ? '🛒' : '🏪';
      case 'SupportDevs': return focused ? '💙' : '❤️';
      default: return '📱';
    }
  };

  return (
    <Text style={{
      fontSize: 20,
      opacity: focused ? 1 : 0.7,
      textShadowColor: focused ? 'rgba(79, 195, 247, 0.5)' : 'rgba(0,0,0,0.2)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: focused ? 2 : 1,
    }}>
      {getIcon(name)}
    </Text>
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
        tabBarActiveTintColor: theme.colors.primary, // Bright ice blue when active
        tabBarInactiveTintColor: theme.colors.textTertiary, // Muted grey-blue when inactive
        tabBarStyle: {
          backgroundColor: theme.colors.backgroundLight, // Dark frozen steel
          borderTopWidth: 1,
          borderTopColor: theme.colors.border, // Subtle dark border
          paddingTop: 8,
          paddingBottom: Math.max(insets.bottom, 8),
          height: 65 + Math.max(insets.bottom - 5, 0),
          ...theme.shadows.medium,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          letterSpacing: 0.3,
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
      <Tab.Screen
        name="Shop"
        options={{ tabBarLabel: t('tabs.shop') }}
      >
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

export default AppNavigator;