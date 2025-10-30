import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { useUser } from '../../context/UserContext';

// User Profile Component
export function UserProfile({ navigation }) {
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

const styles = StyleSheet.create({
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
});





