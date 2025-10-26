# Open Active Database System - Cross-Platform

The Open Active tennis booking system uses a **single, shared database** that works seamlessly across both web and mobile platforms.

## 🌐 **Cross-Platform Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                    Open Active System                       │
├─────────────────────────────────────────────────────────────┤
│  Web App (React)           │  Mobile App (React Native)    │
│  ┌─────────────────────┐   │  ┌─────────────────────┐      │
│  │  UserContext        │   │  │  UserContext        │      │
│  │  ┌───────────────┐  │   │  │  ┌───────────────┐  │      │
│  │  │ Database      │  │   │  │  │ Database      │  │      │
│  │  │ Services      │  │   │  │  │ Services      │  │      │
│  │  └───────────────┘  │   │  │  └───────────────┘  │      │
│  └─────────────────────┘   │  └─────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  Supabase Database                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  PostgreSQL Database                                │   │
│  │  • Users & Authentication                           │   │
│  │  • Clubs & Relationships                            │   │
│  │  • Bookings & Courts                                │   │
│  │  • Real-time Subscriptions                          │   │
│  │  • Row Level Security                               │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 **Real-Time Synchronization**

### **What Syncs Automatically:**
- ✅ **User Authentication** - Login on web, automatically logged in on mobile
- ✅ **User Profiles** - Update profile on mobile, changes appear on web
- ✅ **Club Memberships** - Join a club on web, access on mobile immediately
- ✅ **Bookings** - Book a court on mobile, appears on web instantly
- ✅ **Club Data** - Club updates sync across all platforms
- ✅ **User Roles** - Role changes apply everywhere

### **How It Works:**
1. **Single Database** - Both apps connect to the same Supabase database
2. **Real-time Subscriptions** - Changes are pushed to all connected clients
3. **Shared Services** - Same database service layer on both platforms
4. **Consistent State** - User context manages state identically

## 📊 **Database Schema**

### **Core Tables:**
```sql
users                    -- User profiles and roles
├── id (UUID, primary)
├── email (unique)
├── name
├── role (openactive_user, club_manager, member, visitor)
└── created_at, updated_at

clubs                    -- Club information
├── id (UUID, primary)
├── name
├── slug (unique)
├── description
├── settings (JSONB)
└── created_at, updated_at

club_relationships       -- User-club relationships
├── user_id → users.id
├── club_id → clubs.id
├── relationship_type (manager, member, visitor)
├── joined_at
└── permissions (JSONB)

courts                   -- Court/venue management
├── id (UUID, primary)
├── club_id → clubs.id
├── name
├── court_type
├── hourly_rate
└── created_at, updated_at

bookings                 -- Booking system
├── id (UUID, primary)
├── user_id → users.id
├── club_id → clubs.id
├── court_id → courts.id
├── start_time, end_time
├── status (pending, confirmed, cancelled, completed)
└── total_amount

events                   -- Club events
├── id (UUID, primary)
├── club_id → clubs.id
├── title, description
├── start_time, end_time
├── max_participants
└── is_public
```

## 🔐 **Security & Permissions**

### **Row Level Security (RLS):**
- **User Data** - Users can only see their own data
- **Club Data** - Members can see their club's data
- **Admin Access** - OpenActive users can see everything
- **Club Managers** - Can manage their club's data

### **Role-Based Access:**
```javascript
// OpenActive User (Super User)
- Can manage all clubs
- Can access all data
- Can create/delete clubs
- Can manage users

// Club Manager
- Can manage their club
- Can manage club members
- Can access club admin
- Can manage club settings

// Member
- Can view club content
- Can participate in activities
- Can make bookings
- Can update profile

// Visitor
- Can view public club content
- Can register for events
- Can view basic club info
```

## 🚀 **Setup Instructions**

### **1. Web App Setup:**
```bash
# Install dependencies
npm install @supabase/supabase-js

# Configure environment
cp env.example .env
# Add your Supabase credentials

# Database is ready to use!
```

### **2. Mobile App Setup:**
```bash
# Install dependencies
cd mobile
npm install @supabase/supabase-js @react-navigation/native

# Configure environment
cp env.example .env
# Add your Supabase credentials (same as web)

# Update src/config/supabase.js with your credentials

# Database is ready to use!
```

### **3. Database Setup:**
1. Create Supabase project
2. Run `database/schema.sql` in SQL Editor
3. Configure RLS policies
4. Test with both web and mobile apps

## 🔄 **Data Flow Examples**

### **User Registration:**
```
1. User registers on web app
2. Data saved to Supabase database
3. User can immediately login on mobile app
4. Same user profile available on both platforms
```

### **Club Membership:**
```
1. User joins club on mobile app
2. Club relationship saved to database
3. User can access club features on web app
4. Role-based permissions work on both platforms
```

### **Court Booking:**
```
1. User books court on web app
2. Booking saved to database
3. Booking appears in mobile app immediately
4. Real-time updates across all platforms
```

## 📱 **Platform-Specific Features**

### **Web App:**
- Full admin dashboard
- Advanced club management
- Detailed booking management
- Desktop-optimized UI

### **Mobile App:**
- Touch-optimized interface
- Native navigation
- Offline support (coming soon)
- Push notifications (coming soon)

### **Shared Features:**
- User authentication
- Club browsing
- Court booking
- Profile management
- Real-time updates

## 🎯 **Benefits of Shared Database**

### **For Users:**
- ✅ **Seamless Experience** - Same data everywhere
- ✅ **No Duplication** - One account, all platforms
- ✅ **Real-time Sync** - Changes appear instantly
- ✅ **Consistent Permissions** - Same access everywhere

### **For Developers:**
- ✅ **Single Source of Truth** - One database to maintain
- ✅ **Consistent API** - Same services on both platforms
- ✅ **Easier Testing** - Test once, works everywhere
- ✅ **Simplified Deployment** - One database setup

### **For Business:**
- ✅ **Lower Costs** - One database instead of multiple
- ✅ **Easier Management** - Single admin interface
- ✅ **Better Analytics** - Unified data across platforms
- ✅ **Faster Development** - Shared services and logic

## 🚀 **Next Steps**

1. **Set up Supabase project** using the provided schema
2. **Configure both web and mobile apps** with database credentials
3. **Test cross-platform functionality** with real data
4. **Build additional features** using the shared database
5. **Deploy both platforms** with confidence

The database system is designed to scale with your needs and provide a seamless experience across all platforms! 🎾




