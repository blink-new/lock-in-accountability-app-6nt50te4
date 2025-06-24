import { NavLink } from 'react-router-dom'
import { Home, Users, MessageCircle, User, CheckSquare } from 'lucide-react'
import { cn } from '../../lib/utils'

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/users', icon: Users, label: 'Users' },
  { to: '/inbox', icon: MessageCircle, label: 'Inbox' },
  { to: '/checklist', icon: CheckSquare, label: 'Checklist' },
  { to: '/profile', icon: User, label: 'Profile' }
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-sm border-t">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-all duration-200 text-xs font-medium",
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon 
                  className={cn(
                    "h-5 w-5 mb-1 transition-all duration-200",
                    isActive && "scale-110"
                  )} 
                />
                <span className="text-[10px] leading-none">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}