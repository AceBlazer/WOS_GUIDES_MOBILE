import type { NavigationProp } from '@react-navigation/native';

export type RootTabParamList = {
  Guides: undefined;
  Tools: undefined;
  Shop: undefined;
  SupportDevs: undefined;
};

export type GuidesStackParamList = {
  GuidesMain: undefined;
  CategoryGuides: {
    categoryId: string;
    categoryName: string;
  };
  GuideDetail: {
    guideId: string;
    guideTitle: string;
  };
};

export type ToolsStackParamList = {
  ToolsMain: undefined;
  AutoClicker: undefined;
  BlacklistTracker: undefined;
  Notifications: undefined;
};

export type RootTabNavigationProp = NavigationProp<RootTabParamList>;
export type GuidesStackNavigationProp = NavigationProp<GuidesStackParamList>;
export type ToolsStackNavigationProp = NavigationProp<ToolsStackParamList>;