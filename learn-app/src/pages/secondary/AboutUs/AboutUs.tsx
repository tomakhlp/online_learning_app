import TeamCard from "../../../components/ui/TeamCard/TeamCard.tsx";
import {teamMembersData} from "../../../data/teamMembersData.ts";
import {useTranslation} from "react-i18next";

function AboutUs() {
    const { t } = useTranslation(['pages']);
    return (
        <div className={'flex flex-col items-center md:px-20 w-full gap-8'}>
            <h1 className={"heading"}>{t('pages:ABOUT_US.HEADER')}</h1>
            <h4 className={'tertiary-heading'}>
                {t('pages:ABOUT_US.DESCRIPTION')}
            </h4>
            <img src={'/images/about-us/about_us.jpg'} alt={'aboutUs'} className={'w-full h-auto max-h-[600px] object-cover'}/>
            <div className="flex flex-col lg:flex-row items-center justify-center gap-5">
            <div className={'flex flex-col items-center justify-center lg:w-1/4'}>
                    <h2 className="subheading mb-4">{t('pages:ABOUT_US.TEAM.HEADER')}</h2>
                    <p className="text-body-150 text-center">
                        {t('pages:ABOUT_US.TEAM.DESCRIPTION')}
                    </p>
                </div>

                <div className="lg:w-3/4 grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full">
                    {teamMembersData.map((teamMember, index) => (
                        <TeamCard
                            key={index}
                            imageUrl={teamMember.imageUrl}
                            name={teamMember.name}
                            title={teamMember.title}
                            description={teamMember.description}
                        />
                    ))}
                </div>
            </div>

        </div>

    )
}

export default AboutUs;
