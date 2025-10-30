# Open Farm Database Setup

This guide will help you set up the Supabase database for the Open Farm tennis booking system.

## 🚀 Quick Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: `openactive`
   - **Database Password**: Choose a strong password
   - **Region**: Choose closest to your users
6. Click "Create new project"

### 2. Get Your Project Credentials

1. Go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **anon public** key (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### 3. Set Up Environment Variables

1. Copy `env.example` to `.env` in your project root:
   ```bash
   cp env.example .env
   ```

2. Update `.env` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### 4. Create Database Schema

1. Go to **SQL Editor** in your Supabase dashboard
2. Click "New Query"
3. Copy the entire contents of `database/schema.sql`
4. Paste it into the SQL editor
5. Click "Run" to execute the schema

### 5. Verify Setup

1. Go to **Table Editor** in Supabase
2. You should see these tables:
   - `users`
   - `clubs`
   - `club_relationships`
   - `courts`
   - `bookings`
   - `events`

## 🧪 Test the Setup

### 1. Start Your Application

```bash
npm run dev
```

### 2. Test Registration

1. Go to `/login` (or add registration to your login page)
2. Try registering a new user
3. Check the `users` table in Supabase to see the new user

### 3. Test Authentication

1. Try logging in with the user you just created
2. Check that the user context loads properly
3. Verify that the user profile appears in the header

## 🔧 Database Features

### **User Management**
- ✅ User registration and authentication
- ✅ User profiles with roles
- ✅ Multi-club relationships

### **Club Management**
- ✅ Club creation and management
- ✅ User-club relationships (manager, member, visitor)
- ✅ Role-based permissions

### **Security**
- ✅ Row Level Security (RLS) policies
- ✅ Secure authentication
- ✅ Permission-based access control

### **Scalability**
- ✅ PostgreSQL database
- ✅ Optimized indexes
- ✅ Real-time subscriptions

## 🎯 Next Steps

1. **Create Test Data**: Add some sample clubs and users
2. **Test Permissions**: Verify role-based access works
3. **Add Booking System**: Implement court booking functionality
4. **Add Real-time Features**: Use Supabase real-time for live updates

## 🆘 Troubleshooting

### Common Issues

**"Missing Supabase environment variables"**
- Make sure your `.env` file is in the project root
- Verify the variable names start with `VITE_`
- Restart your development server after adding environment variables

**"Authentication failed"**
- Check that your Supabase URL and key are correct
- Verify the database schema was created successfully
- Check the browser console for detailed error messages

**"Permission denied"**
- Make sure RLS policies are set up correctly
- Verify user roles are assigned properly
- Check that the user is authenticated

### Getting Help

- Check the [Supabase Documentation](https://supabase.com/docs)
- Look at the browser console for error messages
- Verify your database schema matches the provided SQL

## 📊 Database Schema Overview

```
users (extends auth.users)
├── id (UUID, primary key)
├── email (text, unique)
├── name (text)
├── role (enum: openactive_user, club_manager, member, visitor)
└── created_at, updated_at

clubs
├── id (UUID, primary key)
├── name (text)
├── slug (text, unique)
├── description (text)
├── settings (JSONB)
└── created_at, updated_at

club_relationships (many-to-many)
├── user_id → users.id
├── club_id → clubs.id
├── relationship_type (enum: manager, member, visitor)
└── joined_at

courts
├── id (UUID, primary key)
├── club_id → clubs.id
├── name (text)
├── court_type (text)
├── hourly_rate (decimal)
└── created_at, updated_at

bookings
├── id (UUID, primary key)
├── user_id → users.id
├── club_id → clubs.id
├── court_id → courts.id
├── start_time, end_time (timestamp)
├── status (enum: pending, confirmed, cancelled, completed)
└── total_amount (decimal)

events
├── id (UUID, primary key)
├── club_id → clubs.id
├── title (text)
├── description (text)
├── start_time, end_time (timestamp)
├── max_participants (integer)
└── is_public (boolean)
```

Your database is now ready for the Open Farm tennis booking system! 🎾









