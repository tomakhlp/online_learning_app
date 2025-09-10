import styles from "./themeToggle.module.css";
import {MdOutlineModeNight} from "react-icons/md";
import ReactSwitch from "react-switch";
import {useTranslation} from "react-i18next";
import {ThemeContext} from "../../../context/ThemeContext.tsx";
import {useContext} from "react";
import clsx from "clsx";

interface ThemeToggleProps {
    fontSize?: string;
    showText?: boolean;
}

function ThemeToggle({ fontSize = "text-base", showText = false }: ThemeToggleProps) {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const isDarkMode = theme === "dark";

    const { t } = useTranslation(['global', 'ariaLabel']);

    return (
        <div className={styles.themeToggle}>
            <div className={styles.themeLabel}>
                <MdOutlineModeNight className={styles.themeIcon}/>
                {showText && (
                    <span
                        className={clsx("text-(--color-body-200) leading-[22px]", fontSize)}
                    >
                        {t('global:COMMON.NIGHT_MODE')}
                    </span>
                )}
            </div>
            <ReactSwitch
                checked={isDarkMode}
                onChange={toggleTheme}
                onColor={'#6355D8'}
                activeBoxShadow={'none'}
                aria-label={t('ariaLabel:TOGGLE_NIGHT_MODE')}
            />
        </div>
    )
}

export default ThemeToggle;
