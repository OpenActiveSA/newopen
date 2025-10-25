import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ScrollView, TextInput, Modal } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { UserProvider, useUser } from './src/context/UserContext';
import { apiService } from './src/services/api';

const Stack = createStackNavigator();

// Login Component
function LoginForm({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useUser();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      Alert.alert('Success', 'Logged in successfully!');
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Login Failed', error.message || 'Please try again');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Login</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Login</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email:</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password:</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
            />
          </View>
          <TouchableOpacity 
            style={[styles.button, isLoading && styles.buttonDisabled]} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

// User Profile Component
function UserProfile({ navigation }) {
  const { user, globalRole, clubRelationships, logout } = useUser();

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: logout }
      ]
    );
  };

  return (
    <View style={styles.profileContainer}>
      <Text style={styles.profileTitle}>Welcome, {user?.name || user?.email}!</Text>
      <Text style={styles.profileInfo}>Role: {globalRole || 'N/A'}</Text>
      
      {Object.keys(clubRelationships).length > 0 && (
        <View style={styles.clubsContainer}>
          <Text style={styles.clubsTitle}>Your Clubs:</Text>
          {Object.entries(clubRelationships).map(([clubId, relationship]) => (
            <TouchableOpacity 
              key={clubId} 
              style={styles.clubItem}
              onPress={() => navigation.navigate('Club', { clubId })}
            >
              <Text style={styles.clubItemText}>
                {relationship.clubName || `Club ${clubId}`}: {relationship.role}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

// Clubs List Component
function ClubsList({ navigation }) {
  const [clubs, setClubs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadClubs();
  }, []);

  const loadClubs = async () => {
    try {
      const response = await apiService.getClubs();
      setClubs(response.clubs || []);
    } catch (error) {
      Alert.alert('Error', 'Failed to load clubs');
      console.error('Error loading clubs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading clubs...</Text>
      </View>
    );
  }

  return (
    <View style={styles.clubsListContainer}>
      <Text style={styles.clubsListTitle}>Available Clubs</Text>
      <ScrollView style={styles.clubsScrollView}>
        {clubs.map((club) => (
          <TouchableOpacity 
            key={club.id} 
            style={styles.clubCard}
            onPress={() => navigation.navigate('Club', { clubId: club.id })}
          >
            <Text style={styles.clubName}>{club.name}</Text>
            <Text style={styles.clubDescription}>{club.description}</Text>
            <Text style={styles.clubAddress}>{club.address}</Text>
            <Text style={styles.clubPhone}>{club.phone}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

// Home Screen
function HomeScreen({ navigation, onMenuPress }) {
  const { isAuthenticated } = useUser();

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onMenuPress}>
          <Text style={styles.menuButton}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Main Header</Text>
        {isAuthenticated && <UserProfile navigation={navigation} />}
      </View>
      
      <ScrollView style={styles.content}>
        <Text style={styles.pageTitle}>Open Active Home</Text>
        {!isAuthenticated && (
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeTitle}>Welcome to Open Active</Text>
            <Text style={styles.welcomeSubtitle}>Tennis Booking System</Text>
            <Text style={styles.welcomeVersion}>Version 2.0.0</Text>
            <TouchableOpacity 
              style={styles.loginButton}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.loginButtonText}>Login to Continue</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>Open Active Tennis Booking System</Text>
        <Text style={styles.footerText}>Version 2.0.0</Text>
      </View>
    </View>
  );
}

// Login Page
function LoginPage({ navigation }) {
  return <LoginForm navigation={navigation} />;
}

// Admin Page
function AdminPage({ navigation }) {
  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Open Active Admin</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <Text style={styles.pageTitle}>Open Active Admin</Text>
        <Text style={styles.pageContent}>Admin functionality coming soon...</Text>
      </ScrollView>
    </View>
  );
}

// Club Register Page
function ClubRegisterPage({ navigation }) {
  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Club Register</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <Text style={styles.pageTitle}>Club Register</Text>
        <Text style={styles.pageContent}>Club registration functionality coming soon...</Text>
      </ScrollView>
    </View>
  );
}

// Demo Club Page
function DemoClubPage({ navigation }) {
  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Demo Club</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <Text style={styles.pageTitle}>Demo Club</Text>
        <Text style={styles.pageContent}>Club functionality coming soon...</Text>
      </ScrollView>
    </View>
  );
}

// Demo Club Login Page
function DemoClubLoginPage({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useUser();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      Alert.alert('Success', 'Logged in successfully!');
      navigation.navigate('DemoClub');
    } catch (error) {
      Alert.alert('Login Failed', error.message || 'Please try again');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Demo Club Login</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Demo Club Login</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email:</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password:</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
            />
          </View>
          <TouchableOpacity 
            style={[styles.button, isLoading && styles.buttonDisabled]} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Logging in...' : 'Login to Demo Club'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

// Club Admin Page
function ClubAdminPage({ navigation }) {
  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Club Admin</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <Text style={styles.pageTitle}>Club Admin</Text>
        <Text style={styles.pageContent}>Club admin functionality coming soon...</Text>
      </ScrollView>
    </View>
  );
}

// User Registration Page
function UserRegistrationPage({ navigation }) {
  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>User Registration</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <Text style={styles.pageTitle}>User Registration</Text>
        <Text style={styles.pageContent}>User registration functionality coming soon...</Text>
      </ScrollView>
    </View>
  );
}

// Generic Club Page
function ClubPage({ navigation, route }) {
  const { clubId } = route.params;
  
  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Club {clubId}</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <Text style={styles.pageTitle}>Club {clubId}</Text>
        <Text style={styles.pageContent}>Club details and functionality coming soon...</Text>
      </ScrollView>
    </View>
  );
}

// Navigation Menu
function NavigationMenu({ isVisible, onClose }) {
  const { isAuthenticated, user, globalRole, getUserClubs } = useUser();

  if (!isVisible) return null;

  const userClubs = getUserClubs();

  const navigateToScreen = (screenName, params = {}) => {
    // This will be handled by the navigation context
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.menuOverlay}>
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuClose} onPress={onClose}>
            <Text style={styles.menuCloseText}>✕</Text>
          </TouchableOpacity>
          
          <ScrollView style={styles.menuItems}>
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => navigateToScreen('Home')}
            >
              <Text style={styles.menuItemText}>Home</Text>
            </TouchableOpacity>
            
            {!isAuthenticated ? (
              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={() => navigateToScreen('Login')}
              >
                <Text style={styles.menuItemText}>Login</Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity 
                  style={styles.menuItem} 
                  onPress={() => navigateToScreen('ClubRegister')}
                >
                  <Text style={styles.menuItemText}>Register Club</Text>
                </TouchableOpacity>
                
                {globalRole === 'openactive_user' && (
                  <TouchableOpacity 
                    style={styles.menuItem} 
                    onPress={() => navigateToScreen('Admin')}
                  >
                    <Text style={styles.menuItemText}>Open Active Admin</Text>
                  </TouchableOpacity>
                )}
                
                {userClubs.map(({ clubId, clubName, role }) => (
                  <TouchableOpacity 
                    key={clubId} 
                    style={styles.menuItem}
                    onPress={() => navigateToScreen('Club', { clubId })}
                  >
                    <Text style={styles.menuItemText}>
                      {clubName || `Club ${clubId}`}
                    </Text>
                  </TouchableOpacity>
                ))}
                
                <TouchableOpacity 
                  style={styles.menuItem} 
                  onPress={() => navigateToScreen('DemoClub')}
                >
                  <Text style={styles.menuItemText}>Demo Club</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.menuItem} 
                  onPress={() => navigateToScreen('DemoClubLogin')}
                >
                  <Text style={styles.menuItemText}>Demo Club Login</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.menuItem} 
                  onPress={() => navigateToScreen('ClubAdmin')}
                >
                  <Text style={styles.menuItemText}>Club Admin</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.menuItem} 
                  onPress={() => navigateToScreen('UserRegistration')}
                >
                  <Text style={styles.menuItemText}>User Registration</Text>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// Main App Component
function AppContent() {
  const { isAuthenticated, isLoading } = useUser();
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#052333' }
        }}
      >
        <Stack.Screen name="Home">
          {(props) => <HomeScreen {...props} onMenuPress={() => setIsMenuVisible(true)} />}
        </Stack.Screen>
        <Stack.Screen name="Login" component={LoginPage} />
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
      />
      
      <StatusBar style="light" />
    </NavigationContainer>
  );
}

