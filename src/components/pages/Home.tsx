import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart, MessageCircle, MoreHorizontal, CheckCircle2 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { User, Post } from '../../types'

interface HomeProps {
  user: User
  searchQuery: string
}

// Mock data - in real app, this would come from API
const mockPosts: Post[] = [
  {
    id: '1',
    userId: 'jennie',
    username: 'jennie',
    content: 'Completed: Morning meditation (10 minutes)',
    type: 'checklist',
    isPublic: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    likes: ['user1', 'user2'],
    comments: [
      {
        id: '1',
        postId: '1',
        userId: 'user1',
        username: 'alexsmith',
        content: 'Great start to the day! 🧘‍♀️',
        likes: ['jennie'],
        createdAt: new Date(Date.now() - 1000 * 60 * 20),
        isCreator: false
      }
    ]
  },
  {
    id: '2',
    userId: 'user1',
    username: 'alexsmith',
    content: 'Completed: 5K morning run',
    type: 'checklist',
    isPublic: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    likes: ['jennie'],
    comments: []
  }
]

export default function Home({ user, searchQuery }: HomeProps) {
  const [activeTab, setActiveTab] = useState('lock-in')
  const [posts, setPosts] = useState<Post[]>(mockPosts)
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(mockPosts)

  useEffect(() => {
    // Filter posts based on search query
    if (searchQuery.trim()) {
      const filtered = posts.filter(post => 
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredPosts(filtered)
    } else {
      setFilteredPosts(posts)
    }
  }, [searchQuery, posts])

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? {
            ...post,
            likes: post.likes.includes(user.id)
              ? post.likes.filter(id => id !== user.id)
              : [...post.likes, user.id]
          }
        : post
    ))
  }

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
                  {post.username === 'jennie' && (
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
                onClick={() => handleLike(post.id)}
                className={`flex items-center space-x-1 transition-colors ${
                  post.likes.includes(user.id) 
                    ? 'text-red-500 hover:text-red-600' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Heart 
                  className={`h-4 w-4 ${post.likes.includes(user.id) ? 'fill-current' : ''}`} 
                />
                <span className="text-xs">{post.likes.length}</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center space-x-1 text-muted-foreground hover:text-foreground">
                <MessageCircle className="h-4 w-4" />
                <span className="text-xs">{post.comments.length}</span>
              </Button>
            </div>
          </div>

          {/* Comments */}
          {post.comments.length > 0 && (
            <div className="mt-3 pt-3 border-t border-border/30 space-y-2">
              {post.comments.map(comment => (
                <div key={comment.id} className="flex items-start space-x-2">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                      {comment.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-medium text-primary">@{comment.username}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatTimeAgo(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )

  return (
    <div className="min-h-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4 mx-4 mt-4 bg-muted/50">
          <TabsTrigger value="friends" className="text-xs">Friends</TabsTrigger>
          <TabsTrigger value="following" className="text-xs">Following</TabsTrigger>
          <TabsTrigger value="lock-in" className="text-xs">Lock In</TabsTrigger>
        </TabsList>

        <div className="px-4">
          <TabsContent value="friends" className="mt-0">
            <div className="space-y-4">
              <div className="text-center py-8">
                <p className="text-muted-foreground">No friends posts yet</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Follow users who follow you back to see their posts here
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="following" className="mt-0">
            <div className="space-y-4">
              {filteredPosts.length > 0 ? (
                filteredPosts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    {searchQuery ? 'No posts found' : 'No posts from people you follow'}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="lock-in" className="mt-0">
            <div className="space-y-4">
              {filteredPosts.length > 0 ? (
                filteredPosts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    {searchQuery ? 'No posts found' : 'Start following users and checking off tasks!'}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}