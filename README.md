# 🎮 Rewind Arcade 


![LogoPerson 1](https://github.com/user-attachments/assets/e262c143-cbfe-48c8-9fb8-0eb5de9596c1)

Rewind Arcade is a web platform that revives classic arcade games, allowing users to compete for high scores, manage profiles, and enjoy a retro experience with modern features.

## ✨ Project Description

Rewind Arcade is a full-stack project offering a collection of classic games like Tetris, Snake, or Tic-Tac-Toe, among others, with a user system featuring roles (admin and user), score management, and an admin panel. The backend is built with **Node.js** and **Express**, using a **PostgreSQL** database hosted on Neon. The frontend is developed with **React** and **Vite**, providing a modern and responsive interface.

### Main Features
- 🎮 Available games: **Tetris**, **Tic-Tac-Toe**, **Snake**, **Pong**, **Connect-4**
- 🗄️ Database on **Neon (PostgreSQL)**
- 👥 Role system: **admin** and **user**
- 🛠️ Admin functionalities:
  - Delete users
  - Promote users to admin
  - Delete scores
- 🏆 Global scoring system
- 🔒 JWT authentication and authorization
- 📧 EmailJS integration for notifications

---

## 📷 Screen captures



## 🚀 Installation & Getting Started

### 1. Clone the repository

```bash
https://github.com/Nando218/RewindArcade.git
```

### 2. Set up environment variables

Create a `.env` file in the `backend` folder following the format of `.env.example` to configure the database and authentication.

### 3. Install and run the Backend

```bash
cd backend
npm install
npm run dev
```

### 4. Install and run the Frontend

Open a new terminal and run:

```bash
cd frontend
npm install
npm run dev
```

## ⚠️ In some cases, it is necessary to install the dependencies of EmailJS.

```bash
npm install @emailjs/browser
```

### 5. Access the application

Open your browser at: [http://localhost:8080/](http://localhost:8080/)

---

## 🧪 Testing
- Backend - 40.5% coverage
![Backend - 40.5% coverage](https://github.com/user-attachments/assets/8e42d954-a5a8-488d-a7bf-60ccb3b9f23d)

- Frontend - 37.3% coverage
![Frontend - 37.3% coverage](https://github.com/user-attachments/assets/478850b5-4131-4ea1-8f98-7008d57223d4)

- More tests coming soon...

---

## 🚧 Coming Soon

🕹️ New games:  Pac-Man, Arkanoid

🎵 Music and sound effects

