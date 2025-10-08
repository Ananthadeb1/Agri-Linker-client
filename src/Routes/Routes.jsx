import {
    createBrowserRouter,
} from "react-router-dom";
import Home from "../Components/Pages/Home/Home";
import Login from "../Ragistration/Login/Login";
import Signup from "../Ragistration/Signup/Signup";
import PrivateRoute from "../Shared/PriveteRoute/privateRoute";
import Main from "../Layout/Main";

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
                path: "/home",
                element: <PrivateRoute> <Home /></PrivateRoute>,
            },
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/signup",
                element: <Signup />,
            }
        ],
    },

]);


