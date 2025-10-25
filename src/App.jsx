import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { UserProvider, useUser } from './context/UserContext'
import { RoleGuard } from './components/RoleGuard'
import { LoginForm, UserProfile, RegisterForm } from './components/UserAuth'
import { usePermissions } from './components/RoleGuard'
import './App.css'

function FullScreenMenu({ isOpen, onClose }) {
  const navigate = useNavigate()
  const { isAuthenticated, user, globalRole, getUserClubs } = useUser()
  const { canAccessAdmin, canAccessClubAdmin } = usePermissions()

  const handleMenuClick = (path) => {
    navigate(path)
    onClose()
  }

  if (!isOpen) return null

  const userClubs = getUserClubs()

  return (
    <div className="full-screen-menu-overlay" onClick={onClose}>
      <div className="full-screen-menu" onClick={(e) => e.stopPropagation()}>
        <div className="menu-close" onClick={onClose}>✕</div>
        <div className="menu-items">
          <div className="menu-item" onClick={() => handleMenuClick('/')}>
            Home
          </div>
          
          {!isAuthenticated ? (
            <div className="menu-item" onClick={() => handleMenuClick('/login')}>
              Login
            </div>
          ) : (
            <>
              <div className="menu-item" onClick={() => handleMenuClick('/register')}>
                Register Club
              </div>
              
              {canAccessAdmin() && (
                <div className="menu-item" onClick={() => handleMenuClick('/admin')}>
                  Open Active Admin
                </div>
              )}
              
              {userClubs.map(({ clubId, clubName, role }) => (
                <div key={clubId} className="menu-item" onClick={() => handleMenuClick(`/club/${clubId}`)}>
                  {clubName || `Club ${clubId}`}
                </div>
              ))}
              
              {userClubs.some(club => canAccessClubAdmin(club.clubId)) && (
                <div className="menu-item" onClick={() => handleMenuClick('/club/demo/admin')}>
                  Club Admin
                </div>
              )}
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

function MainFooter() {
  return (
    <footer className="footer main-footer">
      <div className="footer-content">
        <div>Open Active Tennis Booking System</div>
        <div>Version 2.0.0</div>
      </div>
    </footer>
  )
}

function ClubFooter() {
  return (
    <footer className="footer club-footer">
      <div className="footer-content">Club Footer</div>
    </footer>
  )
}

function Home() {
  return (
    <div className="page home">
      <MainHeader />
      <div className="page-content">Open Active Home</div>
      <MainFooter />
    </div>
  )
}

function BackArrow() {
  const navigate = useNavigate()
  
  return (
    <div className="back-arrow" onClick={() => navigate('/')}>
      ←
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
    </div>
  )
}

function DemoClub() {
  return (
    <div className="page demo-club">
      <ClubHeader />
      <div className="page-content">Demo Club</div>
      <ClubFooter />
    </div>
  )
}

function DemoClubLogin() {
  return (
    <div className="page">
      <ClubHeader />
      <div className="page-content">
        <LoginForm onSuccess={() => window.location.href = '/club/demo'} />
      </div>
      <ClubFooter />
    </div>
  )
}

function ClubAdmin() {
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

function OpenActiveAdmin() {
  return (
    <RoleGuard requiredRoles={['openactive_user']} fallback={<div>Access Denied</div>}>
      <div className="page">
        <MainHeader />
        <div className="page-content">Open Active Admin</div>
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
  return (
    <div className="page demo-club">
      <ClubHeader />
      <div className="page-content">User Registration</div>
      <ClubFooter />
    </div>
  )
}

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<OpenActiveAdmin />} />
          <Route path="/register" element={<ClubRegister />} />
          <Route path="/club/demo" element={<DemoClub />} />
          <Route path="/club/demo/login" element={<DemoClubLogin />} />
          <Route path="/club/demo/admin" element={<ClubAdmin />} />
          <Route path="/club/demo/register" element={<UserRegistration />} />
        </Routes>
      </Router>
    </UserProvider>
  )
}

export default App
