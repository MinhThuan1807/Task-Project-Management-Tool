<div align="center">

# 🚀 Task Project Management Tool (SprintSOS)

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Redux](https://img.shields.io/badge/Redux_Toolkit-2.0-764ABC?style=for-the-badge&logo=redux)](https://redux-toolkit.js.org/)

### A modern Agile Project Management platform built with Next.js App Router + TypeScript

### Designed to manage projects, sprints, tasks, team collaboration, and real-time communication.

[🔗 Live Demo](https://sprintos.fittrackwk.online/) • [🔗 Backend Repository](https://github.com/QUANG221222/Sprintos-API) • [📦 Frontend Repository](https://github.com/MinhThuan1807/Task-Project-Management-Tool)

</div>

---

## 📋 Table of Contents

- [📌 Overview](#-overview)
- [🛠 Tech Stack](#-tech-stack)
- [✨ Core Features](#-core-features)
- [🧠 Architecture Overview](#-architecture-overview)
- [🚀 Getting Started](#-getting-started)
- [📈 Performance Considerations](#-performance-considerations)
- [🎯 What I Learned](#-what-i-learned)
- [📌 Future Improvements](#-future-improvements)
- [👨‍💻 Author](#-author)
- [⭐ Why This Project Matters](#-why-this-project-matters)

---

## 📌 Overview

This project is a **full-featured Agile Project Management Tool** inspired by Jira/Trello-style workflows.

### 🎯 It allows teams to:

- ✅ **Manage** projects & members
- ✅ **Plan and track** sprints
- ✅ **Organize** tasks with Kanban boards
- ✅ **Monitor** performance via reports
- ✅ **Collaborate** via real-time chat

### 🎓 The goal of this project was to:

- 🎯 Practice building a **production-like fullstack architecture**
- 🎯 Apply **modern React patterns**
- 🎯 Optimize **performance & state management**
- 🎯 Implement **real-time communication**

---

## 🛠 Tech Stack

### Frontend

| Technology                   | Purpose                       |
| ---------------------------- | ----------------------------- |
| ⚡ **Next.js 15**            | App Router, Server Components |
| 🔷 **TypeScript**            | Type-safe development         |
| 🎨 **TailwindCSS**           | Utility-first styling         |
| 🧠 **Redux Toolkit**         | Global state management       |
| 🔄 **TanStack Query**        | Server state & caching        |
| 📡 **Axios**                 | HTTP client                   |
| 📊 **Recharts**              | Data visualization            |
| 📝 **React Hook Form + Zod** | Form handling & validation    |
| 🔔 **Sonner**                | Toast notifications           |

### Realtime

- 🔌 **Socket.io Client** - WebSocket communication

### 🏗️ Architecture Highlights

- ✨ Server / Client Component separation (App Router)
- ✨ Optimized data fetching with TanStack Query
- ✨ Centralized API service layer
- ✨ Role-based access control
- ✨ Cookie-based authentication
- ✨ Middleware route protection

---

## ✨ Core Features

### 🔐 Authentication

- ✅ Register / Login
- ✅ Cookie-based access token
- ✅ Middleware protected routes
- ✅ Role-based permissions

### 📁 Project Management

- ✅ Create & manage projects
- ✅ Invite members
- ✅ Assign roles (Owner, Member)
- ✅ Member status tracking

### 🏃 Sprint Planning

- ✅ Create sprint
- ✅ Set sprint goals
- ✅ Track sprint status
- ✅ Define max story points

### 📋 Kanban Board

- ✅ Drag & drop tasks
- ✅ Column-based workflow
- ✅ Update task status
- ✅ Task priority & story points
- ✅ Optimistic UI updates

### 📊 Reports & Analytics

- ✅ Sprint progress
- ✅ Velocity tracking
- ✅ Burndown charts
- ✅ Performance visualization

### 💬 Real-time Chat

- ✅ Project-based chat
- ✅ Typing indicators
- ✅ Live message updates
- ✅ File/image preview support

---

## 🧠 Architecture Overview

### 1️⃣ Data Fetching Strategy

This project uses **TanStack Query** for:

- 💾 **Caching** server data
- 🔄 **Automatic** background refetch
- ⚡ **Optimistic** updates
- 🗑️ **Cache** invalidation

**Example pattern:**

```typescript
GET /tasks → cached with queryKey ['tasks', sprintId]
PATCH /tasks/:id → optimistic update
On success → invalidate or update cache directly
On error → rollback
```

This approach prevents excessive re-rendering and avoids complex `useEffect` logic.

### 2️⃣ State Management

| Type of State             | Tool           |
| ------------------------- | -------------- |
| **Server state**          | TanStack Query |
| **Global UI state**       | Redux Toolkit  |
| **Local component state** | useState       |

This separation keeps the architecture **scalable and maintainable**.

### 3️⃣ Folder Structure (Simplified)

```bash
src/
 ├── app/
 ├── components/
 ├── lib/
 │    ├── services/
 │    ├── utils/
 │    └── types.ts
 ├── providers/
 └── middleware.ts
```

- `services/` → API layer
- `providers/` → Socket & global context
- `middleware.ts` → Route protection
- `lib/types.ts` → Shared TypeScript types

### 🔐 Middleware Logic

- 🚫 Redirect unauthenticated users to `/login`
- 🚫 Prevent logged-in users from accessing public auth routes
- ✅ Protect private routes with cookie validation

---

## 🚀 Getting Started

### 1️⃣ Clone the repo

```bash
git clone https://github.com/MinhThuan1807/Task-Project-Management-Tool.git
cd Task-Project-Management-Tool
```

### 2️⃣ Install dependencies

```bash
pnpm install
# or
npm install
```

### 3️⃣ Setup environment variables

Create `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_IO_URL=http://localhost:5000
```

### 4️⃣ Run development server

```bash
pnpm dev
```

App runs at: **http://localhost:3000**

---

## 📈 Performance Considerations

- ⚡ Avoid double-fetch between Server & Client
- ⚡ Optimistic UI updates for drag-drop
- ⚡ Suspense boundaries for async components
- ⚡ Code splitting via App Router
- ⚡ Controlled query invalidation

---

## 🎯 What I Learned

- ✅ Real-world project structuring
- ✅ Server vs Client component boundaries
- ✅ Data consistency with optimistic updates
- ✅ Managing complex UI states
- ✅ Integrating WebSocket in modern React
- ✅ Production-like auth flow

---

## 📌 Future Improvements

- 🚀 Add unit & integration tests
- 🚀 CI/CD with GitHub Actions
- 🚀 Role-based granular permissions
- 🚀 Dark mode
- 🚀 Activity logs
- 🚀 Audit history
- 🚀 Micro-frontend architecture exploration

---

## 👨‍💻 Author

**Minh Thuận (Jake Nguyen)**  
_Frontend Developer (React / Next.js / TypeScript)_

- 📧 Email: nguyenthuan05.work.com
- 💼 LinkedIn: [Thuan Nguyen](https://www.linkedin.com/in/thuan-nguyen-a568273b7/)
- 🐙 GitHub: [@MinhThuan1807](https://github.com/MinhThuan1807)

---

## ⭐ Why This Project Matters

This project demonstrates:

- 🎯 **Modern React architecture** (App Router)
- 🎯 **Production-level state management**
- 🎯 **Real-time system integration**
- 🎯 **Scalable folder structure**
- 🎯 **Clean separation of concerns**

> 💡 It reflects my ability to build a complex application from scratch using industry-standard tools.

---

<div align="center">

**⭐ If you find this project useful, please consider giving it a star!**

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

Made with ❤️ by [Minh Thuận](https://github.com/MinhThuan1807)

</div>
