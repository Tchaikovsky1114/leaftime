import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '../screens/HomeScreen';
import BookMarksScreen from '../screens/BookMarksScreen';
import Icons from '../assets/Icons';


const Drawer = createDrawerNavigator();

export default function HomeDrawer() {
  return (
    <Drawer.Navigator
    initialRouteName="HomeScreen"
      screenOptions={{
        headerShown: false,
        drawerPosition: 'right',

        drawerStyle: {
          backgroundColor: '#fdf6ec',
          width: 260,
        },
        drawerLabelStyle: {
          fontSize: 16,
          marginLeft: -10,
        },
        drawerActiveTintColor: '#222',
        drawerInactiveTintColor: '#888',
      }}
    >
      <Drawer.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          title: '홈',
          drawerIcon: ({ color, size }) => (
            <Icons name="home-outline" color={color} size={size} />
          ),
        }}
      />

      <Drawer.Screen
        name="Bookmarks"
        component={BookMarksScreen}
        options={{
          title: '북마크',
          drawerIcon: ({ color, size }) => (
            <Icons name="bookmark-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}
