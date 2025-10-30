import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ScrollView, TextInput } from 'react-native';
import { useUser } from '../../context/UserContext';
import { Icon } from '../Icon';

// Login Component
export function LoginForm({ navigation, onSuccess }) {
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
      if (onSuccess) {
        onSuccess();
      } else {
        navigation.navigate('Home');
      }
    } catch (error) {
      Alert.alert('Login Failed', error.message || 'Please try again');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>Login</Text>
      <View style={styles.inputWithIcon}>
        <View style={styles.inputIcon}>
          <Icon name="envelope" size={20} color="rgba(255, 255, 255, 0.6)" />
        </View>
        <TextInput
          style={styles.inputWithIconText}
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          placeholderTextColor="rgba(255, 255, 255, 0.7)"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      <View style={styles.inputWithIcon}>
        <View style={styles.inputIcon}>
          <Icon name="lock" size={20} color="rgba(255, 255, 255, 0.6)" />
        </View>
        <TextInput
          style={styles.inputWithIconText}
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          placeholderTextColor="rgba(255, 255, 255, 0.7)"
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

const styles = StyleSheet.create({
  formContainer: {
    backgroundColor: 'transparent',
    borderRadius: 3,
    padding: 20,
    marginTop: 20,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Poppins_600SemiBold',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderBottomWidth: 2,
    borderBottomColor: 'white',
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  inputIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  inputWithIconText: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: 'white',
    backgroundColor: 'transparent',
    fontFamily: 'Poppins_400Regular',
  },
  button: {
    backgroundColor: 'white',
    borderRadius: 3,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#666',
  },
  buttonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
});





