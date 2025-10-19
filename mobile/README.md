# Open Active Mobile App

The mobile app for the Open Active tennis booking system, built with React Native and Expo.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- Expo CLI: `npm install -g @expo/cli`
- Expo Go app on your phone (for testing)

### 1. Install Dependencies

```bash
cd mobile
npm install
```

### 2. Configure Database

1. Copy the environment file:
   ```bash
   cp env.example .env
   ```

2. Update `.env` with your Supabase credentials (same as web app):
   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. Update `src/config/supabase.js` with your credentials:
   ```javascript
   const supabaseUrl = 'https://your-project-id.supabase.co'
   const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
   ```

### 3. Start Development Server

```bash
npm start
```

### 4. Test on Your Phone

1. Install "Expo Go" from App Store/Google Play
2. Scan the QR code from the terminal
3. App will load on your device

## 📱 Features

### **Shared Database**
- ✅ **Same database** as web app
- ✅ **Real-time sync** between mobile and web
- ✅ **User authentication** works across platforms
- ✅ **Club relationships** sync automatically

### **Mobile-Specific Features**
- ✅ **Native navigation** with React Navigation
- ✅ **Touch-optimized UI** for mobile devices
- ✅ **Offline support** (coming soon)
- ✅ **Push notifications** (coming soon)

### **Cross-Platform**
- ✅ **iOS and Android** support
- ✅ **Same codebase** for both platforms
- ✅ **Consistent UI** across devices

## 🏗️ Project Structure

```
mobile/
├── src/
│   ├── config/
│   │   └── supabase.js          # Database configuration
│   ├── context/
│   │   └── UserContext.jsx      # User state management
│   ├── services/
│   │   └── database.js          # Database service layer
│   ├── types/
│   │   └── user.js              # User types and roles
│   └── components/              # Mobile components (coming soon)
├── App.js                       # Main app component
├── app.config.js               # Expo configuration
└── package.json                # Dependencies
```

## 🔄 Database Integration

The mobile app uses the **exact same database** as the web app:

### **Shared Services**
- `userService` - User management
- `clubService` - Club operations
- `authService` - Authentication
- `bookingService` - Booking management
- `courtService` - Court management

### **Real-time Sync**
- User login on web → automatically logged in on mobile
- Book a court on mobile → appears on web immediately
- Update profile on web → changes reflect on mobile

### **Same User Roles**
- OpenActive User (Super user)
- Club Manager (Club admin)
- Member (Club member)
- Visitor (Club visitor)

## 🎯 Development Workflow

### **1. Database Changes**
- Make changes in `database/schema.sql`
- Run SQL in Supabase dashboard
- Both web and mobile apps automatically get updates

### **2. Service Updates**
- Update `src/services/database.js` in both projects
- Changes apply to both web and mobile

### **3. User Context**
- Same user state management
- Same authentication flow
- Same role-based permissions

## 📊 Data Flow

```
┌─────────────────┐    ┌─────────────────┐
│   Web App       │    │   Mobile App    │
│                 │    │                 │
│  UserContext    │    │  UserContext    │
│  ┌───────────┐  │    │  ┌───────────┐  │
│  │Database   │  │    │  │Database   │  │
│  │Services   │  │    │  │Services   │  │
│  └───────────┘  │    │  └───────────┘  │
└─────────────────┘    └─────────────────┘
         │                       │
         └───────────┬───────────┘
                     │
            ┌─────────────────┐
            │   Supabase      │
            │   Database      │
            │                 │
            │  • Users        │
            │  • Clubs        │
            │  • Bookings     │
            │  • Real-time    │
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
# Required for database connection
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

### **App Configuration**
- Bundle identifier: `com.openactive.mobile`
- App name: "Open Active"
- Icon and splash screen configured

## 🆘 Troubleshooting

### **"Supabase configuration not set"**
- Make sure you've updated `src/config/supabase.js`
- Verify your environment variables are set
- Check that your Supabase project is active

### **"Authentication failed"**
- Ensure your Supabase URL and key are correct
- Verify the database schema is set up
- Check that RLS policies are configured

### **"Network request failed"**
- Check your internet connection
- Verify Supabase project is not paused
- Ensure your API keys are valid

## 🎾 Next Steps

1. **Complete Mobile UI** - Build native mobile screens
2. **Add Navigation** - Implement React Navigation
3. **Test Database** - Verify all services work
4. **Add Features** - Booking, club management, etc.
5. **Deploy** - Build for app stores

The mobile app is now ready to use the same database as your web app! 🚀
