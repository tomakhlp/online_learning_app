import ReCAPTCHA from "react-google-recaptcha";
import {Ref} from "react";
import styles from './captcha.module.css'
import {RECAPTCHA_SITE_KEY} from "../../../config.ts";

interface CaptchaProps {
    onChange: (value: string | null) => void;
    ref: Ref<ReCAPTCHA>;
}

function Captcha({ onChange, ref }: CaptchaProps) {
    if (!RECAPTCHA_SITE_KEY) {
        throw new Error('ReCAPTCHA sitekey is missing');
    }

    return (
        // <div className={`flex justify-center items-center w-full max-w-full p-5`}>
        <div className={'flex justify-center w-full'}>
            <div className={styles.captchaWrapper}>
            <ReCAPTCHA
                ref={ref}
                sitekey={RECAPTCHA_SITE_KEY}
                onChange={onChange}
            />
            </div>
        </div>
    );
}

export default Captcha;
