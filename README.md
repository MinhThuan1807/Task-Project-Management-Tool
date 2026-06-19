<div align="center">

# 🚀 SprintSOS - Agile Project Management Tool

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Redux](https://img.shields.io/badge/Redux_Toolkit-2.0-764ABC?style=for-the-badge&logo=redux)](https://redux-toolkit.js.org/)
[![Shadcn/UI](https://img.shields.io/badge/shadcn/ui-0.0-black?style=for-the-badge&logo=shadcnui)](https://ui.shadcn.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.0-010101?style=for-the-badge&logo=socket.io)](https://socket.io/)

### A high-performance, real-time Agile Project Management platform built with Next.js 15 App Router & TypeScript.

Designed to optimize workflows with interactive Kanban boards, sprint tracking, real-time team communication, and automated burndown charts.

[🔗 Live Demo](https://sprintos.fittrackwk.online/) • [🔗 Backend Repo](https://github.com/QUANG221222/Sprintos-API) • [📦 Frontend Repo](https://github.com/MinhThuan1807/Task-Project-Management-Tool)

</div>

---

## 📋 Table of Contents

- [📌 Overview](#-overview)
- [🛠 Tech Stack](#-tech-stack)
- [🧠 Key Technical Challenges & Solutions](#-key-technical-challenges--solutions)
- [✨ Core Features](#-core-features)
- [📐 Architecture & Folder Structure](#-architecture--folder-structure)
- [📸 Screenshots & UI Walkthrough](#-screenshots--ui-walkthrough)
- [🚀 Getting Started](#-getting-started)
- [📈 Performance Optimization](#-performance-optimization)
- [🎯 Learnings & Reflections](#-learnings--reflections)
- [👨‍💻 Contact Author](#-contact-author)

---

## 📌 Overview

**SprintSOS** is a modern project management tool designed to model Jira & Trello workflows. It serves as a playground to demonstrate production-grade frontend architecture, emphasizing type-safety, efficient caching, state management, and seamless real-time synchronization.

---

## 🛠 Tech Stack

| Domain | Technology | Key Highlights |
| :--- | :--- | :--- |
| **Core** | **Next.js 15 (App Router)** & **TypeScript** | Hybrid Server/Client component structure, route groups, strict type checking. |
| **State & Caching** | **TanStack Query v5** & **Redux Toolkit** | Caching, deduplication of server requests + predictable UI state management. |
| **Styling** | **TailwindCSS** & **Shadcn/UI** | Tailwind variables + accessible headless radix-ui primitives for high fidelity UI. |
| **Realtime** | **Socket.io-client** | Persistent websocket channels for messaging & state synchronizations. |
| **Forms** | **React Hook Form** + **Zod** | Type-safe form validation and state management. |
| **HTTP Client** | **Axios** | Dynamic interceptors with retry queuing mechanism on authentication expiration. |

---

## 🧠 Key Technical Challenges & Solutions

### 1️⃣ Advanced Token Rotation (Axios Interceptors)
*   **Problem:** Handling expired access tokens smoothly without interrupting the user experience or firing duplicate token-refresh API requests when multiple component requests fail simultaneously.
*   **Solution:** Built a custom Axios interceptor with a token refresh queue. When an API call returns status `410` (Token Expired), the interceptor locks subsequent requests inside a `refreshTokenPromise` queue. Once refreshed successfully, queued requests are automatically retried with the new credentials. If refresh fails, it dispatches a global Redux logout action (`logoutUserAPI()`) to securely wipe session states.

### 2️⃣ Seamless Drag-and-Drop UX (Optimistic Updates)
*   **Problem:** Waiting for the server to confirm task movement on the Kanban board causes a sluggish user experience (latency lag).
*   **Solution:** Implemented **Optimistic UI Updates** using TanStack Query's `onMutate`. When a user moves a task:
    1. The query cache is immediately mutated to reflect the new column.
    2. The previous cache is saved as a fallback checkpoint.
    3. If the server fails to update the task, the transaction rolls back seamlessly to the saved checkpoint, and a toast error is triggered.

### 3️⃣ Real-time Synchronization & Socket.io Lifecycle
*   **Problem:** Managing WebSocket instances globally in Next.js 15 client-side without memory leaks or redundant connections on route changes.
*   **Solution:** Created a React Context-based `SocketProvider`. It initiates a single connection on root mount, binds cleanup actions on unmount, and exposes reactive helpers (`useSocket()`) to handle real-time chat, typing indicators, and system-wide notifications dynamically.

---

## ✨ Core Features

### 🔐 Authentication & Security
- **Middleware Protected Routes:** Route guards redirecting unauthorized requests to `/login` and authenticated users away from public pages.
- **Secure Sessions:** JWT token processing integrated directly into secure HTTP-only cookie wrappers.
- **RBAC:** Role-based access control (Owner, Member) governing project actions.

### 📁 Agile Workflow Management
- **Project Workspaces:** Dedicated spaces to manage resources, track performance, and invite members.
- **Sprint Management:** Sprint creation, target metrics, goal tracking, and velocity analysis.
- **Kanban Board:** Column-based board supporting instant task categorization, priority ratings, and point estimations.

### 💬 Live Collaboration & Reporting
- **Real-time Chat:** Instant chat per project workspace featuring typing status indicators and media previews.
- **Analytics & Burndown Charts:** Custom visual reporting powered by **Recharts** to plot velocity trends and sprint burndowns.

---

## 📐 Architecture & Folder Structure

This project follows a clean **Feature-Folder and Layer-Separated Architecture**:

```bash
src/
 ├── app/                    # Next.js pages & layout system
 │    ├── (auth)/            # Auth routes group (login, register)
 │    └── (dashboard)/       # Dashboard routes group (projects, boards, chat)
 ├── components/             # Reusable UI & Layout Components
 │    ├── auth/              # Auth-related UI modules
 │    ├── ui/                # Base UI components (Shadcn/UI primitives)
 │    └── ChatView.tsx       # Live chat component interface
 ├── lib/                    # Shared core business logic
 │    ├── features/          # Redux slices (state management)
 │    ├── queries/           # TanStack query wrapper hooks (cache keys)
 │    ├── services/          # Pure Axios API services
 │    ├── types/             # Common TypeScript definitions
 │    └── axios.ts           # Interceptor-wrapped Axios instance
 └── middleware.ts           # Route protection middleware
```

*   **Decoupled Queries & Services:** Axios endpoints are declared in `services/`. React Query hooks are declared in `queries/`, keeping components clean of raw HTTP concerns.

---

## 📸 Screenshots & UI Walkthrough

### 📊 Dashboard Workspace Overview
![Dashboard](/public/screenshots/dashboard.png)

### 📋 Interactive Kanban Board (Optimistic DnD)
![Kanban Board](/public/screenshots/board.png)

### 🏃 Sprint Backlog & Planning
![Sprint Planning](/public/screenshots/sprint.png)

### 💬 Real-time Team Chat
![Chat](/public/screenshots/chat.png)

### 📈 Reports & Velocity Tracking
![Reports](/public/screenshots/report.png)

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/MinhThuan1807/Task-Project-Management-Tool.git
cd Task-Project-Management-Tool
```

### 2️⃣ Install Dependencies
```bash
pnpm install
# or
npm install
```

### 3️⃣ Configure Environment
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_IO_URL=http://localhost:5000
```

### 4️⃣ Spin up the Dev Server
```bash
pnpm dev
# open http://localhost:3000
```

---

## 📈 Performance Optimization

- **Selective Server Rendering (SSR):** Critical metadata is server-fetched, while dynamic interactive modules hydrate dynamically.
- **Query Cache Synchronization:** `staleTime` is set to `2 minutes` across modules to prevent double-fetching on navigate-back triggers.
- **Debounced Input handlers:** Input validations are throttled/debounced to minimize layout re-calculations.

---

## 🎯 Learnings & Reflections

- Experienced building production-ready project modules using standard enterprise design systems.
- Mastered client-server synchronization patterns utilizing React-Query and custom server-state mutations.
- Configured connection states and fallback states during server websocket dropouts.
- Understand how to structure route groups efficiently to implement robust cookie authentication.

---

## 👨‍💻 Contact Author

**Minh Thuận (Jake Nguyen)**  
*Frontend Developer (Next.js / TypeScript)*

- 📧 Email: nguyenthuan05.work@gmail.com
- 💼 LinkedIn: [Thuan Nguyen](https://www.linkedin.com/in/thuan-nguyen-a568273b7/)
- 🐙 GitHub: [@MinhThuan1807](https://github.com/MinhThuan1807)

---

⭐ **If you find this project useful, please consider giving it a star!**
