import {FaCheckCircle} from "react-icons/fa";
import Button from "../../../components/ui/Button/Button.tsx";
import {useNavigate} from "react-router";
import {ROUTES} from "../../../constants/routes.ts";
import {useTranslation} from "react-i18next";
import {useSuccessRedirect} from "../../../hooks/useSuccessRedirect.ts";

function ChangePasswordSuccess() {
    const { t } = useTranslation(['button', 'pages']);
    const navigate = useNavigate();

    const success = useSuccessRedirect({
        flagKey: "passwordChangeSuccess",
        authRedirectPath: `${ROUTES.MY_ACCOUNT}/${ROUTES.CHANGE_PASSWORD}`,
        guestRedirectPath: ROUTES.LOGIN,
    });

    if (!success) return null;

    const handleSignIn = () => {
        navigate(ROUTES.LOGIN, { replace: true });
    };

    return (
        <div className={'w-full flex items-center justify-center'}>
            <div className={'flex flex-col items-center min-h-screen text-center gap-14'}>
                <h1 className="text-3xl md:text-5xl font-bold">{t('pages:CHANGE_PASSWORD.SUCCESS.CONGRATS')}</h1>
                <FaCheckCircle className="text-success-100 text-6xl"/>
                <p className="text-lg md:text-xl">{t('pages:CHANGE_PASSWORD.SUCCESS.DESCRIPTION')}</p>
                <Button
                    variant={'btnPrimary'}
                    onClick={handleSignIn}
                >
                    {t('button:SIGN_IN')}
                </Button>
            </div>
        </div>

    )
}

export default ChangePasswordSuccess;
