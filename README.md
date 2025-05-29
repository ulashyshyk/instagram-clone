# 📸 Instagram Clone

A full-stack clone of Instagram built with **React**, **Node.js**, **Express**, and **MongoDB**. This project replicates key features of Instagram including user authentication, posting images, liking, following, and messaging. Designed with responsive UI and RESTful API architecture.

> ⚠️ This project is still under development.

---

## 🚀 Features

- 🔐 Secure **JWT authentication** with refresh tokens
- 📷 Upload and view **posts with images**
- ❤️ Like/unlike posts and view likes count
- 👤 Follow/unfollow other users
- 💬 Real-time **chat/messaging**
- 🧾 User profile with avatar, bio, and posts
- 🧪 Protected routes and role-based access
- 📱 Responsive UI with **React Context** for global state
- ☁️ Image storage with **Cloudinary**

---

## 🛠️ Tech Stack

### Backend
- Node.js, Express.js
- MongoDB + Mongoose
- Socket.io (Real-time messaging)
- JWT for authentication
- Bcrypt.js for password hashing
- Multer + Cloudinary (Image uploads)
- CORS, Dotenv
- Day.js

### Frontend
- React 19, React Router DOM
- Context API (state management)
- Socket.io Client
- Tailwind CSS, Chakra UI
- Framer Motion (animations)
- Lucide-react (icons)
- Emoji Picker React
- React Hot Toast (notifications)
- Axios

---

## 📂 Project Structure

```
instagram-clone/
├── backend/      # Express server, REST API, MongoDB models
└── frontend/     # React client, Tailwind styles, UI components
```

---

## 🛠️ Setup Instructions

### Prerequisites
- Node.js & npm
- MongoDB (Atlas or local)
- Cloudinary account

### Clone the repository
```bash
git clone https://github.com/ulashyshyk/instagram-clone.git
cd instagram-clone
```

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Fill in environment variables (Mongo URI, JWT keys, Cloudinary keys)
npm run dev
```

### Frontend Setup
```bash
cd ../frontend
npm install
cp .env.example .env
# Fill in frontend environment variables (API base URL, etc.)
npm start
```

---

## 🙋‍♂️ About Me

Hi, I'm [Ulash Yshyk](https://www.linkedin.com/in/ulashyshyk/), a Computer Programming & Analysis student at Seneca Polytechnic, passionate about building scalable, full-stack applications. Currently seeking a **Fall 2025 Software Development Co-op** opportunity!

---

## 📫 Contact

- ✉️ Email: isikulas1907@gmail.com  
- 💼 LinkedIn: [linkedin.com/in/ulashyshyk](https://www.linkedin.com/in/ulashyshyk)

---

