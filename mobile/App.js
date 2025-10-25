import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ScrollView, TextInput } from 'react-native';
import { UserProvider, useUser } from './src/context/UserContext';
import { apiService } from './src/services/api';

// Login Component
function LoginForm() {
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
    } catch (error) {
      Alert.alert('Login Failed', error.message || 'Please try again');
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
  );
}

// User Profile Component
function UserProfile() {
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
            <Text key={clubId} style={styles.clubItem}>
              {relationship.clubName || `Club ${clubId}`}: {relationship.role}
            </Text>
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
function ClubsList() {
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
          <View key={club.id} style={styles.clubCard}>
            <Text style={styles.clubName}>{club.name}</Text>
            <Text style={styles.clubDescription}>{club.description}</Text>
            <Text style={styles.clubAddress}>{club.address}</Text>
            <Text style={styles.clubPhone}>{club.phone}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

// Home Component (when not authenticated)
function HomeScreen() {
  const { login } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      Alert.alert('Success', 'Logged in successfully!');
    } catch (error) {
      Alert.alert('Login Failed', error.message || 'Please try again');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.homeContainer}>
      <Text style={styles.welcomeTitle}>Welcome to Open Active</Text>
      <Text style={styles.welcomeSubtitle}>Tennis Booking System</Text>
      <Text style={styles.homeVersion}>Version 2.0.0</Text>
      
      <View style={styles.loginSection}>
        <Text style={styles.loginTitle}>Login to Continue</Text>
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
    </View>
  );
}

// Main App Component
function AppContent() {
  const { isAuthenticated, isLoading } = useUser();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🎾 Open Active v2.0</Text>
        <Text style={styles.subtitle}>Tennis Booking System</Text>
        <Text style={styles.version}>Version 2.0.0</Text>
      </View>
      
      <ScrollView style={styles.content}>
        {isAuthenticated ? (
          <>
            <UserProfile />
            <ClubsList />
          </>
        ) : (
          <HomeScreen />
        )}
      </ScrollView>
      
      <StatusBar style="light" />
    </View>
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
    paddingTop: 50,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '300',
  },
  version: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '300',
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 20,
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
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
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
  homeContainer: {
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
  homeVersion: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    marginBottom: 30,
  },
  loginSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 16,
  },
  loginTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    marginBottom: 16,
  },
});