// App with UserProvider
export default function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#052333',
  },
  page: {
    flex: 1,
    backgroundColor: '#052333',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  menuButton: {
    fontSize: 24,
    color: 'white',
    marginRight: 15,
  },
  backArrow: {
    fontSize: 24,
    color: 'white',
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: 'white',
    marginBottom: 20,
  },
  pageContent: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 24,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },
  welcomeContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeVersion: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    marginBottom: 30,
  },
  loginButton: {
    backgroundColor: '#667eea',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: 'white',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#667eea',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#666',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  profileContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  profileTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
  },
  profileInfo: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 16,
  },
  clubsContainer: {
    marginBottom: 16,
  },
  clubsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
  },
  clubItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  clubItemText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  logoutButton: {
    backgroundColor: '#ff6b6b',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  clubsListContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 20,
  },
  clubsListTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    marginBottom: 16,
  },
  clubsScrollView: {
    maxHeight: 300,
  },
  clubCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  clubName: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  clubDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  clubAddress: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 2,
  },
  clubPhone: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: 'white',
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    backgroundColor: '#052333',
    width: '80%',
    maxHeight: '80%',
    borderRadius: 12,
    padding: 20,
  },
  menuClose: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  menuCloseText: {
    fontSize: 24,
    color: 'white',
  },
  menuItems: {
    flex: 1,
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  menuItemText: {
    fontSize: 18,
    color: 'white',
  },
});