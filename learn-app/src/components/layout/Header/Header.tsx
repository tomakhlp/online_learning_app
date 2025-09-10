import styles from './header.module.css';
import Button from "../../ui/Button/Button.tsx";
import {BsThreeDots} from "react-icons/bs";
import {RxCross2} from "react-icons/rx";
import Logo from "../../ui/Logo/Logo.tsx";
import Navigation from "./components/Navigation/Navigation.tsx";
import AccountBox from "../../features/AccountBox/AccountBox.tsx";
import AuthButtons from "./components/AuthButtons/AuthButtons.tsx";
import UserInfo from "../../common/UserInfo/UserInfo.tsx";
import SignOutButton from "../../common/SignOutButton/SignOutButton.tsx";
import {useMenuAutoClose} from "../../../hooks/useMenuAutoClose.tsx";
import {useContext} from "react";
import {AuthContext} from "../../../context/AuthContext.tsx";
import {useNavigate} from "react-router";
import {ROUTES} from "../../../constants/routes.ts";
import ThemeToggle from "../../common/ThemeToggle/ThemeToggle.tsx";

function Header() {
    const { user, signOut } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut();
        navigate(ROUTES.LOGIN, {replace: true});
    };

    const { isOpen: isMenuOpen, toggleOpen, elementRef: menuRef} = useMenuAutoClose();

    return (
        <>
            <header className={styles.headerWrapper}>
                <div className={styles.headerLeft}>
                    <Button icon={<BsThreeDots className={styles.headerIcon}/>}
                            variant={'btnTransparent'}
                            className={'md:hidden'}
                            onClick={toggleOpen}
                    />
                    <Logo/>
                    <Navigation variant={'desktop'}/>
                </div>

                <div className={styles.headerRight}>
                    {user ?
                        <AccountBox handleSignOut={handleSignOut}/>
                        :
                        <>
                            <ThemeToggle/>
                            <AuthButtons/>
                        </>
                    }
                </div>
            </header>

            <div className={`${styles.menuOverlay} ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
                 ref={menuRef}
            >
                <div className={styles.menuHeader}>
                    <Button icon={<RxCross2 className={styles.headerIcon}/>}
                            variant={'btnTransparent'}
                            className={'ml-auto'}
                            onClick={toggleOpen}
                    />
                    {user && <UserInfo />}
                </div>

                <Navigation
                    variant="mobile"
                    withMyAccountLink={!!user}
                />

                <div className={styles.menuFooter}>
                    <ThemeToggle/>
                    {user ? <SignOutButton onSignOut={handleSignOut}/> : <AuthButtons/>}
                </div>
            </div>
        </>
    )
}

export default Header;
