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

![main](https://github.com/user-attachments/assets/e6e422a8-22a4-4702-b197-4fd1b5fd5fa3)

![Tetris](https://github.com/user-attachments/assets/aa2f72ac-339c-4895-a036-97038878098b)

![TicTacToe](https://github.com/user-attachments/assets/4094d578-2ee4-43a2-844d-ca03ca32e8a0)

![Snake](https://github.com/user-attachments/assets/47dbc31b-ef8c-4674-b1ea-7ff1eea935ba)

![Pong](https://github.com/user-attachments/assets/12a64450-64a4-4eea-814f-57ad8f50f1e7)

![Connect-4](https://github.com/user-attachments/assets/274a5c6d-0294-46e5-b208-128d4fd912c6)



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
- Backend - 55.27% coverage
![TestBack](https://github.com/user-attachments/assets/8d84eace-72b2-420a-9d06-e76cc94731a7)

```bash
cd backend
npm test
```


- Frontend - 51.89% coverage
![TestFront](https://github.com/user-attachments/assets/3aca1b23-0ec8-48c0-8883-ae69788c841b)

```bash
cd frontend
npx vitest run
```

- More tests coming soon...

---

## 🚧 Coming Soon

🕹️ New games:  Pac-Man, Arkanoid

👥 2 players mode

🎵 Music and sound effects

