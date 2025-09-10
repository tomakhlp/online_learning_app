import {Dropdown} from "../../ui/Dropdown/Dropdown.tsx";
import {useTranslation} from "react-i18next";
import {LANGUAGES} from "../../../constants/languages.ts";
import {showErrorToast} from "../../ui/Toaster/Toaster.tsx";

function LanguageSwitcher() {
    const { i18n } = useTranslation();
    const { t } = useTranslation('error');

    const selectedLanguage = i18n.language;

    const handleLanguageChange = async (id: string) => {
        try {
            await i18n.changeLanguage(id);
            localStorage.setItem('language', id);
        } catch (error) {
            showErrorToast(t('error:FAILED_CHANGE_LANGUAGE'))
        }
    };

    return (
        <Dropdown
            options={LANGUAGES}
            buttonStyles={'gap-2 bg-[var(--color-basic-250)]'}
            dropdownStyles={'bottom-full mb-1'}
            id={selectedLanguage}
            onChange={handleLanguageChange}
            showValidation={false}
        />
    );
}

export default LanguageSwitcher;
