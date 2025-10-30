import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { apiService } from '../../services/api';

// Clubs List Component
export function ClubsList({ navigation }) {
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

const styles = StyleSheet.create({
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
});





