import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

// Check if we're using placeholder values
const isConfigured = supabaseUrl !== 'https://placeholder.supabase.co' && supabaseAnonKey !== 'placeholder-key'

// Debug logging (remove in production)
// console.log('🔍 Supabase Configuration Debug:')
// console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL)
// console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Not set')
// console.log('isConfigured:', isConfigured)

if (!isConfigured) {
  console.warn('⚠️ Supabase not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file')
  console.warn('📖 See database/README.md for setup instructions')
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Export configuration status
export const isSupabaseConfigured = isConfigured

// Database table names
export const TABLES = {
  USERS: 'users',
  CLUBS: 'clubs',
  CLUB_RELATIONSHIPS: 'club_relationships',
  BOOKINGS: 'bookings',
  COURTS: 'courts',
  EVENTS: 'events'
}

// User roles enum
export const USER_ROLES = {
  OPENACTIVE_USER: 'openactive_user',
  CLUB_MANAGER: 'club_manager', 
  MEMBER: 'member',
  VISITOR: 'visitor'
}

// Club relationship types
export const CLUB_RELATIONSHIP_TYPES = {
  MANAGER: 'manager',
  MEMBER: 'member',
  VISITOR: 'visitor'
}
