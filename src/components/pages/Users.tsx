import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Trophy, Heart } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card, CardContent } from '../ui/card'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { User } from '../../types'

interface UsersProps {
  user: User
  searchQuery: string
}

// Mock users data
const mockUsers = [
  {
    id: 'jennie',
    username: 'jennie',
    displayName: 'Jennie',
    streak: 47,
    totalLikes: 234,
    isVerified: true,
    isFollowing: true
  },
  {
    id: 'alex',
    username: 'alexsmith',
    displayName: 'Alex Smith',
    streak: 23,
    totalLikes: 156,
    isVerified: false,
    isFollowing: false
  },
  {
    id: 'sarah',
    username: 'sarahj',
    displayName: 'Sarah Johnson',
    streak: 15,
    totalLikes: 89,
    isVerified: false,
    isFollowing: true
  }
]

export default function Users({ user, searchQuery }: UsersProps) {
  const [users, setUsers] = useState(mockUsers)
  const [localSearch, setLocalSearch] = useState('')

  const filteredUsers = users.filter(u => 
    (searchQuery || localSearch) ? 
      u.username.toLowerCase().includes((searchQuery || localSearch).toLowerCase()) ||
      u.displayName.toLowerCase().includes((searchQuery || localSearch).toLowerCase())
    : true
  ).sort((a, b) => {
    // Sort by streak first, then by likes
    if (a.streak !== b.streak) return b.streak - a.streak
    return b.totalLikes - a.totalLikes
  })

  const handleFollow = (userId: string) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, isFollowing: !u.isFollowing } : u
    ))
  }

  return (
    <div className="min-h-full p-4">
      <div className="space-y-4">
        {/* Search Header */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="pl-10 bg-muted/50"
          />
        </div>

        {/* Leaderboard Title */}
        <div className="flex items-center space-x-2">
          <Trophy className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-bold">Leaderboard</h1>
        </div>

        {/* Users List */}
        <div className="space-y-3">
          {filteredUsers.map((userData, index) => (
            <motion.div
              key={userData.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass-card cursor-pointer hover:border-primary/30 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {/* Rank */}
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-sm font-bold text-muted-foreground">
                          #{index + 1}
                        </span>
                      </div>

                      {/* Avatar */}
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-primary text-white font-semibold">
                          {userData.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      {/* User Info */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-primary">@{userData.username}</span>
                          {userData.isVerified && (
                            <Badge variant="secondary" className="text-xs bg-primary/20 text-primary">
                              ✓ verified
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-4 mt-1">
                          <div className="flex items-center space-x-1">
                            <Trophy className="h-3 w-3 text-orange-500" />
                            <span className="text-xs text-muted-foreground">
                              {userData.streak} day streak
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Heart className="h-3 w-3 text-red-500" />
                            <span className="text-xs text-muted-foreground">
                              {userData.totalLikes} likes
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Follow Button */}
                    {userData.id !== user.id && (
                      <Button
                        size="sm"
                        variant={userData.isFollowing ? "outline" : "default"}
                        className={userData.isFollowing ? "" : "lock-in-gradient border-0"}
                        onClick={() => handleFollow(userData.id)}
                      >
                        {userData.isFollowing ? 'Unfollow' : 'Follow'}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No users found</p>
          </div>
        )}
      </div>
    </div>
  )
}