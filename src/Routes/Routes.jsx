import {
    createBrowserRouter,
} from "react-router-dom";
import Home from "../Components/Pages/Home/Home";
import Login from "../Ragistration/Login/Login";
import Signup from "../Ragistration/Signup/Signup";
import PrivateRoute from "../Shared/PriveteRoute/privateRoute";
import Main from "../Layout/Main";
import Dashboard from "../Components/Pages/Dashboard/Dashboard";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Main></Main>,
        children: [
            {
                path: "/",
                element: <Home />,
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
                path: "/dashboard",
                element: <Dashboard />,
            }
        ],
    },

]);


