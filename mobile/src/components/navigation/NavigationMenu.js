import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { useUser } from '../../context/UserContext';

// Navigation Menu
export function NavigationMenu({ isVisible, onClose, navigation }) {
  const { isAuthenticated, user, globalRole, getUserClubs } = useUser();

  if (!isVisible) return null;

  const userClubs = getUserClubs();

  const navigateToScreen = (screenName, params = {}) => {
    console.log('navigateToScreen called with:', screenName);
    console.log('navigation object:', navigation);
    if (navigation && navigation.navigate) {
      navigation.navigate(screenName, params);
    } else {
      console.log('Navigation not available');
    }
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
            <Text style={styles.menuItemText}>Debug: Menu is visible</Text>
            
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => navigateToScreen('Home')}
            >
              <Text style={styles.menuItemText}>Home</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => navigateToScreen('SvgTest')}
            >
              <Text style={styles.menuItemText}>SVG Test</Text>
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
                    <Text style={styles.menuItemText}>Open Farm Admin</Text>
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

const styles = StyleSheet.create({
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





