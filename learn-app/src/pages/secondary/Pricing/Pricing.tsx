import {useState} from "react";
import Button from "../../../components/ui/Button/Button.tsx";
import {IoIosArrowDown} from "react-icons/io";
import PricingCard from "../../../components/ui/PricingCard/PricingCard.tsx";
import {faqData} from "../../../data/faqData.ts";
import {pricingPlansData} from "../../../data/pricingPlansData.tsx";
import Modal from "../../../components/ui/Modal/Modal.tsx";
import {useTranslation} from "react-i18next";
import {useTranslate} from "../../../hooks/useTranslate.ts";

function Pricing() {
    const { t } = useTranslation(['button', 'pages', 'modal']);
    const { translate } = useTranslate('faq')

    const [activeQuestion, setActiveQuestion] = useState<number | null>(null);

    const toggleQuestion = (index: number) => {
        setActiveQuestion(activeQuestion === index ? null : index);
    };

    const [isModalOpen, setModalOpen] = useState(false);

    const handleSelectPlan = () => {
        setModalOpen(true);
    };

    function handleCloseModal() {
        setModalOpen(false);
    }

    return (
        <div className={'flex flex-col items-center w-full gap-8 md:px-20'}>
            <h1 className={"heading"}>{t('pages:PRICING.HEADER')}</h1>
            <h4 className={'tertiary-heading'}>
                {t('pages:PRICING.DESCRIPTION')}
            </h4>

            <div className="flex flex-col md:flex-row gap-5 md:gap-0 w-full justify-center items-center md:items-stretch">
                {pricingPlansData.map((plan, index) => (
                    <PricingCard
                        key={index}
                        title={plan.title}
                        description={plan.description}
                        price={plan.price}
                        frequency={plan.frequency}
                        features={plan.features}
                        buttonText={plan.buttonText}
                        buttonIcon={plan.buttonIcon}
                        onClick={handleSelectPlan}
                        badge={plan.badge}
                        isHighlighted={plan.isHighlighted}
                    />
                ))}
            </div>

            <h2 className="subheading">{t('pages:PRICING.FAQ.HEADER')}</h2>
            <p className="tertiary-heading">{t('pages:PRICING.FAQ.DESCRIPTION')}</p>
            <div className="w-full">
                <div className="">
                    {faqData.map((faq, index) => (
                        <div
                            key={index}
                            className="border-t border-basic-300 py-5 text-left cursor-pointer"
                            onClick={() => toggleQuestion(index)}
                        >
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold">{translate(faq.question)}</h3>
                                <Button
                                    variant={'btnTransparent'}
                                    icon={<IoIosArrowDown className={`transform transition-transform ${activeQuestion === index ? "rotate-180 text-body-200" : "rotate-0 text-body-300 "}`}/>}
                                >
                                </Button>
                            </div>
                            {activeQuestion === index && (
                                <p className="text-body-150 mt-2">{translate(faq.answer)}</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <Modal
                open={isModalOpen}
                onClose={handleCloseModal}
                title={t('modal:COMING_SOON.TITLE')}
                description={t('modal:COMING_SOON.DESCRIPTION')}
                primaryConfirmText={t('button:GOT_IT')}
                onPrimaryConfirm={handleCloseModal}
            />
        </div>
    )
}

export default Pricing;
