import {GLOBAL_TEXT} from "./global.ts";
import {ROUTES} from "../../constants/routes.ts";

export const HEADER = {
    NAV_LINKS: [
        { title: GLOBAL_TEXT.COMMON.BLOG, to: ROUTES.BLOG },
        { title: GLOBAL_TEXT.COMMON.PRICING, to: ROUTES.PRICING },
        { title: GLOBAL_TEXT.COMMON.FEATURES, to: ROUTES.FEATURES },
    ]
}

export const NAV_LINKS = HEADER.NAV_LINKS
