import { Navigate } from "react-router";
import {JSX, useContext} from "react";
import {AuthContext} from "../context/AuthContext.tsx";
import {ROLES} from "../constants/roles.ts";
import {ROUTES} from "../constants/routes.ts";


interface StudentRouteProps {
    element: JSX.Element;
}

function StudentRoute({ element }: StudentRouteProps) {
    const { user } = useContext(AuthContext);

    if (user?.role !== ROLES.STUDENT) {
        return <Navigate to={ROUTES.MY_ACCOUNT} replace />;
    }

    return element;
}

export default StudentRoute;
