# Charlotte Job Board

A modern, full-stack job board web application for the Charlotte area. Built for employers and job seekers to post, discover, and manage job opportunities with a beautiful, responsive UI and robust authentication.

---

## 🚀 Features
- Secure authentication with Auth0 (social login supported)
- Add, edit, and delete job postings (with role-based access)
- User profiles with admin management
- Responsive, accessible UI with a visually rich gradient background
- Powered by FastAPI (backend) and React + TypeScript (frontend)

---

## 🛠️ Technologies Used

### Frontend
- **React 19** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** + custom gradients
- **shadcn/ui** component library
- **TanStack Query** for data fetching and caching
- **Auth0** for authentication
- **react-hook-form** for forms
- **Radix UI** for accessible primitives

### Backend
- **FastAPI** (Python 3.13)
- **SQLAlchemy** ORM
- **Alembic** for migrations
- **PostgreSQL** database
- **Auth0** JWT authentication

---

## 🏃‍♂️ Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/charlotte-job-board.git
cd charlotte-job-board
```

### 2. Backend Setup (FastAPI + PostgreSQL via Docker)

The backend and database are managed with Docker Compose. This ensures consistent environments for development and deployment.

```bash
cd cjb-backend
# Build and start the backend and database services
docker compose up --build
```
- The FastAPI backend will be available at `http://127.0.0.1:8000`.
- The PostgreSQL database will be available at the port specified in `docker-compose.yml`.

**Environment Variables:**
- Set environment variables in `.env` files or in `docker-compose.yml` as needed.

**Stopping/Removing Containers:**
```bash
docker compose down
```

### 3. Frontend Setup (React)
```bash
cd ../cjb-frontend
npm install
npm run dev
```

- The frontend will run at `http://localhost:5173` (default Vite port)
- The backend runs at `http://127.0.0.1:8000`

### 4. Environment Variables
- Configure Auth0, API URLs, and database credentials in `.env` files for both backend and frontend.

---

## 📚 Project Structure
```
cjb-backend/   # FastAPI backend
cjb-frontend/  # React frontend
```

---

## 📝 Notes
- Admin users can manage all job postings and user profiles.
- Regular users can only edit/delete their own jobs.
- All API calls use TanStack Query hooks for consistency and performance.
- Custom gradient backgrounds and UI components for a modern look.

---

## 🤝 Contributing
Pull requests welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License
[MIT](LICENSE)
