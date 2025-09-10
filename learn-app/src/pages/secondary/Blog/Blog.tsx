import Box from "../../../components/ui/Box/Box.tsx";
import {articlesData} from "../../../data/articlesData.ts.ts";
import {useState} from "react";
import Button from "../../../components/ui/Button/Button.tsx";
import {useTranslation} from "react-i18next";

function Blog() {
    const { t } = useTranslation(['button', 'pages',]);

    const [visibleCount, setVisibleCount] = useState(6);

    const loadMore = () => {
        setVisibleCount(prev => prev + 3);
    };

    const isAllVisible = visibleCount >= articlesData.length;

    return (
        <div className="flex flex-col items-center gap-8">
            <h2 className="heading mb-8">{t('pages:BLOG.HEADER')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {articlesData.slice(0, visibleCount).map((article, index) => (
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

            {!isAllVisible && (
                <Button
                    variant={'btnPrimary'}
                    onClick={loadMore}
                >
                    {t('button:LOAD_MORE_ARTICLES')}
                </Button>
            )}
        </div>
    )
}

export default Blog;
