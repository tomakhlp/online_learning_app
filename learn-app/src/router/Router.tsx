import Home from "../pages/main/Home/Home.tsx";
import Login from "../pages/main/Login/Login.tsx";
import MyAccount from "../pages/main/MyAccount/MyAccount.tsx";
import Training from "../pages/main/Training/Training.tsx";
import JoinUs from "../pages/main/JoinUs/JoinUs.tsx";
import ChangePassword from "../pages/main/ChangePassword/ChangePassword.tsx";
import Registration from "../pages/main/Registration/Registration.tsx";
import RegistrationSuccess from "../pages/main/Registration/RegistrationSuccess.tsx";
import NotFound from "../pages/main/NotFound/NotFound.tsx";
import {createBrowserRouter, Navigate} from "react-router";
import App from "../App.tsx";
import PrivateRoute from "./PrivateRoute.tsx";
import Blog from "../pages/secondary/Blog/Blog.tsx";
import Pricing from "../pages/secondary/Pricing/Pricing.tsx";
import Features from "../pages/secondary/Features/Features.tsx";
import {ROUTES} from "../constants/routes.ts";
import AboutUs from "../pages/secondary/AboutUs/AboutUs.tsx";
import ComingSoon from "../pages/secondary/ComingSoon/ComingSoon.tsx";
import AddTrainer from "../pages/main/AddTrainer/AddTrainer.tsx";
import AddTraining from "../pages/main/AddTraining/AddTraining.tsx";
import StudentRoute from "./StudentRoute.tsx";
import ChangePasswordSuccess from "../pages/main/ChangePassword/ChangePasswordSuccess.tsx";

export const router = createBrowserRouter([
    {
        path: ROUTES.ROOT,
        element: <App />,
        children: [
            {
                path: "/",
                element: <Navigate to={ROUTES.HOME} />,
            },
            {
                path: ROUTES.HOME,
                element: <Home />,
            },
            {
                path: ROUTES.LOGIN,
                element: <Login />,
            },
            {
                path: ROUTES.MY_ACCOUNT,
                element: <PrivateRoute element={<MyAccount />} />,
                children: [
                    {
                        path: ROUTES.ADD_TRAINER,
                        element: <AddTrainer />,
                    },
                    {
                        path: ROUTES.TRAINING,
                        element: <Training />,
                        children: [
                            {
                                path: ROUTES.ADD_TRAINING,
                                element: <StudentRoute element={<AddTraining />} />,
                            }
                        ],
                    },
                    {
                        path: ROUTES.CHANGE_PASSWORD,
                        element: <ChangePassword />,
                    },
                ],
            },
            {   path: `/${ROUTES.CHANGE_PASSWORD}/${ROUTES.SUCCESS}`,
                element: <ChangePasswordSuccess />,
            },
            {
                path: ROUTES.JOIN_US,
                element: <JoinUs />,
            },
            {
                path: `${ROUTES.REGISTRATION}/:role`,
                element: <Registration />,
                children: [
                    {   path: ROUTES.SUCCESS,
                        element: <RegistrationSuccess />,
                    },
                ]
            },
            {
                path: ROUTES.BLOG,
                element: <Blog />
            },
            {
                path: ROUTES.PRICING,
                element: <Pricing />
            },
            {
                path: ROUTES.FEATURES,
                element: <Features />
            },
            {
                path: ROUTES.ABOUT_US,
                element: <AboutUs />
            },
            {
                path: ROUTES.CONTACT_US,
                element: <ComingSoon />
            },
            {
                path: ROUTES.USER_GUIDES,
                element: <ComingSoon />
            },
            {
                path: ROUTES.WEBINARS,
                element: <ComingSoon />
            },
            {
                path: ROUTES.PRIVACY,
                element: <ComingSoon />
            },
            {
                path: ROUTES.TERMS,
                element: <ComingSoon />
            },
            {
                path: ROUTES.NOT_FOUND,
                element: <NotFound />,
            },
            {
                path: '*',
                element: <Navigate to={ROUTES.NOT_FOUND} replace />,
            },
        ]
    }
]);
