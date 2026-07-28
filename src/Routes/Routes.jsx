import {
    createBrowserRouter,
} from "react-router-dom";
import Products from "../Components/Pages/Products/Products";
import Login from "../Ragistration/Login/Login";
import Signup from "../Ragistration/Signup/Signup";
import PrivateRoute from "../Shared/PriveteRoute/privateRoute";
import Main from "../Layout/Main";
import AddProduct from "../Components/Pages/AddProduct/AddProduct";
import LandingPage from "../Components/Pages/LandingPage/LandingPage";
import Dashboard from "../Components/Pages/Dashboard/Dashboard";
import Cart from "../Components/Pages/Cart/Cart";

import UserProfile from "../Components/Pages/userProfile/userProfile";
import LoanRequest from "../Components/Pages/LoanRequest/LoanRequest";
import InvestPage from "../Components/Pages/InvestPage/InvestPage";
import OrderTracking from "../Components/Pages/OrderTrack/OrderTracking";


 // Add import here
import RatingReview from "../Components/Pages/RatingReview/RatingReview";
import CropRecommendation from "../Components/Pages/CropRecommendation/CropRecommendation";
import MyProducts from "../Components/Pages/MyProducts/MyProducts";



import ForgotPassword from "../Ragistration/ForgotPassword/ForgotPassword";
import ResetPassword from "../Ragistration/ResetPassword/ResetPassword";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Main></Main>,
        children: [
            {
                path: "/",
                element: <LandingPage />,
            },
            {
                path: "/products",
                element: <PrivateRoute><Products /></PrivateRoute>,
            },
            {
                path: "/admin-dashboard",
                element: <PrivateRoute allowedRoles={["admin"]}><Dashboard /></PrivateRoute>,
            },
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/signup",
                element: <Signup />,
            },
            {
                path: "/forgot-password",
                element: <ForgotPassword />,
            },
            {
                path: "/reset-password",
                element: <ResetPassword />,
            },
            {
                path: '/add-product',
                element: <PrivateRoute allowedRoles={["farmer"]}><AddProduct /></PrivateRoute>
            },
            {
                path: "/cart",
                element: <PrivateRoute allowedRoles={["buyer"]}><Cart /></PrivateRoute>,
            },
            {
                path: "/rating-review",
                element: <PrivateRoute allowedRoles={["buyer"]}><RatingReview /></PrivateRoute>,
            },
            {
                path: '/userProfile',
                element: <PrivateRoute><UserProfile /></PrivateRoute>
            },
            {
                path: "/loan-request",
                element: <PrivateRoute allowedRoles={["farmer"]}><LoanRequest /></PrivateRoute>
            },
            {
                path: "/invest",
                element: <PrivateRoute allowedRoles={["buyer"]}><InvestPage /></PrivateRoute>
            },
            {
                path: "/track-order",
                element: <PrivateRoute allowedRoles={["buyer"]}><OrderTracking /></PrivateRoute>
            },
            {
                path: "/crop-recommendation",
                element: <PrivateRoute allowedRoles={["farmer"]}><CropRecommendation /></PrivateRoute>,
            },
            {
                path: "/my-products",
                element: <PrivateRoute allowedRoles={["farmer"]}><MyProducts /></PrivateRoute>,
            }
        ],
    },
]);