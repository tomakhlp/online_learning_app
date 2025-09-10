import {NAV_LINKS as FOOTER_NAV_LINKS_en } from './en/footer.ts'
import {NAV_LINKS as FOOTER_NAV_LINKS_de } from './de/footer.ts'
import {NAV_LINKS as HEADER_NAV_LINKS_en } from './en/header.ts';
import {NAV_LINKS as HEADER_NAV_LINKS_de } from './de/header.ts';
import {useTranslation} from "react-i18next";
import {HeaderLink} from "../types/headerNav.ts";
import {FooterNavLinks} from "../types/footerNav.ts";

const FOOTERS_NAV_LINKS: Record<string, typeof FOOTER_NAV_LINKS_en> = {
    en: FOOTER_NAV_LINKS_en,
    de: FOOTER_NAV_LINKS_de,
};

const HEADERS_NAV_LINKS: Record<string, typeof HEADER_NAV_LINKS_en> = {
    en: HEADER_NAV_LINKS_en,
    de: HEADER_NAV_LINKS_de,
};

export function useNavLinks(area: 'footer'): FooterNavLinks;
export function useNavLinks(area: 'header'): HeaderLink[];

export function useNavLinks(area: 'footer' | 'header') {
    const { i18n } = useTranslation();
    const lang = i18n.language || 'en';

    if (area === 'footer') {
        return FOOTERS_NAV_LINKS[lang] ?? FOOTERS_NAV_LINKS.en;
    }

    return HEADERS_NAV_LINKS[lang] ?? HEADERS_NAV_LINKS.en;
}
