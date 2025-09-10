import { ChangeEvent, useContext, useState } from "react";
import { AuthContext } from "../../../context/AuthContext.tsx";
import { Field, USER_ACCOUNT_FIELDS } from "../../../constants/userAccountFields.ts";
import Input from "../../ui/Input/Input.tsx";
import Button from "../../ui/Button/Button.tsx";
import {StudentEntity, TrainerEntity, UserAccountData} from "../../../types/user.ts";
import { ROLES } from "../../../constants/roles.ts";
import { Dropdown } from "../../ui/Dropdown/Dropdown.tsx";
import { SPECIALIZATIONS } from "../../../data/specializationData.ts";
import ReactSwitch from "react-switch";
import { ROUTES } from "../../../constants/routes.ts";
import {Navigate} from "react-router";
import FileUploadModal from "../FileUploadModal/FileUploadModal.tsx";
import {useTranslation} from "react-i18next";
import {useTranslate} from "../../../hooks/useTranslate.ts";
import {validateForm} from "../../../utils/validateForm.ts";
import {studentAccountEditSchema, trainerAccountEditSchema} from "../../../schemas/myAccountEditSchema.ts";
import {handleApiError} from "../../../utils/errorHelpers.ts";
import {showErrorToast} from "../../ui/Toaster/Toaster.tsx";

interface MyAccountEditFormProps {
    onCancel: () => void;
    onSave: (updatedUser: UserAccountData) => Promise<void>;
    onUpdateAvatar: (base64String: string) => Promise<void>,
    setIsEditing: (isEditing: boolean) => void;
}

