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
import RatingReview from "../Components/Pages/RatingReview/RatingReview";
import UserProfile from "../Components/Pages/userProfile/userProfile";
import LoanRequest from "../Components/Pages/LoanRequest/LoanRequest";
import InvestPage from "../Components/Pages/InvestPage/InvestPage"; // Add import here

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
                element: <PrivateRoute><Dashboard /></PrivateRoute>,
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
                path: '/add-product',
                element: <PrivateRoute><AddProduct /></PrivateRoute>
            },
            {
                path: "/cart",
                element: <PrivateRoute><Cart /></PrivateRoute>,
            },
            {
                path: "/rating-review",
                element: <PrivateRoute><RatingReview /></PrivateRoute>,
            },
            {
                path: 'userProfile',
                element: <PrivateRoute><UserProfile /></PrivateRoute>
            },
            {
                path: "/loan-request",
                element: <PrivateRoute><LoanRequest /></PrivateRoute>
            },
            {
                path: "/invest",            // <-- Add this new route
                element: <PrivateRoute><InvestPage /></PrivateRoute>
            },
            {
                path: '/userProfile',
                element: <PrivateRoute>
                    <UserProfile></UserProfile>
                </PrivateRoute>
            },
        ],
    },
]);