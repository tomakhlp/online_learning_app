import {ChangeEvent, FormEvent, useContext, useState} from "react";
import PasswordInput from "../../../components/common/PasswordInput/PasswordInput.tsx";
import Button from "../../../components/ui/Button/Button.tsx";
import {TbLockPassword} from "react-icons/tb";
import {AuthContext} from "../../../context/AuthContext.tsx";
import {changePasswordSchema} from "../../../schemas/changePasswordSchema.ts";
import {validateForm} from "../../../utils/validateForm.ts";
import {useTranslation} from "react-i18next";
import {updatePassword} from "../../../api/user.ts";
import {handleApiError} from "../../../utils/errorHelpers.ts";
import {showErrorToast} from "../../../components/ui/Toaster/Toaster.tsx";
import LoaderOverlay from "../../../components/ui/LoaderOverlay/LoaderOverlay.tsx";
import {UserUpdatePassword} from "../../../types/user.ts";

function ChangePassword() {
    const { t } = useTranslation(['button', 'pages', 'input']);
    const { t: tError } = useTranslation('error');
    const [loading, setLoading] = useState(false);

    const { signOut } = useContext(AuthContext);

    const [passwords, setPasswords] = useState({
        password: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setPasswords({
            ...passwords,
            [name]: value,
        });

        setErrors({
            ...errors,
            [name]: '',
        })
    };

    const handleCancel = () => {
        setPasswords({
            password: "",
            newPassword: "",
            confirmPassword: "",
        });

        setErrors({});
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const schema = changePasswordSchema(tError);
        const { isValid, errors: validationErrors } = validateForm(passwords, schema);

        if (!isValid) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);

        try {
            const payload: UserUpdatePassword = {
                currentPassword: passwords.password,
                newPassword: passwords.newPassword,
                confirmPassword: passwords.confirmPassword,
            };

            await updatePassword(payload)

            setPasswords({password: '', newPassword: '', confirmPassword: '', });
            setErrors({});
            sessionStorage.setItem("passwordChangeSuccess", "true");

            await signOut()
        } catch (error) {
            const { global, ...fieldErrors } = handleApiError(error, tError);
            setErrors(fieldErrors);
            if (global) {
                showErrorToast(global);
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <LoaderOverlay isLoading={loading}>
        <div className="flex flex-col w-full px-4 md:px-10 lg:px-20 xl:px-28">
            <div className="w-full">
                <h2 className="text-4xl font-bold pb-10">{t('pages:CHANGE_PASSWORD.HEADER')}</h2>
            </div>

            <div className="flex flex-col md:flex-row w-full items-start justify-between gap-10">
                <p className="flex items-center space-x-2 w-auto flex-shrink-0">
                    <TbLockPassword className={'w-6 h-6'}/>
                    <span className="text-lg">{t('pages:CHANGE_PASSWORD.SUBHEADER')}</span>
                </p>
                <div className="flex flex-col border-1 border-basic-200 rounded-lg p-6 w-full max-w-3xl gap-5">
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <PasswordInput
                            id="password"
                            name={"password"}
                            value={passwords.password}
                            onChange={handleChange}
                            label={t('input:LABELS.CURRENT_PASSWORD')}
                            placeholder={t('input:PLACEHOLDERS.CURRENT_PASSWORD')}
                            error={errors.password}
                        />

                        <PasswordInput
                            id="newPassword"
                            name={"newPassword"}
                            value={passwords.newPassword}
                            onChange={handleChange}
                            label={t('input:LABELS.NEW_PASSWORD')}
                            placeholder={t('input:PLACEHOLDERS.NEW_PASSWORD')}
                            error={errors.newPassword}
                        />

                        <PasswordInput
                            id="confirmPassword"
                            name={"confirmPassword"}
                            value={passwords.confirmPassword}
                            onChange={handleChange}
                            label={t('input:LABELS.CONFIRM_PASSWORD')}
                            placeholder={t('input:PLACEHOLDERS.CONFIRM_PASSWORD')}
                            error={errors.confirmPassword}
                        />
                        <div className="flex items-center justify-end flex-wrap gap-5">
                            <Button variant={'btnTransparent'}
                                    className={'text-[var(--color-body-200)]'}
                                    onClick={handleCancel}
                            >
                                {t('button:CANCEL')}
                            </Button>
                            <Button
                                variant={'btnPrimary'}
                                type={'submit'}
                            >
                                {t('button:CHANGE_PASSWORD')}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        </LoaderOverlay>
    )
}

export default ChangePassword;
