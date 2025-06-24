import { ChecklistItem } from '../types'

// In a real app, this would be stored in a database
let checklistStore: ChecklistItem[] = [
  {
    id: '1',
    userId: 'current-user',
    text: 'Morning meditation (10 minutes)',
    isCompleted: true,
    isPublic: true,
    type: 'daily',
    createdAt: new Date(),
    completedAt: new Date()
  },
  {
    id: '2',
    userId: 'current-user',
    text: '5K morning run',
    isCompleted: false,
    isPublic: true,
    type: 'daily',
    createdAt: new Date()
  },
  {
    id: '3',
    userId: 'current-user',
    text: 'Call mom',
    isCompleted: false,
    isPublic: false,
    type: 'oneoff',
    createdAt: new Date()
  }
]

// Event listeners for real-time updates
const listeners: Array<() => void> = []

export const subscribeToChecklistUpdates = (callback: () => void) => {
  listeners.push(callback)
  return () => {
    const index = listeners.indexOf(callback)
    if (index > -1) {
      listeners.splice(index, 1)
    }
  }
}

const notifyListeners = () => {
  listeners.forEach(callback => callback())
}

export const getChecklistItems = (userId: string): ChecklistItem[] => {
  return checklistStore.filter(item => item.userId === userId)
}

export const addChecklistItem = (item: ChecklistItem): ChecklistItem => {
  checklistStore.push(item)
  notifyListeners()
  return item
}

export const updateChecklistItem = (itemId: string, updates: Partial<ChecklistItem>): ChecklistItem | null => {
  const index = checklistStore.findIndex(item => item.id === itemId)
  if (index === -1) return null
  
  checklistStore[index] = { ...checklistStore[index], ...updates }
  notifyListeners()
  return checklistStore[index]
}

export const deleteChecklistItem = (itemId: string): boolean => {
  const initialLength = checklistStore.length
  checklistStore = checklistStore.filter(item => item.id !== itemId)
  if (checklistStore.length < initialLength) {
    notifyListeners()
    return true
  }
  return false
}

export const toggleChecklistItem = (itemId: string): ChecklistItem | null => {
  const item = checklistStore.find(item => item.id === itemId)
  if (!item) return null
  
  const updatedItem = {
    ...item,
    isCompleted: !item.isCompleted,
    completedAt: !item.isCompleted ? new Date() : undefined
  }
  
  return updateChecklistItem(itemId, updatedItem)
}