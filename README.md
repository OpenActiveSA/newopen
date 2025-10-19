# Open Active - Tennis Booking System

A modern tennis booking system with web and mobile applications.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- For mobile: Expo Go app on your phone

### Web Application (Local Development)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open in browser:**
   - Navigate to `http://localhost:3000`
   - You should see "Open Active" screen

### Mobile Application (Local Development)

1. **Navigate to mobile directory:**
   ```bash
   cd mobile
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start Expo development server:**
   ```bash
   npm start
   ```

4. **Test on your phone:**
   - Install "Expo Go" app from App Store/Google Play
   - Scan the QR code from terminal
   - App will load on your device

## 🌐 Deployment to Vercel

### Automatic Deployment (Recommended)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial Open Active setup"
   git push origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub
   - Import your repository
   - Deploy automatically

### Manual Deployment

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

## 📱 Mobile App Distribution

### Development Testing
- Use Expo Go app for testing
- Share QR code with team members
- No app store submission needed for testing

### Production Distribution (Future)
- Use Expo Application Services (EAS)
- Build for iOS App Store and Google Play Store
- Over-the-air updates

## 🏗️ Project Structure

```
openactive/
├── src/                 # Web app source code
│   ├── App.jsx         # Main React component
│   ├── App.css         # Styling
│   └── main.jsx        # Entry point
├── mobile/             # Mobile app source code
│   ├── App.js          # Main React Native component
│   └── app.json        # Expo configuration
├── package.json        # Web app dependencies
├── vercel.json         # Vercel deployment config
└── README.md           # This file
```

## 🎨 Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Glassmorphism design with gradient background
- **Cross-Platform**: Same codebase for iOS and Android
- **Fast Development**: Hot reload for instant updates

## 🔧 Tech Stack

### Web
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **CSS3** - Styling with modern features

### Mobile
- **React Native** - Cross-platform mobile development
- **Expo** - Development platform and tools

### Deployment
- **Vercel** - Web hosting and deployment
- **GitHub** - Version control and CI/CD

## 📞 Support

For questions or issues, please check the documentation or create an issue in the repository.

---

**Next Steps:**
- Add user authentication
- Implement booking system
- Connect to database
- Add payment integration
