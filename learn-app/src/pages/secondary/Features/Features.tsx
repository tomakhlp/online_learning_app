import Button from "../../../components/ui/Button/Button.tsx";
import {useState} from "react";
import Modal from "../../../components/ui/Modal/Modal.tsx";
import {useTranslation} from "react-i18next";

function Features() {
    const { t } = useTranslation(['button', 'pages', 'modal']);
    const [isModalOpen, setModalOpen] = useState(false);

    const handleTryFeature = () => {
        setModalOpen(true);
    };

    function handleCloseModal() {
        setModalOpen(false);
    }

    return (
        <div className={'flex flex-col items-center md:px-20 w-full gap-8'}>
            <h1 className={"heading"}>{t('pages:FEATURES.HEADER')}</h1>
            <div>
                <h2 className="subheading mb-4">{t('pages:FEATURES.LEARNING.HEADER')}</h2>
                <h4 className={'tertiary-heading'}>
                    {t('pages:FEATURES.LEARNING.DESCRIPTION')}
                </h4>
            </div>
            <div className="grid gap-12">
                <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-52">
                    <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
                        <h3 className="text-2xl font-bold text-body-100 mb-4">
                            {t('pages:FEATURES.SECTION_ONE.HEADER')}
                        </h3>
                        <p className="text-body-150 mb-6">
                            {t('pages:FEATURES.SECTION_ONE.DESCRIPTION')}
                        </p>
                        <Button
                            variant={'btnPrimary'}
                            onClick={handleTryFeature}
                        >
                            {t('button:TRY_NOW')}
                        </Button>
                    </div>

                    <div className="flex-1">
                        <div className="w-full aspect-[16/9] overflow-hidden rounded-md">
                            <img
                                src='/images/features/features1.jpg'
                                alt="Feature Image"
                                className="w-full h-full object-cover object-center"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row-reverse items-center gap-10 lg:gap-52">
                    <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
                        <h3 className="text-2xl font-bold text-body-100 mb-4">
                            {t('pages:FEATURES.SECTION_TWO.HEADER')}
                        </h3>
                        <p className="text-body-150 mb-6">
                            {t('pages:FEATURES.SECTION_TWO.DESCRIPTION')}
                        </p>
                        <Button
                            variant={'btnPrimary'}
                            onClick={handleTryFeature}
                        >
                            {t('button:TRY_NOW')}
                        </Button>
                    </div>

                    <div className="flex-1">
                        <div className="w-full aspect-[16/9] overflow-hidden rounded-md">
                            <img
                                src='/images/features/features2.jpg'
                                alt="Feature Image"
                                className="w-full h-full object-cover object-center"
                            />
                        </div>
                    </div>
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

export default Features;
