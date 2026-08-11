# 💙 everUS

<p align="center">
  <img src="https://img.shields.io/badge/everUS-Private%20Memory%20Space-6630E9?style=for-the-badge&logo=heart&logoColor=white" alt="everUS">
  <img src="https://img.shields.io/badge/Python-3.x-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python">
  <img src="https://img.shields.io/badge/Flask-Backend-000000?style=for-the-badge&logo=flask&logoColor=white" alt="Flask">
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
  <img src="https://img.shields.io/badge/PyMongo-Database%20Driver-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="PyMongo">
  <img src="https://img.shields.io/badge/JWT-Authentication-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT">
  <img src="https://img.shields.io/badge/bcrypt-Password%20Security-4A4A4A?style=for-the-badge" alt="bcrypt">
  <img src="https://img.shields.io/badge/Cloudinary-Media%20Storage-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white" alt="Cloudinary">
</p>

<p align="center">
  <h1 align="center">everUS</h1>
</p>

<p align="center">
  <strong>A private digital space for preserving memories, conversations, photos, and moments that matter.</strong>
</p>

<p align="center">
  <a href="#-about">About</a> •
  <a href="#-features">Features</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-installation">Installation</a> •
  <a href="#-api-documentation">API</a> •
  <a href="#-roadmap">Roadmap</a>
</p>

---

# 🌌 About

**everUS** is a private digital space designed for people who want to preserve meaningful moments with the people who matter to them.

The idea behind everUS is simple:

> **Some moments deserve a place of their own.**

Modern communication platforms are excellent for instant conversations, but meaningful memories often become scattered across:

- Messaging applications
- Cloud storage
- Social media
- Notes applications
- Photo galleries
- Screenshots
- Personal journals

everUS aims to bring these experiences into one private and organized space.

A user can create a shared **Space** and invite another person or group of people into it.

Each Space can eventually contain:

- 💬 Conversations
- 📸 Photos
- 🎥 Videos
- 📝 Journals
- 📌 Sticky Notes
- 🗓️ Timeline events
- 🎯 Bucket Lists
- ⏳ Time Capsules
- 🎙️ Voice Notes
- 🔔 Notifications
- ❤️ Shared memories

The current version focuses on building the backend foundation, authentication, shared spaces, memberships, and invitation system.

---

# 💭 The Vision

everUS is not intended to be another public social media platform.

It is designed around **private relationships and shared memories**.

Instead of:

```text
WhatsApp
    ↓
Conversations

Google Drive
    ↓
Photos / Files

Notes
    ↓
Personal Thoughts

Instagram
    ↓
Memories

Calendar
    ↓
Important Dates
```

everUS brings these ideas together:

```text
                         ┌──────────────┐
                         │    everUS    │
                         └──────┬───────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
        ▼                       ▼                       ▼
   Conversations           Memories                Moments
        │                       │                       │
        ▼                       ▼                       ▼
     Messages                 Gallery               Timeline
        │                       │                       │
        └───────────────────────┼───────────────────────┘
                                │
                                ▼
                       Private Shared Space
```

The goal is to create a place that feels:

```text
Private
Personal
Simple
Warm
Meaningful
Secure
```

---

# ✨ Features

## 🔐 Authentication

The project currently includes a secure authentication foundation.

### Implemented

- User registration
- User login
- Password hashing using bcrypt
- JWT token generation
- JWT authentication
- Protected routes
- User profile access

Authentication flow:

```text
                    User
                     │
                     ▼
              Register / Login
                     │
                     ▼
                 Flask API
                     │
                     ▼
              MongoDB Atlas
                     │
                     ▼
              Password Verify
                     │
                     ▼
                 JWT Token
                     │
                     ▼
           Authenticated Requests
```

---

# 👤 User Management

Users form the foundation of everUS.

The system supports:

- User registration
- User authentication
- Profile access
- Secure password storage
- JWT-based authorization

A user can also participate in multiple Spaces.

Example:

```text
                       User
                         │
             ┌───────────┴───────────┐
             │                       │
             ▼                       ▼
       Priyanshu ❤️ Tanu       College Friends
             │                       │
             ▼                       ▼
          Couple                    Friends
           Space                     Space
```

---

# 🏡 Shared Spaces

A **Space** is the central concept of everUS.

A Space can represent:

