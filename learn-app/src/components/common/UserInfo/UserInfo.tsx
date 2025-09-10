import styles from './userInfo.module.css'
import Button from "../../ui/Button/Button.tsx";
import {useContext} from "react";
import {AuthContext} from "../../../context/AuthContext.tsx";

type UserInfoProps = {
    isButton?: boolean;
    onClick?: () => void;
    showEmail?: boolean;
};

const UserInfo = ({ isButton = false, onClick, showEmail = true  }: UserInfoProps) => {
    const {user} = useContext(AuthContext);

    const content = (
        <>
            <img
                src={user?.photo}
                alt={"User Avatar"}
                className={styles.userAvatar}
            />
            <div className={styles.userDetails}>
                <span className={styles.userName}>{user?.firstName}</span>
                {showEmail && <span className={styles.userEmail}>{user?.email}</span>}
            </div>
        </>
    );

    if (isButton) {
        return (
            <Button variant={'btnTransparent'}
                    onClick={onClick}
                    className="cursor-pointer items-center flex-row-reverse gap-5 py-0 text-[var(--color-body-100)]"
            >
                {content}
            </Button>
        );
    }

    return <div className={styles.userInfo}>{content}</div>;
};

export default UserInfo;
