import {useTranslation} from "react-i18next";
import {Namespace} from "i18next";

export function useTranslate(ns?: string) {
    const { t } = useTranslation(ns as Namespace | undefined);
    const translate = (key: string) => t(key as any);
    return { translate };
}
