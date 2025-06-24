import { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, Bell, Plus, CheckCheck } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { User } from '../../types'

interface InboxProps {
  user: User
}

// Mock data
const mockMessages = [
  {
    id: '1',
    fromUser: 'jennie',
    content: 'Great job on your daily streak! Keep it up! 🔥',
    isRead: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 30)
  },
  {
    id: '2',
    fromUser: 'alexsmith',
    content: 'Want to be accountability partners?',
    isRead: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2)
  }
]

const mockNotifications = [
  {
    id: '1',
    type: 'like',
    fromUser: 'jennie',
    content: 'liked your post "Completed: Morning meditation"',
    isRead: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 15)
  },
  {
    id: '2',
    type: 'follow',
    fromUser: 'sarahj',
    content: 'started following you',
    isRead: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 45)
  },
  {
    id: '3',
    type: 'comment',
    fromUser: 'alexsmith',
    content: 'commented on your post',
    isRead: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3)
  }
]

export default function Inbox({ }: InboxProps) {
  const [messages, setMessages] = useState(mockMessages)
  const [notifications, setNotifications] = useState(mockNotifications)

  const unreadMessages = messages.filter(m => !m.isRead).length
  const unreadNotifications = notifications.filter(n => !n.isRead).length
  const totalUnread = unreadMessages + unreadNotifications

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  const markAllAsRead = () => {
    setMessages(prev => prev.map(m => ({ ...m, isRead: true })))
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
  }

  return (
    <div className="min-h-full">
      <Tabs defaultValue="messages" className="w-full">
        <div className="flex items-center justify-between p-4 border-b">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="messages" className="flex items-center space-x-2">
              <MessageCircle className="h-4 w-4" />
              <span>Messages</span>
              {unreadMessages > 0 && (
                <Badge variant="destructive" className="text-xs ml-1">
                  {unreadMessages}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
              {unreadNotifications > 0 && (
                <Badge variant="destructive" className="text-xs ml-1">
                  {unreadNotifications}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {totalUnread > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              className="flex items-center space-x-2"
            >
              <CheckCheck className="h-4 w-4" />
              <span>Mark all read</span>
            </Button>
          )}
        </div>

        <TabsContent value="messages" className="mt-0 p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Messages</h2>
              <Button size="sm" className="lock-in-gradient border-0">
                <Plus className="h-4 w-4 mr-2" />
                New Message
              </Button>
            </div>

            {messages.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No messages yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={`glass-card cursor-pointer hover:border-primary/30 transition-colors ${
                      !message.isRead ? 'bg-primary/5 border-primary/20' : ''
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-primary text-white font-semibold">
                              {message.fromUser.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-primary">@{message.fromUser}</span>
                              <span className="text-xs text-muted-foreground">
                                {formatTimeAgo(message.timestamp)}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground truncate mt-1">
                              {message.content}
                            </p>
                          </div>
                          {!message.isRead && (
                            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="mt-0 p-4">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Notifications</h2>

            {notifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No notifications yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {notifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={`glass-card cursor-pointer hover:border-primary/30 transition-colors ${
                      !notification.isRead ? 'bg-primary/5 border-primary/20' : ''
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-primary text-white font-semibold">
                              {notification.fromUser.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-primary">@{notification.fromUser}</span>
                              <span className="text-xs text-muted-foreground">
                                {formatTimeAgo(notification.timestamp)}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {notification.content}
                            </p>
                          </div>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}