const MyAccountEditForm = ({ onCancel, onSave, onUpdateAvatar, setIsEditing }: MyAccountEditFormProps) => {
    const { t } = useTranslation(['button', 'dropdown', 'pages', 'global']);
    const { t: tError } = useTranslation('error');
    const { translate } = useTranslate('input')
    const { user } = useContext(AuthContext);

    if (!user) {
        return <Navigate to={ROUTES.LOGIN} />;
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

    type UserAccountErrors = Partial<Record<keyof UserAccountData, string>>;
    const [errors, setErrors] = useState<UserAccountErrors>({});

    const [formData, setFormData] = useState<UserAccountData>(userData);
    const [originalData] = useState<UserAccountData>(userData);
    const [isToggled, setIsToggled] = useState<boolean>(user.isActive);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        setErrors({
            ...errors,
            [name]: '',
        });
    };

    const handleSave = async () => {
        const schema = user.role === ROLES.STUDENT
            ? studentAccountEditSchema(tError)
            : trainerAccountEditSchema(tError)
        ;

        const {isValid, errors: validationErrors} = validateForm(formData, schema);

        if (!isValid) {
            setErrors(validationErrors);
            return;
        }

        const changedFields: any = {};

        Object.keys(formData).forEach((key) => {
            const fieldKey = key as keyof UserAccountData;
            if (formData[fieldKey] !== originalData[fieldKey]) {
                changedFields[fieldKey] = formData[fieldKey];
            }
        });

        if (isToggled !== originalData.isActive) {
            changedFields.isActive = isToggled;
        }

        try {
            await onSave(changedFields);
            setIsEditing(false);
        } catch (error) {
            const {global, ...fieldErrors} = handleApiError(error, tError);
            setErrors(fieldErrors);
            if (global) {
                showErrorToast(global);
            }
        }
    };

    const handleSpecializationChange = (value: string) => {
        if (user.role === ROLES.TRAINER) {
            setFormData(formData => ({ ...formData, specializationId: value }));
        }
    };

    const renderFields = (fields: Field[]) =>
        fields.map(({ key, label, placeholder, defaultValue }) => (
            <div key={key} className="mb-4">
                <label htmlFor={key} className="font-semibold block mb-2">
                    {translate(label)}
                </label>
                <Input
                    id={key}
                    name={key}
                    value={String(formData[key as keyof UserAccountData] ?? defaultValue)}
                    placeholder={translate(placeholder)}
                    onChange={handleChange}
                    showValidation={false}
                    error={errors[key as keyof UserAccountData]}
                />
            </div>
        ));

    const [isModalOpen, setModalOpen] = useState(false);

    const handleChooseImage = () => {
        setModalOpen(true);
    };

    function handleCloseModal() {
        setModalOpen(false);
    }

    return (
        <div className="flex flex-col w-full gap-6">
            <div className="flex flex-col md:flex-row gap-10 md:gap-20 lg:gap-36 h-full">
                <div className="w-full md:w-1/2 rounded-lg shadow-(--box-shadow-card-100) p-6">
                    <h2 className="text-xl font-bold mb-6">{t('pages:MY_ACCOUNT.SECTIONS.EDIT_PROFILE.HEADER')}</h2>
                    <div className="mb-6">
                        <p className="font-semibold mb-2">{t('pages:MY_ACCOUNT.SECTIONS.EDIT_PROFILE.PHOTO.HEADER')}</p>
                        <div className="flex items-center flex-wrap gap-4">
                            <img
                                src={user.photo}
                                alt="Profile Photo"
                                className="w-40 h-40 rounded-lg bg-image-100 object-cover"
                            />
                            <div className={'flex flex-col gap-1'}>
                                <p className={'text-sm'}>
                                    {t('pages:MY_ACCOUNT.SECTIONS.EDIT_PROFILE.PHOTO.UPLOAD_LABEL')}
                                </p>
                                <p className={'text-xs text-body-200'}>
                                    {t('pages:MY_ACCOUNT.SECTIONS.EDIT_PROFILE.PHOTO.UPLOAD_INSTRUCTION')}
                                </p>
                                <div className={'flex flex-wrap gap-3'}>
                                    <Button variant="btnTransparent"
                                            className={'border border-primary-100 '}
                                            onClick={handleChooseImage}
                                    >
                                        {t('button:CHOOSE_IMAGE')}
                                    </Button>
                                    <Button
                                        variant="btnTransparent"
                                        className={'text-body-300'}
                                        onClick={() => {}}
                                    >
                                        {t('button:REMOVE')}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {renderFields(USER_ACCOUNT_FIELDS.general)}
                    {user.role === ROLES.STUDENT && renderFields(USER_ACCOUNT_FIELDS.roles[ROLES.STUDENT])}

                    <div className="flex items-center gap-3">
                        <span className="font-bold">{t('global:COMMON.ACTIVE')}</span>
                        <ReactSwitch
                            checked={isToggled}
                            onChange={setIsToggled}
                            onColor="#6355D8"
                        />
                    </div>
                </div>
                {user.role === ROLES.TRAINER && (
                    <div className="md:w-1/2">
                        <Dropdown
                            options={SPECIALIZATIONS}
                            onChange={handleSpecializationChange}
                            id={(formData as UserAccountData).specializationId}
                            label={t('dropdown:LABELS.MY_SPECIALIZATION')}
                            labelStyles={'pb-5 font-bold'}
                            wrapperStyles={'w-max'}
                            dropdownStyles={"mt-1 max-h-30 md:max-h-200"}
                            buttonStyles={'border-primary-100 min-w-full'}
                            showValidation={false}
                        />
                    </div>
                )}
            </div>
            <div className="flex justify-center gap-5">
                <Button variant="btnTransparent" onClick={onCancel}>
                    {t('button:CANCEL')}
                </Button>
                <Button variant="btnPrimary" onClick={handleSave}>
                    {t('button:SAVE_CHANGES')}
                </Button>
            </div>
            <FileUploadModal
                open={isModalOpen}
                onClose={handleCloseModal}
                onUpload={onUpdateAvatar}
            />
        </div>
    );
};

export default MyAccountEditForm;
