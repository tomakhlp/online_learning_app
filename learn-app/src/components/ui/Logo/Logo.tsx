// @ts-ignore
import LogoImg from "../../../assets/logo.svg?react";
import styles from './logo.module.css'
import {Link} from "react-router";
import {ROUTES} from "../../../constants/routes.ts";

function Logo({ isLink = true }: { isLink?: boolean }) {
    const content = (
        <>
            <LogoImg className={styles.logoImg} />
            <span className={styles.logoText}>learn</span>
        </>
    );

    return isLink ? (
        <Link to={ROUTES.HOME} className={styles.logoGroup}>
            {content}
        </Link>
    ) : (
        <div className={styles.logoGroup}>{content}</div>
    );
}

export default Logo;
