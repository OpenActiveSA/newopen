import { useState } from 'react'
import { useUser } from '../context/UserContext'
import { apiService } from '../services/api.js'
import { USER_ROLES, CLUB_RELATIONSHIP_TYPES } from '../types/user.js'
import { Icon } from './Icon.jsx'

// Login component
export function LoginForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const { login } = useUser()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      await login(formData.email, formData.password)
      onSuccess?.()
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-form">
      <div className="form-container">
        <h2 className="form-title">o p e n</h2>
        <p className="form-subtitle">Login to book & play!</p>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="input-with-icon">
              <span className="input-icon">
                <Icon name="envelope" size={20} color={formData.email ? "#8b7b54" : "rgba(255, 255, 255, 0.6)"} />
              </span>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Email"
                required
              />
            </div>
          </div>
          <div className="form-group">
            <div className="input-with-icon">
              <span className="input-icon">
                <Icon name="lock" size={20} color={formData.password ? "#8b7b54" : "rgba(255, 255, 255, 0.6)"} />
              </span>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Password"
                required
              />
            </div>
          </div>
          <button type="submit" disabled={isLoading} className="submit-button">
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
          <div className="auth-links">
            <a href="#" className="auth-link">Forgot Password?</a>
            <a href="/register" className="auth-link">Register new account</a>
          </div>
        </form>
      </div>
    </div>
  )
}

// User profile component
export function UserProfile() {
  const { user, globalRole, getUserClubs, logout } = useUser()
  const [showProfile, setShowProfile] = useState(false)

  if (!user) return null

  const userClubs = getUserClubs()

  const getInitials = (name) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <div className="user-profile">
      <button 
        className="profile-toggle"
        onClick={() => setShowProfile(!showProfile)}
      >
        <div className="profile-avatar">
          {user.avatar_url ? (
            <img src={user.avatar_url} alt={user.name || 'User'} />
          ) : (
            <span>{getInitials(user.name || user.email)}</span>
          )}
        </div>
        <span>{user.name || user.email}</span>
        <span>▼</span>
      </button>
      
      {showProfile && (
        <div className="profile-dropdown">
          <div className="profile-info">
            <div className="profile-header">
              <div className="profile-avatar-large">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt={user.name || 'User'} />
                ) : (
                  <span>{getInitials(user.name || user.email)}</span>
                )}
              </div>
              <h3>{user.name || user.email}</h3>
            </div>
            <p>Role: {globalRole}</p>
            {userClubs.length > 0 && (
              <div className="club-relationships">
                <h4>Club Relationships:</h4>
                <ul>
                  {userClubs.map(({ clubId, role, clubName }) => (
                    <li key={clubId}>
                      {clubName || `Club ${clubId}`} - {role}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        </div>
      )}
    </div>
  )
}

// Registration form component
export function RegisterForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    // Validate password strength
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      setIsLoading(false)
      return
    }

            try {
              await apiService.register(formData.email, formData.password, {
                name: formData.name
              })
              setError('')
              onSuccess?.()
            } catch (err) {
              setError(err.message || 'Registration failed. Please try again.')
            } finally {
              setIsLoading(false)
            }
  }

  return (
    <div className="auth-form">
      <div className="form-container">
        <h2 className="form-title">o p e n</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="input-with-icon">
              <span className="input-icon">
                <Icon name="user" size={20} color={formData.name ? "#8b7b54" : "rgba(255, 255, 255, 0.6)"} />
              </span>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Name"
                required
              />
            </div>
          </div>
          <div className="form-group">
            <div className="input-with-icon">
              <span className="input-icon">
                <Icon name="envelope" size={20} color={formData.email ? "#8b7b54" : "rgba(255, 255, 255, 0.6)"} />
              </span>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Email"
                required
              />
            </div>
          </div>
          <div className="form-group">
            <div className="input-with-icon">
              <span className="input-icon">
                <Icon name="lock" size={20} color={formData.password ? "#8b7b54" : "rgba(255, 255, 255, 0.6)"} />
              </span>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Password"
                required
                minLength={6}
              />
            </div>
          </div>
          <div className="form-group">
            <div className="input-with-icon">
              <span className="input-icon">
                <Icon name="lock" size={20} color={formData.confirmPassword ? "#8b7b54" : "rgba(255, 255, 255, 0.6)"} />
              </span>
              <input
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Confirm Password"
                required
                minLength={6}
              />
            </div>
          </div>
          <button type="submit" disabled={isLoading} className="submit-button">
            {isLoading ? 'Creating Account...' : 'Register'}
          </button>
          <div className="auth-links">
            <a href="/login" className="auth-link">Already have an account? Login</a>
          </div>
        </form>
      </div>
    </div>
  )
}
