import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MessageCircle, Users, Trophy, Heart, Calendar, ArrowLeft } from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { User } from '../../types'
import { useNavigate } from 'react-router-dom'

interface UserProfileProps {
  currentUser: User
}

// Mock user data
const mockUserData = {
  jennie: {
    id: 'jennie',
    username: 'jennie',
    displayName: 'Jennie',
    bio: 'Founder of Lock In 🚀 Building habits, one day at a time',
    isVerified: true,
    streak: 47,
    totalLikes: 234,
    followers: 1247,
    following: 89,
    isFollowing: true
  },
  alexsmith: {
    id: 'alexsmith',
    username: 'alexsmith',
    displayName: 'Alex Smith',
    bio: 'Fitness enthusiast | Early riser | Accountability partner 💪',
    isVerified: false,
    streak: 23,
    totalLikes: 156,
    followers: 234,
    following: 45,
    isFollowing: false
  }
}

export default function UserProfile({ currentUser }: UserProfileProps) {
  const { username } = useParams<{ username: string }>()
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    if (username && mockUserData[username as keyof typeof mockUserData]) {
      setUser(mockUserData[username as keyof typeof mockUserData])
    }
  }, [username])

  const handleFollow = () => {
    setUser((prev: any) => ({
      ...prev,
      isFollowing: !prev.isFollowing,
      followers: prev.isFollowing ? prev.followers - 1 : prev.followers + 1
    }))
  }

  if (!user) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">User not found</p>
          <Button onClick={() => navigate(-1)} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  const stats = [
    {
      label: 'Followers',
      value: user.followers,
      icon: Users,
      color: 'text-blue-500'
    },
    {
      label: 'Following',
      value: user.following,
      icon: Users,
      color: 'text-green-500'
    },
    {
      label: 'Streak',
      value: user.streak,
      icon: Trophy,
      color: 'text-orange-500'
    },
    {
      label: 'Likes',
      value: user.totalLikes,
      icon: Heart,
      color: 'text-red-500'
    }
  ]

  return (
    <div className="min-h-full p-4 space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back</span>
      </Button>

      {/* Profile Header */}
      <Card className="glass-card">
        <CardContent className="p-6">
          {/* Row 1: Avatar & Username */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20">
                <AvatarFallback className="bg-primary text-white text-2xl font-bold">
                  {user.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold text-primary">@{user.username}</span>
                  {user.isVerified && (
                    <Badge variant="secondary" className="bg-primary/20 text-primary">
                      ✓ verified
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            {currentUser.id !== user.id && (
              <Button
                onClick={handleFollow}
                variant={user.isFollowing ? "outline" : "default"}
                className={user.isFollowing ? "" : "lock-in-gradient border-0"}
              >
                {user.isFollowing ? 'Unfollow' : 'Follow'}
              </Button>
            )}
          </div>

          {/* Row 2: Bio & Message Button */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground flex-1">
              {user.bio}
            </p>
            {currentUser.id !== user.id && (
              <Button variant="outline" size="sm" className="ml-4">
                <MessageCircle className="h-4 w-4 mr-2" />
                Message
              </Button>
            )}
          </div>

          {/* Row 3: Stats */}
          <div className="grid grid-cols-4 gap-4 pt-4 border-t">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="flex items-center justify-center mb-2">
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Profile Feeds */}
      <Tabs defaultValue="checklist" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-muted/50">
          <TabsTrigger value="checklist">Checklist</TabsTrigger>
          <TabsTrigger value="public">Public</TabsTrigger>
        </TabsList>

        <TabsContent value="checklist" className="mt-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span>Today's Checklist</span>
                <span className="text-sm text-muted-foreground font-normal">
                  ({new Date().toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="w-4 h-4 rounded border-2 border-primary bg-primary flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-sm" />
                  </div>
                  <span className="text-sm text-muted-foreground line-through">
                    Morning meditation (10 minutes)
                  </span>
                </div>
                
                {user.username === 'jennie' && (
                  <>
                    <div className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
                      <div className="w-4 h-4 rounded border-2 border-primary bg-primary flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-sm" />
                      </div>
                      <span className="text-sm text-muted-foreground line-through">
                        Review daily reports
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                      <div className="w-4 h-4 rounded border-2 border-muted-foreground" />
                      <span className="text-sm">Team standup meeting</span>
                    </div>
                  </>
                )}
                
                {user.username === 'alexsmith' && (
                  <>
                    <div className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
                      <div className="w-4 h-4 rounded border-2 border-primary bg-primary flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-sm" />
                      </div>
                      <span className="text-sm text-muted-foreground line-through">
                        5K morning run
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                      <div className="w-4 h-4 rounded border-2 border-muted-foreground" />
                      <span className="text-sm">Gym workout (chest & triceps)</span>
                    </div>
                  </>
                )}
              </div>
              
              <p className="text-xs text-muted-foreground mt-4 italic">
                Note: You cannot tick or untick another user's checklist items.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="public" className="mt-4">
          <Card className="glass-card">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-2">No public posts yet</h3>
              <p className="text-sm text-muted-foreground">
                @{user.username} hasn't shared any public progress yet.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}