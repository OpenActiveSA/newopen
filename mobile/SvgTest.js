import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Icon } from './src/components/Icon';
import Svg, { Rect, Path, Polyline, Polygon, Circle, Line } from 'react-native-svg';

// Actual downloaded SVG components using react-native-svg
const LockSvg = () => (
  <Svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <Path d="M6,11v-5c0-2.8,3.2-4,6-4s6,1.2,6,4v5" />
    <Line x1="7.4" y1="16.3" x2="7.6" y2="16.3" />
    <Line x1="10.4" y1="16.3" x2="10.6" y2="16.3" />
    <Line x1="13.4" y1="16.3" x2="13.6" y2="16.3" />
    <Line x1="16.4" y1="16.3" x2="16.6" y2="16.3" />
  </Svg>
);

const MailSvg = () => (
  <Svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <Polyline points="22,6 12,13 2,6" />
  </Svg>
);

const HeartSvg = () => (
  <Svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </Svg>
);

const StarSvg = () => (
  <Svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
  </Svg>
);

const CalendarSvg = () => (
  <Svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <Line x1="16" y1="2" x2="16" y2="6" />
    <Line x1="8" y1="2" x2="8" y2="6" />
    <Line x1="3" y1="10" x2="21" y2="10" />
  </Svg>
);

const ClockSvg = () => (
  <Svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Polyline points="12,6 12,12 16,14" />
  </Svg>
);

const UserSvg = () => (
  <Svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <Circle cx="12" cy="7" r="4" />
  </Svg>
);

const MapPinSvg = () => (
  <Svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <Circle cx="12" cy="10" r="3" />
  </Svg>
);

const PhoneSvg = () => (
  <Svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </Svg>
);

const SettingsSvg = () => (
  <Svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="3" />
    <Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </Svg>
);

const SearchSvg = () => (
  <Svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="11" cy="11" r="8" />
    <Path d="M21 21l-4.35-4.35" />
  </Svg>
);

const PlaySvg = () => (
  <Svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Polygon points="5,3 19,12 5,21" />
  </Svg>
);

const BackSvg = () => (
  <Svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Polyline points="17,21 7,12 17,3" />
  </Svg>
);

// Icon container component
const LineSvg = ({ children, label }) => (
  <View style={styles.svgContainer}>
    <View style={styles.svgBox}>
      {children}
    </View>
    <Text style={styles.iconLabel}>{label}</Text>
  </View>
);

export default function SvgTest() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>SVG Test</Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Local Open Active Icons</Text>
          <View style={styles.iconRow}>
            <LineSvg label="Lock">
              <Icon name="lock" size={32} color="white" />
            </LineSvg>
            <LineSvg label="Mail">
              <Icon name="envelope" size={32} color="white" />
            </LineSvg>
            <LineSvg label="Heart">
              <HeartSvg />
            </LineSvg>
            <LineSvg label="Star">
              <StarSvg />
            </LineSvg>
            <LineSvg label="Calendar">
              <CalendarSvg />
            </LineSvg>
            <LineSvg label="Clock">
              <ClockSvg />
            </LineSvg>
            <LineSvg label="User">
              <UserSvg />
            </LineSvg>
            <LineSvg label="Location">
              <MapPinSvg />
            </LineSvg>
            <LineSvg label="Phone">
              <PhoneSvg />
            </LineSvg>
            <LineSvg label="Settings">
              <SettingsSvg />
            </LineSvg>
            <LineSvg label="Search">
              <SearchSvg />
            </LineSvg>
                <LineSvg label="Play">
                  <PlaySvg />
                </LineSvg>
                <LineSvg label="Back">
                  <BackSvg />
                </LineSvg>
          </View>
        </View>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>Open Active Tennis Booking System</Text>
        <Text style={styles.footerText}>SVG Test Page</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#052333',
  },
  header: {
    backgroundColor: '#052333',
    padding: 20,
    paddingTop: 50,
    alignItems: 'center',
  },
      headerTitle: {
        fontSize: 24,
        color: 'white',
        fontWeight: 'bold',
        fontFamily: 'Poppins_700Bold',
      },
  content: {
    padding: 20,
  },
  pageTitle: {
    fontSize: 28,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 30,
    opacity: 0.8,
  },
  section: {
    marginBottom: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 10,
  },
  sectionLabel: {
    fontSize: 18,
    color: 'white',
    marginBottom: 15,
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
  },
  iconRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  svgContainer: {
    alignItems: 'center',
    margin: 10,
  },
  svgBox: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    marginBottom: 8,
  },
  iconLabel: {
    color: 'white',
    fontSize: 14,
    opacity: 0.7,
  },
  note: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  noteText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.6,
  },
  footer: {
    backgroundColor: '#052333',
    padding: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  footerText: {
    color: 'white',
    fontSize: 14,
    opacity: 0.6,
    marginBottom: 5,
  },
});