# 🏗️ Architecture Diagrams & Visual Guides

## Complete Application Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                      FRONTEND (React + TypeScript)               │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    React Components                       │ │
│  │                                                            │ │
│  │  ┌─────────────┬──────────────┬──────────────┐            │ │
│  │  │ AuthPage    │ KanbanBoard  │ BacklogTable │ ...        │ │
│  │  └──────┬──────┴──────┬───────┴──────┬───────┘            │ │
│  │         │             │              │                    │ │
│  └─────────┼─────────────┼──────────────┼────────────────────┘ │
│            │             │              │                      │
│  ┌─────────▼─────────────▼──────────────▼────────────────────┐ │
│  │         Custom Hooks (useAuth, useTask, ...)             │ │
│  └──────────────────┬───────────────────────────────────────┘ │
│                     │                                         │
│  ┌──────────────────▼───────────────────────────────────────┐ │
│  │           Redux Store (State Management)                │ │
│  │  ┌────────────────────────────────────────────────────┐ │
│  │  │ ✅ tasks       ❌ projects   ❌ auth              │ │
│  │  │ ❌ comments    ❌ activities                       │ │
│  │  └────────────────────────────────────────────────────┘ │
│  └──────────────────┬───────────────────────────────────────┘ │
│                     │                                         │
│  ┌──────────────────▼───────────────────────────────────────┐ │
│  │      API Service Layer (axios instances)                │ │
│  │  ┌────────────────────────────────────────────────────┐ │
│  │  │ ✅ taskApi    ❌ projectApi   ❌ authApi          │ │
│  │  │ ❌ commentApi ❌ activityApi                       │ │
│  │  └────────────────────────────────────────────────────┘ │
│  └──────────────────┬───────────────────────────────────────┘ │
│                     │                                         │
│  ┌──────────────────▼───────────────────────────────────────┐ │
│  │  TypeScript Types & Interfaces (7 files needed)         │ │
│  │  └────────────────────────────────────────────────────┘ │
│                                                              │
└──────────────────────────────┬───────────────────────────────┘
                               │ HTTP
                               │ (JWT in headers)
                               ▼
