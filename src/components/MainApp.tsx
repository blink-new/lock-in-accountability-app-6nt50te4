import { useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import Header from './layout/Header'
import BottomNav from './layout/BottomNav'
import Home from './pages/Home'
import Users from './pages/Users'
import Inbox from './pages/Inbox'
import Profile from './pages/Profile'
import Checklist from './pages/Checklist'
import UserProfile from './pages/UserProfile'
import { User } from '../types'

interface MainAppProps {
  user: User
  onLogout: () => void
}

export default function MainApp({ user, onLogout }: MainAppProps) {
  const location = useLocation()
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <Header 
        user={user} 
        onLogout={onLogout} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Content */}
      <main className="flex-1 pb-16 overflow-hidden">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="h-full"
        >
          <Routes>
            <Route path="/" element={<Home user={user} searchQuery={searchQuery} />} />
            <Route path="/users" element={<Users user={user} searchQuery={searchQuery} />} />
            <Route path="/inbox" element={<Inbox user={user} />} />
            <Route path="/profile" element={<Profile user={user} />} />
            <Route path="/checklist" element={<Checklist user={user} />} />
            <Route path="/user/:username" element={<UserProfile currentUser={user} />} />
          </Routes>
        </motion.div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  )
}