- 💕 Couples
- 👨‍👩‍👧‍👦 Families
- 👥 Friends
- 🎓 Private groups
- 🧑‍🤝‍🧑 Any shared relationship

Users can currently:

- Create a Space
- View their Spaces
- View an individual Space
- Update a Space
- Delete a Space
- Join a Space
- Manage membership

Example:

```text
                  everUS
                     │
       ┌─────────────┴─────────────┐
       │                           │
       ▼                           ▼
Priyanshu ❤️ Tanu             College Friends
       │                           │
       ▼                           ▼
    Couple                       Friends
     Space                        Space
```

---

# 👥 Membership System

The membership system connects users with Spaces.

A user can have different roles inside a Space.

Example:

```text
Space
 │
 ├── Owner
 │
 ├── Member
 │
 └── Member
```

The current implementation supports:

- Space owner
- Space members
- Joining Spaces
- Membership creation
- Duplicate membership prevention
- Role-based membership

Conceptual relationship:

```text
User
 │
 ├──────────────┐
 │              │
 ▼              ▼
Space A       Space B
 │              │
Owner          Member
```

---

# 📨 Invite System

Users can join a Space using an invite code.

### Invite workflow

```text
Space Owner
     │
     ▼
Invite Code
     │
     ▼
Share Code
     │
     ▼
Another User
     │
     ▼
Join Space
     │
     ▼
Membership Created
```

The backend also prevents a user from joining the same Space multiple times.

Example:

```text
Invite Code:

ABC123
```

---

# 📊 Current Feature Status

| Feature | Status |
|---|---|
| User Registration | ✅ Completed |
| User Login | ✅ Completed |
| Password Hashing | ✅ Completed |
| JWT Authentication | ✅ Completed |
| Protected Routes | ✅ Completed |
| User Profile | ✅ Completed |
| Create Space | ✅ Completed |
| Get User Spaces | ✅ Completed |
| Get Single Space | ✅ Completed |
| Update Space | ✅ Completed |
| Delete Space | ✅ Completed |
| Membership System | ✅ Completed |
| Owner / Member Roles | ✅ Completed |
| Invite Codes | ✅ Completed |
| Join Space | ✅ Completed |
| Duplicate Membership Prevention | ✅ Completed |
| Messaging | 🚧 In Development |
| Media Gallery | 🔜 Planned |
| Journal | 🔜 Planned |
| Sticky Notes | 🔜 Planned |
| Timeline | 🔜 Planned |
| Bucket List | 🔜 Planned |
| Time Capsule | 🔜 Planned |
| Voice Notes | 🔜 Planned |
| Notifications | 🔜 Planned |
| Dark Mode | 🔜 Planned |
| Complete Responsive UI | 🔜 Planned |

---

# 🏗️ Architecture

everUS follows a modular backend architecture.

```text
                         ┌──────────────────────┐
                         │       Frontend       │
                         │    Web Application   │
                         └──────────┬───────────┘
                                    │
                                    │ HTTP / JSON
                                    ▼
                         ┌──────────────────────┐
                         │      Flask API       │
                         └──────────┬───────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
                 Routes        Middleware       Controllers
                    │               │               │
                    └───────────────┼───────────────┘
                                    │
                                    ▼
                                Services
                                    │
                                    ▼
                                 Models
                                    │
                                    ▼
                                PyMongo
                                    │
                                    ▼
                             MongoDB Atlas
```

---

# 🧱 Backend Architecture

The backend is organized into separate layers.

```text
backend/
│
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── services/
├── utils/
├── app.py
└── requirements.txt
```

Each layer has a specific responsibility.

---

# 🛣️ Routes

Routes define the API endpoints.

Conceptually:

```text
/api/auth/*
/api/users/*
/api/spaces/*
/api/invite/*
```

Routes should remain focused on endpoint definitions rather than containing large amounts of business logic.

---

# 🎮 Controllers

Controllers handle incoming HTTP requests.

Their responsibilities include:

- Reading request data
- Calling appropriate services
- Handling responses
- Returning HTTP status codes

Flow:

```text
HTTP Request
     │
     ▼
Controller
     │
     ▼
Service
     │
     ▼
Response
```

---

# ⚙️ Services

Services contain the application's business logic.

For example, creating a Space may involve:

