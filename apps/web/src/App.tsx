import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Hero } from './components/Hero'
import { PhotoGrid } from './components/PhotoGrid'
import { Timeline } from './components/Timeline'
import { FriendVault } from './components/FriendVault'
import { ExperienceFeedback } from './components/ExperienceFeedback'
import { FloatingBackground } from './components/FloatingBackground'
import { AdminDashboard } from './components/AdminDashboard'

function LandingPage() {
  return (
    <div className="min-h-screen relative">
      <FloatingBackground />
      <Hero />
      <Timeline />
      <PhotoGrid />
      <FriendVault />
      <ExperienceFeedback />
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  )
}

export default App
