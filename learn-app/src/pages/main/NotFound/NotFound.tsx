import {Link} from "react-router";
import {ROUTES} from "../../../constants/routes.ts";
import {useTranslation} from "react-i18next";

function NotFound() {
    const {t } = useTranslation(['pages']);
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
            <h1 className="text-5xl font-bold mb-4">{t('pages:NOT_FOUND.HEADER')}</h1>
            <p className="text-body-300 mb-8 max-w-xl text-lg">
                {t('pages:NOT_FOUND.DESCRIPTION')}
            </p>
            <Link
                to={ROUTES.HOME}
                className="text-primary-100 text-lg hover:text-primary-150 transition-colors"
            >
                {t('pages:NOT_FOUND.LINK_TEXT')}
            </Link>
        </div>
    );
}

export default NotFound;
