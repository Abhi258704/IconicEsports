# 🎮 Esports Tournament Management Platform


🔗 Live: https://iconic-esports.vercel.app  


A full-stack esports tournament management platform built for managing BGMI scrims, tournaments, rounds, groups, matches, leaderboards, qualification workflows, and LAN-scale tournament operations.

Designed with a modern admin-first workflow focused on real esports tournament management.

---

# 🚀 Highlights

- Full tournament lifecycle management
- Automatic group generation system
- Match scheduling & room management
- Qualification & progression workflows
- Rollback-safe tournament operations
- Transaction-safe critical workflows
- Live leaderboard aggregation
- Secure admin-only operations
- Production-oriented backend architecture

---

# ✨ Features

# 🏆 Tournament Management

- Create and manage tournaments
- Tournament banner uploads
- Configure:
  - Prize pool
  - Entry fee
  - Team size
  - Max teams
  - Maps
  - Teams per group
- Tournament status management
- Soft-delete tournament system

---

# 👥 Team Registration & Verification

- Google OAuth authentication
- JWT-based authentication
- Team registration system
- Duplicate registration prevention
- Team verification/rejection workflows
- Automatic group assignment
- Manual team assignment system
- Team progression tracking

---

# 🧩 Group & Qualification System

- Dynamic group generation
- Automatic team balancing
- Move teams between groups
- Qualification locking system
- Qualification rollback system
- Next-round progression engine
- Elimination tracking
- Tournament state protection

---

# 🎯 Match Management

- Match creation system
- Match scheduling
- Room ID/password publishing
- Match start time support
- Edit match details
- Match result submission
- Placement + kill point system
- Automatic total point calculation
- Match lifecycle statuses:
  - Upcoming
  - Live
  - Completed

---

# 📊 Leaderboard System

- Group leaderboard aggregation
- Placement-based ranking
- Kill-point support
- Automatic tie-breaking logic
- Aggregated standings using MongoDB pipelines

---

# 🔐 Security Features

- JWT authentication
- Admin authorization middleware
- Helmet security headers
- Mongo sanitize protection
- HPP protection
- Rate limiting
- Request validation using Zod
- Protected admin routes

---

# ⚡ Backend Architecture

Built with scalable backend practices:

- Service layer architecture
- Thin controller pattern
- Transaction-safe workflows
- Centralized error handling
- Reusable transaction utility
- Validation middleware
- Indexed MongoDB schemas
- Workflow integrity protection

---

# 🛠️ Tech Stack

# Frontend

- Next.js
- React.js
- Tailwind CSS
- Axios
- React Hot Toast
- Lucide React

---

# Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Zod Validation

---

# Cloud & Services

- Cloudinary
- MongoDB Atlas

---

# 📁 Project Structure

```bash
client/
├── app/
├── components/
├── lib/
├── hooks/
├── services/
└── styles/

server/
├── controllers/
├── services/
├── models/
├── routes/
├── middlewares/
├── validators/
├── utils/
├── constants/
└── config/
```

---

# 🔄 Core Tournament Workflows

## Team Verification Workflow

- Verify pending teams
- Auto assign into groups
- Prevent duplicate assignment
- Handle ongoing tournaments safely

---

## Qualification Workflow

- Lock qualification state
- Move teams to next rounds
- Eliminate non-qualified teams
- Prevent post-lock result editing

---

## Rollback Workflow

- Rollback-safe qualification system
- Transaction-safe rollback operations
- Prevent rollback after next round starts

---

# 🧠 Backend Engineering Features

- MongoDB transactions
- Database indexing
- Concurrency-safe operations
- Rollback-safe workflows
- Service-based business logic
- Aggregation pipelines
- Middleware-driven architecture

---

# 📌 Current Status

✅ Tournament system  
✅ Team verification workflow  
✅ Automatic group generation  
✅ Match management  
✅ Leaderboard aggregation  
✅ Qualification system  
✅ Rollback system  
✅ Transaction-safe workflows  
✅ Service-layer architecture  
✅ Validation middleware  
✅ Security middleware  
✅ Room ID/password management  
✅ MongoDB indexing optimization  

---

# 🔮 Planned Features

- Realtime leaderboard updates
- Socket.IO integration
- Public tournament pages
- Public live standings
- Tournament analytics
- Match audit logs
- Notifications system
- Excel export system
- Admin activity logs
- Redis caching
- LAN event management tools
- Mobile optimization

---

# 🚀 Deployment

## Frontend
- Vercel

## Backend
- Render 

## Database
- MongoDB Atlas

---

# 👨‍💻 Author

Built by Abhishek Singh

Software Engineering Student | Full Stack Developer | Esports Tech Builder

---
