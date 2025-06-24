import { Post, ChecklistItem } from '../types'

// In a real app, this would be stored in a database
let postsStore: Post[] = []

export const createChecklistPost = (item: ChecklistItem, username: string): Post => {
  const post: Post = {
    id: `post-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId: item.userId,
    username: username,
    content: `Completed: ${item.text}`,
    type: 'checklist',
    checklistItemId: item.id,
    isPublic: item.isPublic,
    createdAt: new Date(),
    likes: [],
    comments: []
  }

  postsStore.push(post)
  return post
}

export const getUserPosts = (userId: string, isPublic?: boolean): Post[] => {
  return postsStore.filter(post => {
    if (post.userId !== userId) return false
    if (isPublic !== undefined) return post.isPublic === isPublic
    return true
  }).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

export const getAllPosts = (): Post[] => {
  return [...postsStore].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

export const deletePost = (postId: string): boolean => {
  const initialLength = postsStore.length
  postsStore = postsStore.filter(post => post.id !== postId)
  return postsStore.length < initialLength
}

export const deletePostsByChecklistItem = (checklistItemId: string): number => {
  const initialLength = postsStore.length
  postsStore = postsStore.filter(post => post.checklistItemId !== checklistItemId)
  return initialLength - postsStore.length
}

// Initialize with some mock data for demo purposes
const initializeMockPosts = () => {
  if (postsStore.length === 0) {
    const mockPosts: Post[] = [
      {
        id: 'demo-post-1',
        userId: 'current-user',
        username: 'currentuser',
        content: 'Completed: Read for 30 minutes',
        type: 'checklist',
        checklistItemId: 'demo-item-1',
        isPublic: false, // Private post
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        likes: [],
        comments: []
      },
      {
        id: 'demo-post-2',
        userId: 'current-user',
        username: 'currentuser',
        content: 'Completed: Morning workout',
        type: 'checklist',
        checklistItemId: 'demo-item-2',
        isPublic: true, // Public post
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
        likes: ['user1'],
        comments: []
      }
    ]
    postsStore.push(...mockPosts)
  }
}

// Initialize mock data
initializeMockPosts()