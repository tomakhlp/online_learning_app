import {Navigate} from "react-router";
import {ReactElement, useContext} from "react";
import {AuthContext} from "../context/AuthContext.tsx";
import {ROUTES} from "../constants/routes.ts";
import Spinner from "../components/ui/Spinner/Spinner.tsx";

type PrivateRouteProps = {
    element: ReactElement;
};

const PrivateRoute = ({ element }: PrivateRouteProps) => {
    const { isAuthenticated, isAuthChecked } = useContext(AuthContext);

    if (!isAuthChecked) {
        return <Spinner />;
    }

    if (isAuthenticated) {
        return element;
    }

    const passwordChangeSuccess = sessionStorage.getItem("passwordChangeSuccess");

    if (passwordChangeSuccess) {
        return <Navigate to={`/${ROUTES.CHANGE_PASSWORD}/${ROUTES.SUCCESS}`} replace={true} />;
    }

    return <Navigate to={ROUTES.LOGIN} replace={true} />;
};

export default PrivateRoute;
