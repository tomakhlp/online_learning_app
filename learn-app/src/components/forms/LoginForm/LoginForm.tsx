import Input from "../../ui/Input/Input.tsx";
import styles from './loginForm.module.css'
import {ChangeEvent, FormEvent} from "react";
import {LoginUser} from "../../../types/auth.ts";
import {TbLockPassword, TbUser} from "react-icons/tb";
import Button from "../../ui/Button/Button.tsx";
import PasswordInput from "../../common/PasswordInput/PasswordInput.tsx";
import {useTranslation} from "react-i18next";

interface LoginFormProps {
    user: LoginUser;
    errors:  Partial<LoginUser>;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: FormEvent) => void;
}

function LoginForm({ user, errors, onChange, onSubmit}: LoginFormProps) {
    const { t } = useTranslation(['button', 'input']);
    return (
            <form className={styles.loginForm} onSubmit={onSubmit}>
                <Input
                    id={'username-input'}
                    label={t('input:LABELS.USERNAME')}
                    name={'username'}
                    value={user.username}
                    onChange={onChange}
                    icon={<TbUser/>}
                    placeholder={t('input:PLACEHOLDERS.USERNAME')}
                    error={errors.username}
                />
                <PasswordInput
                    value={user.password}
                    onChange={onChange}
                    error={errors.password}
                    icon={<TbLockPassword/>}
                />

                <Button variant={'btnPrimary'}
                        className={'w-full mt-6'}
                        type={'submit'}
                >
                    {t('button:SIGN_IN')}
                </Button>
            </form>
    )
}

export default LoginForm;