```text
Create Space
     │
     ▼
Validate User
     │
     ▼
Create Space
     │
     ▼
Create Membership
     │
     ▼
Return Result
```

Separating this logic into services makes the application easier to maintain and extend.

---

# 🛡️ Middleware

Middleware processes requests before they reach protected resources.

The JWT middleware verifies authentication.

```text
Request
   │
   ▼
JWT Middleware
   │
   ├──────── Invalid
   │              │
   │              ▼
   │        401 Unauthorized
   │
   ▼
Valid Token
   │
   ▼
Controller
```

---

# 🗄️ Database Architecture

everUS uses **MongoDB Atlas** as the primary database.

The current database architecture revolves around:

```text
users
spaces
memberships
```

Future collections can include:

```text
messages
memories
journal
notes
timeline
bucket_lists
time_capsules
voice_notes
notifications
```

---

# 👤 Users Collection

The users collection stores account information.

Conceptual document:

```json
{
    "_id": "...",
    "name": "User Name",
    "email": "user@example.com",
    "password": "hashed_password"
}
```

Passwords are hashed using bcrypt before being stored.

---

# 🏡 Spaces Collection

The Spaces collection stores shared spaces.

Example:

```json
{
    "_id": "...",
    "name": "Priyanshu ❤️ Tanu",
    "type": "couple",
    "owner_id": "..."
}
```

A Space can eventually contain all shared content.

```text
Space
 │
 ├── Messages
 ├── Memories
 ├── Journal
 ├── Notes
 ├── Timeline
 ├── Bucket List
 ├── Time Capsules
 └── Voice Notes
```

---

# 👥 Membership Collection

Membership connects users to Spaces.

Conceptual document:

```json
{
    "_id": "...",
    "user_id": "...",
    "space_id": "...",
    "role": "member"
}
```

Possible roles:

```text
owner
member
```

---

# 🔐 Authentication Architecture

everUS uses:

- JWT for authentication
- bcrypt for password hashing
- Protected routes for private resources

Authentication flow:

```text
                       User
                        │
                        ▼
                  Login Request
                        │
                        ▼
                    Flask API
                        │
                        ▼
                 Find User
                        │
                        ▼
              Verify Password
                        │
                        ▼
                  Create JWT
                        │
                        ▼
                Return Token
```

---

# 🔑 JWT Protected Requests

Once authenticated, the client sends the JWT token with protected requests.

Example:

```http
Authorization: Bearer <JWT_TOKEN>
```

The server verifies the token before allowing access.

```text
Client
  │
  │ JWT
  ▼
Flask API
  │
  ▼
JWT Middleware
  │
  ▼
Authenticated User
  │
  ▼
Protected Resource
```

---

# 🔐 Password Security

Passwords are not stored directly.

The flow is:

```text
Plain Password
      │
      ▼
    bcrypt
      │
      ▼
Hashed Password
      │
      ▼
    MongoDB
```

During login:

```text
Entered Password
      │
      ▼
bcrypt Verification
      │
      ▼
Stored Hash
      │
      ▼
Valid / Invalid
```

---

# ☁️ Cloudinary Integration

Cloudinary is planned for media storage.

It will handle files such as:

- Images
- Videos
- Voice notes

The planned architecture:

```text
User
 │
 ▼
Upload Media
 │
 ▼
Flask API
 │
 ▼
Cloudinary
 │
 ▼
Media URL
 │
 ▼
MongoDB
```

MongoDB stores the metadata while Cloudinary stores the actual media.

---

# 💬 Messaging

The messaging system is currently under development.

The planned architecture is:

```text
User A
   │
   ▼
Message
   │
   ▼
Flask API
   │
   ▼
Message Service
   │
   ▼
MongoDB
   │
   ▼
User B
```

Future messaging functionality may include:

- One-to-one messages
- Shared Space messages
- Message timestamps
- Message read status
- Message deletion
- Message editing
- Real-time messaging
- Notifications

---

# 📸 Memory Gallery

The planned Gallery will allow users to preserve important memories.

Possible functionality:

```text
Upload Photo
      │
      ▼
Cloudinary
      │
      ▼
Media URL
      │
      ▼
MongoDB
      │
      ▼
Gallery
```

Planned features:

- Photos
- Videos
- Albums
- Captions
- Dates
- Memory categories
- Shared access

---

