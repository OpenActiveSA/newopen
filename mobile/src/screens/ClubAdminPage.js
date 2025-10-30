import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { BackSvg } from '../components/common/BackSvg';

// Club Admin Page
export function ClubAdminPage({ navigation }) {
  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackSvg size={24} color="white" />
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
});





