import React from 'react';
import Svg, { Rect, Path, Polyline, Circle } from 'react-native-svg';

// Custom SVG designs matching the web version exactly
const EnvelopeIcon = ({ size = 20, color = 'white' }) => (
  <Svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2" 
    strokeMiterlimit="10"
  >
    <Polyline points="2.69 4.46 11.99 14.56 21.48 4.63" fill="none" stroke={color} strokeMiterlimit="10" strokeWidth="2"/>
    <Rect x="1.42" y="3.38" width="21.16" height="17.24" rx="4" ry="4" fill="none" stroke={color} strokeMiterlimit="10" strokeWidth="2"/>
  </Svg>
);

const LockIcon = ({ size = 20, color = 'white' }) => (
  <Svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill={color}
  >
    <Path d="M18.6,8.9v-2.5c0-3.3-2.3-6-5.1-6h-2.8c-2.8,0-5.1,2.7-5.1,6v2.5c-2,.2-3.6,1.9-3.6,4v6.9c0,2.2,1.8,4,4,4h12.3c2.2,0,4-1.8,4-4v-6.9c0-2.1-1.6-3.7-3.6-4ZM7.4,6.3c0-2.2,1.4-4,3.1-4h2.8c1.7,0,3.1,1.8,3.1,4v2.5H7.4v-2.5ZM20.1,19.7c0,1.1-.9,2-2,2H5.9c-1.1,0-2-.9-2-2v-6.9c0-1.1.9-2,2-2h12.3c1.1,0,2,.9,2,2v6.9Z"/>
    <Path d="M6.5,15.7c-.7,0-1.2.5-1.2,1.2s.5,1.2,1.2,1.2,1.2-.5,1.2-1.2-.5-1.2-1.2-1.2Z"/>
    <Circle cx="10.2" cy="16.9" r="1.2"/>
    <Circle cx="13.8" cy="16.9" r="1.2"/>
    <Path d="M17.5,15.7c-.7,0-1.2.5-1.2,1.2s.5,1.2,1.2,1.2,1.2-.5,1.2-1.2-.5-1.2-1.2-1.2Z"/>
  </Svg>
);

// Universal Icon component
export function Icon({ name, size = 20, color = 'white' }) {
  const icons = {
    envelope: <EnvelopeIcon size={size} color={color} />,
    lock: <LockIcon size={size} color={color} />
  };

  return icons[name] || null;
}
