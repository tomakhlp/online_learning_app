import Button from "../../../components/ui/Button/Button.tsx";
import {articlesData} from "../../../data/articlesData.ts.ts";
import Box from "../../../components/ui/Box/Box.tsx";
import {useContext} from "react";
import {AuthContext} from "../../../context/AuthContext.tsx";
import {useNavigate} from "react-router";
import {ROUTES} from "../../../constants/routes.ts";
import Banner from "./components/Banner.tsx";
import {useTranslation} from "react-i18next";

function Home() {
    const { t } = useTranslation(['button', 'pages',]);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleJoinUs = () => {
        navigate(ROUTES.JOIN_US)
    }

    const greeting = user
        ? t('pages:HOME.GREETING.SIGNED_IN', { name: user.firstName })
        : t('pages:HOME.GREETING.SIGNED_OUT')
    ;

    return (
        <div className={'flex flex-col items-center md:px-20 w-full gap-8'}>
            <h1 className={"heading"}>{greeting}</h1>
            <h4 className={"tertiary-heading"}>{t('pages:HOME.WELCOME_MESSAGE')}</h4>

            {user ? (
                <div className={'flex flex-col items-center gap-11'}>
                    <div>
                        <h2 className={'subheading'}>{t('pages:HOME.WHATS_NEW.HEADER')}</h2>
                        <h4 className="text-lg text-center text-body-300 max-w-3xl">
                            {t('pages:HOME.WHATS_NEW.DESCRIPTION')}
                        </h4>
                    </div>

                    <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
                        {articlesData.slice(0, 3).map((article, index) => (
                            <Box
                                key={index}
                                tag={article.tag}
                                title={article.title}
                                date={article.date}
                                timeToRead={article.timeToRead}
                                imageUrl={article.imageUrl}
                            />
                        ))}
                    </div>
                    <Button variant={'btnPrimary'}
                            onClick={() => navigate(ROUTES.BLOG)}
                    >
                        {t('button:READ_MORE_ARTICLES')}
                    </Button>
                </div>

            ) : (
                <div className={'flex flex-col items-center gap-11 w-full'}>
                    <video
                        className={'w-full sm:max-w-lg lg:max-w-4xl h-auto object-contain'}
                        controls
                        src={'/video/video.mp4'}
                    >
                        Sorry, your browser does not support video playback.
                    </video>
                    <Banner onJoinUs={handleJoinUs}/>
                </div>
            )}
        </div>
    )
}

export default Home;
