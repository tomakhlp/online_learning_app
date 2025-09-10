import {en} from './en'
import i18n from "i18next";
import {initReactI18next} from "react-i18next";
import {de} from "./de";

const translations: Record<string, any> = {
    en,
    de,
};

const savedLanguage = localStorage.getItem('language') || 'en';

i18n.use(initReactI18next).init({
    fallbackLng: "en",
    resources: translations,
    lng: savedLanguage,
    interpolation: {
        escapeValue: false
    },
});

export default i18n;
