# NITC Job Portal

Modern MERN stack platform for publishing, managing, and applying to NITC staff hiring opportunities. The repository hosts both the **React** frontend (`client/`) and the **Node.js/Express** API (`server/`), making it easy to deploy the two apps separately (e.g., Vercel Frontend + Vercel Serverless Backend).

---

## ✨ Highlights

- Role-based flows for applicants, admins, and super admins.
- Dark/light themed UI with job search, filtering, and detail modals.
- Secure authentication, JWT-protected APIs, and fine-grained admin actions.
- Email notifications (Nodemailer/Resend) and rate-limited Express server.
- MongoDB Atlas persistence for jobs, applications, users, and notifications.

---

## 🗂️ Project Structure

```
Job_Portal_for_NITC_Staff_Hiring/
├── client/                 # React SPA (Create React App)
│   ├── public/             # Static assets
│   └── src/
│       ├── components/     # Shared UI
│       ├── pages/          # Route-level views
│       ├── context/        # Auth & theme providers
│       └── services/       # API helpers
├── server/                 # Express API
│   ├── config/             # DB + email configs
│   ├── controllers/        # Business logic
│   ├── middleware/         # Auth, rate limiting
│   ├── models/             # Mongoose schemas
│   └── routes/             # REST endpoints
└── CONTRIBUTING.md
```

---

## 🧰 Tech Stack

| Layer        | Technologies / Notes                              |
| ------------ | ------------------------------------------------- |
| Frontend     | React 19, React Router, Bootstrap 5, Axios        |
| Backend      | Node 20+, Express 5, Mongoose 8                   |
| Auth         | JWT, bcrypt                                       |
| Email        | Nodemailer + SMTP or Resend API                   |
| Security     | Helmet, Rate limiting, CORS                       |
| Deployment   | Vercel (recommended), MongoDB Atlas               |

---

## 🚀 Getting Started

### Prerequisites
- Node.js **>= 18** and npm **>= 9**
- MongoDB Atlas connection string
- SMTP/Resend credentials for transactional emails

### 1. Clone and install
```bash
git clone https://github.com/<your-org>/Job_Portal_for_NITC_Staff_Hiring.git
cd Job_Portal_for_NITC_Staff_Hiring

# Install frontend deps
cd client && npm install

# Install backend deps
cd ../server && npm install
```

### 2. Configure environment variables

`server/.env`
```
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=super_secret_string
SMTP_USER=your_email@example.com
SMTP_PASS=app_password_or_token
RESEND_API_KEY=optional_if_using_resend
ORIGIN_WHITELIST=https://your-frontend-domain.com
```

`client/.env`
```
REACT_APP_API_URL=https://your-backend-domain.com
```

### 3. Run locally
```bash
# Terminal 1 - backend
cd server
npm run dev   # nodemon server.js

# Terminal 2 - frontend
cd client
npm start
```
Frontend runs on `http://localhost:3000`, backend on `http://localhost:5000`.

---

## ☁️ Deployment (Vercel)

1. **Backend**  
   - Create a Vercel project, set **Root Directory** = `server`.  
   - Build Command: `npm install`, Output: leave empty, set the Runtime to Node.js 20.  
   - Add the server environment variables in Vercel → Settings → Environment Variables.  
   - Deploy and note the backend URL (e.g., `https://nitc-job-portal-backend.vercel.app`).

2. **Frontend**  
   - Create another Vercel project pointing to the same repo, set **Root Directory** = `client`.  
   - Build Command: `npm run build`, Output: `build`.  
   - Set `REACT_APP_API_URL` to the backend URL from step 1.  
   - Redeploy; update CORS origins in `server/server.js` to include the new frontend domain.

---

## 📡 API Overview

| Method | Endpoint                         | Description                       |
| ------ | -------------------------------- | --------------------------------- |
| POST   | `/api/auth/register`             | Register user/admin/super-admin   |
| POST   | `/api/auth/login`                | Email/password login              |
| GET    | `/api/users/me`                  | Current user profile              |
| GET    | `/api/jobs`                      | List jobs with optional filters   |
| GET    | `/api/jobs/:id`                  | Job details                       |
| POST   | `/api/jobs`                      | Create job (admin)                |
| PUT    | `/api/jobs/:id`                  | Update job (admin)                |
| DELETE | `/api/jobs/:id`                  | Delete job (admin)                |
| POST   | `/api/applications`              | Apply to a job                    |
| GET    | `/api/applications/:jobId`       | Applications for a job (admin)    |
| GET    | `/api/applications/user/:userId` | Application history for a user    |

> Resumes are currently stored as public URLs in MongoDB; file storage integration can be added later (S3, Cloudinary, etc.).

---

## 🧭 Frontend Screens & Components

| View / Component  | Purpose                                           |
| ----------------- | ------------------------------------------------- |
| Home & Login      | Entry points, login selection, theming toggle     |
| User Dashboard    | Search/filter jobs, apply, track status           |
| Admin Dashboard   | Manage job posts, review applications             |
| Super Admin       | Approve admin requests, send notifications        |
| Shared Components | Navbar, Job cards, Protected routes, Modals       |

---

## 📜 Useful npm Scripts

| Location | Command          | Description                    |
| -------- | ---------------- | ------------------------------ |
| client   | `npm start`      | Run CRA dev server             |
| client   | `npm run build`  | Production React build         |
| server   | `npm run dev`    | Nodemon development server     |
| server   | `npm start`      | Run Express in production mode |

---

## 🤝 Contributing

Guidelines for coding standards, branching, and pull requests are documented in [`CONTRIBUTING.md`](CONTRIBUTING.md). Please create feature branches, add relevant tests, and open descriptive pull requests.

---

## 📄 License

This project is currently intended for internal academic use. If you plan to reuse it outside the lab, please clarify licensing/attribution with the maintainers.
