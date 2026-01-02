# PrimeTrade

This is a task management app I built for the Frontend Developer Intern assignment. It's got a nice Web3-ish feel to it with some cool glassmorphism and animations. I used Next.js for the frontend and a Node/Express backend with MongoDB.

## Features
- JWT Auth (Login/Signup)
- Full CRUD for Tasks (Create, Edit, Delete)
- Dashboard stats
- Profile updates (supports avatar uploads)
- Responsive UI with Framer Motion animations

## Tech Stack
- **Frontend**: Next.js 15, Tailwind, Framer Motion, Axios
- **Backend**: Node.js, Express, MongoDB, JWT

## How to Run it

### 1. Clone & Install
```bash
git clone https://github.com/Krishnakumar-Naik/PrimeTrade
cd prime-trade
```

### 2. Setup the Server
Go into the `server` folder, install everything, and set up your environment:
```bash
cd server
npm install
```
Create a `.env` file in the `server` folder with these values:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/prime-trade  # Replace with your own Atlas URL if needed
JWT_SECRET=anything_you_want
NODE_ENV=development
```
> **Note**: I'm using a local MongoDB URL by default here. If you want to use MongoDB Atlas, just swap the `MONGODB_URI` with your own cluster connection string (and keep your password safe!).

Run the server:
```bash
npm run dev
```

### 3. Setup the Client
Open a new terminal, go to the `client` folder:
```bash
cd client
npm install
```
Create a `.env.local` for the client:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```
Run the frontend:
```bash
npm run dev
```

## Scalability Stuff
If I were taking this to production, I'd probably add:
- Redis for caching tasks and sessions.
- Proper refresh tokens (HttpOnly cookies) instead of just keeping the JWT in localstorage.
- Image storage on something like AWS S3 or Cloudinary instead of just storing base64 strings in the DB.
- Maybe move to TypeScript on the backend too for better type safety across the whole stack.
