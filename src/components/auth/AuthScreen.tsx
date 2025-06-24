import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Lock, Mail, User as UserIcon, Smartphone } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Checkbox } from '../ui/checkbox'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Separator } from '../ui/separator'
import { User } from '../../types'
import toast from 'react-hot-toast'

interface AuthScreenProps {
  onLogin: (user: User) => void
}

export default function AuthScreen({ onLogin }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isLogin && formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (!isLogin && formData.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    if (!isLogin && formData.username.length < 3) {
      toast.error('Username must be at least 3 characters')
      return
    }

    // Mock authentication - in real app, this would be API calls
    const user: User = {
      id: isLogin ? 'existing-user' : 'new-user-' + Date.now(),
      username: formData.username.toLowerCase(),
      email: formData.email,
      displayName: formData.username,
      isVerified: formData.username.toLowerCase() === 'jennie',
      isAdmin: formData.username.toLowerCase() === 'jennie',
      createdAt: new Date(),
      followers: [],
      following: formData.username.toLowerCase() !== 'jennie' ? ['jennie'] : [],
      streak: 0,
      totalLikes: 0,
      settings: {
        theme: 'dark',
        messaging: 'anyone',
        allowTagging: true,
        profileVisibility: 'public'
      }
    }

    toast.success(isLogin ? 'Welcome back!' : 'Account created successfully!')
    onLogin(user)
  }

  const handleForgotPassword = () => {
    if (!formData.email) {
      toast.error('Please enter your email address first')
      return
    }
    toast.success('Password reset link sent to your email!')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-background/50">
      <div className="w-full max-w-md space-y-6">
        {/* Logo & Brand */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <div className="w-16 h-16 mx-auto rounded-full lock-in-gradient flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Lock In</h1>
          <p className="text-muted-foreground">Simple, Accountable, peer support</p>
        </motion.div>

        {/* Auth Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-card">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-semibold">
                {isLogin ? 'Welcome back' : 'Create account'}
              </CardTitle>
              <CardDescription>
                {isLogin 
                  ? 'Sign in to continue your accountability journey'
                  : 'Join the Lock In community and start building habits'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="username"
                        placeholder="@username"
                        value={formData.username}
                        onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                        className="pl-10"
                        required
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Case insensitive & unique
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="pl-10"
                      required
                    />
                  </div>
                  {isLogin && (
                    <p className="text-xs text-muted-foreground">
                      Used for password recovery
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className="pl-10 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1 h-8 w-8 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                )}

                {isLogin && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="remember" 
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                      />
                      <Label htmlFor="remember" className="text-sm">
                        Remember me
                      </Label>
                    </div>
                    <Button 
                      type="button" 
                      variant="link" 
                      className="p-0 h-auto text-primary"
                      onClick={handleForgotPassword}
                    >
                      Forgot password?
                    </Button>
                  </div>
                )}

                <Button type="submit" className="w-full lock-in-gradient border-0">
                  {isLogin ? 'Sign In' : 'Create Account'}
                </Button>
              </form>

              <Separator className="my-6" />

              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-muted-foreground hover:text-primary"
                >
                  {isLogin 
                    ? "Don't have an account? Sign up" 
                    : 'Already have an account? Sign in'
                  }
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* PWA Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center space-y-2"
        >
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <Smartphone className="w-4 h-4" />
            <span>Add to Home Screen for best experience</span>
          </div>
          <p className="text-xs text-muted-foreground">
            iOS: Share → Add to Home Screen | Android: Menu → Add to Home Screen
          </p>
        </motion.div>
      </div>
    </div>
  )
}