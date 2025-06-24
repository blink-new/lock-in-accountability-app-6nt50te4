import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Settings, Edit3, Users, Trophy, Heart, Calendar, CheckCircle2, MoreHorizontal, MessageCircle } from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { User, Post } from '../../types'
import { getUserPosts } from '../../utils/posts'

interface ProfileProps {
  user: User
}

export default function Profile({ user }: ProfileProps) {
  const [followers] = useState(1247)
  const [following] = useState(89)
  const [publicPosts, setPublicPosts] = useState<Post[]>([])
  const [privatePosts, setPrivatePosts] = useState<Post[]>([])

  useEffect(() => {
    // Load user's posts
    setPublicPosts(getUserPosts(user.id, true))
    setPrivatePosts(getUserPosts(user.id, false))
  }, [user.id])

  // Refresh posts when checklist updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPublicPosts(getUserPosts(user.id, true))
      setPrivatePosts(getUserPosts(user.id, false))
    }, 1000) // Check every second for demo purposes

    return () => clearInterval(interval)
  }, [user.id])

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'now'
    if (diffInMinutes < 60) return `${diffInMinutes}m`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`
    return `${Math.floor(diffInMinutes / 1440)}d`
  }

  const PostCard = ({ post }: { post: Post }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4"
    >
      <Card className="glass-card">
        <CardContent className="p-4">
          {/* User Info */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-primary text-white font-semibold">
                  {post.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-primary">@{post.username}</span>
                  {user.isVerified && (
                    <Badge variant="secondary" className="text-xs bg-primary/20 text-primary">
                      ✓ verified
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatTimeAgo(post.createdAt)}
                </span>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>

          {/* Post Content */}
          <div className="mb-3">
            <div className="flex items-start space-x-2">
              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-sm leading-relaxed">{post.content}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-1 text-muted-foreground hover:text-foreground"
              >
                <Heart className="h-4 w-4" />
                <span className="text-xs">{post.likes.length}</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center space-x-1 text-muted-foreground hover:text-foreground">
                <MessageCircle className="h-4 w-4" />
                <span className="text-xs">{post.comments.length}</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  const stats = [
    {
      label: 'Followers',
      value: followers,
      icon: Users,
      color: 'text-blue-500'
    },
    {
      label: 'Following',
      value: following,
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
    <div className="min-h-full p-4">
      <div className="space-y-6">
        {/* Profile Header */}
        <Card className="glass-card">
          <CardContent className="p-6">
            {/* Row 1: Avatar, Username, Settings */}
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
                  <p className="text-sm text-muted-foreground mt-1">
                    Building habits, one day at a time 🚀
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
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
          <TabsList className="grid w-full grid-cols-3 bg-muted/50">
            <TabsTrigger value="checklist">Checklist</TabsTrigger>
            <TabsTrigger value="public">Public</TabsTrigger>
            <TabsTrigger value="private">Private</TabsTrigger>
          </TabsList>

          <TabsContent value="checklist" className="mt-4">
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span>Today's Checklist</span>
                  </CardTitle>
                  <span className="text-sm text-muted-foreground">
                    {new Date().toLocaleDateString('en-US', { 
                      weekday: 'long',
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
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
                  
                  <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                    <div className="w-4 h-4 rounded border-2 border-muted-foreground" />
                    <span className="text-sm">5K morning run</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                    <div className="w-4 h-4 rounded border-2 border-muted-foreground" />
                    <span className="text-sm">Read for 30 minutes</span>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-2">33%</div>
                    <div className="text-sm text-muted-foreground">Today's Progress</div>
                    <div className="w-full bg-muted rounded-full h-2 mt-2">
                      <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: '33%' }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="public" className="mt-4">
            <Card className="glass-card">
              {publicPosts.length > 0 ? (
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {publicPosts.map(post => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </div>
                </CardContent>
              ) : (
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <Users className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2">No public posts yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Complete public checklist items to share your progress!
                  </p>
                </CardContent>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="private" className="mt-4">
            <Card className="glass-card">
              {privatePosts.length > 0 ? (
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {privatePosts.map(post => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </div>
                </CardContent>
              ) : (
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <Calendar className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2">No private posts yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Complete private checklist items to track your personal progress!
                  </p>
                </CardContent>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}