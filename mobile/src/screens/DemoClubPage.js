import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Modal } from 'react-native';

// Demo Club Page
export function DemoClubPage({ navigation }) {
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const handleMenuPress = () => {
    setIsMenuVisible(true);
  };

  const navigateToScreen = (screenName, params = {}) => {
    setIsMenuVisible(false);
    if (screenName === 'Home') {
      navigation.navigate('Home');
    } else if (screenName === 'DemoClubLogin') {
      navigation.navigate('DemoClubLogin');
    }
  };

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleMenuPress}>
          <Text style={styles.menuButton}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Demo Club</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <Text style={styles.pageTitle}>Demo Club</Text>
        <Text style={styles.pageContent}>Club functionality coming soon...</Text>
      </ScrollView>

      <Modal
        visible={isMenuVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsMenuVisible(false)}
      >
        <View style={styles.menuOverlay}>
          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuClose} onPress={() => setIsMenuVisible(false)}>
              <Text style={styles.menuCloseText}>✕</Text>
            </TouchableOpacity>
            
            <ScrollView style={styles.menuItems}>
              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={() => navigateToScreen('Home')}
              >
                <Text style={styles.menuItemText}>Home</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={() => navigateToScreen('DemoClubLogin')}
              >
                <Text style={styles.menuItemText}>Login</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  pageContent: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 24,
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





