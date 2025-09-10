import {useContext} from "react";
import {AuthContext} from "../../../context/AuthContext.tsx";
import Button from "../../ui/Button/Button.tsx";
import {Navigate, useNavigate} from "react-router";
import {ROUTES} from "../../../constants/routes.ts";
import {Field, USER_ACCOUNT_FIELDS} from "../../../constants/userAccountFields.ts";
import {StudentEntity, TrainerEntity, UserAccountData} from "../../../types/user.ts";
import {SPECIALIZATIONS} from "../../../data/specializationData.ts";
import {useTranslation} from "react-i18next";
import {useTranslate} from "../../../hooks/useTranslate.ts";
import clsx from "clsx";
import {MdCheckCircleOutline, MdOutlineCancel} from "react-icons/md";

interface Props {
    onEdit: () => void;
}

function MyAccountList({onEdit}: Props) {
    const { t } = useTranslation(['button', 'pages', 'global']);
    const { translate } = useTranslate('input');
    const {user} = useContext(AuthContext);
    const navigate = useNavigate();

    if (!user) {
        return <Navigate to={ROUTES.LOGIN} />;
    }

    const handleChangePassword = () => {
        navigate(ROUTES.CHANGE_PASSWORD)
    }

    const userData: UserAccountData = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        isActive: user.isActive,
        dateOfBirth: (user.roleData as StudentEntity).dateOfBirth,
        address: (user.roleData as StudentEntity).address,
        specializationId: (user.roleData as TrainerEntity).specializationId,
    }

    const renderFields = (fields: Field[]) => {
        return fields.map(({ key, label, defaultValue }) => {
            let value = userData[key as keyof UserAccountData];

            if (key === "specializationId" && typeof value === "string") {
                const match = SPECIALIZATIONS.find(spec => spec.id === value);
                value = match?.label ?? defaultValue;
            }

            return (
                <div key={String(key)}>
                    <p className="font-bold">{translate(label)}</p>
                    <p>{value || defaultValue}</p>
                </div>
            );
        });
    };

    return (
        <div className={"flex flex-col w-full"}>
            <h1 className={"text-2xl lg:text-3xl font-bold mb-6"}>{t('pages:MY_ACCOUNT.SECTIONS.MY_PROFILE.HEADER')}</h1>
            <div className={"flex items-start gap-4 mb-4 flex-wrap"}>
                <img
                    className={"w-40 h-40 rounded-lg bg-image-100 object-cover"}
                    src={user?.photo}
                    alt="Profile Image"
                />
                <div>
                    <p className={"font-bold"}>{t('pages:MY_ACCOUNT.SECTIONS.MY_PROFILE.STATUS')}</p>
                    <span className={clsx(
                        "flex items-center gap-1",
                        user?.isActive ? "text-secondary-100" : "text-important-150"
                    )}
                    >
                        {user?.isActive ? (
                            <MdCheckCircleOutline  className="h-5 w-5" />
                        ) : (
                            <MdOutlineCancel className="h-5 w-5" />
                        )}
                        {user?.isActive ? t('global:COMMON.ACTIVE') : t('global:COMMON.NOT_ACTIVE')}
                    </span>
                </div>
            </div>

            <div className={"space-y-4 mb-6"}>
                {renderFields(USER_ACCOUNT_FIELDS.general)}
                {user?.role && renderFields(USER_ACCOUNT_FIELDS.roles[user.role] || [])}
            </div>

            <div className={"flex gap-5 flex-wrap"}>
                <Button
                    variant={'btnPrimary'}
                    onClick={onEdit}
                >
                    {t('button:EDIT_PROFILE')}
                </Button>
                <Button
                    variant={'btnSecondary'}
                    onClick={handleChangePassword}
                >
                    {t('button:CHANGE_PASSWORD')}
                </Button>
            </div>
        </div>
    );
}

export default MyAccountList;