┌──────────────────────────────────────────────────────────────────┐
│                   BACKEND (Node.js + Express)                   │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    Express Routes                         │ │
│  │                                                            │ │
│  │  /api/auth/*     /api/projects/*     /api/tasks/*         │ │
│  │  ✅              ✅                   ✅                   │ │
│  │  ❌ /api/comments/*     ❌ /api/activities/*              │ │
│  └──────────────────────┬───────────────────────────────────┘ │
│                         │                                      │
│  ┌──────────────────────▼───────────────────────────────────┐ │
│  │              Middleware Stack                            │ │
│  │  ┌────────────────────────────────────────────────────┐ │
│  │  │ ✅ CORS        ✅ Auth Validation                  │ │
│  │  │ ❌ Error       ❌ Input Validation                 │ │
│  │  │ ❌ RBAC        ❌ Error Handler                    │ │
│  │  └────────────────────────────────────────────────────┘ │
│  └──────────────────────┬───────────────────────────────────┘ │
│                         │                                      │
│  ┌──────────────────────▼───────────────────────────────────┐ │
│  │               Controllers (❌ ALL MISSING)               │ │
│  │  ┌────────────────────────────────────────────────────┐ │
│  │  │ authController    projectController               │ │
│  │  │ taskController    commentController               │ │
│  │  │ activityController                                │ │
│  │  └────────────────────────────────────────────────────┘ │
│  └──────────────────────┬───────────────────────────────────┘ │
│                         │                                      │
│  ┌──────────────────────▼───────────────────────────────────┐ │
│  │                Services (❌ ALL MISSING)                 │ │
│  │  ┌────────────────────────────────────────────────────┐ │
│  │  │ Handles business logic, DB queries                 │ │
│  │  │ authService, projectService, taskService...       │ │
│  │  └────────────────────────────────────────────────────┘ │
│  └──────────────────────┬───────────────────────────────────┘ │
│                         │                                      │
│  ┌──────────────────────▼───────────────────────────────────┐ │
│  │              Data Models (Mongoose)                      │ │
│  │  ┌────────────────────────────────────────────────────┐ │
│  │  │ ✅ User         ✅ Project       ✅ Task           │ │
│  │  │ ✅ ActivityLog  ❌ Comment                          │ │
│  │  └────────────────────────────────────────────────────┘ │
│  └──────────────────────┬───────────────────────────────────┘ │
│                         │                                      │
│  ┌──────────────────────▼───────────────────────────────────┐ │
│  │                    MongoDB Database                      │ │
│  │           (Collections for each model)                   │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
└──────────────────────────────────────────────────────────────────┘
```

---

## Data Flow: Creating a Task

```
User Input (Create Task Form)
    │
    ▼
Component dispatches Redux Action
    │
    ├─→ Redux optimistic update (show in UI immediately)
    │
    ▼
Calls taskApi.create(taskData)
    │
    ├─→ Adds JWT token to header
    ├─→ Makes POST /api/tasks
    │
    ▼
Backend Route Handler (/api/tasks POST)
    │
    ├─→ Auth Middleware (verify JWT)
    ├─→ Validation Middleware (check fields)
    │
    ▼
Task Controller
    ├─→ Calls taskService.createTask()
    │
    ▼
Task Service
    ├─→ Creates ActivityLog entry
    ├─→ Saves Task to MongoDB
    │
    ▼
Response returned to Frontend
    │
    ├─→ HTTP 201 Created + task data
    │
    ▼
Frontend Redux Store Updated
    │
    ├─→ tasksSlice receives new task
    ├─→ Component re-renders
    ├─→ User sees new task in Kanban
    │
    ▼
Activity Log Updated
    ├─→ Fetches latest activities
    ├─→ Displays "Task created by User"
    │
    ▼
✅ Complete!
```

---

## State Flow: Drag & Drop Task

```
┌─────────────────────────────────────────────────────────┐
│ User drags task from "TODO" to "IN_PROGRESS"           │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
     ┌──────────────────────────────────────┐
     │ useDragDrop hook captures:           │
     │ - draggedTaskId: "T-101"             │
     │ - oldStatus: "todo"                  │
     │ - newStatus: "in-progress"           │
     └──────────────────────────────────────┘
                        │
                        ▼
     ┌──────────────────────────────────────┐
     │ Dispatch Redux Action:               │
     │ updateTaskStatus(                    │
     │   {taskId, newStatus}                │
     │ )                                    │
     └──────────────────────────────────────┘
                        │
            ┌───────────┴───────────┐
            │                       │
            ▼                       ▼
    ┌──────────────────┐  ┌──────────────────┐
    │ Redux updates    │  │ Call API:        │
    │ local state      │  │ PATCH /api/tasks │
    │ (optimistic)     │  │ /T-101           │
    └──────────────────┘  │ {status: ...}    │
            │             └──────────────────┘
            │                     │
            └─────────────┬───────┘
                          │
                          ▼
            ┌──────────────────────────────────┐
            │ Backend updates MongoDB          │
            │ & creates ActivityLog            │
            └──────────────────────────────────┘
                          │
                          ▼
            ┌──────────────────────────────────┐
            │ Response: {status: 200, task}    │
            └──────────────────────────────────┘
                          │
                          ▼
            ┌──────────────────────────────────┐
            │ Redux confirms update            │
            │ Component re-renders             │
            │ Task appears in new column       │
            └──────────────────────────────────┘
                          │
                          ▼
                    ✅ Complete!
```

---

## Redux State Tree Structure

```
RootState
├── tasks: {
│   ├── items: Task[] ✅
│   ├── loading: boolean ✅
│   ├── error: string | null ✅
│   └── currentTask: Task | null ✅
├── projects: {  ❌ MISSING
│   ├── items: Project[]
│   ├── loading: boolean
│   ├── error: string | null
│   └── currentProject: Project | null
├── auth: {  ❌ MISSING
│   ├── user: User | null
│   ├── token: string | null
│   ├── isAuthenticated: boolean
│   └── loading: boolean
├── comments: {  ❌ MISSING
│   ├── items: Comment[]
│   ├── loading: boolean
│   └── byTaskId: { [taskId]: Comment[] }
├── activities: {  ❌ MISSING
│   ├── items: Activity[]
│   ├── loading: boolean
│   └── byTaskId: { [taskId]: Activity[] }
└── dragDrop: {  ❌ OPTIONAL
    ├── activeDragId: string | null
    ├── sourceColumn: string
    └── targetColumn: string
```

---

## Component Hierarchy

```
App
├── Layout
│   ├── Header
│   │   ├── Logo
│   │   ├── UserMenu
│   │   └── Notifications
│   ├── Sidebar
│   │   ├── ProjectList
│   │   └── Navigation
│   └── MainContent
│       ├── AuthPage (conditional)
│       ├── ProjectView
│       │   ├── Tabs (Kanban, Backlog, etc.)
│       │   ├── KanbanBoard
│       │   │   ├── KanbanColumn (x5)
│       │   │   │   └── TaskCard (draggable)
│       │   │   │       └── TaskPreview
│       │   └── BacklogTable
│       │       ├── DataGrid
│       │       └── TaskRow
│       └── TaskDetailsPanel (modal/drawer)
│           ├── TaskHeader
│           ├── TaskForm
│           ├── CommentSection
│           │   ├── CommentList
│           │   │   └── CommentItem
│           │   └── CommentForm
│           └── ActivityFeed
│               └── ActivityItem
└── ErrorBoundary
    └── ErrorFallback
```

---

## Database Schema Relationships

```
User
├── _id: ObjectId
├── name: String
├── email: String
├── password: String (hashed)
├── role: String (admin|member)
└── timestamps

Project
├── _id: ObjectId
├── name: String
├── description: String
├── owner: Reference → User._id
├── members: [Reference → User._id]
└── timestamps

Task
├── _id: ObjectId
├── project: Reference → Project._id
├── title: String
├── description: String
├── status: String (backlog|todo|in-progress|review|done)
├── priority: String (low|medium|high|urgent)
├── assignee: Reference → User._id
├── reporter: Reference → User._id
├── dueDate: Date
├── comments: [Reference → Comment._id]
├── activity: [Reference → ActivityLog._id]
└── timestamps

Comment ❌ MISSING SCHEMA
├── _id: ObjectId
├── task: Reference → Task._id
├── author: Reference → User._id
├── content: String
├── edited: Boolean
└── timestamps

ActivityLog
├── _id: ObjectId
├── task: Reference → Task._id
├── project: Reference → Project._id
├── user: Reference → User._id
├── action: String
├── details: String
└── createdAt: Date
```

---

## API Endpoint Structure

```
/api/
├── /auth
│   ├── POST   /register          ✅
│   ├── POST   /login             ✅
│   ├── POST   /refresh-token     ✅
│   └── POST   /logout            ✅
│
├── /projects
│   ├── GET    /                  ✅
│   ├── GET    /:id               ✅
│   ├── POST   /                  ✅
│   ├── PUT    /:id               ✅
│   ├── DELETE /:id               ✅
│   ├── POST   /:id/members       ✅
│   └── DELETE /:id/members/:uid  ✅
│
├── /tasks
│   ├── GET    /                  ✅
│   ├── GET    /:id               ✅
│   ├── POST   /                  ✅
│   ├── PATCH  /:id               ✅
│   ├── DELETE /:id               ✅
│   ├── GET    /:id/comments      ✅
│   └── GET    /:id/activity      ✅
│
├── /comments ❌ MISSING
│   ├── POST   /                  ❌
│   ├── PUT    /:id               ❌
│   ├── DELETE /:id               ❌
│   └── GET    /:id               ❌
│
└── /activities ❌ MISSING
    ├── GET    /                  ❌
    ├── GET    /:taskId           ❌
    └── GET    /:projectId        ❌
```

---

## Tier 1 Implementation Dependency Graph

```
Comment Model
    │
    ├────────────┬─────────────┬──────────────┐
    │            │             │              │
    ▼            ▼             ▼              ▼
authSlice  projectsSlice  commentsSlice  activitiesSlice
    │            │             │              │
    └────────────┼─────────────┼──────────────┘
                 │
                 ▼
          store.ts (update)
                 │
                 ├────────────┬─────────────┬──────────────┬─────────────┐
                 │            │             │              │             │
                 ▼            ▼             ▼              ▼             ▼
            authApi.ts  projectApi.ts  commentApi.ts  activityApi.ts  index.ts
                 │            │             │              │
                 └────────────┼─────────────┼──────────────┘
                              │
                    Backend Controllers (all 5)
                              │
                    Backend Services (all 5)
                              │
                    Type Definitions (all 7)
                              │
                         Custom Hooks
                              │
                         Components Update
```

---

## Authentication Flow

```
┌─────────────────────┐
│  User Login Page    │
└──────────┬──────────┘
           │ POST /api/auth/login
           │ {email, password}
           ▼
┌─────────────────────────────┐
│ Backend Auth Controller     │
│ - Hash password check       │
│ - Generate JWT token       │
│ - Return {user, token}     │
└──────────┬──────────────────┘
           │
           ▼
┌──────────────────────────────┐
│ Frontend Redux authSlice     │
│ - Store user + token        │
│ - Save to localStorage       │
│ - Set isAuthenticated=true  │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│ All API Calls                │
│ - Add token to header        │
│ Authorization: Bearer {token}│
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│ Backend Auth Middleware      │
│ - Verify JWT signature       │
│ - Decode user ID             │
│ - Continue to controller     │
└──────────────────────────────┘
```

---

## Kanban Board State Management

```
Component State:
- activeDragId: string | null
- sourceColumn: string
- targetColumn: string

Redux State:
- tasks: Task[]  (with status field)

When Drag Ends:
1. Find task by ID
2. Update task.status = newStatus
3. Dispatch Redux action
4. Call API to persist
5. Re-render component
6. Log activity
```

---

## Error Handling Flow

```
User Action
    │
    ▼
Try/Catch Block
    │
    ├─→ Success
    │   └─→ Update Redux
    │       └─→ Show Success Toast
    │
    └─→ Error
        ├─→ Extract error message
        ├─→ Dispatch error to Redux
        ├─→ Show Error Toast
        └─→ Log for debugging
```

---

## Production Deployment Overview

```
Frontend Deployment
├─ Build: npm run build
├─ Output: dist/ folder
├─ Deploy to: Vercel/Netlify
└─ Env: VITE_API_URL=https://api.example.com

Backend Deployment
├─ Deploy to: Heroku/AWS/Azure
├─ Env: MONGODB_URI, JWT_SECRET, PORT
├─ Start: node server.js
└─ Scale: Multiple instances with load balancer

Database
└─ MongoDB Atlas (cloud) or self-hosted

Result: Full-stack application accessible worldwide! 🌍
```

---

**Use these diagrams as reference while implementing!**
