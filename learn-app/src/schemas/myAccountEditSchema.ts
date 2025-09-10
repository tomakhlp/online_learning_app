import Joi from 'joi';
import {TFunction} from "i18next";

export function studentAccountEditSchema(t: TFunction<'error'>) {
    return Joi.object({
        firstName: Joi.string().required().messages({
            'string.empty': t('FIRSTNAME_REQUIRED'),
        }),
        lastName: Joi.string().required().messages({
            'string.empty': t('LASTNAME_REQUIRED'),
        }),
        email: Joi.string().email({ tlds: { allow: false } }).required().messages({
            'string.empty': t('EMAIL_REQUIRED'),
            'string.email': t('INVALID_EMAIL'),
        }),
        username: Joi.string().required().messages({
            'string.empty': t('EMAIL_REQUIRED'),
        }),
        dateOfBirth: Joi.string().optional().allow('', null),
        address: Joi.string().optional().allow('', null),
    });
}

export function trainerAccountEditSchema(t: TFunction<'error'>) {
    return Joi.object({
        firstName: Joi.string().required().messages({
            'string.empty': t('FIRSTNAME_REQUIRED'),
        }),
        lastName: Joi.string().required().messages({
            'string.empty': t('LASTNAME_REQUIRED'),
        }),
        email: Joi.string().email({ tlds: { allow: false } }).required().messages({
            'string.empty': t('EMAIL_REQUIRED'),
            'string.email': t('INVALID_EMAIL'),
        }),
        username: Joi.string().required().messages({
            'string.empty': t('USERNAME_REQUIRED'),
        })
    });
}