# 📝 Journal

The Journal will provide a private writing space inside a Space.

Possible document structure:

```json
{
    "title": "A Special Day",
    "content": "Today was...",
    "author_id": "...",
    "space_id": "...",
    "created_at": "...",
    "updated_at": "..."
}
```

---

# 📌 Sticky Notes

Sticky Notes will allow members to leave small reminders or thoughts.

Examples:

```text
💜 Don't forget our anniversary.

🍕 Let's try this restaurant.

🎬 Movie night this weekend.

✈️ Plan our next trip.

🎁 Birthday surprise idea.
```

---

# 🗓️ Timeline

The Timeline will organize important moments chronologically.

Example:

```text
2025
 │
 ├── First Meeting
 │
 ├── First Trip
 │
 └── Special Memory
 │
2026
 │
 ├── New Year
 │
 ├── Anniversary
 │
 └── Future Plans
```

---

# 🎯 Bucket List

Users will be able to maintain shared goals.

Example:

```text
☐ Visit another country
☐ Go on a road trip
☐ Watch the sunrise together
☐ Learn something together
☐ Take 100 photos together
☐ Build something together
```

---

# ⏳ Time Capsule

The Time Capsule is designed to preserve messages and memories for the future.

Workflow:

```text
Create Memory
      │
      ▼
Set Unlock Date
      │
      ▼
Store Securely
      │
      ▼
Wait
      │
      ▼
Unlock Date
      │
      ▼
Future Memory
```

This feature is intended to make everUS more than a conventional messaging platform.

---

# 🎙️ Voice Notes

Users will eventually be able to save voice messages.

Planned flow:

```text
Record Voice
      │
      ▼
Upload
      │
      ▼
Cloudinary
      │
      ▼
Media URL
      │
      ▼
MongoDB
```

---

# 🔔 Notifications

Future notifications may include:

```text
New Message
New Memory
Space Invitation
Bucket List Update
Time Capsule Available
Important Date
New Journal Entry
```

---

# 🎨 Frontend Vision

The frontend is designed to feel personal rather than corporate or social-media-like.

The visual direction is:

```text
Minimal
   +
Warm
   +
Modern
   +
Personal
   +
Private
```

The interface should feel like a **private digital room**.

---

# 📱 Responsive Design

The frontend is intended to support:

```text
Desktop
   │
   ├── Laptop
   └── Large Monitor

Tablet
   │
   └── Touch Interface

Mobile
   │
   ├── Android
   └── iOS
```

---

# 🌙 Dark Mode

Dark mode is planned as part of the frontend.

```text
☀️ Light Mode
🌙 Dark Mode
```

The design should maintain the same visual identity in both modes.

---

# 📂 Project Structure

```text
Ever-US/
│
├── backend/
│   │
│   ├── config/
│   │
│   ├── controllers/
│   │
│   ├── middleware/
│   │
│   ├── models/
│   │
│   ├── routes/
│   │
│   ├── services/
│   │
│   ├── utils/
│   │
│   ├── app.py
│   └── requirements.txt
│
├── frontend/
│
├── .env.example
├── .gitignore
├── docker-compose.yml
└── README.md
```

---

# 🛠️ Tech Stack

## Backend

| Technology | Purpose |
|---|---|
| Python | Backend programming |
| Flask | REST API framework |
| PyMongo | MongoDB driver |
| MongoDB Atlas | Cloud database |
| JWT | Authentication |
| bcrypt | Password hashing |
| Cloudinary | Media storage |

---

## Frontend

| Technology | Purpose |
|---|---|
| HTML5 | Page structure |
| CSS3 | Styling |
| JavaScript | Frontend interactions |
| Tailwind CSS | UI styling |

---

## Development Tools

| Tool | Purpose |
|---|---|
| VS Code | Development |
| Git | Version control |
| GitHub | Source control |
| Postman | API testing |
| MongoDB Atlas | Database management |

---

# ⚙️ Environment Variables

Create a `.env` file in the backend directory.

