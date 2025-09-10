import Button from "../../ui/Button/Button.tsx";
import {useTranslation} from "react-i18next";

interface JoinUsBoxProps {
    title: string;
    description: string;
    imageUrl: string;
    onClick: () => void;
}

function JoinUsBox({ title, description, imageUrl, onClick }: JoinUsBoxProps) {
    const { t } = useTranslation(['button']);

    return (
        <div className="w-full bg-basic-100 rounded-2xl shadow-(--box-shadow-card-100) overflow-hidden flex flex-col md:flex-row">
            <div className="flex flex-col justify-center p-6 md:w-1/2">
                <h2 className="text-xl sm:text-3xl lg:text-5xl font-bold mb-4 text-center md:text-left">{title}</h2>
                <p className="text-md sm:text-lg mb-6 text-center md:text-left">{description}</p>
                <Button
                    onClick={onClick}
                    variant="btnPrimary"
                    className="w-fit mx-auto md:mx-0"
                >
                    {t('button:JOIN_US')}
                </Button>
            </div>

            <div className="md:w-1/2 flex justify-center items-center">
                <img
                    src={imageUrl}
                    alt="Illustration"
                    loading="lazy"
                    className="h-full aspect-16/9 w-full object-cover md:rounded-r-2xl"
                />
            </div>
        </div>
    )
}

export default JoinUsBox;
