import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, Calendar } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Checkbox } from '../ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog'
import { User, ChecklistItem } from '../../types'
import { createChecklistPost, deletePostsByChecklistItem } from '../../utils/posts'
import { getChecklistItems, addChecklistItem, deleteChecklistItem, toggleChecklistItem, subscribeToChecklistUpdates } from '../../utils/checklist'
import toast from 'react-hot-toast'

interface ChecklistProps {
  user: User
}

export default function Checklist({ user }: ChecklistProps) {
  const [items, setItems] = useState<ChecklistItem[]>([])
  const [newItemText, setNewItemText] = useState('')
  const [newItemType, setNewItemType] = useState<'daily' | 'oneoff'>('daily')
  const [newItemVisibility, setNewItemVisibility] = useState<'public' | 'private'>('public')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  useEffect(() => {
    // Load initial items
    setItems(getChecklistItems(user.id))
    
    // Subscribe to updates
    const unsubscribe = subscribeToChecklistUpdates(() => {
      setItems(getChecklistItems(user.id))
    })
    
    return unsubscribe
  }, [user.id])

  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })

  const handleToggleItem = (itemId: string) => {
    const updatedItem = toggleChecklistItem(itemId)
    if (updatedItem && updatedItem.isCompleted) {
      // Create a post when item is completed
      createChecklistPost(updatedItem, user.username)
      setTimeout(() => {
        const feedType = updatedItem.isPublic ? 'public' : 'private'
        toast.success(`Task completed! Post created in your ${feedType} feed.`)
      }, 0)
    }
  }

  const handleAddItem = () => {
    if (!newItemText.trim()) {
      toast.error('Please enter a task description')
      return
    }

    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      userId: user.id,
      text: newItemText.trim(),
      isCompleted: false,
      isPublic: newItemVisibility === 'public',
      type: newItemType,
      createdAt: new Date()
    }

    addChecklistItem(newItem)
    setNewItemText('')
    setIsAddDialogOpen(false)
    setTimeout(() => {
      toast.success('Task added successfully!')
    }, 0)
  }

  const handleDeleteItem = (itemId: string) => {
    const item = items.find(i => i.id === itemId)
    const deleted = deleteChecklistItem(itemId)
    
    if (deleted && item?.isCompleted) {
      // Delete associated posts
      const deletedCount = deletePostsByChecklistItem(itemId)
      setTimeout(() => {
        toast.success(`Task deleted along with ${deletedCount} associated post${deletedCount !== 1 ? 's' : ''}`)
      }, 0)
    } else if (deleted) {
      setTimeout(() => {
        toast.success('Task deleted')
      }, 0)
    }
  }

  return (
    <div className="min-h-full p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Daily Checklist</h1>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
            <Calendar className="h-4 w-4" />
            <span>{today}</span>
          </div>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="lock-in-gradient border-0">
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
              <DialogDescription>
                Create a new accountability task for your checklist.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="task">Task Description</Label>
                <Input
                  id="task"
                  placeholder="e.g., Morning meditation (10 minutes)"
                  value={newItemText}
                  onChange={(e) => setNewItemText(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={newItemType} onValueChange={(value: 'daily' | 'oneoff') => setNewItemType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="oneoff">One-off</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Visibility</Label>
                  <Select value={newItemVisibility} onValueChange={(value: 'public' | 'private') => setNewItemVisibility(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground italic">
                List will be reset at 4am every day. Daily items will untick & one-off items will be removed. Add your daily one-offs every day.
              </p>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddItem} className="lock-in-gradient border-0">
                  Add Task
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Checklist Items */}
      <div className="space-y-3">
        {items.length === 0 ? (
          <Card className="glass-card">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Plus className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-2">No tasks yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create your first accountability task to get started!
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)} className="lock-in-gradient border-0">
                Add Your First Task
              </Button>
            </CardContent>
          </Card>
        ) : (
          items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`glass-card transition-all duration-200 ${
                item.isCompleted ? 'bg-primary/5 border-primary/20' : ''
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <Checkbox
                        checked={item.isCompleted}
                        onCheckedChange={(checked) => {
                          // Ensure the state update happens asynchronously
                          if (typeof checked === 'boolean') {
                            handleToggleItem(item.id)
                          }
                        }}
                        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <div className="flex-1">
                        <p className={`text-sm ${
                          item.isCompleted 
                            ? 'line-through text-muted-foreground' 
                            : 'text-foreground font-medium'
                        }`}>
                          {item.text}
                        </p>
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
                    </div>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Task</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{item.text}"?
                            {item.isCompleted && (
                              <span className="block mt-2 text-xs">
                                Note: Associated posts will be preserved in your feed.
                              </span>
                            )}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDeleteItem(item.id)}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Stats */}
      {items.length > 0 && (
        <Card className="glass-card mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Today's Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">
                  {items.filter(item => item.isCompleted).length}
                </div>
                <div className="text-xs text-muted-foreground">Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {items.length}
                </div>
                <div className="text-xs text-muted-foreground">Total Tasks</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">
                  {items.length > 0 ? Math.round((items.filter(item => item.isCompleted).length / items.length) * 100) : 0}%
                </div>
                <div className="text-xs text-muted-foreground">Complete</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}