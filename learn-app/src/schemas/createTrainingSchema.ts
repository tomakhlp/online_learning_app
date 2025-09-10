import Joi from 'joi';
import {TFunction} from "i18next";

export function createTrainingSchema(t: TFunction<'error'>) {
    return Joi.object({
        trainerId: Joi.string().required().messages({
            'string.empty': t('TRAINER_REQUIRED'),
        }),
        name: Joi.string().required().messages({
            'string.empty': t('TRAINING_NAME_REQUIRED'),
        }),
        date: Joi.number().integer().min(0).required().messages({
            'string.empty': t('DATE_REQUIRED')
        }),
        duration: Joi.number().integer().min(1).required().messages({
            'number.base': t('DURATION_REQUIRED'),
            'number.min': t('INVALID_DURATION'),
            'number.integer': t('INVALID_DURATION'),
        }),
        description: Joi.string().required().messages({
            'string.empty': t('DESCRIPTION_REQUIRED'),
        }),
        typeId: Joi.string().required().messages({
            'string.empty': t('TYPE_REQUIRED')
        }),
    });
}
