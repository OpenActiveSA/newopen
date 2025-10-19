import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { authService, userService } from '../services/database.js'
import { USER_ROLES, CLUB_RELATIONSHIP_TYPES } from '../types/user.js'

// User context for managing user state and roles (mobile version)
const UserContext = createContext()

// Initial user state
const initialState = {
  user: null,
  isAuthenticated: false,
  currentClub: null,
  clubRelationships: {}, // { clubId: { role, permissions, joinedAt } }
  globalRole: null,
  isLoading: true
}

// User reducer for state management
function userReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        globalRole: action.payload.globalRole,
        clubRelationships: action.payload.clubRelationships || {},
        isLoading: false
      }
    
    case 'LOGOUT':
      return {
        ...initialState,
        isLoading: false
      }
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      }
    
    case 'SET_CURRENT_CLUB':
      return {
        ...state,
        currentClub: action.payload
      }
    
    case 'UPDATE_CLUB_RELATIONSHIP':
      return {
        ...state,
        clubRelationships: {
          ...state.clubRelationships,
          [action.payload.clubId]: action.payload.relationship
        }
      }
    
    case 'ADD_CLUB_RELATIONSHIP':
      return {
        ...state,
        clubRelationships: {
          ...state.clubRelationships,
          [action.payload.clubId]: action.payload.relationship
        }
      }
    
    case 'REMOVE_CLUB_RELATIONSHIP':
      const newRelationships = { ...state.clubRelationships }
      delete newRelationships[action.payload.clubId]
      return {
        ...state,
        clubRelationships: newRelationships
      }
    
    default:
      return state
  }
}

// User context provider
export function UserProvider({ children }) {
  const [state, dispatch] = useReducer(userReducer, initialState)

  // Initialize auth state
  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true })
        const session = await authService.getSession()
        if (session?.user) {
          await loadUserData(session.user)
        } else {
          dispatch({ type: 'SET_LOADING', payload: false })
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = authService.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await loadUserData(session.user)
      } else if (event === 'SIGNED_OUT') {
        dispatch({ type: 'LOGOUT' })
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Load user data from database
  const loadUserData = async (user) => {
    try {
      const [profile, relationships] = await Promise.all([
        userService.getCurrentUser(),
        userService.getUserClubRelationships()
      ])

      const clubRelationships = {}
      relationships.forEach(rel => {
        clubRelationships[rel.club_id] = {
          role: rel.relationship_type,
          clubName: rel.club?.name,
          joinedAt: rel.joined_at,
          permissions: rel.permissions || {}
        }
      })

      dispatch({
        type: 'LOGIN',
        payload: {
          user: profile,
          globalRole: profile?.role,
          clubRelationships
        }
      })
    } catch (error) {
      console.error('Error loading user data:', error)
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  // Login function
  const login = async (email, password) => {
    try {
      const { data, error } = await authService.signIn(email, password)
      if (error) throw error
      return data
    } catch (error) {
      throw error
    }
  }

  // Logout function
  const logout = async () => {
    try {
      await authService.signOut()
      dispatch({ type: 'LOGOUT' })
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  // Set current club
  const setCurrentClub = (club) => {
    dispatch({
      type: 'SET_CURRENT_CLUB',
      payload: club
    })
  }

  // Update club relationship
  const updateClubRelationship = (clubId, relationship) => {
    dispatch({
      type: 'UPDATE_CLUB_RELATIONSHIP',
      payload: { clubId, relationship }
    })
  }

  // Add club relationship
  const addClubRelationship = (clubId, relationship) => {
    dispatch({
      type: 'ADD_CLUB_RELATIONSHIP',
      payload: { clubId, relationship }
    })
  }

  // Remove club relationship
  const removeClubRelationship = (clubId) => {
    dispatch({
      type: 'REMOVE_CLUB_RELATIONSHIP',
      payload: { clubId }
    })
  }

  // Get user's role for a specific club
  const getClubRole = (clubId) => {
    return state.clubRelationships[clubId]?.role || null
  }

  // Check if user has permission for a club
  const hasClubPermission = (clubId, permission) => {
    const relationship = state.clubRelationships[clubId]
    if (!relationship) return false
    
    // Check global permissions first (OpenActive User)
    if (state.globalRole === USER_ROLES.OPENACTIVE_USER) {
      return true
    }
    
    // Check club-specific permissions
    return relationship.permissions?.[permission] || false
  }

  // Get all clubs user has relationships with
  const getUserClubs = () => {
    return Object.keys(state.clubRelationships).map(clubId => ({
      clubId,
      ...state.clubRelationships[clubId]
    }))
  }

  const value = {
    ...state,
    login,
    logout,
    setCurrentClub,
    updateClubRelationship,
    addClubRelationship,
    removeClubRelationship,
    getClubRole,
    hasClubPermission,
    getUserClubs
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

// Hook to use user context
export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
