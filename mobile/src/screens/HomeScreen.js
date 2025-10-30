import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useUser } from '../../context/UserContext';
import { getVersion } from '../../utils/version';
import { UserProfile } from '../user/UserProfile';

// Home Screen
export function HomeScreen({ navigation, onMenuPress }) {
  const { isAuthenticated } = useUser();

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {
          console.log('Menu button pressed');
          onMenuPress();
        }}>
          <Text style={styles.menuButton}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Main Header</Text>
        {isAuthenticated && <UserProfile navigation={navigation} />}
      </View>
      
      <ScrollView style={styles.content}>
        <Text style={styles.pageTitle}>Open Farm Home</Text>
        {!isAuthenticated && (
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeTitle}>Welcome to Open Farm</Text>
            <Text style={styles.welcomeSubtitle}>Tennis Booking System</Text>
            <Text style={styles.welcomeVersion}>Version {getVersion()}</Text>
            <TouchableOpacity 
              style={styles.loginButton}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.loginButtonText}>Login to Continue</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.loginButton, { backgroundColor: '#4CAF50', marginTop: 10 }]}
              onPress={() => navigation.navigate('SvgTest')}
            >
              <Text style={styles.loginButtonText}>SVG Test</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>Open Farm Tennis Booking System</Text>
        <Text style={styles.footerText}>Version {getVersion()}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  },
  menuButton: {
    fontSize: 24,
    color: 'white',
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    flex: 1,
    fontFamily: 'Poppins_600SemiBold',
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
    fontFamily: 'Poppins_600SemiBold',
  },
  footer: {
    padding: 20,
    paddingBottom: 35,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    fontFamily: 'Poppins_400Regular',
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
    fontFamily: 'Poppins_700Bold',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'Poppins_400Regular',
  },
  welcomeVersion: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: 'Poppins_400Regular',
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
    fontFamily: 'Poppins_600SemiBold',
  },
});





