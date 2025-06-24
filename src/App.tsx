import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from 'next-themes'
import AuthScreen from './components/auth/AuthScreen'
import MainApp from './components/MainApp'
import { User } from './types'

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('lockInUser')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Failed to parse stored user:', error)
        localStorage.removeItem('lockInUser')
      }
    }
    setIsLoading(false)
  }, [])

  const handleLogin = (userData: User) => {
    setUser(userData)
    localStorage.setItem('lockInUser', JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('lockInUser')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <Router>
        <div className="min-h-screen bg-background text-foreground">
          <Routes>
            <Route
              path="/auth"
              element={
                user ? <Navigate to="/" replace /> : <AuthScreen onLogin={handleLogin} />
              }
            />
            <Route
              path="/*"
              element={
                user ? (
                  <MainApp user={user} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/auth" replace />
                )
              }
            />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App