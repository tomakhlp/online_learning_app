import Joi from 'joi';
import {TFunction} from "i18next";

export function studentRegistrationSchema(t: TFunction<'error'>) {
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
        dateOfBirth: Joi.string().optional().allow(''),
        address: Joi.string().optional().allow(''),
    });
}

export function trainerRegistrationSchema(t: TFunction<'error'>) {
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
        specializationId: Joi.string().required().messages({
            'string.empty': t('SPECIALIZATION_REQUIRED'),
        }),
    }).unknown();
}
