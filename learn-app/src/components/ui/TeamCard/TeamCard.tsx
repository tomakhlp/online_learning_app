import {useTranslate} from "../../../hooks/useTranslate.ts";

type TeamCardProps = {
    imageUrl: string;
    name: string;
    title: string;
    description: string;
};

const TeamCard = ({ imageUrl, name, title, description }: TeamCardProps) => {
    const { translate } = useTranslate('team');
    return (
        <div className="flex h-full flex-col items-center text-center p-6 bg-basic-100 overflow-hidden rounded-md w-full max-w-xs mx-auto">
            <div className="w-[90%] aspect-square rounded-full overflow-hidden mb-4 border-4 border-bg">
                <img src={imageUrl} alt={name} className="w-full h-full object-cover"/>
            </div>
            <h3 className="text-2xl font-bold">{translate(name)}</h3>
            <h4 className="text-primary-100 mb-2">{translate(title)}</h4>
            <p className="text-body-250 text-center max-w-[228px]">{translate(description)}</p>
        </div>
    );
};

export default TeamCard;