```env
MONGO_URI=your_mongodb_connection_string

JWT_SECRET_KEY=your_secure_secret_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Never commit the actual `.env` file.

Use:

```text
.env
```

inside `.gitignore`.

---

# 🚀 Installation

## 1. Clone Repository

```bash
git clone https://github.com/Ristel7/Ever-US.git
```

Move into the project:

```bash
cd Ever-US
```

---

# 🐍 2. Create Virtual Environment

### Windows

```bash
python -m venv venv
```

Activate:

```bash
venv\Scripts\activate
```

### Linux / macOS

```bash
python3 -m venv venv
```

Activate:

```bash
source venv/bin/activate
```

---

# 📦 3. Install Dependencies

```bash
pip install -r backend/requirements.txt
```

---

# 🗄️ 4. MongoDB Atlas

Create a MongoDB Atlas cluster.

Get your connection string.

Example:

```text
mongodb+srv://username:password@cluster.mongodb.net/
```

Add it to `.env`:

```env
MONGO_URI=your_connection_string
```

---

# 🔐 5. JWT Configuration

Set a strong secret:

```env
JWT_SECRET_KEY=your_long_random_secret
```

For production, use a long and unpredictable value.

---

# ☁️ 6. Cloudinary Configuration

Create a Cloudinary account and configure:

```env
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

---

# ▶️ Running the Application

Move into the backend:

```bash
cd backend
```

Run Flask:

```bash
python app.py
```

The local server should be available at:

```text
http://127.0.0.1:5000
```

---

# 🧪 API Documentation

The backend currently provides REST APIs for:

```text
Authentication
Users
Spaces
Memberships
Invitations
```

---

# 🔐 Authentication Endpoints

## Register

```http
POST /api/auth/register
```

Example request:

```json
{
    "name": "Priyanshu",
    "email": "user@example.com",
    "password": "your_password"
}
```

---

# 🔑 Login

```http
POST /api/auth/login
```

Example request:

```json
{
    "email": "user@example.com",
    "password": "your_password"
}
```

The response provides a JWT token that can be used for protected endpoints.

---

# 👤 User Profile

```http
GET /api/users/profile
```

Authentication required:

```http
Authorization: Bearer <JWT_TOKEN>
```

---

# 🏡 Space Endpoints

## Create Space

```http
POST /api/spaces
```

Creates a new Space for the authenticated user.

---

## Get Spaces

```http
GET /api/spaces
```

Returns Spaces associated with the authenticated user.

---

## Get Single Space

```http
GET /api/spaces/<space_id>
```

Returns a specific Space.

---

## Update Space

```http
PUT /api/spaces/<space_id>
```

Updates an existing Space.

---

## Delete Space

```http
DELETE /api/spaces/<space_id>
```

Deletes an existing Space according to authorization rules.

---

# 📨 Invite Endpoint

## Join Space

```http
POST /api/invite/join
```

Example:

```json
{
    "invite_code": "ABC123"
}
```

The endpoint validates the invitation and creates membership for the user.

---

# 🔄 API Request Lifecycle

```text
                    HTTP Request
                         │
                         ▼
                       Route
                         │
                         ▼
                    Middleware
                         │
                         ▼
                    Controller
                         │
                         ▼
                      Service
                         │
                         ▼
                       Model
                         │
                         ▼
                    MongoDB Atlas
                         │
                         ▼
                      Response
```

---

# 🧪 Testing

The API can be tested using:

```text
Postman
Thunder Client
REST Client
curl
```

Recommended testing flow:

```text
Register
   ↓
Login
   ↓
Copy JWT
   ↓
Create Space
   ↓
Get Spaces
   ↓
Update Space
   ↓
Generate / Use Invite
   ↓
Join Space
   ↓
Verify Membership
   ↓
Delete Space
```

---

# 🛡️ Security

Security is important because everUS is designed around private data and memories.

The application uses:

```text
bcrypt
JWT
Protected Routes
Environment Variables
Membership Authorization
```

---

# 🚫 Never Commit Secrets

Never commit:

```text
❌ MongoDB Password
❌ MongoDB URI with Credentials
❌ JWT Secret
❌ Cloudinary API Secret
❌ API Keys
❌ Access Tokens
❌ Passwords
```

Use `.env` locally and secure secret management in production.

---

# 🔐 Future Security Improvements

Production deployment can introduce:

```text
HTTPS
Rate Limiting
Input Validation
CSRF Protection
CORS Configuration
Secure Cookies
Security Headers
MongoDB RBAC
Azure / Cloud Secret Management
Audit Logging
```

---

# 🐳 Docker

The project includes:

