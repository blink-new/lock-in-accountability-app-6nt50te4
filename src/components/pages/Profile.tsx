import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Settings, Edit3, Users, Trophy, Heart, Calendar, CheckCircle2, MoreHorizontal, MessageCircle, LogOut } from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { User, Post } from '../../types'
import { getUserPosts } from '../../utils/posts'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Switch } from '../ui/switch'

interface ProfileProps {
  user: User
}

export default function Profile({ user }: ProfileProps) {
  const [followers] = useState(1247)
  const [following] = useState(89)
  const [publicPosts, setPublicPosts] = useState<Post[]>([])
  const [privatePosts, setPrivatePosts] = useState<Post[]>([])
  const [settingsOpen, setSettingsOpen] = useState(false)

  // Local copy of user settings for toggles
  const [allowAnyoneMessage, setAllowAnyoneMessage] = useState(user.settings.messaging === 'anyone')
  const [allowFriendsMessage, setAllowFriendsMessage] = useState(user.settings.messaging === 'friends')
  const [allowFollowersMessage, setAllowFollowersMessage] = useState(user.settings.messaging === 'followers')
  const [allowTagging, setAllowTagging] = useState(user.settings.allowTagging)

  useEffect(() => {
    // Load user's posts
    setPublicPosts(getUserPosts(user.id, true))
    setPrivatePosts(getUserPosts(user.id, false))
  }, [user.id])

  useEffect(() => {
    const interval = setInterval(() => {
      setPublicPosts(getUserPosts(user.id, true))
      setPrivatePosts(getUserPosts(user.id, false))
    }, 1000)
    return () => clearInterval(interval)
  }, [user.id])

  // TODO: Add save settings logic to backend or state management

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
          <div className="mb-3">
            <div className="flex items-start space-x-2">
              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-sm leading-relaxed">{post.content}</p>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="flex items-center space-x-1 text-muted-foreground hover:text-foreground">
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

  return (
    <div className="min-h-full p-4">
      <div className="space-y-6">
        <Card className="glass-card">
          <CardContent className="p-6 flex items-center justify-between">
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
                <p className="text-sm text-muted-foreground mt-1">{user.bio || 'Building habits, one day at a time 🚀'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setSettingsOpen(true)}>
                <Settings className="h-5 w-5 text-muted-foreground hover:text-foreground" />
              </Button>
              <Button variant="ghost" size="sm">
                <LogOut className="h-5 w-5 text-muted-foreground hover:text-foreground" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Settings Dialog */}
        <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Settings</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Anyone can message me</span>
                <Switch checked={allowAnyoneMessage} onCheckedChange={setAllowAnyoneMessage} />
              </div>
              <div className="flex items-center justify-between">
                <span>Friends can message me</span>
                <Switch checked={allowFriendsMessage} onCheckedChange={setAllowFriendsMessage} />
              </div>
              <div className="flex items-center justify-between">
                <span>Followers can message me</span>
                <Switch checked={allowFollowersMessage} onCheckedChange={setAllowFollowersMessage} />
              </div>
              <div className="flex items-center justify-between">
                <span>Users can tag me in comments</span>
                <Switch checked={allowTagging} onCheckedChange={setAllowTagging} />
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Profile Stats and Feeds */}
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
                <Button variant="ghost" size="sm" onClick={() => setSettingsOpen(true)}>
                  <Settings className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                </Button>
                <Button variant="ghost" size="sm">
                  <LogOut className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                </Button>
              </div>
            </div>

            {/* Row 3: Stats */}
            <div className="grid grid-cols-4 gap-4 pt-4 border-t">
              {
                [
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
                ].map((stat, index) => (
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
                ))
              }
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
                {checklistItems.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                      <Plus className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold mb-2">No tasks yet</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Go to the Checklist tab to create your first accountability task!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {checklistItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200 ${
                          item.isCompleted 
                            ? 'bg-primary/5 border-primary/20' 
                            : 'bg-muted/30 border-border'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                          item.isCompleted
                            ? 'border-primary bg-primary'
                            : 'border-muted-foreground'
                        }`}>
                          {item.isCompleted && (
                            <div className="w-2 h-2 bg-white rounded-sm" />
                          )}
                        </div>
                        <div className="flex-1">
                          <span className={`text-sm ${
                            item.isCompleted 
                              ? 'text-muted-foreground line-through' 
                              : 'text-foreground'
                          }`}>
                            {item.text}
                          </span>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              item.type === 'daily' 
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                                : 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
                            }`}>
                              {item.type === 'daily' ? 'Daily' : 'One-off'}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              item.isPublic 
                                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                            }`}>
                              {item.isPublic ? 'Public' : 'Private'}
                            </span>
                            {item.completedAt && (
                              <span className="text-xs text-muted-foreground">
                                Completed {item.completedAt.toLocaleTimeString('en-US', { 
                                  hour: '2-digit', 
                                  minute: '2-digit',
                                  hour12: false 
                                })}
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
                
                {checklistItems.length > 0 && (
                  <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary mb-2">
                        {checklistItems.length > 0 
                          ? Math.round((checklistItems.filter(item => item.isCompleted).length / checklistItems.length) * 100) 
                          : 0}%
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">Today's Progress</div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300" 
                          style={{ 
                            width: `${checklistItems.length > 0 
                              ? Math.round((checklistItems.filter(item => item.isCompleted).length / checklistItems.length) * 100) 
                              : 0}%` 
                          }} 
                        />
                      </div>
                      <div className="flex justify-center space-x-4 mt-3 text-xs text-muted-foreground">
                        <span>{checklistItems.filter(item => item.isCompleted).length} completed</span>
                        <span>•</span>
                        <span>{checklistItems.length - checklistItems.filter(item => item.isCompleted).length} remaining</span>
                      </div>
                    </div>
                  </div>
                )}
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