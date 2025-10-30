import React from 'react';
import Svg, { Polyline } from 'react-native-svg';

// Back arrow SVG component
export const BackSvg = ({ size = 24, color = 'white' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Polyline points="17,21 7,12 17,3" />
  </Svg>
);





