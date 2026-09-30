# API Endpoints Documentation

This document outlines all the backend API endpoints, their required inputs, and expected outputs to help you connect your frontend.

---

## 1. Health Check

**Endpoint:** `GET /health`
**Description:** Checks if the backend server is running.
**Authentication:** Not required

**Request:**
- **Headers:** None
- **Body:** None

**Response (200 OK):**
```json
{
  "ok": true
}
```

---

## 2. Auth

### Check Authentication
**Endpoint:** `GET /api/auth/check`
**Description:** Returns the logged-in user's details. Used to verify if the user is authenticated.
**Authentication:** Required (Clerk session token/cookie)

**Request:**
- **Headers:** None specific (Clerk handles auth headers automatically)
- **Body:** None

**Response (200 OK):**
Returns the User object from the database.
```json
{
  "_id": "60d0fe4f5311236168a109ca",
  "clerkId": "user_2Pabc123",
  "email": "user@example.com",
  "fullName": "John Doe",
  "profilePic": "https://example.com/pic.jpg",
  "createdAt": "2023-10-01T12:00:00Z",
  "updatedAt": "2023-10-01T12:00:00Z"
}
```

---

## 3. Messages

**Note:** All endpoints under `/api/messages` require authentication.

### Get Users for Sidebar
**Endpoint:** `GET /api/messages/users`
**Description:** Fetches all users registered in the app (excluding the currently logged-in user) to display in a "New Chat" or contacts sidebar.
**Authentication:** Required

**Request:**
- **Body:** None

**Response (200 OK):**
An array of User objects (the `clerkId` is intentionally hidden for security).
```json
[
  {
    "_id": "60d0fe4f5311236168a109cb",
    "email": "alice@example.com",
    "fullName": "Alice Smith",
    "profilePic": "https://example.com/alice.jpg",
    "createdAt": "2023-10-01T12:00:00Z",
    "updatedAt": "2023-10-01T12:00:00Z"
  }
]
```

### Get Active Conversations
**Endpoint:** `GET /api/messages/conversation`
**Description:** Fetches a list of users that the logged-in user has already exchanged messages with, sorted by the most recent message time.
**Authentication:** Required

**Request:**
- **Body:** None

**Response (200 OK):**
```json
{
  "success": true,
  "conversations": [
    {
      "_id": "60d0fe4f5311236168a109cb",
      "email": "alice@example.com",
      "fullName": "Alice Smith",
      "profilePic": "https://example.com/alice.jpg",
      "createdAt": "2023-10-01T12:00:00Z",
      "updatedAt": "2023-10-01T12:00:00Z"
    }
  ]
}
```

### Get Chat History
**Endpoint:** `GET /api/messages/:id`
**Description:** Fetches the entire chat history between the logged-in user and the user specified by `:id`.
**Authentication:** Required

**Request:**
- **Params:** `id` (The MongoDB `_id` of the user you are chatting with)
- **Body:** None

**Response (200 OK):**
An array of Message objects sorted chronologically.
```json
[
  {
    "_id": "65b0c9e0d1...",
    "senderId": "60d0fe4f5311236168a109ca",
    "receiverId": "60d0fe4f5311236168a109cb",
    "text": "Hey Alice!",
    "image": "",
    "video": "",
    "createdAt": "2023-10-05T14:30:00Z",
    "updatedAt": "2023-10-05T14:30:00Z"
  }
]
```

### Send a Message
**Endpoint:** `POST /api/messages/send/:id`
**Description:** Sends a message (text, image, or video) to the user specified by `:id`.
**Authentication:** Required

**Request:**
- **Params:** `id` (The MongoDB `_id` of the user you are sending the message to)
- **Content-Type:** `multipart/form-data` (required if sending files) or `application/json` (if text only).
- **Body:**
  - `text` (String, Optional): The text content of the message.
  - `media` (File, Optional): The image or video file being uploaded.

**Response (201 Created):**
Returns the newly created message.
```json
{
  "_id": "65b0c9e0d2...",
  "senderId": "60d0fe4f5311236168a109ca",
  "receiverId": "60d0fe4f5311236168a109cb",
  "text": "Look at this picture!",
  "image": "https://ik.imagekit.io/your_id/chat-170...jpg",
  "video": null,
  "createdAt": "2023-10-05T14:35:00Z",
  "updatedAt": "2023-10-05T14:35:00Z"
}
```

---

## 4. Webhooks

**Endpoint:** `POST /api/webhooks/clerk`
**Description:** This endpoint is hit automatically by Clerk whenever a user signs up, updates their profile, or gets deleted. You **do not** need to call this from your frontend.
