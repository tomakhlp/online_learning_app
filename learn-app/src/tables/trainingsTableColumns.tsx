import {Role, ROLES} from "../constants/roles.ts";
import {TFunction} from "i18next";

export const getTrainingsColumns = (role: Role, t: TFunction<'tables'>) => {
    return [
        { key: "date", title: t('COLUMNS.DATE') },
        {
            key: "name",
            title: t('COLUMNS.TRAINING_NAME'),
            render: (name: string) => (
                <span className="font-bold">{name}</span>
            ),
        },
        {
            key: "type",
            title: t('COLUMNS.TYPE'),
            render: (type: string) => {
                if (!type) return <span></span>;
                return (
                    <span className="text-xs px-2 py-1 rounded-full text-primary-100 bg-primary-100/10">
                        {type}
                    </span>
                );
            },
        },
        {
            key: role === ROLES.TRAINER ? "studentName" : "trainerName",
            title: role === ROLES.TRAINER ? t('COLUMNS.STUDENT_NAME') : t('COLUMNS.TRAINER_NAME'),
        },
        { key: "duration", title: t('COLUMNS.DURATION') },
    ];
};
