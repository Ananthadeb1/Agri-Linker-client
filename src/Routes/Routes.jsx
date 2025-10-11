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
                element: <PrivateRoute> <Products /></PrivateRoute>,
            },
            {
                path: "/admin-dashboard",
                element: <PrivateRoute> <Dashboard /></PrivateRoute>,
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
                element: <PrivateRoute><AddProduct /></PrivateRoute> // Add this route
            },
            {
                path: "/cart", // Add this route
                element: <PrivateRoute> <Cart /></PrivateRoute>,
            },
            {
                path: "/rating-review",
                element: <PrivateRoute><RatingReview /></PrivateRoute>,
            }
        ],
    },

]);