```text
docker-compose.yml
```

Docker can eventually be used to containerize the backend.

Conceptual setup:

```text
Docker
 │
 └── Flask Application
          │
          ▼
       MongoDB
```

---

# ☁️ Deployment Architecture

The planned production architecture is:

```text
                       Internet
                          │
                          ▼
                ┌──────────────────┐
                │      Vercel      │
                │    Frontend      │
                └────────┬─────────┘
                         │
                         │ REST API
                         ▼
                ┌──────────────────┐
                │      Render      │
                │  Flask Backend   │
                └────────┬─────────┘
                         │
              ┌──────────┴──────────┐
              │                     │
              ▼                     ▼
      ┌───────────────┐     ┌────────────────┐
      │ MongoDB Atlas │     │   Cloudinary   │
      │   Database    │     │ Media Storage  │
      └───────────────┘     └────────────────┘
```

---

# 📈 Scalability

As everUS grows, the architecture can be expanded.

```text
                     Load Balancer
                           │
              ┌────────────┼────────────┐
              │            │            │
              ▼            ▼            ▼
           Flask 1      Flask 2      Flask 3
              │            │            │
              └────────────┼────────────┘
                           │
                           ▼
                     MongoDB Atlas
```

Caching can also be introduced using:

```text
Redis
```

---

# 🧠 Engineering Concepts Demonstrated

The project demonstrates practical knowledge of:

## Backend

- Flask
- REST APIs
- Routing
- Controllers
- Services
- Middleware
- CRUD
- Authentication
- Authorization

## Database

- MongoDB
- MongoDB Atlas
- PyMongo
- Collections
- Documents
- Relationships
- CRUD operations

## Security

- JWT
- bcrypt
- Protected routes
- Environment variables
- Access control

## Cloud

- MongoDB Atlas
- Cloudinary
- Render
- Vercel

## Software Architecture

- Layered architecture
- Modular backend
- Separation of concerns
- RESTful design

---

# 🧩 Why MongoDB?

MongoDB is suitable for everUS because the platform will contain multiple types of content.

For example:

```text
Messages
Photos
Videos
Journal Entries
Notes
Timeline Events
Bucket List Items
Time Capsules
Voice Notes
Notifications
```

These features can evolve independently.

MongoDB's document-based model provides flexibility while the project is still evolving.

---

# ☁️ Why Cloudinary?

Media files can become large.

Instead of storing the actual files directly in MongoDB:

```text
MongoDB
   │
   └── Metadata
```

Cloudinary handles the media:

```text
Cloudinary
   │
   ├── Images
   ├── Videos
   └── Audio
```

This creates a cleaner architecture:

```text
                 Media Upload
                      │
              ┌───────┴───────┐
              │               │
              ▼               ▼
         Cloudinary       MongoDB
         Actual File      Metadata
```

---

# 🔄 CRUD Architecture

The Space module currently demonstrates complete CRUD functionality.

```text
CREATE
  │
  └── Create Space

READ
  │
  ├── Get Spaces
  └── Get Single Space

UPDATE
  │
  └── Update Space

DELETE
  │
  └── Delete Space
```

The same architecture can later be applied to:

```text
Messages
Journal
Notes
Timeline
Memories
Bucket List
Time Capsules
```

---

# 🎯 Real-World Use Cases

## 💕 Couples

A couple can create a private Space for:

```text
Messages
Photos
Anniversaries
Bucket Lists
Time Capsules
Journal Entries
```

---

# 👨‍👩‍👧‍👦 Families

Families can preserve:

```text
Family Photos
Events
Milestones
Memories
Messages
```

---

# 👥 Friends

Friend groups can create Spaces for:

```text
Trips
Photos
Plans
Memories
Bucket Lists
Shared Notes
```

---

# 🎓 Private Groups

The same architecture can also support:

```text
Study Groups
Project Teams
Small Communities
Private Clubs
```

---

# 🧪 Development Approach

everUS is being developed incrementally.

The project follows:

```text
Foundation
    │
    ▼
Authentication
    │
    ▼
Spaces
    │
    ▼
Membership
    │
    ▼
Invitations
    │
    ▼
Messaging
    │
    ▼
Memories
    │
    ▼
Personal Features
    │
    ▼
Production
```

This makes it easier to test and extend each feature independently.

