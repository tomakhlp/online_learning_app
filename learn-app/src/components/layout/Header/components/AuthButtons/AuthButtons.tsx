import Button from "../../../../ui/Button/Button.tsx";
import { useNavigate } from "react-router";
import {ROUTES} from "../../../../../constants/routes.ts";
import {useTranslation} from "react-i18next";

function AuthButtons() {
    const { t } = useTranslation(['button']);

    const navigate = useNavigate();

    const handleSignIn = () => {
        navigate(ROUTES.LOGIN);
    };

    const handleJoinUs = () => {
        navigate(ROUTES.JOIN_US);
    };

    return (
        <div className={'flex gap-3 flex-wrap'}>
            <Button variant={'btnTransparent'}
                    onClick={handleSignIn}
            >
                {t('button:SIGN_IN')}
            </Button>
            <Button variant={'btnPrimary'}
                    onClick={handleJoinUs}
            >
                {t('button:JOIN_US')}
            </Button>
        </div>
    );
}

export default AuthButtons;
