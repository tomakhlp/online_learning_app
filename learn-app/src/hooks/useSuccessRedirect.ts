import {useNavigate} from "react-router";
import {useContext, useEffect} from "react";
import {AuthContext} from "../context/AuthContext.tsx";

type UseSuccessRedirectParams = {
    flagKey: string;
    authRedirectPath: string;
    guestRedirectPath: string;
};

export function useSuccessRedirect ({
   flagKey,
   authRedirectPath,
   guestRedirectPath,
}: UseSuccessRedirectParams) {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const successFlag = sessionStorage.getItem(flagKey);

    useEffect(() => {
        if (!successFlag) {
            if (user) {
                navigate(authRedirectPath, { replace: true });
            } else {
                navigate(guestRedirectPath, { replace: true });
            }
        }

        return () => {
            sessionStorage.removeItem(flagKey);
        };
    }, [successFlag, user, navigate]);

    return !!successFlag;
}
