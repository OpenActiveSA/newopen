import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

function MainHeader() {
  return (
    <header className="header main-header">
      <div className="burger-menu">☰</div>
      <div className="header-title">Main Header</div>
    </header>
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
      <div className="footer-content">Main Footer</div>
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

function Login() {
  return (
    <div className="page">
      <MainHeader />
      <div className="page-content">Open Login</div>
      <MainFooter />
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
      <div className="page-content">Demo Club Login</div>
      <ClubFooter />
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/club/demo" element={<DemoClub />} />
        <Route path="/club/demo/login" element={<DemoClubLogin />} />
      </Routes>
    </Router>
  )
}

export default App
