import {useNavigate} from "react-router";
import {ROUTES} from "../../../constants/routes.ts";
import JoinUsBox from "../../../components/features/JoinUsBox/JoinUsBox.tsx";
import {Role, ROLES} from "../../../constants/roles.ts";
import {useTranslation} from "react-i18next";

function JoinUs() {
    const { t } = useTranslation(['pages']);
    const navigate = useNavigate();

    const handleRegistration = (role: Role) => {
        navigate(`${ROUTES.REGISTRATION}/${role}`);
    };

    return (
        <div className={'flex flex-col items-center justify-center gap-5 px-4 md:px-20'}>
            <h2 className={'heading'}>{t('pages:JOIN_US.HEADER')}</h2>
            <JoinUsBox
                title={t('pages:JOIN_US.SECTIONS.TITLE', {
                    role: t('pages:JOIN_US.SECTIONS.TRAINER.ROLE')
                })}
                description={t('pages:JOIN_US.SECTIONS.TRAINER.DESCRIPTION')}
                imageUrl={'/images/join-us/join_us_trainer.png'}
                onClick={() => handleRegistration(ROLES.TRAINER)}
            />

            <JoinUsBox
                title={t('pages:JOIN_US.SECTIONS.TITLE', {
                    role: t('pages:JOIN_US.SECTIONS.STUDENT.ROLE')
                })}
                description={t('pages:JOIN_US.SECTIONS.STUDENT.DESCRIPTION')}
                imageUrl={'/images/join-us/join_us_students.jpeg'}
                onClick={() => handleRegistration(ROLES.STUDENT)}
            />
        </div>
    )
}

export default JoinUs;
