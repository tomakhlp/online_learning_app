import {Link} from "react-router";
import {useTranslation} from "react-i18next";

function Copyright() {
    const { t } = useTranslation(['footer']);

    return (
        <div className="text-sm">
            <span>{t('footer:COPYRIGHT.TITLE')}</span> ·{" "}
            <Link to={t('footer:LEGAL_LINKS.PRIVACY.TO')} className="hover:underline">{t('footer:LEGAL_LINKS.PRIVACY.TITLE')}</Link> ·{" "}
            <Link to={t('footer:LEGAL_LINKS.TERMS.TO')} className="hover:underline">{t('footer:LEGAL_LINKS.TERMS.TITLE')}</Link>
        </div>
    );
}

export default Copyright;
