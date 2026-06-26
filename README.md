# 💙 everUS

**everUS** is a private memory-sharing platform designed for **couples, families, and friends**. It provides a secure shared space where users can preserve memories, communicate, and collaborate through features such as messages, journals, galleries, sticky notes, timelines, bucket lists, and time capsules.

---

## ✨ Features

### 🔐 Authentication

* User Registration
* User Login
* Password Hashing (bcrypt)
* JWT Authentication
* Protected Routes
* User Profile

### 🏡 Shared Spaces

* Create Space
* View All Spaces
* View Single Space
* Update Space
* Delete Space

### 👥 Membership System

* Owner Membership
* Join Shared Spaces
* Duplicate Membership Prevention
* Role-based Membership (Owner / Member)

### 📨 Invite System

* Generate Unique Invite Codes
* Join Space Using Invite Code
* Secure Invitation Flow

### 🚀 Upcoming Features

* Real-time Messaging
* Media Gallery
* Journal
* Sticky Notes
* Timeline
* Bucket List
* Time Capsules
* Voice Notes
* Notifications
* Dark Mode
* Responsive Web Application

---

# 🛠 Tech Stack

## Backend

* Python
* Flask
* PyMongo
* MongoDB Atlas
* JWT Authentication
* bcrypt
* Cloudinary

## Frontend (Upcoming)

* HTML5
* CSS3
* JavaScript
* Tailwind CSS

## Deployment (Planned)

* Frontend: Vercel
* Backend: Render
* Database: MongoDB Atlas
* Media Storage: Cloudinary

---

# 📂 Project Structure

```text
everUS
│
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── services
│   ├── utils
│   ├── app.py
│   └── requirements.txt
│
├── frontend
│
├── .env.example
├── docker-compose.yml
└── README.md
```

---

# ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/your-username/everUS.git
cd everUS
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate the virtual environment:

### Windows

```bash
venv\Scripts\activate
```

### Linux / macOS

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r backend/requirements.txt
```

---

# 🔑 Environment Variables

Create a `.env` file inside the `backend` folder.

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

# ▶️ Run the Project

```bash
cd backend
python app.py
```

Server runs at:

```text
http://127.0.0.1:5000
```

---

# 📌 Current API Modules

## Authentication

* POST `/api/auth/register`
* POST `/api/auth/login`
* GET `/api/users/profile`

## Spaces

* POST `/api/spaces`
* GET `/api/spaces`
* GET `/api/spaces/<space_id>`
* PUT `/api/spaces/<space_id>`
* DELETE `/api/spaces/<space_id>`

## Invitations

* POST `/api/invite/join`

---

# 🗄 Database Collections

* users
* spaces
* memberships

---

# 📈 Project Status

Current Version: **v0.1.0**

Completed Modules:

* Authentication
* Space Management
* Membership System
* Invite System

Currently in Development:

* Messaging Module

---

# 🤝 Contributing

Contributions, feature suggestions, and bug reports are welcome. Feel free to fork the repository and submit a pull request.

---

# 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Developer

**Priyanshu**

Building **everUS** as a secure platform where people can create shared digital spaces to preserve memories and stay connected.
