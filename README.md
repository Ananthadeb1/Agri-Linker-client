# 🌾 AgriLinker Client (Frontend)

AgriLinker Client is a modern React + Vite application built with Tailwind CSS, DaisyUI, React Router v7, React Query, and Firebase Authentication.

## 🚀 Key Features
- **Responsive Landing Page**: Interactive hero section, role-aware action tabs, category showcases, video modal, and testimonials.
- **Direct Farm Marketplace**: Product filtering, search preference tracking, shopping cart, and checkout flow.
- **Farmer Dashboard**: Produce submission with direct ImgBB CDN image upload, stock management, and loan request forms.
- **AI Crop Advisor**: Interactive crop recommendation based on soil and weather metrics.
- **Micro-Investment & Crowdfunding**: Discover vetted farmer loan requests and fund agricultural expansion.
- **Order Logistics Tracking**: Real-time order status tracking with timeline history.
- **Admin Dashboard**: Comprehensive user management, order processing, farmer verification control, and loan administration.

# 🌾 AgriLinker Server (Backend API)

AgriLinker Server is an Express.js 5 REST API powering the AgriLinker platform with MongoDB integration, Firebase Admin SDK authentication, JWT security, and cloud media handling.

## 🚀 Key Features
- **Stateless Cloud Storage**: Product image uploads are processed via in-memory Multer storage and uploaded directly to ImgBB Cloud CDN or stored as Data URIs in MongoDB. No files are saved to local server disk (`0% local storage dependency`).
- **Role-Based Authorization**: JWT verification middleware with `admin` and `superadmin` role guards.
- **Superadmin Seeding**: Automatic superadmin seeding on startup (`SUPER_ADMIN_EMAIL`).
- **Order & Logistics Management**: Order creation, status updates, and automated tracking sync.
- **Loan & Investment Processing**: Farmer loan submission, admin approval workflow, and investor crowdfunding endpoints.
- **Crop Recommendation API**: AI and rule-based crop suggestions for farmers.

## 📦 Setup & Running
```bash
npm install
npm run dev
```

Build for production:
```bash
npm run build
```
## Links
live link: https://hilarious-biscuit-d1a0c5.netlify.app/
Client-Side Code: https://github.com/Ananthadeb1/Agri-Linker-client/
Server-Side Code: https://github.com/Ananthadeb1/Agri-Linker-Server

