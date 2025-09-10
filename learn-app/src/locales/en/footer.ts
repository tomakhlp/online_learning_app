import {GLOBAL_TEXT} from "./global.ts";
import {ROUTES} from "../../constants/routes.ts";

export const FOOTER = {
    NAV_LINKS: {
        product: {
            label: 'Product',
            links: [
                { title: GLOBAL_TEXT.COMMON.FEATURES, to: ROUTES.FEATURES },
                { title: GLOBAL_TEXT.COMMON.PRICING, to: ROUTES.PRICING },
            ],
        },
        resources: {
            label: 'Resources',
            links: [
                { title: GLOBAL_TEXT.COMMON.BLOG, to: ROUTES.BLOG },
                { title: GLOBAL_TEXT.COMMON.USER_GUIDES, to: ROUTES.USER_GUIDES },
                { title: GLOBAL_TEXT.COMMON.WEBINARS, to: ROUTES.WEBINARS },
            ],
        },
        company: {
            label: 'Company',
            links: [
                { title: GLOBAL_TEXT.COMMON.ABOUT_US, to: ROUTES.ABOUT_US },
                { title: GLOBAL_TEXT.COMMON.CONTACT_US, to: ROUTES.CONTACT_US },
            ],
        },
    },
    LEGAL_LINKS: {
        PRIVACY: { TITLE: "Privacy", TO: ROUTES.PRIVACY },
        TERMS: { TITLE: "Terms", TO: ROUTES.TERMS },
    },
    COPYRIGHT: {
        TITLE: "© 2023 Learn, Inc.",
    },
    SUBSCRIBE: {
        TITLE: "Subscribe to our newsletter",
        DESCRIPTION: "For product announcements and exclusive insights",
    }
};

export const NAV_LINKS = FOOTER.NAV_LINKS;
