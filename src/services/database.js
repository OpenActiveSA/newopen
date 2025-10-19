import { supabase, TABLES, USER_ROLES, CLUB_RELATIONSHIP_TYPES, isSupabaseConfigured } from '../config/supabase.js'

// Helper function to check if Supabase is configured
const checkConfiguration = () => {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Please set up your environment variables.')
  }
}

// User service functions
export const userService = {
  // Get current user profile
  async getCurrentUser() {
    checkConfiguration()
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

// Club service functions
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

  // Create new club
  async createClub(clubData) {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    if (!user) throw new Error('No authenticated user')

    // Create club
    const { data: club, error: clubError } = await supabase
      .from(TABLES.CLUBS)
      .insert([clubData])
      .select()
      .single()

    if (clubError) throw clubError

    // Add creator as manager
    const { error: relationshipError } = await supabase
      .from(TABLES.CLUB_RELATIONSHIPS)
      .insert([{
        user_id: user.id,
        club_id: club.id,
        relationship_type: CLUB_RELATIONSHIP_TYPES.MANAGER
      }])

    if (relationshipError) throw relationshipError
    return club
  },

  // Update club
  async updateClub(clubId, updates) {
    const { data, error } = await supabase
      .from(TABLES.CLUBS)
      .update(updates)
      .eq('id', clubId)
      .select()
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
  },

  // Add user to club
  async addUserToClub(clubId, userId, relationshipType) {
    const { data, error } = await supabase
      .from(TABLES.CLUB_RELATIONSHIPS)
      .insert([{
        user_id: userId,
        club_id: clubId,
        relationship_type: relationshipType
      }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Remove user from club
  async removeUserFromClub(clubId, userId) {
    const { error } = await supabase
      .from(TABLES.CLUB_RELATIONSHIPS)
      .update({ is_active: false })
      .eq('club_id', clubId)
      .eq('user_id', userId)

    if (error) throw error
  }
}

// Authentication service functions
export const authService = {
  // Sign up new user
  async signUp(email, password, userData = {}) {
    checkConfiguration()
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
    checkConfiguration()
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
    checkConfiguration()
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return session
  },

  // Listen to auth changes
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Booking service functions
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

// Court service functions
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
  },

  // Create new court
  async createCourt(courtData) {
    const { data, error } = await supabase
      .from(TABLES.COURTS)
      .insert([courtData])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update court
  async updateCourt(courtId, updates) {
    const { data, error } = await supabase
      .from(TABLES.COURTS)
      .update(updates)
      .eq('id', courtId)
      .select()
      .single()

    if (error) throw error
    return data
  }
}