---

# 📈 Current Project Status

### Version

```text
v0.1.0
```

### Completed

```text
✅ Flask Backend
✅ MongoDB Atlas Integration
✅ User Registration
✅ User Login
✅ bcrypt Password Hashing
✅ JWT Authentication
✅ JWT Middleware
✅ Protected Routes
✅ User Profile
✅ Space CRUD
✅ Membership System
✅ Owner / Member Roles
✅ Invite Codes
✅ Join Space
✅ Duplicate Membership Prevention
```

### In Development

```text
🚧 Messaging
```

### Planned

```text
📸 Media Gallery
📝 Journal
📌 Sticky Notes
🗓️ Timeline
🎯 Bucket List
⏳ Time Capsules
🎙️ Voice Notes
🔔 Notifications
🌙 Dark Mode
📱 Responsive Frontend
☁️ Production Deployment
```

---

# 🗺️ Roadmap

## Phase 1 — Foundation

```text
[x] Project Setup
[x] Flask Backend
[x] MongoDB Atlas
[x] Environment Configuration
[x] Authentication
[x] JWT Middleware
```

## Phase 2 — Shared Spaces

```text
[x] Create Space
[x] Get Spaces
[x] Get Single Space
[x] Update Space
[x] Delete Space
[x] Membership System
[x] Invite System
```

## Phase 3 — Communication

```text
[ ] Messaging
[ ] Message Persistence
[ ] Real-Time Messaging
[ ] Message Read Status
[ ] Typing Indicators
[ ] Notifications
```

## Phase 4 — Memories

```text
[ ] Image Gallery
[ ] Video Gallery
[ ] Albums
[ ] Captions
[ ] Memory Dates
[ ] Cloudinary Integration
```

## Phase 5 — Personal Features

```text
[ ] Journal
[ ] Sticky Notes
[ ] Timeline
[ ] Bucket List
[ ] Time Capsules
[ ] Voice Notes
```

## Phase 6 — User Experience

```text
[ ] Complete Frontend
[ ] Responsive Design
[ ] Dark Mode
[ ] Improved Dashboard
[ ] Mobile Experience
```

## Phase 7 — Production

```text
[ ] Production Deployment
[ ] CI/CD
[ ] Automated Testing
[ ] Logging
[ ] Monitoring
[ ] Rate Limiting
[ ] API Documentation
[ ] Security Hardening
```

---

# 🔮 Future Enhancements

## Real-Time Messaging

Introduce WebSocket or Socket.IO-based communication.

```text
User A
  │
  │ Message
  ▼
WebSocket
  │
  ▼
Server
  │
  ▼
User B
```

---

## Advanced Media Management

Add:

```text
Albums
Tags
Captions
Favorites
Media Search
Memory Dates
```

---

## Search

Users could search:

```text
Messages
Photos
Journal Entries
Notes
Timeline Events
```

---

## Notifications

Introduce real-time notifications for important events.

---

## Data Export

Users could eventually export their memories.

Possible formats:

```text
JSON
ZIP
PDF
Media Archive
```

---

## Mobile Application

A future mobile application could provide:

```text
Android
iOS
```

access to the same backend API.

---

# 🏢 Future Production Architecture

```text
                          USERS
                            │
                            ▼
                   ┌─────────────────┐
                   │    Frontend     │
                   │ Vercel / Mobile │
                   └────────┬────────┘
                            │
                            ▼
                   ┌─────────────────┐
                   │    API Layer    │
                   │     Flask       │
                   └────────┬────────┘
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
          ▼                 ▼                 ▼
   Authentication      Space Service     Media Service
          │                 │                 │
          └─────────────────┼─────────────────┘
                            │
                ┌───────────┴───────────┐
                │                       │
                ▼                       ▼
         MongoDB Atlas             Cloudinary
          Application               Media
             Data                  Storage
```

---

# 🧠 Long-Term Vision

The long-term vision is to turn everUS into a complete private digital memory platform.

```text
                           everUS
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
     People               Memories               Moments
        │                     │                     │
        ▼                     ▼                     ▼
     Spaces                Gallery              Timeline
        │                     │                     │
        ├──────────┬──────────┼──────────┬──────────┤
        │          │          │          │          │
        ▼          ▼          ▼          ▼          ▼
    Messages    Journal     Notes    Bucket List   Capsule
```

