import {GLOBAL_TEXT} from "./global.ts";
import {ROUTES} from "../../constants/routes.ts";

export const FOOTER = {
    NAV_LINKS: {
        product: {
            label: 'Produkt',
            links: [
                { title: GLOBAL_TEXT.COMMON.FEATURES, to: ROUTES.FEATURES },
                { title: GLOBAL_TEXT.COMMON.PRICING, to: ROUTES.PRICING },
            ],
        },
        resources: {
            label: 'Ressourcen',
            links: [
                { title: GLOBAL_TEXT.COMMON.BLOG, to: ROUTES.BLOG },
                { title: GLOBAL_TEXT.COMMON.USER_GUIDES, to: ROUTES.USER_GUIDES },
                { title: GLOBAL_TEXT.COMMON.WEBINARS, to: ROUTES.WEBINARS },
            ],
        },
        company: {
            label: 'Unternehmen',
            links: [
                { title: GLOBAL_TEXT.COMMON.ABOUT_US, to: ROUTES.ABOUT_US },
                { title: GLOBAL_TEXT.COMMON.CONTACT_US, to: ROUTES.CONTACT_US },
            ],
        },
    },
    LEGAL_LINKS: {
        PRIVACY: { TITLE: "Datenschutz", TO: ROUTES.PRIVACY },
        TERMS: { TITLE: "Nutzungsbedingungen", TO: ROUTES.TERMS },
    },
    COPYRIGHT: {
        TITLE: "© 2023 Lernen, Inc.",
    },
    SUBSCRIBE: {
        TITLE: "Abonnieren Sie unseren Newsletter",
        DESCRIPTION: "Für Produktankündigungen und exklusive Einblicke",
    },
};

export const NAV_LINKS = FOOTER.NAV_LINKS;
