import styles from './navigation.module.css'
import {NavLink} from "react-router";
import clsx from "clsx";
import MyAccountLink from "../../../../common/MyAccountLink/MyAccountLink.tsx";
import {useNavLinks} from "../../../../../locales/useNavLinks.ts";

interface NavigationProps {
    variant: 'desktop' | 'mobile';
    onClickLink?: () => void;
    withMyAccountLink?: boolean;
}

function Navigation({variant, onClickLink, withMyAccountLink = false }: NavigationProps) {
    const NAV_LINKS = useNavLinks('header')

    const navClass = variant === 'desktop' ? styles.menuNavDesktop : styles.menuNav;
    const linkClass = variant === 'desktop' ? styles.menuNavLinksDesktop : styles.menuNavLinks;

    return (
        <ul className={navClass}>
            {NAV_LINKS.map((navLink) => (
                <li key={navLink.to}>
                    <NavLink
                        to={navLink.to}
                        className={({ isActive }) =>
                            clsx(linkClass, { [styles.navLinkActive]: isActive })
                        }
                        onClick={onClickLink}
                    >
                        {navLink.title}
                    </NavLink>
                </li>
            ))}
            {withMyAccountLink && (
                <li>
                    <MyAccountLink navLinkClass={linkClass} navLinkActiveClass={styles.navLinkActive}/>
                </li>
            )}
        </ul>
    );
}

export default Navigation;
