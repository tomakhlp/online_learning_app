import "i18next";
import { en } from "./locales/en";

type TranslationResources = typeof en;

declare module "i18next" {
    interface CustomTypeOptions {
        resources: TranslationResources;
    }
}
