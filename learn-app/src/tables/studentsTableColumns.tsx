import {TFunction} from "i18next";

export const getStudentColumns = (t: TFunction<['tables', 'global']>) => {
    return [
        {
            key: "name",
            title: t('tables:COLUMNS.NAME'),
            render: (name: string) => (
                    <span className="font-bold">{name}</span>
            )
        },
        {
            key: "isActive",
            title: t('tables:COLUMNS.STATUS'),
            render: (value: boolean) => (
                    <span className={`${value ? "text-secondary-100" : "text-important-150"} uppercase`}>
                        {value ? t("global:COMMON.ACTIVE") : t("global:COMMON.NOT_ACTIVE")}
                    </span>
            )
        }
    ]
}
