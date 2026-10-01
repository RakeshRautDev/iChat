<div align="center">

# 💬 iChat — Modern Full-Stack Real-Time Messaging Platform

<p align="center">
  <strong>An Apple iMessage-inspired real-time chat application powered by MERN, Socket.IO, Clerk Auth, and ImageKit CDN.</strong>
</p>

[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](#-tech-stack)
[![Express](https://img.shields.io/badge/Express-5.2-000000?logo=express&logoColor=white)](#-tech-stack)
[![Node.js](https://img.shields.io/badge/Node.js-ESM-339933?logo=nodedotjs&logoColor=white)](#-tech-stack)
[![Socket.io](https://img.shields.io/badge/Socket.IO-4.8-010101?logo=socketdotio&logoColor=white)](#-tech-stack)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas%20%2F%20Mongoose%209-47A248?logo=mongodb&logoColor=white)](#-tech-stack)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](#-tech-stack)
[![Clerk](https://img.shields.io/badge/Clerk-Auth%20%26%20Webhooks-6C47FF?logo=clerk&logoColor=white)](#-tech-stack)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#-license)

<br />

<img src="./frontend/public/screenshot-for-readme.png" alt="iChat Demo Preview" width="100%" style="border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);" />

</div>

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Tech Stack & Tools](#-tech-stack--tools)
- [Data Models & Schema](#-data-models--schema)
- [API Reference](#-api-reference)
- [Real-Time WebSocket Protocol](#-real-time-websocket-protocol)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [1. Clone Repository](#1-clone-repository)
  - [2. Backend Setup](#2-backend-setup)
  - [3. Frontend Setup](#3-frontend-setup)
  - [4. Clerk Webhook Tunneling (Local Dev)](#4-clerk-webhook-tunneling-local-dev)
- [Environment Variables](#-environment-variables)
- [Project Directory Structure](#-project-directory-structure)
- [Deployment Guide](#-deployment-guide)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**iChat** is a production-grade, full-stack real-time messaging application engineered with the modern web stack. Designed to capture the aesthetic precision and fluidity of Apple’s native iMessage, iChat delivers instantaneous two-way messaging, media dispatch (images & videos), live online presence tracking, and cloud data persistence.

By leveraging **Express 5**, **React 19**, **Socket.IO 4**, **Mongoose 9**, and **Clerk Authentication**, the system maintains strong security with verified cryptographic webhooks, granular route guards, and zero plaintext token leakage.

---

## ✨ Key Features

### ⚡ Real-Time Instant Messaging
- **Bi-Directional WebSocket Communication**: Low-latency event streaming via Socket.IO with automated handshake resolution and reconnect resilience.
- **Multi-Client Synchronization**: Incoming messages are instantly pushed to the recipient socket while broadcasting across open tabs/sessions of the sender.
- **Optimistic UI Updates**: Outgoing messages appear immediately in the local conversation state before network round-trips for zero perceived lag.

### 🟢 Live Presence & Status Tracking
- **Heartbeat Connection Life-Cycle**: Real-time identification mapping (`clerkId` $\rightarrow$ MongoDB `_id` $\rightarrow$ active `socketId`).
- **Dynamic Online Indicators**: Online badge switches in real time upon connection, heartbeat refresh, or disconnect events.

### 🖼️ Rich Media Sharing (Images & Videos)
- **High-Speed CDN Delivery**: Media files uploaded with `multipart/form-data` are streamed in-memory via `multer` directly to **ImageKit CDN**.
- **Media Preview in Bubbles**: In-line visual rendering of pictures and clips seamlessly integrated into iMessage chat bubbles.

### 🔒 Enterprise Authentication & Webhook Sync
- **Clerk Identity Platform**: Complete OAuth, Social Login, and Passkey/Email authentication.
- **Svix Webhook Verification**: Cryptographically signed Clerk webhook listener (`/api/webhooks/clerk`) that synchronizes `user.created`, `user.updated`, and `user.deleted` events into MongoDB Atlas.
- **Protected Client & Server Routes**: Middleware-enforced route authorization ensuring non-authenticated requests receive strict `401 Unauthorized` responses.

### 💬 Smart Conversations & Contact Directory
- **Chats Tab (Aggregation Pipeline)**: Queries the database with high-performance MongoDB aggregation to display latest contacts sorted by `lastMessageAt`.
- **Users Tab**: Instant directory of all registered network contacts with rapid search capability.
- **Localized Timestamps**: Indian Standard Time (IST) / user locale 12-hour formatting for every message bubble.

### 🎨 Apple iMessage Aesthetic
- **Polished Glassmorphism & Dark Mode**: Sleek dark slate layout (`bg-slate-950`), custom scrollbars, and signature electric blue message bubbles (`#0185F7`).
- **Auditory Experience**: Bundled keystroke audio assets ready for tactile chat feedback.

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    subgraph Client["Frontend Client (React 19 + Vite 8 + Tailwind CSS 4)"]
        UI["React UI (Chat, SideBar, Message)"]
        SocketClient["Socket.IO Client"]
        ClerkClient["@clerk/react Auth Provider"]
    end

    subgraph AuthProvider["Authentication & Identity Provider"]
        Clerk["Clerk Auth Service"]
    end

    subgraph Backend["Express 5 Server (Node.js ESM)"]
        AuthMiddleware["Clerk Auth Middleware"]
        SocketServer["Socket.IO Server (userSocketMap)"]
        MessageCtrl["Message Controller"]
        WebhookCtrl["Clerk Webhook Verifier"]
    end

    subgraph MediaService["Cloud Storage & CDN"]
        ImageKit["ImageKit Media Engine"]
    end

    subgraph Database["Database Tier"]
        MongoUsers["MongoDB - Users Collection"]
        MongoMessages["MongoDB - Messages Collection"]
    end

    %% Client Interactions
    UI -->|1. Sign in / Sessions| ClerkClient
    ClerkClient <-->|Session JWT| Clerk
    UI -->|2. Authenticated REST Requests| AuthMiddleware
    SocketClient <-->|3. Bi-directional WebSocket| SocketServer

    %% Webhook sync
    Clerk -.->|Webhook Events (user.created/updated/deleted)| WebhookCtrl
    WebhookCtrl -->|Sync User Profile| MongoUsers

    %% Message sending flow
    AuthMiddleware --> MessageCtrl
    MessageCtrl -->|Upload Media| ImageKit
    ImageKit -->|Return Secure URL| MessageCtrl
    MessageCtrl -->|Persist Document| MongoMessages
    MessageCtrl -->|Emit newMessage| SocketServer
    SocketServer -.->|Push Message Event| SocketClient

    %% Message retrieval
    MessageCtrl -->|Aggregate Conversations / Find History| MongoMessages
    MessageCtrl -->|Lookup Contacts| MongoUsers
```

### Message Dispatch Sequence

```mermaid
sequenceDiagram
    autonumber
    actor UserA as Sender (Alice)
    participant ClientA as Alice Frontend
    participant Server as Express / Socket.IO
    participant DB as MongoDB Atlas
    participant CDN as ImageKit CDN
    actor UserB as Receiver (Bob)
    participant ClientB as Bob Frontend

    UserA->>ClientA: Submits text & media
    ClientA->>ClientA: Optimistic bubble insert
    ClientA->>Server: POST /api/messages/send/:id (Bearer token + FormData)
    Server->>Server: Verify Clerk token (protectedRoute)
    alt Media Attached
        Server->>CDN: Upload media stream (uploadChatMedia)
        CDN-->>Server: Return CDN secure URL
    end
    Server->>DB: messageModel.create(...)
    DB-->>Server: Saved Message Document
    Server->>Server: Lookup Bob's socketId in userSocketMap
    opt Bob is Online
        Server-->>ClientB: socket.emit("newMessage", savedMessage)
        ClientB->>UserB: Render message in chat in real time
    end
    Server-->>ClientA: 201 Created (Message JSON)
```

---

## 🛠️ Tech Stack & Tools

### Frontend
| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **[React](https://react.dev/)** | `v19.2` | Core reactive component framework |
| **[Vite](https://vitejs.dev/)** | `v8.3` | Ultra-fast build tool and local dev server |
| **[Tailwind CSS](https://tailwindcss.com/)** | `v4.3` | Utility-first CSS engine with modern theme config |
| **[React Router DOM](https://reactrouter.com/)** | `v7.18` | Declarative client-side routing & route guards |
| **[Clerk React](https://clerk.com/)** | `v6.17` | Frontend user authentication & session management |
| **[Socket.io-client](https://socket.io/)** | `v4.8` | Real-time WebSocket connection to backend |
| **[Axios](https://axios-http.com/)** | `v1.20` | Promise-based HTTP client for REST APIs |
| **[React Icons](https://react-icons.github.io/react-icons/)** | `v5.7` | Apple-like icon set (IoSearch, IoImage, CiChat) |

### Backend
| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **[Node.js](https://nodejs.org/)** | `ESM` | Modern ECMAScript module runtime |
| **[Express.js](https://expressjs.com/)** | `v5.2` | Robust HTTP web framework |
| **[Socket.io](https://socket.io/)** | `v4.8` | Bidirectional low-latency WebSocket engine |
| **[Mongoose](https://mongoosejs.com/)** | `v9.10` | Object Data Modeling (ODM) for MongoDB Atlas |
| **[@clerk/express](https://clerk.com/)** | `v2.1` | Server-side Clerk JWT auth & webhook validation |
| **[@imagekit/nodejs](https://imagekit.io/)** | `v7.12` | Cloud media storage, optimization & CDN URLs |
| **[Multer](https://github.com/expressjs/multer)** | `v2.4` | In-memory stream handling for `multipart/form-data` |
| **[dotenv](https://github.com/motdotla/dotenv)** | `v18.0` | Environment variable management |
| **[cors](https://github.com/expressjs/cors)** | `v2.8` | Cross-Origin Resource Sharing control |
| **[Nodemon](https://nodemon.io/)** | `v3.1` | Hot-reloading server development utility |

---

## 🗄️ Data Models & Schema

### User Schema (`userModel`)
```javascript
{
  clerkId:    { type: String, required: true, unique: true },
  email:      { type: String, required: true, unique: true },
  fullName:   { type: String, required: true },
  profilePic: { type: String, default: "" },
  createdAt:  Date,
  updatedAt:  Date
}
```

### Message Schema (`messageModel`)
```javascript
{
  senderId:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text:       { type: String },
  image:      { type: String },
  video:      { type: String },
  createdAt:  Date,
  updatedAt:  Date
}
```

---

## 📡 API Reference

Base URL: `http://localhost:3000` (or your production deployment domain)

| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/health` | No | Server health check (`{"ok": true}`) |
| `GET` | `/api/auth/check` | Yes | Retrieves authenticated user profile from MongoDB |
| `GET` | `/api/messages/users` | Yes | Fetches all registered contacts (excluding current user) |
| `GET` | `/api/messages/conversation` | Yes | Aggregates all ongoing chats sorted by latest message |
| `GET` | `/api/messages/:id` | Yes | Fetches chronological chat history between two users |
| `POST` | `/api/messages/send/:id` | Yes | Sends a text message or uploads image/video to `:id` |
| `POST` | `/api/webhooks/clerk` | Svix Signature | Webhook receiver for automated Clerk user synchronization |

> 📘 Full request/response schemas and example payloads are documented in [API_DOCS.md](file:///c:/Users/bbrak/OneDrive/Desktop/Mern/chatAPP/API_DOCS.md).

---

## ⚡ Real-Time WebSocket Protocol

The WebSocket server attaches directly to the HTTP server instance to handle real-time handshakes.

### Events Emitted and Received

| Event Name | Direction | Payload | Description |
| :--- | :---: | :--- | :--- |
| `connection` | Client $\rightarrow$ Server | `query: { userId: "<clerkId>" }` | Initial socket connection handshake with user identity. |
| `getOnlineUsers` | Server $\rightarrow$ Client | `string[]` (Array of MongoDB `_id`s) | Broadcasts list of currently online user IDs. |
| `newMessage` | Server $\rightarrow$ Client | `Message` Document | Delivers incoming message instantly to the active conversation window. |
| `disconnect` | Client $\rightarrow$ Server | None | Removes user from `userSocketMap` and re-broadcasts online status. |

---

## 🚀 Getting Started

### Prerequisites

Ensure you have installed on your local workstation:
- **Node.js**: `v18.x` or higher (Node 20+ recommended)
- **npm** or **pnpm**
- **MongoDB Atlas** account (or local MongoDB daemon)
- **Clerk** account ([clerk.com](https://clerk.com/))
- **ImageKit** account ([imagekit.io](https://imagekit.io/))

---

### 1. Clone Repository

```bash
git clone https://github.com/RakeshRautDev/iChat.git
cd iChat
```

---

### 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your `.env` configuration file:
   ```bash
   cp .env.example .env
   ```
   *(On Windows PowerShell: `Copy-Item .env.example .env`)*

4. Populate the `.env` variables with your credentials (see [Environment Variables](#backend-env)).

5. Start the development server with live reload:
   ```bash
   npm run dev
   ```
   Backend will start at: `http://localhost:3000`

---

### 3. Frontend Setup

1. Open a new terminal tab and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your `.env` configuration file:
   ```bash
   cp .env.example .env
   ```
   *(On Windows PowerShell: `Copy-Item .env.example .env`)*

4. Set your `VITE_CLERK_PUBLISHABLE_KEY` and `VITE_BACKEND_URL`.

5. Start the Vite development server:
   ```bash
   npm run dev
   ```
   Frontend will launch at: `http://localhost:5173`

---

### 4. Clerk Webhook Tunneling (Local Dev)

To allow Clerk to communicate with your local machine when new users sign up:

1. Expose port `3000` using a tunnel tool (e.g. `localtunnel` or `ngrok`):
   ```bash
   npx localtunnel --port 3000
   ```
2. In your [Clerk Dashboard](https://dashboard.clerk.com/) $\rightarrow$ **Webhooks** $\rightarrow$ **Add Endpoint**:
   - **URL**: `https://<your-tunnel-url>/api/webhooks/clerk`
   - **Subscribe to Events**:
     - `user.created`
     - `user.updated`
     - `user.deleted`
3. Copy the **Signing Secret** and paste it into `backend/.env` as `CLERK_WEBHOOK`.

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
| :--- | :--- | :--- |
| `PORT` | Port for Express & Socket.IO server | `3000` |
| `FRONTEND_URL` | Client origin URL for CORS policy | `http://localhost:5173` |
| `DB_URL` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/iChat` |
| `CLERK_PUBLISHABLE_KEY` | Clerk Publishable API key | `<clerk_publishable_key>` |
| `CLERK_SECRET_KEY` | Clerk Secret Key for backend middleware | `<clerk_secret_key>` |
| `CLERK_WEBHOOK` | Clerk Webhook signing secret | `<clerk_webhook_secret>` |
| `IMAGEKIT_PUBLIC_KEY` | ImageKit Public Key | `<imagekit_public_key>` |
| `IMAGEKIT_PRIVATE_KEY` | ImageKit Private Key | `<imagekit_private_key>` |
| `IMAGEKIT_ENDPOINT_URL` | ImageKit Endpoint URL | `https://ik.imagekit.io/<your_id>` |

### Frontend (`frontend/.env`)

| Variable | Description | Example |
| :--- | :--- | :--- |
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk Public Key for React Client | `<clerk_publishable_key>` |
| `VITE_BACKEND_URL` | HTTP / WebSocket server address | `http://localhost:3000` |

---

## 📂 Project Directory Structure

```text
iChat/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.js          # Authentication check & profile logic
│   │   │   └── message.controller.js       # Conversations, messages & media upload
│   │   ├── lib/
│   │   │   ├── db.js                       # Mongoose connection initialization
│   │   │   ├── imagekit.js                 # ImageKit SDK configuration & upload helper
│   │   │   └── socket.js                   # Socket.IO server & user-socket registry
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js          # Clerk session authentication verification
│   │   │   └── upload.middleware.js        # Multer in-memory upload handler
│   │   ├── models/
│   │   │   ├── message.model.js            # Message MongoDB schema
│   │   │   └── user.model.js               # Synchronized User MongoDB schema
│   │   ├── routes/
│   │   │   ├── auth.routes.js              # Auth endpoints (/api/auth/*)
│   │   │   └── message.routes.js           # Message endpoints (/api/messages/*)
│   │   ├── webhooks/
│   │   │   └── clerk.webhook.js            # Raw JSON Clerk webhook receiver
│   │   └── index.js                        # Express server entry point
│   ├── .env.example                        # Template backend environment config
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   ├── sounds/                         # Keystroke sound assets
│   │   ├── wallpapers/                     # Custom chat background wallpapers
│   │   ├── logo.png                        # Application logo
│   │   └── screenshot-for-readme.png       # Application screenshot
│   ├── src/
│   │   ├── component/
│   │   │   ├── AuthComponent.jsx           # Sign-in / Sign-up landing interface
│   │   │   ├── Chat.jsx                    # Scrollable conversation message thread
│   │   │   ├── ChatPage.jsx                # Main 2-column split chat application view
│   │   │   ├── ChatUser.jsx                # User list item in sidebar
│   │   │   ├── Message.jsx                 # Individual message bubble (text/media/time)
│   │   │   ├── ProtectedRoute.jsx          # Route guard for authenticated users
│   │   │   ├── PublicRoute.jsx             # Route guard for guest sessions
│   │   │   ├── SendMessage.jsx             # Text & media composer bar with attachments
│   │   │   └── SideBar.jsx                 # Conversations & contacts list pane
│   │   ├── context/
│   │   │   ├── SocketContext.jsx           # Real-time WebSocket connection state provider
│   │   │   └── UserContext.jsx             # User identity context
│   │   ├── App.jsx                         # Main Router definition
│   │   └── main.jsx                        # React root entry & Clerk Provider
│   ├── .env.example                        # Template frontend environment config
│   ├── vite.config.js                      # Vite & Tailwind CSS plugins
│   └── package.json
│
├── API_DOCS.md                             # Exhaustive backend API endpoints specification
├── DockerFile                              # Docker container specification
└── README.md                               # Project documentation
```

---

## 🚢 Deployment Guide

### Backend (Render / Railway)
1. Deploy as a **Node.js Web Service**.
2. Build Command: `npm install`
3. Start Command: `node src/index.js`
4. Set Environment Variables in host dashboard matching `backend/.env`.
5. Update your Clerk Webhook Endpoint to point to your live backend domain (`https://your-api.onrender.com/api/webhooks/clerk`).

### Frontend (Vercel / Netlify / Render)
1. Deploy as a **Static Site** from `/frontend`.
2. Build Command: `npm run build`
3. Output Directory: `dist`
4. Add Environment Variables:
   - `VITE_CLERK_PUBLISHABLE_KEY`
   - `VITE_BACKEND_URL` (Points to your live backend URL)
5. Ensure `FRONTEND_URL` in backend `.env` matches your deployed frontend domain for CORS authorization.

---

## 🤝 Contributing

Contributions make the open-source community an inspiring place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<div align="center">
  <sub>Engineered with ❤️ by <a href="https://github.com/RakeshRautDev">Rakesh Raut</a>. If you found this project helpful, give it a ⭐️!</sub>
</div>
