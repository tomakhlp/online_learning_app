import Button from "../../../../components/ui/Button/Button.tsx";
import YellowCircle from "../../../../assets/yellowCircle.svg";
import BlueCircle from "../../../../assets/blueСircle.svg";
import Dots from "../../../../assets/dots.svg";
import {useTranslation} from "react-i18next";

interface BannerProps {
    onJoinUs: () => void;
}

export default function Banner({ onJoinUs }: BannerProps) {
    const { t } = useTranslation(['button', 'pages']);

    return (
        <div className="relative w-full flex flex-col items-center justify-center min-h-[40vh] mx-auto px-6 text-center bg-basic-100 overflow-hidden">
            <img
                src={BlueCircle}
                alt="blue circle"
                className="absolute bottom-[-120px] md:bottom-[-80px] left-[-150px] md:left-[-100px] w-[200px] h-[200px]"
            />

            <img
                src={YellowCircle}
                alt="yellow circle"
                className="absolute top-[-200px] md:top-[-150px] right-[-160px] md:right-[-120px] w-[250px] h-[250px]"
            />

            <img
                src={Dots}
                alt="dots top left"
                className="absolute top-[-225px] md:top-[-200px] left-[-130px] md:left-[10px] lg:left-[100px] w-[100px] h-[200px] w-[177px] h-[264px]"
            />

            <img
                src={Dots}
                alt="dots bottom right"
                className="absolute bottom-[-200px] md:bottom-[-170px] right-[-130px] md:right-[-100px] w-[177px] h-[264px]"
            />

            <h1 className="subheading text-primary-100 mb-4">{t('pages:HOME.BANNER.HEADER')}</h1>

            <p className="max-w-md mb-6">{t('pages:HOME.BANNER.DESCRIPTION')}</p>

            <Button variant={'btnPrimary'}
                    onClick={onJoinUs}
                    className={'mb-4'}
            >
                {t('button:JOIN_US')}
            </Button>
        </div>
    );
}
