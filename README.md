# AgriLinker Client

## Professional Project Summary
AgriLinker is a full-stack agriculture marketplace platform designed to connect buyers, farmers, and administrators in a single web application. The system supports secure user authentication, role-based access control, product management, investment workflows, order tracking, reviews, and administrative oversight.

## Architecture Overview
The project is implemented as a client-server MERN-style application with the following structure:
- **Frontend:** React + Vite with Tailwind CSS / DaisyUI, React Router, React Query, Firebase Authentication, and Axios.
- **Backend:** Express.js with MongoDB using the native driver, JWT-based authorization, file upload support via Multer, and environment-based configuration.

## Key Technology Stack
- React 18, Vite, Tailwind CSS, DaisyUI
- React Router DOM v7, React Query
- Firebase Authentication (email/password and Google sign-in)
- Axios, SweetAlert2, Material UI icons
- Express 5, MongoDB, JWT, CORS, Multer
- dotenv for environment configuration

## Client Application Capabilities
The client delivers a responsive, role-aware web interface with the following capabilities:
- Login and signup flows with Firebase and Google sign-in
- Unified auth context for user state, token management, and protected routes
- Role-based navigation and access control for Buyer, Farmer, Admin, and Superadmin
- Product browsing, shopping cart access, and product detail pages
- Investment page for buyers to discover and invest in farmer loan requests
- Rating and review pages for buyers to rate products and manage reviews
- User profile management with editable profile data
- Admin dashboard sections for user management, loan control, order management, and investment oversight

## Backend Services and Features
The backend provides a robust API surface for the application:
- Authentication token issuance via `/jwt`
- JWT verification middleware for protected endpoints
- Role-based admin authorization with `admin` and `superadmin` protection
- Persistent user role management and superadmin seeding
- User collection CRUD endpoints, including role updates and secure deletion
- Product management endpoints for public and farmer-owned product views
- Cart, orders, order tracking, and payment support
- Loan request creation, investment processing, and admin review workflows
- Rating and review storage with pending review flows
- Crop recommendation and user preference tracking
- Image upload support for product and profile photos

## Roles and Access Matrix
- **Buyer**
  - Access home, products, invest, cart, rating/review, order tracking, profile
- **Farmer**
  - Access home, products, my products, crop advisor, loan request, add product, profile
- **Admin**
  - Full dashboard access, user role management, order and loan control, investment reports
- **Superadmin**
  - Reserved account with immutable ownership and highest privileges

## Data Model Highlights
The server uses MongoDB collections for:
- `users`
- `products`
- `carts`
- `ordered_Items`
- `rating_review`
- `loanrequests`
- `ordertracks`
- `investments`
- `farmers`
- `userpreferences`
- `pendingreviews`

## Security and Authorization Notes
- JWT tokens are generated for authenticated users and stored in client local storage
- Protected backend routes validate the token and verify user roles
- Admin routes explicitly allow `admin` and `superadmin` roles
- Superadmin account is seeded on startup for a consistent management entry point
- The client refreshes user role data after signup and social login to avoid stale authorization state

## Project Status and Strengths
- The platform already supports role-based navigation and protected routing
- UI has been designed with a modern dashboard and responsive layout in mind
- Backend and frontend are separated cleanly by API contract and auth flow
- Superadmin and admin protections are implemented to safeguard key user operations
- User onboarding supports both email/password and Google authentication

## Recommended Next Steps
- Add complete automated tests for frontend routes and backend role enforcement
- Standardize all route URLs and update placeholder documentation links
- Harden production security by moving secrets to environment variables and clearing local storage on logout
- Add full investment transaction persistence and real payment gateway integration
- Enhance user role change UI and audit trails for admin actions

## File Locations to Review
- Frontend source: `agri-linker-client/src`
- Backend source: `agri-linker-server/index.js`
- Route modules: `agri-linker-server/routes`
- Authentication provider: `agri-linker-client/src/Provider/AuthProvider.jsx`
- Private route guard: `agri-linker-client/src/Shared/PriveteRoute/privateRoute.jsx`
- Admin dashboard user management: `agri-linker-client/src/Components/Pages/Dashboard/UserManagement/UserManagement.jsx`

## Setup Commands
From the client folder:
```bash
npm install
npm run dev
```
From the server folder:
```bash
npm install
npm run dev
```

## Deployment Notes
- Ensure `ACCESS_TOKEN_SECRET` and `SUPER_ADMIN_EMAIL` are configured in the server `.env`
- Use a hosted MongoDB instance for production
- Update the frontend base API URL from `http://localhost:5000` to the deployed backend URL
- Review CORS settings and secure file uploads before deployment
