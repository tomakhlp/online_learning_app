import {TFunction} from "i18next";

export const getTrainerColumns = (t: TFunction<'tables'>) => {
    return [
        {
            key: "name",
            title: t('COLUMNS.NAME'),
            render: (name: string) => <span className="font-bold">{name}</span>,
        },
        {
            key: "specialization",
            title: t('COLUMNS.SPECIALIZATION'),
        },
    ];
}
