import { createClient } from '@supabase/supabase-js'

// Supabase configuration for mobile app
// These should match your web app configuration
const supabaseUrl = 'YOUR_SUPABASE_URL' // Replace with your actual URL
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY' // Replace with your actual key

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'YOUR_SUPABASE_URL') {
  console.warn('Supabase configuration not set. Please update mobile/src/config/supabase.js with your credentials.')
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false // Disable for mobile
  }
})

// Database table names (same as web app)
export const TABLES = {
  USERS: 'users',
  CLUBS: 'clubs',
  CLUB_RELATIONSHIPS: 'club_relationships',
  BOOKINGS: 'bookings',
  COURTS: 'courts',
  EVENTS: 'events'
}

// User roles enum (same as web app)
export const USER_ROLES = {
  OPENACTIVE_USER: 'openactive_user',
  CLUB_MANAGER: 'club_manager', 
  MEMBER: 'member',
  VISITOR: 'visitor'
}

// Club relationship types (same as web app)
export const CLUB_RELATIONSHIP_TYPES = {
  MANAGER: 'manager',
  MEMBER: 'member',
  VISITOR: 'visitor'
}



