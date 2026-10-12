# EduProof Frontend
React + Vite web app for issuing and verifying academic certificates.
## Tech Stack
- **React 18** · **Vite 5** · **React Router DOM v6** · **Axios** · **Vanilla CSS**
## Setup & Run
```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build → dist/
Project Structure
src/
├── components/    # Navbar, ProtectedRoute
├── context/       # AuthContext (global auth state)
├── hooks/         # Custom hooks
├── pages/         # All page components
├── services/      # Axios API calls
└── utils/         # Helper functions
Pages
Page	Role
Home	Public
Login / Register	Public
Admin Dashboard	Admin
Student Dashboard	Student
Recruiter Dashboard	Recruiter
Students	Admin
Certificates	Admin, Student
Issue Certificate	Admin
Verification	Public, Recruiter
Verification Result	Public, Recruiter
Profile	All logged-in users
Auth & Routing
JWT token stored in context via AuthContext
ProtectedRoute guards role-based pages
Redirects unauthenticated users to /login
API Proxy
Dev server proxies to backend (http://localhost:9091):

/api      → backend REST API
/uploads  → certificate PDFs & QR images
