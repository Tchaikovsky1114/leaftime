import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// import SettingsScreen from '../screens/SettingsScreen';
import BookListScreen from '../screens/BookListScreen';
import HomeDrawerStack from '../stacks/HomeDrawerStack';
import Icons, { IconProps } from '../assets/Icons';
import ProfileScreen from '../screens/ProfileScreen';


const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarLabelStyle: { fontSize: 12 },
      tabBarIcon: ({ color, size }) => {
        let iconName: IconProps['name'];

        switch (route.name) {
          case 'Home':
            iconName = 'home-outline';
            break;
          case 'Books':
            iconName = 'book-outline';
            break;
          case 'Profile':
            iconName = 'person-outline';
            break;
          default:
            iconName = 'ellipse-outline';
        }

        return <Icons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#222',
      tabBarInactiveTintColor: '#aaa',
    })}
  >
    <Tab.Screen name="Home" component={HomeDrawerStack} />
    <Tab.Screen name="Books" component={BookListScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
    {/* <Tab.Screen name="Settings" component={SettingsScreen} /> */}
  </Tab.Navigator>
  );
}
