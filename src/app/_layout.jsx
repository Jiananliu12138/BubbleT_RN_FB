import { observer } from 'mobx-react-lite';
import { Tabs } from 'expo-router';
import { LoadingView } from '../views/commonComponents/loadingView';
import { reactiveModel } from '../bootstrapping';
import { Icon } from '../components/IconComponent';
import { useEffect, useState, useRef } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack, useRouter, useSegments } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar, Platform } from 'react-native';

// Define yellow theme colors
const COLORS = {
  background: '#fff9db',      // Light yellow for background
  primaryDark: '#facc15',     // Deep yellow for active elements
  accent: '#eab308',          // Medium yellow for highlights
  text: '#1f2937',            // Dark gray for text/icons
  textSecondary: '#4b5563',   // Medium gray for secondary text/icons
  border: '#000000',          // Black for borders/shadows
};

// This is the default export required by Expo Router
export default observer(function RootLayout() {
  const { tea, user } = reactiveModel;
  const router = useRouter();
  const segments = useSegments(); // Get current route segments
  const [hasCheckedOnboarding, setHasCheckedOnboarding] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false); // Prevent navigation loops
  const navigationLock = useRef(false); // Track navigation state with ref

  // Centralize app state and navigation handling
  useEffect(() => {
    async function initializeApp() {
      if (!tea.ready) return;

      // Avoid repeated initialization
      if (navigationLock.current) return;
      navigationLock.current = true;

      try {
        // Check onboarding status
        const onboardingComplete = await AsyncStorage.getItem('@onboarding_complete');
        console.log('Layout checking onboarding status:', onboardingComplete);

        const shouldShowOnboarding = onboardingComplete !== 'true';
        setShowOnboarding(shouldShowOnboarding);
        setHasCheckedOnboarding(true);

        // Wait for state update
        setTimeout(() => {
          navigationLock.current = false;
        }, 100);
      } catch (error) {
        console.error('Error initializing app:', error);
        setHasCheckedOnboarding(true);
        navigationLock.current = false;
      }
    }

    initializeApp();
  }, [tea.ready]);

  // Handle navigation logic
  useEffect(() => {
    if (!hasCheckedOnboarding || !tea.ready || isNavigating) return;

    const navigate = async () => {
      // Prevent navigation loops
      setIsNavigating(true);

      try {
        if (showOnboarding) {
          console.log('Navigating to onboarding');
          if (segments[0] !== 'onboarding') {
            await router.replace('/onboarding');
          }
        } else if (!user.currentUser) {
          console.log('Navigating to login');
          if (segments[0] !== 'login') {
            await router.replace('/login');
          }
        }
      } catch (error) {
        console.error('Navigation error:', error);
      } finally {
        // Unlock navigation state
        setTimeout(() => {
          setIsNavigating(false);
        }, 300);
      }
    };

    navigate();
  }, [hasCheckedOnboarding, showOnboarding, user.currentUser, tea.ready, segments]);

  // Handler for completing onboarding - called by onboardingPresenter
  // Note: This is a critical part providing unified navigation logic
  global.completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('@onboarding_complete', 'true');
      console.log('Layout marking onboarding complete');
      setShowOnboarding(false);
      return true;
    } catch (error) {
      console.error('Unable to save onboarding status:', error);
      return false;
    }
  };

  if (!tea.ready || !hasCheckedOnboarding) {
    return <LoadingView message="Loading..." />;
  }

  // Show onboarding or login page
  if (showOnboarding || !user.currentUser) {
    return (
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            width: '100%',
            height: '100%',
            backgroundColor: COLORS.background, // Apply yellow background
          },
        }}
      >
        {showOnboarding ? (
          <Stack.Screen
            name="onboarding"
            options={{
              animation: Platform.OS === 'web' ? 'none' : 'default',
            }}
          />
        ) : (
          <Stack.Screen
            name="login"
            options={{
              animation: Platform.OS === 'web' ? 'none' : 'default',
            }}
          />
        )}
      </Stack>
    );
  }

  // User is logged in, show main app
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: COLORS.primaryDark, // Deep yellow for active tab
          tabBarInactiveTintColor: COLORS.textSecondary, // Gray for inactive tab
          tabBarStyle: {
            height: 70,
            paddingBottom: 8,
            paddingTop: 8,
            backgroundColor: COLORS.background, // Light yellow tab bar
            borderTopColor: COLORS.border, // Black border
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="home-outline" size={size} color={color} />
            ),
            tabBarLabel: 'Home',
          }}
        />

        <Tabs.Screen
          name="community"
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="people-outline" size={size} color={color} />
            ),
            tabBarLabel: 'Community',
          }}
        />

        <Tabs.Screen
          name="map"
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="map-outline" size={size} color={color} />
            ),
            tabBarLabel: 'Map',
          }}
        />

        <Tabs.Screen
          name="AiChat"
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="filter" size={size} color={color} />
            ),
            tabBarLabel: "AI"
          }}
        />  

        <Tabs.Screen
          name="profile"
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="person-outline" size={size} color={color} />
            ),
            tabBarLabel: 'Profile',
          }}
        />

        {/* Hidden screens */}
        <Tabs.Screen
          name="details"
          options={{
            href: null,
          }}
        />

        <Tabs.Screen
          name="search"
          options={{
            href: null,
          }}
        />

        <Tabs.Screen
          name="all-teas"
          options={{
            href: null,
          }}
        />

        <Tabs.Screen
          name="login"
          options={{
            href: null,
          }}
        />

        <Tabs.Screen
          name="favorites"
          options={{
            href: null,
          }}
        />

        <Tabs.Screen
          name="onboarding"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </SafeAreaProvider>
  );
});