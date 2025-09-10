import styles from './accountBox.module.css'
import ThemeToggle from "../../common/ThemeToggle/ThemeToggle.tsx";
import UserInfo from "../../common/UserInfo/UserInfo.tsx";
import SignOutButton from "../../common/SignOutButton/SignOutButton.tsx";
import MyAccountLink from "../../common/MyAccountLink/MyAccountLink.tsx";
import {useMenuAutoClose} from "../../../hooks/useMenuAutoClose.tsx";

interface AccountBoxProps {
    handleSignOut: () => void;
}

function AccountBox({handleSignOut}: AccountBoxProps) {
    const { isOpen: isAccountBoxOpen, toggleOpen, elementRef: accountBoxRef} = useMenuAutoClose();

    return (
        <div className={styles.userMenuWrapper}>
            <UserInfo isButton={true} onClick={toggleOpen} showEmail={false}/>
            {isAccountBoxOpen && (
                    <div className={styles.accountBoxWrapper}
                         ref={accountBoxRef}
                    >
                        <UserInfo />
                        <hr className={styles.menuDivider}/>
                        <div className={styles.menuSection}>
                            <MyAccountLink withIcon={true}/>
                            <ThemeToggle fontSize={'text-sm '} showText={true}/>
                        </div>
                        <hr className={styles.menuDivider}/>
                        <SignOutButton onSignOut={handleSignOut}/>
                    </div>
            )}
        </div>
    )
}

export default AccountBox;
