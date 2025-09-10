import {RegistrationUser} from "../../../types/auth.ts";
import {ChangeEvent, FormEvent} from "react";
import Input from "../../ui/Input/Input.tsx";
import Button from "../../ui/Button/Button.tsx";
import {Dropdown} from "../../ui/Dropdown/Dropdown.tsx";
import {Role} from "../../../constants/roles.ts";
import {SPECIALIZATIONS} from "../../../data/specializationData.ts";
import {RegistrationErrors} from "../../../types/errors.ts";
import {isStudentContext, isTrainerContext} from "../../../pages/main/Registration/registrationUtils.ts";
import {useTranslation} from "react-i18next";

interface RegistrationFormProps {
    role: Role;
    user: RegistrationUser[Role];
    errors: RegistrationErrors[Role];
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: FormEvent) => void;
    onSpecializationChange: (value: string) => void;
}

function RegistrationForm({ role, user, errors, onChange, onSpecializationChange, onSubmit}: RegistrationFormProps) {
    const { t } = useTranslation(['button', 'dropdown', 'input']);
    const context = { user, errors };

    return (
        <form onSubmit={onSubmit} className={'h-full flex flex-col justify-between gap-6'}>
            <div className={'space-y-6'}>
                <Input
                    name="firstName"
                    label={t('input:LABELS.FIRST_NAME')}
                    placeholder={t('input:PLACEHOLDERS.FIRST_NAME')}
                    value={user.firstName}
                    onChange={onChange}
                    error={errors.firstName}
                />
                <Input
                    name="lastName"
                    label={t('input:LABELS.LAST_NAME')}
                    placeholder={t('input:PLACEHOLDERS.LAST_NAME')}
                    value={user.lastName}
                    onChange={onChange}
                    error={errors.lastName}
                />

                <Input
                    name="email"
                    label={t('input:LABELS.EMAIL')}
                    placeholder={t('input:PLACEHOLDERS.EMAIL')}
                    value={user.email}
                    onChange={onChange}
                    error={errors.email}
                />

                {isStudentContext(context, role) && (
                    <>
                        <Input
                            name="dateOfBirth"
                            label={t('input:LABELS.DATE_OF_BIRTH')}
                            value={context.user.dateOfBirth}
                            placeholder={t('input:PLACEHOLDERS.DATE_OF_BIRTH')}
                            onChange={onChange}
                            error={context.errors.dateOfBirth}
                        />
                        <Input
                            name="address"
                            label={t('input:LABELS.ADDRESS')}
                            placeholder={t('input:PLACEHOLDERS.ADDRESS')}
                            value={context.user.address}
                            onChange={onChange}
                            error={context.errors.address}
                        />
                    </>
                )}

                {isTrainerContext(context, role) && (
                    <Dropdown
                        options={SPECIALIZATIONS}
                        onChange={onSpecializationChange}
                        defaultValue={t('dropdown:VALUE.SELECT')}
                        label={t('dropdown:LABELS.SPECIALIZATIONS')}
                        id={context.user.specializationId}
                        labelStyles={'font-bold'}
                        buttonStyles={'w-full'}
                        wrapperStyles={'w-full'}
                        dropdownStyles={'w-full mt-1 max-h-30 md:max-h-41'}
                        error={context.errors.specializationId}
                        showInteractions={true}
                        showValidation={true}
                    />
                )}
            </div>

            <Button
                variant={'btnPrimary'}
                type={'submit'}
                className="mt-4 w-full"
            >
                {t('button:SIGN_UP')}
            </Button>
        </form>
    )
}

export default RegistrationForm;
