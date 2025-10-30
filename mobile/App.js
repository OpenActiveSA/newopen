import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { UserProvider, useUser } from './src/context/UserContext';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';

// Import screens
import {
  HomeScreen,
  LoginPage,
  AdminPage,
  ClubRegisterPage,
  DemoClubPage,
  DemoClubLoginPage,
  ClubAdminPage,
  UserRegistrationPage,
  ClubPage
} from './src/screens';

// Import components
import { NavigationMenu } from './src/components';

// Import SVG Test
import SvgTest from './SvgTest';

const Stack = createStackNavigator();

// Main App Component
function AppContent() {
  const { isAuthenticated, isLoading } = useUser();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [navigationRef, setNavigationRef] = useState(null);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <NavigationContainer ref={setNavigationRef}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#8b7b54' }
        }}
      >
        <Stack.Screen name="Home">
          {(props) => <HomeScreen {...props} onMenuPress={() => setIsMenuVisible(true)} />}
        </Stack.Screen>
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="SvgTest" component={SvgTest} />
        <Stack.Screen name="Admin" component={AdminPage} />
        <Stack.Screen name="ClubRegister" component={ClubRegisterPage} />
        <Stack.Screen name="DemoClub" component={DemoClubPage} />
        <Stack.Screen name="DemoClubLogin" component={DemoClubLoginPage} />
        <Stack.Screen name="ClubAdmin" component={ClubAdminPage} />
        <Stack.Screen name="UserRegistration" component={UserRegistrationPage} />
        <Stack.Screen name="Club" component={ClubPage} />
      </Stack.Navigator>
      
      <NavigationMenu 
        isVisible={isMenuVisible}
        onClose={() => setIsMenuVisible(false)}
        navigation={navigationRef}
      />
      
      <StatusBar style="light" />
    </NavigationContainer>
  );
}

// App with UserProvider
export default function App() {
  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8b7b54',
  },
  loadingText: {
    fontSize: 16,
    color: 'white',
  },
});