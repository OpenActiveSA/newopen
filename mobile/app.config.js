export default {
  expo: {
    name: "Open Farm",
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
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.openactive.mobile"
    },
    android: {
      package: "com.openactive.mobile"
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      eas: {
        projectId: "4614853b-ff84-48fd-a28a-af3991537180"
      }
    }
  }
}




