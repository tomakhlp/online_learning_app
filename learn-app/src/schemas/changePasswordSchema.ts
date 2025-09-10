import Joi from "joi";
import {TFunction} from "i18next";

export function changePasswordSchema(t: TFunction<'error'>) {
    return Joi.object({
        password: Joi.string().required().messages({
            'string.empty': t('PASSWORD_REQUIRED'),
        }),
        newPassword: Joi.string().required().messages({
            'string.empty': t('NEW_PASSWORD_REQUIRED'),
        }),
        confirmPassword: Joi.string()
            .when('newPassword', {
                is: Joi.exist(),
                then: Joi.string().required().valid(Joi.ref('newPassword')).messages({
                    'string.empty': t('CONFIRMED_REQUIRED'),
                    'any.only': t('CONFIRMED_MATCH'),
                }),
                otherwise: Joi.forbidden()
            })
    });
}
