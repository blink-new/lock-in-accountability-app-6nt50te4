# Lock In - Social Accountability Platform

## Design Vision
A sleek, modern social accountability app with a striking black & purple theme that motivates users through peer support and community engagement. The design emphasizes simplicity, accountability, and social connection.

## Core Features (MVP)
1. **Authentication System** - Login/register with username, email, password
2. **Daily Checklist System** - Users create and manage daily accountability tasks
3. **Social Feed** - Share progress, view friends' achievements
4. **Profile & Streak Tracking** - Visual progress indicators and user profiles
5. **Basic Social Features** - Follow/unfollow, likes, comments

## Visual Style
- **Theme**: Cyberpunk-inspired dark design with purple accents
- **Colors**: Deep black backgrounds (#0a0a0a), electric purple (#8b5cf6), white text
- **Typography**: Clean, modern sans-serif (Inter) with bold headers
- **Layout**: Mobile-first responsive design with bottom navigation
- **Animations**: Smooth micro-interactions for engagement

## Key Screens
1. **Login/Register** - Elegant auth forms with purple CTA buttons
2. **Home Feed** - Three tabs: Friends, Following, Lock In algorithm
3. **Checklist** - Daily task management with visual progress
4. **Profile** - User stats, streak counter, bio, settings
5. **Users/Leaderboard** - Community rankings by streaks and engagement
6. **Inbox** - Messages and notifications hub

## User Journey
1. User registers → Auto-follows @jennie (verified admin)
2. Creates daily checklist items (public/private, daily/one-off)
3. Checks off tasks → Auto-creates social posts
4. Engages with community → Builds streaks and connections
5. Maintains accountability through peer support

## Technical Approach
- React with TypeScript for type safety
- Local state management initially (can add Supabase later)
- Responsive design with Tailwind CSS
- ShadCN components for consistency
- Mobile-optimized with PWA capabilities