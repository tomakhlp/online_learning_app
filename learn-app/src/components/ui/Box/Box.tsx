import {JSX} from "react";
import {useTranslation} from "react-i18next";
import {useTranslate} from "../../../hooks/useTranslate.ts";

interface BoxProps {
    tag: string;
    title: string;
    date: string;
    timeToRead: string;
    imageUrl: string;
    alt?: string;
}

function Box({ tag, title, date, timeToRead, imageUrl, alt = "Image" }: BoxProps): JSX.Element {
    const { t } = useTranslation(['global']);
    const { translate } = useTranslate('articles');

    return (
        <div className="w-full max-w-xs md:max-w-sm rounded-lg overflow-hidden shadow-(--box-shadow-card-100) flex flex-col">
            <div className="w-full">
                <img
                    src={imageUrl}
                    alt={alt}
                    className="aspect-16/9 w-full object-cover"
                />
            </div>

            <div className="p-4 flex flex-col flex-1">
                <p className="text-primary-100 mb-2">{tag}</p>

                <h3 className="text-xl md:text-2xl font-bold mb-4">
                    {translate(title)}
                </h3>

                <div className="flex-1"/>

                <div className="flex items-center justify-between">
                    <p className="text-sm text-body-300">{date}</p>
                    <span className="text-xs px-2 py-1 bg-basic-200 rounded-full">{t('global:COMMON.TIME_TO_READ', { timeToRead })}</span>
                </div>
            </div>
        </div>
    );
}

export default Box;
