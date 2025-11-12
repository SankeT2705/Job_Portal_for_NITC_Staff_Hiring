# mern-project-template-SSLlab-monsoon2025
This is the template created for MERN project for SSL Lab in Monsoon 2025 for MTech First year student

## Team Contributions
- Nithin Sai: Setup complete, ready for the challenge
- Sanket Bobhate: Connected (New Branch SankeT2705 created)


Job_Portal_for_NITC_Staff_Hiring/
│
├── client/                 # Frontend (ReactJS)
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   ├── pages/          # Page-level components
│   │   ├── App.js          # Root React component
│   │   └── index.js        # React entry point
│   └── package.json        # Frontend dependencies
│
├── server/                 # Backend (Node.js + Express)
│   ├── config/             # Database connection and environment setup
│   ├── controllers/        # API logic handlers
│   ├── models/             # Mongoose models (User, Job, Application)
│   ├── routes/             # Express API routes
│   ├── server.js           # Entry point of backend server
│   └── package.json        # Backend dependencies
│
├── .gitignore
├── README.md
└── CONTRIBUTING.md



| Method     | Endpoint                         | Description                | Request Body / Params             | Response                          |
| ---------- | -------------------------------- | -------------------------- | --------------------------------- | --------------------------------- |
| **POST**   | `/api/auth/register`             | Register new user          | `{ name, email, password, role }` | `{ success, token, user }`        |
| **POST**   | `/api/auth/login`                | User login                 | `{ email, password }`             | `{ success, token, user }`        |
| **GET**    | `/api/users/me`                  | Get logged-in user details | JWT in header                     | `{ name, email, role }`           |
| **GET**    | `/api/jobs`                      | Fetch all job postings     | Optional filters                  | `[ { jobId, title, dept, ... } ]` |
| **GET**    | `/api/jobs/:id`                  | Get single job details     | Job ID in URL                     | `{ jobId, title, desc, ... }`     |
| **POST**   | `/api/jobs`                      | Create job post (Admin)    | `{ title, desc, dept }`           | `{ success, job }`                |
| **PUT**    | `/api/jobs/:id`                  | Update job (Admin)         | Job ID + body                     | `{ success, updatedJob }`         |
| **DELETE** | `/api/jobs/:id`                  | Delete job (Admin)         | Job ID                            | `{ success }`                     |
| **POST**   | `/api/applications`              | Apply for job              | `{ jobId, userId, resumeLink }`   | `{ success, application }`        |
| **GET**    | `/api/applications/:jobId`       | Get applications for a job | Job ID                            | `[ { user, resume, status } ]`    |
| **GET**    | `/api/applications/user/:userId` | Get applications by user   | User ID                           | `[ { jobId, status } ]`           |



| Component / Page     | Description                    | Key Features                          |
| -------------------- | ------------------------------ | ------------------------------------- |
| **HomePage**         | Landing page with navigation   | Browse Jobs / Post Jobs / Login links |
| **LoginPage**        | User authentication page       | Email & Password form                 |
| **RegisterPage**     | User registration              | Role-based (Admin/Applicant) signup   |
| **JobListPage**      | Displays all available jobs    | Filter by department, role, date      |
| **JobDetailsPage**   | Full details of a selected job | Apply button, eligibility info        |
| **ProfilePage**      | User dashboard                 | Edit info, view applied jobs          |
| **PostJobPage**      | Admin page to post jobs        | Form for job title, desc, last date   |
| **ApplicationsPage** | Admin view of applicants       | Table with applicant names & resumes  |
| **Navbar**           | Top navigation bar             | Conditional rendering by role         |
| **JobCard**          | Reusable job summary card      | Title, department, apply button       |
| **ProtectedRoute**   | Route protection component     | Redirects unauthorized users          |


| Layer               | Technologies               | Description                                      |
| ------------------- | -------------------------- | ------------------------------------------------ |
| **Frontend**        | React.js, Bootstrap, Axios | SPA interface for job portal                     |
| **Backend**         | Node.js, Express.js        | RESTful API for job and user management          |
| **Database**        | MongoDB (Mongoose)         | Stores job listings, applications, and user data |
| **Authentication**  | JWT (JSON Web Tokens)      | Secures endpoints and manages roles              |
| **Environment**     | dotenv                     | Manages environment variables                    |
| **Version Control** | Git, GitHub                | Source code hosting                              |
| **Styling**         | CSS3, Bootstrap            | Responsive design and layout                     |


Current Resume method: Resume stored as a URL string in MongoDB — no file upload service used.