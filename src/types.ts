export interface User {
  id: string
  username: string
  email: string
  displayName: string
  bio?: string
  profilePicture?: string
  isVerified: boolean
  isAdmin: boolean
  createdAt: Date
  followers: string[]
  following: string[]
  streak: number
  totalLikes: number
  settings: {
    theme: 'light' | 'dark'
    messaging: 'anyone' | 'followers' | 'friends'
    allowTagging: boolean
    profileVisibility: 'public' | 'private'
  }
}

export interface ChecklistItem {
  id: string
  userId: string
  text: string
  isCompleted: boolean
  isPublic: boolean
  type: 'daily' | 'oneoff'
  createdAt: Date
  completedAt?: Date
}

export interface Post {
  id: string
  userId: string
  username: string
  content: string
  type: 'checklist' | 'manual'
  checklistItemId?: string
  isPublic: boolean
  createdAt: Date
  likes: string[]
  comments: Comment[]
  pinnedCommentId?: string
}

export interface Comment {
  id: string
  postId: string
  userId: string
  username: string
  content: string
  likes: string[]
  createdAt: Date
  isCreator: boolean
}

export interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  isRead: boolean
  createdAt: Date
}

export interface Notification {
  id: string
  userId: string
  type: 'like' | 'comment' | 'follow' | 'mention'
  fromUserId: string
  fromUsername: string
  postId?: string
  isRead: boolean
  createdAt: Date
  content: string
}

export interface Report {
  id: string
  reporterId: string
  targetType: 'post' | 'comment' | 'user'
  targetId: string
  reason: string
  status: 'pending' | 'resolved' | 'dismissed'
  createdAt: Date
}