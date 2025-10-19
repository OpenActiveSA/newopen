import { supabase, TABLES, USER_ROLES, CLUB_RELATIONSHIP_TYPES } from '../config/supabase.js'

// User service functions (same as web app)
export const userService = {
  // Get current user profile
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    if (!user) return null

    const { data: profile, error: profileError } = await supabase
      .from(TABLES.USERS)
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) throw profileError
    return { ...user, ...profile }
  },

  // Update user profile
  async updateProfile(updates) {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    if (!user) throw new Error('No authenticated user')

    const { data, error: updateError } = await supabase
      .from(TABLES.USERS)
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()

    if (updateError) throw updateError
    return data
  },

  // Get user's club relationships
  async getUserClubRelationships() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    if (!user) return []

    const { data, error: relationshipsError } = await supabase
      .from(TABLES.CLUB_RELATIONSHIPS)
      .select(`
        *,
        club:clubs(*)
      `)
      .eq('user_id', user.id)
      .eq('is_active', true)

    if (relationshipsError) throw relationshipsError
    return data
  },

  // Get user's role for a specific club
  async getClubRole(clubId) {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    if (!user) return null

    const { data, error: roleError } = await supabase
      .from(TABLES.CLUB_RELATIONSHIPS)
      .select('relationship_type')
      .eq('user_id', user.id)
      .eq('club_id', clubId)
      .eq('is_active', true)
      .single()

    if (roleError) return null
    return data.relationship_type
  }
}

// Club service functions (same as web app)
export const clubService = {
  // Get all active clubs
  async getAllClubs() {
    const { data, error } = await supabase
      .from(TABLES.CLUBS)
      .select('*')
      .eq('is_active', true)
      .order('name')

    if (error) throw error
    return data
  },

  // Get club by slug
  async getClubBySlug(slug) {
    const { data, error } = await supabase
      .from(TABLES.CLUBS)
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()

    if (error) throw error
    return data
  },

  // Get club members
  async getClubMembers(clubId) {
    const { data, error } = await supabase
      .from(TABLES.CLUB_RELATIONSHIPS)
      .select(`
        *,
        user:users(*)
      `)
      .eq('club_id', clubId)
      .eq('is_active', true)
      .order('joined_at')

    if (error) throw error
    return data
  }
}

// Authentication service functions (same as web app)
export const authService = {
  // Sign up new user
  async signUp(email, password, userData = {}) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })

    if (error) throw error
    return data
  },

  // Sign in user
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error
    return data
  },

  // Sign out user
  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  // Get current session
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return session
  },

  // Listen to auth changes
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Booking service functions (same as web app)
export const bookingService = {
  // Get user's bookings
  async getUserBookings() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    if (!user) return []

    const { data, error: bookingsError } = await supabase
      .from(TABLES.BOOKINGS)
      .select(`
        *,
        club:clubs(name, slug),
        court:courts(name)
      `)
      .eq('user_id', user.id)
      .order('start_time', { ascending: false })

    if (bookingsError) throw bookingsError
    return data
  },

  // Create new booking
  async createBooking(bookingData) {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    if (!user) throw new Error('No authenticated user')

    const { data, error: bookingError } = await supabase
      .from(TABLES.BOOKINGS)
      .insert([{
        ...bookingData,
        user_id: user.id
      }])
      .select()
      .single()

    if (bookingError) throw bookingError
    return data
  },

  // Update booking
  async updateBooking(bookingId, updates) {
    const { data, error } = await supabase
      .from(TABLES.BOOKINGS)
      .update(updates)
      .eq('id', bookingId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Cancel booking
  async cancelBooking(bookingId) {
    return this.updateBooking(bookingId, { status: 'cancelled' })
  }
}

// Court service functions (same as web app)
export const courtService = {
  // Get courts for a club
  async getClubCourts(clubId) {
    const { data, error } = await supabase
      .from(TABLES.COURTS)
      .select('*')
      .eq('club_id', clubId)
      .eq('is_active', true)
      .order('name')

    if (error) throw error
    return data
  }
}
