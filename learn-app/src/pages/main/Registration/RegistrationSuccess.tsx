import {useLocation, useNavigate} from "react-router";
import Button from "../../../components/ui/Button/Button.tsx";
import { FaCheckCircle } from "react-icons/fa";
import {ROUTES} from "../../../constants/routes.ts";
import {useContext} from "react";
import {useTranslation} from "react-i18next";
import {AuthContext} from "../../../context/AuthContext.tsx";
import {useSuccessRedirect} from "../../../hooks/useSuccessRedirect.ts";

function RegistrationSuccess() {
    const { t } = useTranslation(['button', 'pages']);
    const navigate = useNavigate();
    const {user} = useContext(AuthContext);
    const location = useLocation();

    const success = useSuccessRedirect({
        flagKey: "registrationSuccess",
        authRedirectPath: ROUTES.MY_ACCOUNT,
        guestRedirectPath: ROUTES.JOIN_US,
    });

    if (!success) return null;

    return (
        <div className="max-w-md flex flex-col items-center min-h-screen text-center space-y-6">
            <h1 className="text-3xl md:text-5xl font-bold">{t('pages:REGISTRATION.HEADER')}</h1>
            <FaCheckCircle className="text-success-100 text-6xl" />
            <p className="text-lg md:text-xl text-body-200">
                {t('pages:REGISTRATION.SUCCESS.CONGRATS')}
            </p>
            <div className="w-full">
                <p className="font-bold">{t('pages:REGISTRATION.SUCCESS.USERNAME_LABEL')}</p>
                <p className="mb-2">{user?.username}</p>
                <p className="font-bold">{t('pages:REGISTRATION.SUCCESS.PASSWORD_LABEL')}</p>
                <p className="">{location.state?.password ?? ''}</p>
            </div>
            <Button
                variant={'btnPrimary'}
                className="px-6 py-3"
                onClick={() => navigate(ROUTES.MY_ACCOUNT)}
            >
                {t('button:MY_ACCOUNT')}
            </Button>
        </div>
    );
}

export default RegistrationSuccess;

