import Button from "../../ui/Button/Button.tsx";
import {GoSignOut} from "react-icons/go";
import styles from "../../layout/Header/header.module.css";
import {useTranslation} from "react-i18next";

function SignOutButton({onSignOut}: { onSignOut: () => void }) {
    const { t } = useTranslation(['button']);

    return (
        <Button icon={<GoSignOut className={styles.headerIcon}/>}
                variant={'btnTransparent'}
                className={'text-[var(--color-body-200)]'}
                onClick={onSignOut}
        >
            {t('button:SIGN_OUT')}
        </Button>
    )
}

export default SignOutButton;
