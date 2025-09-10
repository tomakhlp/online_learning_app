import {Link} from "react-router";
import {ROUTES} from "../../../constants/routes.ts";
import {useTranslation} from "react-i18next";

function ComingSoon() {
    const { t } = useTranslation(['pages']);
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
            <h1 className="text-4xl font-bold mb-4">{t('pages:COMING_SOON.HEADER')}</h1>
            <p className="text-body-300 mb-8 max-w-xl">
                {t('pages:COMING_SOON.DESCRIPTION')}
            </p>
            <Link to={ROUTES.HOME} className="text-primary-100 text-lg">
                {t('pages:COMING_SOON.LINK_TEXT')}
            </Link>
        </div>
    );
}

export default ComingSoon;
