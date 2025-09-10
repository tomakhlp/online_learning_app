import Joi from 'joi';
import {TFunction} from "i18next";

export function loginSchema(t: TFunction<'error'>) {
    return Joi.object({
        username: Joi.string().required().messages({
            'string.empty': t('USERNAME_REQUIRED'),
        }),
        password: Joi.string().required().messages({
            'string.empty': t('PASSWORD_REQUIRED'),
        }),
})
}

