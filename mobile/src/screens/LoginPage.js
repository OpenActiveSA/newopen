import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { getVersion } from '../../utils/version';
import { LoginForm } from '../components/auth/LoginForm';
import { BackSvg } from '../components/common/BackSvg';

// Login Page
export function LoginPage({ navigation }) {
  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackSvg size={24} color="white" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        <LoginForm navigation={navigation} />
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
  content: {
    flex: 1,
    padding: 20,
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
});





