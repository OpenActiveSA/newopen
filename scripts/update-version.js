#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read version from version.txt
const versionPath = path.join(__dirname, '..', 'version.txt');
const mobileVersionPath = path.join(__dirname, '..', 'mobile', 'src', 'utils', 'version.js');

try {
  const version = fs.readFileSync(versionPath, 'utf8').trim();
  
  // Update mobile version file
  const mobileVersionContent = `// Version utility for mobile app
// This should be kept in sync with version.txt
export const APP_VERSION = '${version}';

export function getVersion() {
  return APP_VERSION;
}
`;

  fs.writeFileSync(mobileVersionPath, mobileVersionContent);
  
  console.log(`✅ Version updated to ${version} in mobile app`);
  console.log(`📱 Mobile version file updated: ${mobileVersionPath}`);
  
} catch (error) {
  console.error('❌ Error updating version:', error.message);
  process.exit(1);
}
