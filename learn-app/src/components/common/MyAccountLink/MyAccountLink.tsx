import styles from "./myAccountLink.module.css";
import {LuCircleUserRound} from "react-icons/lu";
import {NavLink} from "react-router";
import {ROUTES} from "../../../constants/routes.ts";
import clsx from "clsx";
import {useTranslation} from "react-i18next";

interface MyAccountLinkProps {
    withIcon?: boolean;
    navLinkClass?: string;
    navLinkActiveClass?: string;
}

function MyAccountLink({withIcon = false, navLinkClass, navLinkActiveClass}: MyAccountLinkProps) {
    const { t } = useTranslation(['global']);
    const renderContent = (
        <NavLink to={ROUTES.MY_ACCOUNT}
                 className={({ isActive }) =>
                     clsx(
                         navLinkClass ?? styles.myAccountLink,
                         isActive && (navLinkActiveClass ?? styles.navLinkActive)
                     )}
        >
            {t('global:COMMON.MY_ACCOUNT')}
        </NavLink>
    );

    if (navLinkClass) {
        return renderContent;
    }

    return (
        <div className={styles.myAccountWrapper}>
            {withIcon && <LuCircleUserRound className={styles.myAccountIcon} />}
            {renderContent}
        </div>
    );
}

export default MyAccountLink;
