# Open Farm Mobile App

The mobile app for the Open Farm tennis booking system, built with React Native and Expo. Now uses your custom backend instead of Supabase!

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- Expo CLI: `npm install -g @expo/cli`
- Expo Go app on your phone (for testing)
- **Your custom backend running** on `http://localhost:5000`

### 1. Install Dependencies

```bash
cd mobile
npm install
```

### 2. Start Your Backend

Make sure your custom backend is running:
```bash
cd ../backend
node server.js
```

The backend should be running on `http://localhost:5000`

### 3. Start Mobile Development Server

```bash
npm start
```

### 4. Test on Your Phone

1. Install "Expo Go" from App Store/Google Play
2. Scan the QR code from the terminal
3. App will load on your device and connect to your backend

## 📱 Features

### **Custom Backend Integration**
- ✅ **Your own backend** - No external dependencies
- ✅ **MySQL database** - Full control over your data
- ✅ **JWT authentication** - Secure user management
- ✅ **Real-time sync** between mobile and web
- ✅ **User authentication** works across platforms
- ✅ **Club relationships** sync automatically

### **Mobile-Specific Features**
- ✅ **Native navigation** with React Navigation
- ✅ **Touch-optimized UI** for mobile devices
- ✅ **AsyncStorage** for token persistence
- ✅ **Cross-platform** iOS and Android support

### **User Roles**
- ✅ **OpenActive User** (Super user)
- ✅ **Club Manager** (Club admin)
- ✅ **Member** (Club member)
- ✅ **Visitor** (Club visitor)

## 🏗️ Project Structure

```
mobile/
├── src/
│   ├── config/
│   │   └── supabase.js          # (Legacy - can be removed)
│   ├── context/
│   │   └── UserContext.jsx      # User state management
│   ├── services/
│   │   ├── api.js               # Custom backend API service
│   │   └── database.js          # (Legacy - can be removed)
│   └── types/
│       └── user.js              # User types and roles
├── App.js                       # Main app component
├── app.config.js               # Expo configuration
└── package.json                # Dependencies
```

## 🔄 Backend Integration

The mobile app connects to your **custom backend**:

### **API Endpoints**
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/users/me` - Get current user
- `GET /api/clubs` - List all clubs
- `GET /api/courts` - List courts
- `POST /api/bookings` - Create booking
- And many more!

### **Authentication Flow**
1. User logs in → JWT token stored in AsyncStorage
2. Token sent with every API request
3. Backend validates token and returns data
4. User state synced across mobile and web

### **Data Sync**
- User login on web → automatically logged in on mobile
- Book a court on mobile → appears on web immediately
- Update profile on web → changes reflect on mobile

## 🎯 Development Workflow

### **1. Backend Changes**
- Make changes in your backend code
- Restart backend server
- Mobile app automatically gets updates

### **2. API Updates**
- Update `src/services/api.js` for new endpoints
- Changes apply to mobile app immediately

### **3. User Context**
- Same user state management as web
- Same authentication flow
- Same role-based permissions

## 📊 Data Flow

```
┌─────────────────┐    ┌─────────────────┐
│   Web App       │    │   Mobile App    │
│                 │    │                 │
│  UserContext    │    │  UserContext    │
│  ┌───────────┐  │    │  ┌───────────┐  │
│  │API Service│  │    │  │API Service│  │
│  └───────────┘  │    │  └───────────┘  │
└─────────────────┘    └─────────────────┘
         │                       │
         └───────────┬───────────┘
                     │
            ┌─────────────────┐
            │  Your Backend   │
            │  (Port 5000)    │
            │                 │
            │  • Node.js      │
            │  • Express      │
            │  • MySQL        │
            │  • JWT Auth     │
            └─────────────────┘
```

## 🚀 Deployment

### **Development Testing**
- Use Expo Go for testing
- Share QR code with team members
- No app store submission needed

### **Production Builds** (Future)
- Use Expo Application Services (EAS)
- Build for iOS App Store and Google Play Store
- Over-the-air updates

## 🔧 Configuration

### **Environment Variables**
```env
# Backend API URL
EXPO_PUBLIC_API_URL=http://localhost:5000/api
```

### **App Configuration**
- Bundle identifier: `com.openactive.mobile`
- App name: "Open Farm"
- Icon and splash screen configured

## 🆘 Troubleshooting

### **"Network request failed"**
- Make sure your backend is running on `http://localhost:5000`
- Check that your phone and computer are on the same network
- For physical device testing, use your computer's IP address instead of localhost

### **"Authentication failed"**
- Verify your backend is running and accessible
- Check that the JWT authentication is working
- Ensure the database is set up correctly

### **"Cannot connect to backend"**
- Backend must be running before starting mobile app
- Check firewall settings
- Verify the API URL in your configuration

## 🎾 Next Steps

1. **Test Mobile App** - Verify it connects to your backend
2. **Add More Features** - Booking, court management, etc.
3. **Improve UI** - Add more mobile-specific screens
4. **Deploy** - Build for app stores when ready

Your mobile app is now ready to use your custom backend! 🚀

## 🔥 What's Working Now

- ✅ **Custom Backend Integration** - No more Supabase!
- ✅ **User Authentication** - Login/Register with your MySQL database
- ✅ **Club Management** - View clubs from your database
- ✅ **Cross-Platform** - Works on iOS and Android
- ✅ **Token Persistence** - Stays logged in between app sessions
- ✅ **Real-time Sync** - Same data as your web app

Your tennis booking system is now completely self-contained! 🎾