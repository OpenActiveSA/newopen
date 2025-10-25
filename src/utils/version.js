// Version utility for reading version from version.txt
let cachedVersion = null;

export async function getVersion() {
  if (cachedVersion) {
    return cachedVersion;
  }

  try {
    const response = await fetch('/version.txt');
    if (response.ok) {
      const version = await response.text();
      cachedVersion = version.trim();
      return cachedVersion;
    }
  } catch (error) {
    console.warn('Could not load version from version.txt, using fallback');
  }

  // Fallback version
  cachedVersion = '1.0.0';
  return cachedVersion;
}

// For immediate use (synchronous fallback)
export function getVersionSync() {
  return cachedVersion || '1.0.0';
}
