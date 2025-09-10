import {JSX, ReactNode} from "react";
import Button from "../Button/Button.tsx";
import {RxCross1} from "react-icons/rx";
import {FaRegCircleCheck} from "react-icons/fa6";
import {useTranslate} from "../../../hooks/useTranslate.ts";

interface PricingCardProps {
    title: string;
    description: string;
    price: string;
    frequency: string;
    features?: { text: string; included: boolean }[];
    buttonText: string;
    buttonIcon?: ReactNode;
    onClick: () => void;
    badge?: string;
    isHighlighted?: boolean;
}

function PricingCard({
     title,
     description,
     price,
     frequency,
     features,
     badge,
     buttonText,
     buttonIcon,
     onClick,
     isHighlighted = false,
}: PricingCardProps): JSX.Element {
    const { translate } = useTranslate('pricing');

    return (
        <div className={`relative flex flex-col gap-5 w-full max-w-sm rounded-lg px-6 py-5 ${
            isHighlighted 
                ? "bg-bg -mt-3 -mb-3 pt-12 shadow-(--box-shadow-card-100)" 
                : "bg-basic-100 shadow-(--box-shadow-card-150)"
            }`}
        >
            <div className="flex flex-wrap justify-between items-center gap-5">
                <h3 className={`font-bold flex-grow ${
                    isHighlighted ? "text-primary-100 text-3xl" : "text-body-100 text-2xl"}`}
                >
                    {translate(title)}
                </h3>
                {badge && (
                    <div className="bg-badge-100 text-bg text-xs px-3 py-1 rounded-3xl">
                        {translate(badge)}
                    </div>
                )}
            </div>

            <p className="">{translate(description)}</p>

            <div className={"flex flex-wrap items-start gap-1"}>
                <p className="text-4xl font-bold">
                    {price}
                </p>
                <p className="text-sm text-body-250">/{translate(frequency)}</p>

            </div>
            <ul className="text-left space-y-2">
                {features?.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                        <span>
                            {feature.included ? (
                                <FaRegCircleCheck className={'w-4 h-4 text-icon-100'}/>
                            ) : (
                                <RxCross1 className={'w-4 h-4 text-body-250 stroke-1'}/>
                            )}
                        </span>
                        <p>{translate(feature.text)}</p>
                    </li>
                ))}
            </ul>

            <Button
                variant={isHighlighted ? 'btnPrimary' : 'btnTransparent'}
                className="w-full border border-primary-100 gap-2 mt-auto"
                onClick={onClick}
                icon={buttonIcon}
            >
                {translate(buttonText)}
            </Button>
        </div>
    );
}

export default PricingCard;
