import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { UserProvider, useUser } from './context/UserContext'
import { apiService } from './services/api'
import { RoleGuard } from './components/RoleGuard'
import { LoginForm, UserProfile, RegisterForm } from './components/UserAuth'
import { usePermissions } from './components/RoleGuard'
import { getVersion } from './utils/version'
import SvgTest from './components/SvgTest'
import { ClubAdmin } from './components/ClubAdmin'
import { OpenActiveAdmin } from './components/OpenActiveAdmin'
import './App.css'

function FullScreenMenu({ isOpen, onClose }) {
  const navigate = useNavigate()
  const { isAuthenticated, user, globalRole, getUserClubs } = useUser()
  const { canAccessAdmin, canAccessClubAdmin } = usePermissions()

  console.log('🎯 Menu Debug:', { isAuthenticated, user, globalRole })

  const handleMenuClick = (path) => {
    navigate(path)
    onClose()
  }

  if (!isOpen) return null

  const userClubs = getUserClubs()
  console.log('🎯 User Clubs:', userClubs)

  return (
    <div className="full-screen-menu-overlay" onClick={onClose}>
      <div className="full-screen-menu" onClick={(e) => e.stopPropagation()}>
        <div className="menu-close" onClick={onClose}>✕</div>
        <div className="menu-items">
          <div className="menu-item" onClick={() => handleMenuClick('/')}>
            Home
          </div>
          
          <div className="menu-item" onClick={() => handleMenuClick('/farms')}>
            Farms
          </div>
          
          
          {!isAuthenticated ? (
            <>
              <div className="menu-item" onClick={() => handleMenuClick('/login')}>
                Login
              </div>
              <div className="menu-item" onClick={() => handleMenuClick('/register')}>
                Register
              </div>
            </>
          ) : (
            <>
              {globalRole === 'openactive_user' && (
                <div className="menu-item" onClick={() => handleMenuClick('/admin')}>
                  System Admin
                </div>
              )}
              
              {userClubs.filter(club => club.role === 'manager').length > 0 && (
                <>
                  <div className="menu-section-header">Club Management</div>
                  {userClubs.filter(club => club.role === 'manager').map(({ clubId, clubName }) => (
                    <div key={`admin-${clubId}`} className="menu-item" onClick={() => handleMenuClick(`/club/${clubId}/admin`)}>
                      {clubName} Admin
                    </div>
                  ))}
                </>
              )}
              
              {userClubs.length > 0 && (
                <>
                  <div className="menu-section-header">My Clubs</div>
                  {userClubs.map(({ clubId, clubName }) => (
                    <div key={clubId} className="menu-item" onClick={() => handleMenuClick(`/club/${clubId}`)}>
                      {clubName || `Club ${clubId}`}
                    </div>
                  ))}
                </>
              )}
              
              <div className="menu-item" onClick={() => handleMenuClick('/register')}>
                Register
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function MainHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isAuthenticated } = useUser()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <>
      <header className="header main-header">
        <div className="burger-menu" onClick={toggleMenu}>☰</div>
        <div className="header-title">Main Header</div>
        {isAuthenticated && <UserProfile />}
      </header>
      <FullScreenMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  )
}

function ClubHeader() {
  return (
    <header className="header club-header">
      <div className="burger-menu">☰</div>
      <div className="header-title">Club Header</div>
    </header>
  )
}

function SimpleClubHeader() {
  const navigate = useNavigate()
  
  return (
    <header className="header club-header">
      <div className="back-arrow" onClick={() => navigate('/club/demo')}>
        ←
      </div>
      <div className="header-title">Login</div>
    </header>
  )
}

function MainFooter() {
  const [version, setVersion] = useState('1.0.0')

  useEffect(() => {
    getVersion().then(setVersion)
  }, [])

  return (
    <footer className="footer main-footer">
      <div className="footer-content">
        <div>Open Farm Farm Management System</div>
        <div>Version {version}</div>
      </div>
    </footer>
  )
}

function ClubFooter() {
  const [version, setVersion] = useState('1.0.0')

  useEffect(() => {
    getVersion().then(setVersion)
  }, [])

  return (
    <footer className="footer club-footer">
      <div className="footer-content">
        <div>Open Farm Farm Management System</div>
        <div>Version {version}</div>
      </div>
    </footer>
  )
}

function Home() {
  return (
    <div className="page home">
      <MainHeader />
      <div className="page-content">Open Farm Home</div>
      <MainFooter />
    </div>
  )
}

function Clubs() {
  const [clubs, setClubs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [region, setRegion] = useState('All Regions')
  const [showRegionPicker, setShowRegionPicker] = useState(false)
  const regions = [
    'All Regions',
    'South Africa - Western Cape',
    'South Africa - Eastern Cape',
    'South Africa - Northern Cape',
    'South Africa - Free State',
    'South Africa - Gauteng',
    'South Africa - KwaZulu-Natal',
    'South Africa - Limpopo',
    'South Africa - Mpumalanga',
    'South Africa - North West'
  ]
  const [favorites, setFavorites] = useState(() => {
    // Load favorites from localStorage
    const saved = localStorage.getItem('favoriteClubs')
    return saved ? JSON.parse(saved) : []
  })
  const navigate = useNavigate()

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/farms')
        if (!response.ok) {
          throw new Error('Failed to fetch farms')
        }
        const data = await response.json()
        console.log('Farms data:', data)
        // API returns { clubs: [...] } or { farms: [...] } depending on backend; normalize
        const clubsArray = data.farms || data.clubs || data || []
        setClubs(Array.isArray(clubsArray) ? clubsArray : [])
      } catch (err) {
        console.error('Error fetching farms:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchClubs()
  }, [])

  const toggleFavorite = (clubId, event) => {
    event.stopPropagation() // Prevent navigation when clicking heart
    const newFavorites = favorites.includes(clubId)
      ? favorites.filter(id => id !== clubId)
      : [...favorites, clubId]
    
    setFavorites(newFavorites)
    localStorage.setItem('favoriteClubs', JSON.stringify(newFavorites))
  }

  const filteredClubs = Array.isArray(clubs) ? clubs
    .filter(club => club && club.name && club.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      // Sort favorites first
      const aFav = favorites.includes(a.id)
      const bFav = favorites.includes(b.id)
      if (aFav && !bFav) return -1
      if (!aFav && bFav) return 1
      return a.name.localeCompare(b.name)
    })
  : []

  return (
    <div className="page clubs-page" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="clubs-header" style={{
        padding: '20px',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px', position: 'relative' }}>
            <div onClick={() => navigate('/')} className="back-arrow-inline" style={{ position: 'absolute', left: 0 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="17,21 7,12 17,3"></polyline>
              </svg>
            </div>
            <h1 style={{ color: 'white', fontSize: '24px', fontWeight: '600', margin: 0, fontFamily: 'Poppins, sans-serif', letterSpacing: '0.02em' }}>
              Farms
            </h1>
          </div>
          
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '4px',
            padding: '12px 15px',
            marginBottom: '10px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            position: 'relative'
          }} onClick={() => setShowRegionPicker(v => !v)}>
            <span style={{ color: 'white', fontSize: '14px' }}>{region}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
            {showRegionPicker && (
              <div style={{
                position: 'absolute',
                top: '46px',
                left: 0,
                right: 0,
                background: 'rgba(0,0,0,0.6)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '4px',
                maxHeight: '220px',
                overflowY: 'auto',
                zIndex: 20
              }}>
                {regions.map(r => (
                  <div key={r} onClick={(e) => { e.stopPropagation(); setRegion(r); setShowRegionPicker(false); }}
                    style={{ padding: '10px 12px', color: 'white', fontSize: '14px', background: r===region ? 'rgba(255,255,255,0.1)' : 'transparent' }}>
                    {r}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
          }}>
            <input
              type="text"
              placeholder="Search Farm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '1rem 3rem 1rem 1rem',
                border: 'none',
                borderBottom: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: 0,
                fontSize: '1rem',
                fontFamily: 'Poppins, sans-serif',
                background: searchTerm ? 'rgba(255, 255, 255, 0.5)' : 'transparent',
                color: searchTerm ? '#8b7b54' : 'white',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => {
                e.target.style.borderBottom = '2px solid rgba(255, 255, 255, 0.6)'
              }}
              onBlur={(e) => {
                e.target.style.borderBottom = '2px solid rgba(255, 255, 255, 0.3)'
              }}
            />
            <span style={{
              position: 'absolute',
              right: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={searchTerm ? '#8b7b54' : 'rgba(255, 255, 255, 0.6)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </span>
          </div>
        </div>
      </header>

      <div className="clubs-content" style={{
        flex: 1,
        padding: '20px',
        overflow: 'auto',
      }}>
        {loading && <p style={{ color: 'white', textAlign: 'center' }}>Loading farms...</p>}
        {error && (
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#ff6b6b', marginBottom: '12px' }}>Error: {error}</p>
              <button className="btn-primary" onClick={() => navigate('/farms/create')}>Create New Farm</button>
            </div>
          </div>
        )}
        
        {!loading && !error && filteredClubs.length === 0 && (
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: 'white', marginBottom: '12px' }}>No farms found.</p>
              <button className="btn-primary" onClick={() => navigate('/farms/create')}>Create New Farm</button>
            </div>
          </div>
        )}
        
        {!loading && !error && filteredClubs.length > 0 && (
          <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ marginBottom: '12px', textAlign: 'right' }}>
              <button className="btn-primary" onClick={() => navigate('/farms/create')}>Create New Farm</button>
            </div>
            {filteredClubs.map(club => (
              <div 
                key={club.id} 
                onClick={() => navigate(`/club/${club.slug}`)}
                className="club-card"
                style={{
                  cursor: 'pointer',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  background: 'rgba(255, 255, 255, 0.05)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{
                  position: 'relative',
                  height: '200px',
                  background: club.logo_url 
                    ? `url(${club.logo_url}) center/cover` 
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: 0,
                }}>
                  {/* Favorite heart icon */}
                  <div 
                    onClick={(e) => toggleFavorite(club.id, e)}
                    style={{
                      position: 'absolute',
                      top: '15px',
                      left: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                      zIndex: 2,
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <svg 
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill={favorites.includes(club.id) ? '#ff4444' : 'none'} 
                      stroke={favorites.includes(club.id) ? '#ff4444' : 'white'} 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  </div>
                  
                  {/* Camp count badge - will add dynamic count later */}
                  <div style={{
                    position: 'absolute',
                    bottom: '15px',
                    right: '15px',
                    background: '#2196F3',
                    borderRadius: '4px',
                    padding: '6px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="12" y1="3" x2="12" y2="21"></line>
                      <line x1="3" y1="12" x2="21" y2="12"></line>
                    </svg>
                    <span style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}>0</span>
                  </div>
                  
                  {/* Club name overlay */}
                  <h3 style={{
                    position: 'absolute',
                    bottom: '15px',
                    left: '15px',
                    color: 'white',
                    fontSize: '22px',
                    fontWeight: '600',
                    margin: 0,
                    textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
                    fontFamily: 'Poppins, sans-serif',
                    zIndex: 1,
                  }}>
                    {club.name}
                  </h3>
                </div>
                
                {/* Location info */}
                <div style={{
                  padding: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span style={{ color: 'white', fontSize: '14px', fontFamily: 'Poppins, sans-serif' }}>
                    {club.address || club.description || 'Location not specified'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function BackArrow({ to = '/' }) {
  const navigate = useNavigate()
  
  return (
    <div className="back-arrow" onClick={() => navigate(to)}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="17,21 7,12 17,3"></polyline>
      </svg>
    </div>
  )
}

function Login() {
  const navigate = useNavigate()
  const { isAuthenticated } = useUser()

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate('/')
    return null
  }

  const handleLoginSuccess = () => {
    navigate('/')
  }

  return (
    <div className="page login-page">
      <BackArrow />
      <div className="page-content">
        <LoginForm onSuccess={handleLoginSuccess} />
      </div>
      <MainFooter />
    </div>
  )
}

function DemoClub() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()
  const { slug } = useParams()
  const { user, getUserClubs } = useUser()
  
  // Check if user is a manager of this club
  const userClubs = getUserClubs()
  const isManager = user && userClubs.some(
    c => c.role === 'manager'
  )

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleMenuClick = (path) => {
    navigate(path)
    setIsMenuOpen(false)
  }

  const clubSlug = slug || 'demo'

  return (
    <div className="page demo-club">
      <header className="header club-header">
        <div className="burger-menu" onClick={toggleMenu}>☰</div>
        <div className="header-title">Club Header</div>
        {user && <UserProfile />}
      </header>
      
      {isMenuOpen && (
        <div className="full-screen-menu-overlay" onClick={() => setIsMenuOpen(false)}>
          <div className="full-screen-menu" onClick={(e) => e.stopPropagation()}>
            <div className="menu-close" onClick={() => setIsMenuOpen(false)}>✕</div>
            <div className="menu-items">
              <div className="menu-item" onClick={() => handleMenuClick('/')}>
                Home
              </div>
              {user ? (
                <>
                  {isManager && (
                    <div className="menu-item" onClick={() => handleMenuClick(`/club/${clubSlug}/admin`)}>
                      Admin
                    </div>
                  )}
                  <div className="menu-item" onClick={() => handleMenuClick('/logout')}>
                    Logout
                  </div>
                </>
              ) : (
                <>
                  <div className="menu-item" onClick={() => handleMenuClick(`/club/${clubSlug}/login`)}>
                    Login
                  </div>
                  <div className="menu-item" onClick={() => handleMenuClick(`/club/${clubSlug}/register`)}>
                    Register
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      
      <div className="page-content">Demo Club</div>
      <ClubFooter />
    </div>
  )
}

function DemoClubLogin() {
  return (
    <div className="page">
      <BackArrow to="/club/demo/" />
      <div className="page-content">
        <LoginForm onSuccess={() => window.location.href = '/club/demo'} />
      </div>
      <ClubFooter />
    </div>
  )
}

function ClubAdminOld() {
  // This is replaced by the new ClubAdmin component
  return (
    <RoleGuard requiredClubRole="manager" clubId="demo" fallback={<div>Access Denied</div>}>
      <div className="page demo-club">
        <ClubHeader />
        <div className="page-content">Club Admin</div>
        <ClubFooter />
      </div>
    </RoleGuard>
  )
}

function OpenActiveAdminOld() {
  // This is replaced by the new OpenActiveAdmin component
  return (
    <RoleGuard requiredRoles={['openactive_user']} fallback={<div>Access Denied</div>}>
      <div className="page">
        <MainHeader />
        <div className="page-content">Open Farm Admin</div>
        <MainFooter />
      </div>
    </RoleGuard>
  )
}

function ClubRegister() {
  return (
    <div className="page">
      <MainHeader />
      <div className="page-content">Club Register</div>
      <MainFooter />
    </div>
  )
}

function UserRegistration() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    profilePhoto: null
  })
  const [photoPreview, setPhotoPreview] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData(prev => ({ ...prev, profilePhoto: file }))
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match')
      return
    }

    try {
      const name = `${formData.firstName} ${formData.lastName}`.trim()
      await apiService.register(formData.email, formData.password, { name })
      setSuccessMessage('Registration successful! Redirecting to farms...')
      setTimeout(() => navigate('/farms'), 800)
    } catch (err) {
      alert(err.message || 'Registration failed')
    }
  }

  return (
    <div className="page">
      <BackArrow to="/" />
      <div className="page-content">
        <div className="auth-form">
          <div className="form-container">
            <h2 className="form-title">o p e n Farm Manager</h2>
            <p className="form-subtitle">Register profile before setting up your farm!</p>

            {/* Profile Photo Section */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: photoPreview ? `url(${photoPreview}) center/cover` : 'rgba(255, 255, 255, 0.5)',
          marginBottom: '15px',
        }}></div>
        <label htmlFor="photo-upload" style={{
          background: 'rgba(255, 255, 255, 0.5)',
          padding: '10px 20px',
                  borderRadius: '4px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
            <circle cx="12" cy="13" r="4"></circle>
          </svg>
          <span style={{ color: 'white', fontSize: '14px', fontFamily: 'Poppins, sans-serif' }}>
            {photoPreview ? 'Change photo' : 'Upload profile photo'}
          </span>
        </label>
        <input
          id="photo-upload"
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          style={{ display: 'none' }}
        />
      </div>

      {/* Registration Form */}
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px', width: '100%', margin: '0 auto' }}>
        {/* First Name */}
        <div className="form-group">
          <div className="input-with-icon">
            <span className="input-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={formData.firstName ? "#8b7b54" : "rgba(255, 255, 255, 0.6)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </span>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              className="registration-input"
            />
          </div>
        </div>

        {/* Last Name */}
        <div className="form-group">
          <div className="input-with-icon">
            <span className="input-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={formData.lastName ? "#8b7b54" : "rgba(255, 255, 255, 0.6)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </span>
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              className="registration-input"
            />
          </div>
        </div>

        

        {/* Email */}
        <div className="form-group">
          <div className="input-with-icon">
            <span className="input-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={formData.email ? "#8b7b54" : "rgba(255, 255, 255, 0.6)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </span>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="registration-input"
            />
          </div>
        </div>

        {/* Password */}
        <div className="form-group">
          <div className="input-with-icon">
            <span className="input-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={formData.password ? "#8b7b54" : "rgba(255, 255, 255, 0.6)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </span>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="registration-input"
            />
          </div>
        </div>

        {/* Confirm Password */}
        <div className="form-group">
          <div className="input-with-icon">
            <span className="input-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={formData.confirmPassword ? "#8b7b54" : "rgba(255, 255, 255, 0.6)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </span>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              className="registration-input"
            />
          </div>
        </div>

        {/* Register Button */}
        <button
          type="submit"
          className="submit-button"
          style={{
            marginBottom: '1.5rem',
          }}
        >
          Register
        </button>

        {successMessage && (
          <div className="success-message" style={{ textAlign: 'center', marginBottom: '1rem' }}>
            {successMessage}
          </div>
        )}

        {/* Back to Login */}
        <div style={{ textAlign: 'center' }}>
          <span
            onClick={() => navigate('/club/demo/login')}
            style={{
              color: 'rgba(255,255,255,0.7)',
              fontSize: '14px',
              cursor: 'pointer',
              fontFamily: 'Poppins, sans-serif',
            }}
          >
            Back to login
          </span>
        </div>
      </form>
          </div>
        </div>
      </div>
      <ClubFooter />
    </div>
  )
}

function FarmCreate() {
  const navigate = useNavigate()
  const { isAuthenticated } = useUser()
  const [form, setForm] = useState({ name: '', region: 'South Africa - Western Cape', hectares: '', fyMonth: 'July' })
  const [submitting, setSubmitting] = useState(false)
  const regions = [
    'South Africa - Western Cape',
    'South Africa - Eastern Cape',
    'South Africa - Northern Cape',
    'South Africa - Free State',
    'South Africa - Gauteng',
    'South Africa - KwaZulu-Natal',
    'South Africa - Limpopo',
    'South Africa - Mpumalanga',
    'South Africa - North West'
  ]
  const months = [
    'January','February','March','April','May','June','July','August','September','October','November','December'
  ]
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      const monthIndex = months.indexOf(form.fyMonth) + 1
      const monthStr = String(monthIndex).padStart(2, '0')
      const financialYearStart = `${new Date().getFullYear()}-${monthStr}-01`
      const payload = { 
        name: form.name, 
        slug, 
        address: form.region, 
        hectares: form.hectares ? parseFloat(form.hectares) : undefined,
        financial_year_start: financialYearStart
      }
      // Use central API client so auth header is included
      await apiService.createClub(payload)
      navigate(`/farm/${slug}`)
    } catch (err) {
      alert('Failed to create farm: ' + err.message)
    } finally {
      setSubmitting(false)
    }
  }
  return (
    <div className="page">
      <BackArrow to="/farms" />
      <div className="page-content">
        <div className="form-card" style={{ maxWidth: '480px', margin: '0 auto' }}>
          <h3>Create New Farm</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="setting-label">Farm Name</label>
              <input className="setting-input" name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="setting-label">Region</label>
              <select className="setting-select" name="region" value={form.region} onChange={handleChange}>
                {regions.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="setting-label">Financial year starts</label>
              <select className="setting-select" name="fyMonth" value={form.fyMonth} onChange={handleChange}>
                {months.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="setting-label">Hectares</label>
              <input className="setting-input" name="hectares" type="number" step="0.01" value={form.hectares} onChange={handleChange} />
            </div>
            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => navigate('/farms')}>Cancel</button>
              <button type="submit" className="btn-primary" disabled={submitting}>{submitting ? 'Creating...' : 'Create Farm'}</button>
            </div>
          </form>
        </div>
      </div>
      <MainFooter />
    </div>
  )
}

function FarmHeader({ slug, active }) {
  const navigate = useNavigate()
  return (
    <header className="header club-header">
      <div className="back-arrow" onClick={() => navigate('/farms')}>←</div>
      <div className="header-title">Farm</div>
      <nav style={{ marginLeft: 'auto', display: 'flex', gap: '12px' }}>
        <span className="menu-link" onClick={() => navigate(`/farm/${slug}`)} style={{ opacity: active==='overview'?1:0.7 }}>Overview</span>
        <span className="menu-link" onClick={() => navigate(`/farm/${slug}/animals`)} style={{ opacity: active==='animals'?1:0.7 }}>Animal Management</span>
        <span className="menu-link" onClick={() => navigate(`/farm/${slug}/rainfall`)} style={{ opacity: active==='rainfall'?1:0.7 }}>Rainfall</span>
      </nav>
    </header>
  )
}

function FarmOverview() {
  const { slug } = useParams()
  return (
    <div className="page">
      <FarmHeader slug={slug} active="overview" />
      <div className="page-content">Farm Overview for {slug}</div>
      <MainFooter />
    </div>
  )
}

function FarmAnimals() {
  const { slug } = useParams()
  return (
    <div className="page">
      <FarmHeader slug={slug} active="animals" />
      <div className="page-content">Animal Management for {slug}</div>
      <MainFooter />
    </div>
  )
}

function FarmRainfall() {
  const { slug } = useParams()
  return (
    <div className="page">
      <FarmHeader slug={slug} active="rainfall" />
      <div className="page-content">Rainfall for {slug}</div>
      <MainFooter />
    </div>
  )
}

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/clubs" element={<Clubs />} />
          <Route path="/farms" element={<Clubs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/svg-test" element={<SvgTest />} />
          <Route path="/admin" element={<OpenActiveAdmin />} />
          <Route path="/register" element={<UserRegistration />} />
          <Route path="/club/:slug" element={<DemoClub />} />
          <Route path="/club/:slug/login" element={<DemoClubLogin />} />
          <Route path="/club/:slug/admin" element={<ClubAdmin />} />
          <Route path="/club/:slug/register" element={<UserRegistration />} />
          <Route path="/farm/:slug" element={<FarmOverview />} />
          <Route path="/farm/:slug/animals" element={<FarmAnimals />} />
          <Route path="/farm/:slug/rainfall" element={<FarmRainfall />} />
          <Route path="/farms/create" element={<FarmCreate />} />
        </Routes>
      </Router>
    </UserProvider>
  )
}

export default App
