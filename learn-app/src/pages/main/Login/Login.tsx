import styles from './login.module.css'
import LoginForm from "../../../components/forms/LoginForm/LoginForm.tsx";
import {ChangeEvent, FormEvent, useContext, useRef, useState} from "react";
import {LoginUser} from "../../../types/auth.ts";
import Captcha from "../../../components/ui/Captcha/Captcha.tsx";
import ReCAPTCHA from "react-google-recaptcha";
import {Link, useNavigate} from "react-router";
import {ROUTES} from "../../../constants/routes.ts";
import {loginSchema} from "../../../schemas/loginSchema.ts";
import {validateForm} from "../../../utils/validateForm.ts";
import {AuthContext} from "../../../context/AuthContext.tsx";
import {useTranslation} from "react-i18next";
import {loginUser} from "../../../api/auth.ts";
import {getUserInfo} from "../../../api/user.ts";
import {handleApiError} from "../../../utils/errorHelpers.ts";
import {showErrorToast} from "../../../components/ui/Toaster/Toaster.tsx";
import LoaderOverlay from "../../../components/ui/LoaderOverlay/LoaderOverlay.tsx";

function Login() {
    const { t } = useTranslation(['global', 'pages']);
    const { t: tError } = useTranslation('error');

    const [user, setUser] = useState<LoginUser>({
        username: '',
        password: '',
    });

    const [errors, setErrors] = useState<Partial<LoginUser>>({});

    const [loading, setLoading] = useState(false);

    const [captchaValue, setCaptchaValue] = useState<string | null>(null);
    const [captchaError, setCaptchaError] = useState<string | null>(null);

    const captchaRef = useRef<ReCAPTCHA>(null);
    const navigate = useNavigate();

    const { setUser: setContextUser } = useContext(AuthContext);

    const handleCaptchaChange = (value: string | null) => {
        setCaptchaValue(value);
        if (value) {
            setCaptchaError(null)
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setUser({
            ...user,
            [name]: value,
        });

        setErrors({
            ...errors,
            [name]: '',
        });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const schema = loginSchema(tError)
        const { isValid, errors: validationErrors } = validateForm(user, schema);

        if (!isValid) {
            setErrors(validationErrors);
            return;
        }

        if (!captchaValue) {
            setCaptchaError(tError('CAPTCHA_REQUIRED'));
            return;
        }

        setLoading(true);

        try {
            const data = await loginUser(user);
            localStorage.setItem('accessToken', data.accessToken);
            const fullUser = await getUserInfo();
            setContextUser(fullUser);

            setUser({username: '', password: ''});
            setErrors({});
            setCaptchaValue(null);
            captchaRef.current?.reset();
            navigate(ROUTES.HOME);
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
        <LoaderOverlay isLoading={loading} style={'flex justify-center items-center'}>
            <div className={styles.loginWrapper}>
                <h2 className={styles.loginHeading}>{t('pages:LOGIN.HEADER')}</h2>
                <h3 className={styles.loginSubheading}>{t('pages:LOGIN.SUBHEADING')}</h3>
                <LoginForm user={user}
                           errors={errors}
                           onChange={handleChange}
                           onSubmit={handleSubmit}
                />
                <div className={styles.orText}>{t('pages:LOGIN.OR_TEXT')}</div>
                <p className={styles.signUpText}>
                    {t('pages:LOGIN.SIGN_UP_PROMPT')}{" "}
                    <Link to={ROUTES.JOIN_US} className={styles.signUpLink}>
                        {t('global:COMMON.SIGN_UP')}
                    </Link>
                </p>
                <div className={styles.captchaWrapper}>
                    <Captcha
                        ref={captchaRef}
                        onChange={handleCaptchaChange}

                    />
                    {captchaError && (
                        <div className={styles.captchaErrorText}>{captchaError}</div>
                    )}
                </div>
            </div>
        </LoaderOverlay>
    )
}

export default Login;
