import { useState } from 'react'
import { useUser } from '../context/UserContext'
import { apiService } from '../services/api.js'
import { USER_ROLES, CLUB_RELATIONSHIP_TYPES } from '../types/user.js'

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
        <h2 className="form-title">Login</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="input-with-icon">
              <span className="input-icon">📧</span>
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
              <span className="input-icon">🔒</span>
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

  return (
    <div className="user-profile">
      <button 
        className="profile-toggle"
        onClick={() => setShowProfile(!showProfile)}
      >
        {user.name || user.email} ▼
      </button>
      
      {showProfile && (
        <div className="profile-dropdown">
          <div className="profile-info">
            <h3>{user.name || user.email}</h3>
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
      <h2>Register</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            minLength={6}
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            required
            minLength={6}
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating Account...' : 'Register'}
        </button>
      </form>
    </div>
  )
}
