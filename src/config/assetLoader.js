// src/config/assetLoader.js
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { LogBox } from 'react-native';
import { Asset } from 'expo-asset';

// Suppress specific warnings related to your React Native View text node issue
// and font loading slowness
LogBox.ignoreLogs([
  'TNodeChildrenRenderer: Support for defaultProps will be removed from function components',
  'Slow network is detected',
  'Unexpected text node: . A text node cannot be a child of a <View>.'
]);

// Function to preload all necessary assets
export const loadAssets = async () => {
  try {
    // Load Ionicons font which seems to be taking time in your app
    await Font.loadAsync({
      ...Ionicons.font,
    });
    
    // Preload any critical images your app needs on startup
    // For example, common icons or the app logo
    await Asset.loadAsync([
      require('../assets/avatar.png'),
      // Add any other common assets here
    ]);
    
    console.log('Assets loaded successfully');
    return true;
  } catch (error) {
    console.error('Error loading assets:', error);
    return false;
  }
};