export default {
  expo: {
    name: "Open Active",
    slug: "openactive-mobile",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#667eea"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    fonts: [
      "node_modules/@expo-google-fonts/poppins/Poppins_400Regular.ttf",
      "node_modules/@expo-google-fonts/poppins/Poppins_500Medium.ttf",
      "node_modules/@expo-google-fonts/poppins/Poppins_600SemiBold.ttf",
      "node_modules/@expo-google-fonts/poppins/Poppins_700Bold.ttf"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.openactive.mobile"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#667eea"
      },
      package: "com.openactive.mobile"
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      // You can add environment variables here
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
    }
  }
}




