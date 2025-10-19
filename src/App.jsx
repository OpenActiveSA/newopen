import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

function Home() {
  return <div className="page">Open Active Home</div>
}

function Login() {
  return <div className="page">Open Login</div>
}

function DemoClub() {
  return <div className="page">Demo Club</div>
}

function DemoClubLogin() {
  return <div className="page">Demo Club Login</div>
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
