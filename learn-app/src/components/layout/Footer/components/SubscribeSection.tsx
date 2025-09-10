import Subscribe from "../../../ui/Subscribe/Subscribe.tsx";
import {showSuccessToast} from "../../../ui/Toaster/Toaster.tsx";
import {useTranslation} from "react-i18next";

function SubscribeSection() {
    const { t } = useTranslation(['button', 'footer', 'toaster']);
    function handleSubscribe(_email: string) {
        showSuccessToast(t('toaster:THANKS_FOR_SUBSCRIBING'));
    }

    return (
        <div className="w-full max-w-sm self-center">
            <div className="flex flex-col text-center md:text-start">
                <h4 className="text-primary-100 font-bold text-xl">{t('footer:SUBSCRIBE.TITLE')}</h4>
                <p className="text-body-250 mb-2">{t('footer:SUBSCRIBE.DESCRIPTION')}</p>
                <Subscribe onSubmit={handleSubscribe} buttonText={t('button:SUBSCRIBE')} />
            </div>
        </div>
    );
}

export default SubscribeSection;
