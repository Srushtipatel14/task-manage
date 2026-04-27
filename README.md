🚀 Task Management System (MERN Stack)

A full-stack task management application built using Next.js (Frontend) and Node.js + Express (Backend) with MongoDB as the database.

📁 Project Structure
root/
│
├── frontend/        # Next.js frontend
├── backend/         # Node.js backend


🛠️ Tech Stack

Frontend
Next.js (App Router)
React.js

CSS

Backend: Node.js,Express.js,MongoDB,JWT Authentication,Socket.io (Real-time updates)

⚙️ Installation & Setup
1️⃣ Clone the Repository
git clone <your-repo-url>
cd <project-folder>
🔹 Backend Setup
cd backend
npm install
▶️ Run Backend

You can run backend using:

nodemon app.js

OR

node index.js
🔐 Environment Variables (.env)

Create a .env file inside backend

🔹 Frontend Setup

cd frontend
npm install


▶️ Run Frontend
npm run dev

Frontend will run on: http://localhost:3000

📡 Features

👤 User Authentication (Login / Signup)
🔐 Role-based Access (Admin/User)
📝 Task Management
📩 Real-time Task Updates (Socket.io)
📦 Organized Backend Structure
🔄 JWT-based Authorization


📂 Backend Structure

backend/src/
│
├── config/         # Database connection
├── controllers/    # Business logic
│   ├── admin/
│   ├── auth/
│   └── user/
├── helpers/        # Utilities & JWT
├── middlewares/    # Auth middlewares
├── models/         # Mongoose models
├── routes/         # API routes
├── socket/         # Socket.io logic
├── app.js          # App config
├── index.js        # Server entry point


📂 Frontend Structure


frontend/
│
├── app/
│   ├── signin/
│   ├── signup/
│   ├── components/
│   ├── utils/
│   ├── layout.tsx
│   └── page.tsx

