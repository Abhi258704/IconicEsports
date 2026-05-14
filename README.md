🎮 Esports Tournament Management Platform

A full-stack esports tournament management platform built for managing BGMI scrims, tournaments, rounds, groups, matches, leaderboards, and team progression.

Built with a modern admin-first workflow focused on real tournament operations.

✨ Features
🏆 Tournament Management
Create and manage tournaments
Upload tournament banners
Configure:
prize pool
entry fee
maps
team size
max teams
Tournament status management

👥 Team Registration System
Team registration flow
Google authentication
Team verification/rejection
Auto group assignment on verification
Duplicate registration prevention

🧩 Automatic Group Management
Auto-create groups dynamically
Auto-balance teams
Move teams between groups
Group-based qualification system

🎯 Match Management
Create single/multiple matches
Match scheduling system
IDP time support
Room ID/password publishing
Match start time support
Edit match details
Match lifecycle statuses:
Scheduled
Ongoing
Completed

📊 Leaderboard System
Match result submission
Placement + kill points
Auto total point calculation
Live aggregated leaderboards
Group qualification system

🔐 Authentication & Authorization
Google OAuth login
JWT authentication
Admin-only protected routes
Secure tournament operations
🛠️ Tech Stack
Frontend
Next.js
React
Tailwind CSS
Axios
React Hot Toast
Lucide React Icons
Backend
Node.js
Express.js
MongoDB
Mongoose
JWT Authentication
Cloud
Cloudinary (image uploads)

📁 Project Structure
client/
 ├── app/
 ├── components/
 ├── lib/
 └── styles/

server/
 ├── controllers/
 ├── models/
 ├── routes/
 ├── middlewares/
 ├── utils/
 └── config/
 
⚡ Core Workflow
Tournament Created
        ↓
Teams Register
        ↓
Admin Verifies Teams
        ↓
Auto Group Assignment
        ↓
Create Matches
        ↓
Publish Room ID/Password
        ↓
Match Starts
        ↓
Submit Results
        ↓
Leaderboard Updates
        ↓
Teams Qualify To Next Round

🚀 Installation

1. Clone Repository
git clone <your-repo-url>

2. Install Dependencies
Frontend
cd client
npm install
Backend
cd server
npm install

🔑 Environment Variables

Create .env inside server:

PORT=8000

MONGODB_URI=

JWT_SECRET=

GOOGLE_CLIENT_ID=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

▶️ Run Project
Backend
npm run dev
Frontend
npm run dev

📌 Current Status

✅ Tournament system
✅ Team verification workflow
✅ Automatic group generation
✅ Match management
✅ Leaderboard aggregation
✅ Qualification system
✅ Secure admin routes
✅ Room ID/password management

🔮 Planned Features
Realtime leaderboard updates
Socket.io support
Public tournament pages
Public live standings
Notifications
Scrim automation
Tournament analytics
Match logs/audit system
Mobile responsive optimization


👨‍💻 Author
Built by Abhishek Singh