The central idea remains:

```text
Private Spaces
      +
Shared Moments
      +
Meaningful Memories
```

---

# 📚 Learning Outcomes

Building everUS provides practical experience with:

- Python
- Flask
- REST API development
- MongoDB
- MongoDB Atlas
- PyMongo
- JWT authentication
- bcrypt
- CRUD operations
- Middleware
- Controllers
- Service architecture
- Database modeling
- Cloudinary
- Environment configuration
- Git
- GitHub
- API testing
- Backend architecture
- Cloud deployment concepts

---


# 🧠 What Makes everUS Different?

everUS is not designed to compete with public social media.

The idea is:

```text
Less Public
     ↓
More Personal

Less Followers
     ↓
More Relationships

Less Noise
     ↓
More Meaning

Less Scrolling
     ↓
More Memories
```

The platform focuses on **private relationships rather than public audiences**.

---

# 🔒 Privacy Philosophy

The application is built around private spaces.

The architecture therefore emphasizes:

```text
Authentication
       +
Authorization
       +
Private Spaces
       +
Membership Control
       +
Secure Storage
```

Future production improvements will strengthen privacy through:

- HTTPS
- Strong authentication
- Access control
- Secure media URLs
- Rate limiting
- Input validation
- Secret management
- Database security
- Monitoring
- Audit logs

---

# 🤝 Contributing

Contributions and suggestions are welcome.

Clone the repository:

```bash
git clone https://github.com/Ristel7/Ever-US.git
```

Create a branch:

```bash
git checkout -b feature/your-feature
```

Make changes:

```bash
git add .
```

Commit:

```bash
git commit -m "Add your feature"
```

Push:

```bash
git push origin feature/your-feature
```

Then create a Pull Request.

---

# 🐛 Bug Reports

When reporting a bug, include:

```text
1. What happened?
2. What did you expect?
3. Steps to reproduce
4. Error message
5. Environment
6. API endpoint
7. Relevant logs
```

Never include passwords, API keys, JWT secrets, or database credentials.

---

# 🔐 Security Notice

If you discover a security issue, do not publicly expose sensitive information.

Never share:

```text
MongoDB Credentials
JWT Secrets
Cloudinary Secrets
API Keys
Access Tokens
Passwords
```

Remove all sensitive information from logs and screenshots before sharing them.

---

# 📊 Project Summary

| Category | Details |
|---|---|
| Project | everUS |
| Version | v0.1.0 |
| Type | Private Memory Sharing Platform |
| Backend | Python + Flask |
| Database | MongoDB Atlas |
| Database Driver | PyMongo |
| Authentication | JWT |
| Password Security | bcrypt |
| Media Storage | Cloudinary |
| API Style | REST |
| Version Control | Git + GitHub |
| Current Focus | Backend Foundation |
| Status | Active Development |

---

# 📌 Key Skills Demonstrated

```text
🐍 Python
🌐 Flask
🔐 JWT
🔒 bcrypt
🗄️ MongoDB
☁️ MongoDB Atlas
📦 PyMongo
🛡️ Authentication
👥 Authorization
🔄 REST APIs
🏗️ Backend Architecture
📁 CRUD
☁️ Cloudinary
🔧 Git
🐙 GitHub
```

---

# 📄 License

This project is licensed under the **MIT License**.

See the `LICENSE` file for complete license information.

---

# 👨‍💻 Author

## Priyanshu Kumar 

**Computer Science Engineering Student**

Building everUS as a personal software project focused on:

```text
Software Development
Backend Engineering
Data Science
Cloud Computing
Machine Learning
Databases
```

---

# 🔗 Repository

<p align="center">

<a href="https://github.com/Ristel7/Ever-US">
<img src="https://img.shields.io/badge/View%20Source%20Code-GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub">
</a>

</p>

---

# ⭐ Support

If you like the idea behind everUS, consider giving the repository a ⭐.

It helps support continued development.

---

<p align="center">

# 💙 everUS

### A private place for your people, your conversations, and your memories.

<br>

**Private Spaces • Shared Moments • Meaningful Memories**

<br>

Built with ❤️ using Python, Flask, MongoDB, and modern web technologies.

</p>

---

> **Some memories are too important to get lost in a chat history.**

> **everUS gives them a place to stay.**