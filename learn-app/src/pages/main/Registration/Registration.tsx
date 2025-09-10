import {Navigate, Outlet, useMatch, useNavigate, useParams} from "react-router";
import {ROUTES} from "../../../constants/routes.ts";
import RegistrationForm from "../../../components/forms/RegistrationForm/RegistrationForm.tsx";
import {ChangeEvent, FormEvent, useContext, useState} from "react";
import {RegistrationUser, TrainerRegistrationData} from "../../../types/auth.ts";
import {validateForm} from "../../../utils/validateForm.ts";
import {studentRegistrationSchema, trainerRegistrationSchema} from "../../../schemas/registrationSchema.ts";
import Spinner from "../../../components/ui/Spinner/Spinner.tsx";
import {ALL_ROLES, Role, ROLES} from "../../../constants/roles.ts";
import {AuthContext} from "../../../context/AuthContext.tsx";
import {RegistrationErrors, TrainerRegistrationErrors} from "../../../types/errors.ts";
import {createInitialErrors, createInitialUser} from "./registrationFactories.ts";
import {useTranslation} from "react-i18next";
import {registerUser} from "../../../api/auth.ts";
import {getUserInfo} from "../../../api/user.ts";
import {handleApiError} from "../../../utils/errorHelpers.ts";
import {showErrorToast} from "../../../components/ui/Toaster/Toaster.tsx";

const roleImages: Record<Role, string> = {
    student: '/images/registration/registration_student.jpeg',
    trainer: '/images/registration/registration_trainer.jpg',
}

function Registration() {
    const { t } = useTranslation(['pages']);
    const { t: tError } = useTranslation('error');
    const { role: rawRole } = useParams<{ role: string }>();
    const role = ALL_ROLES.includes(rawRole as Role) ? (rawRole as Role) : undefined;

    if (!role) {
        return <Navigate to={ROUTES.NOT_FOUND} replace />;
    }

    const navigate = useNavigate();

    const [user, setUser] = useState<RegistrationUser[Role]>(createInitialUser(role));
    const [errors, setErrors] = useState<RegistrationErrors[Role]>(createInitialErrors(role));

    const [loading, setLoading] = useState(false);

    const { setUser: setContextUser} = useContext(AuthContext);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setUser({
            ...user,
            [name]: value,
        });

        setErrors({
            ...errors,
            [name]: '',
        });
    };

    const handleSpecializationChange = (value: string) => {
        if (role !== ROLES.TRAINER) { return }

        setUser({
            ...user as TrainerRegistrationData,
            specializationId: value,
        });

        setErrors({
            ...errors as TrainerRegistrationErrors,
            specializationId: '',
        });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const schema = role === ROLES.STUDENT
            ? studentRegistrationSchema(tError)
            : trainerRegistrationSchema(tError)
        ;

        const { isValid, errors: validationErrors } = validateForm(user, schema);

        if (!isValid) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);

        try {
            const data = await registerUser(user);
            localStorage.setItem('accessToken', data.accessToken);
            const fullUser = await getUserInfo();
            setContextUser(fullUser);

            sessionStorage.setItem('registrationSuccess', 'true');
            setUser(createInitialUser(role));
            setErrors(createInitialErrors(role));

            navigate(ROUTES.SUCCESS, { state: { password: data.password } });
        } catch (error) {
            const { global, ...fieldErrors } = handleApiError(error, tError);
            setErrors(fieldErrors);
            if (global) {
                showErrorToast(global);
            }
        } finally {
            setLoading(false);
        }
    }

    const isSuccessPage = useMatch(`${ROUTES.REGISTRATION}/:role/${ROUTES.SUCCESS}`);

    if (isSuccessPage) {
        return <Outlet/>
    }

    return (
            <div className="w-full flex flex-col px-4 md:px-20 relative">
                {loading && <Spinner/>}
                <h3 className="text-3xl md:text-5xl font-bold">{t('pages:REGISTRATION.HEADER')}</h3>
                <p className="text-body-300 text-lg pt-4 pb-6 capitalize">{role}</p>

                <div className="w-full flex flex-col sm:flex-row items-stretch gap-8 lg:gap-24">
                    <div className="w-full sm:w-[350px] flex-shrink-0">
                        <img
                            className="rounded-xl w-full h-full object-cover"
                            src={roleImages[role]}
                            alt={`${role} illustration`}
                        />
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <RegistrationForm
                            role={role}
                            user={user}
                            errors={errors}
                            onSubmit={handleSubmit}
                            onChange={handleChange}
                            onSpecializationChange={handleSpecializationChange}
                        />
                    </div>
                </div>
            </div>

    )
}

export default Registration;
