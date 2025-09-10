import {ChangeEvent, useContext, useEffect, useState} from "react";
import {Dayjs} from "dayjs";
import dayjs from "../../../utils/dayjs.ts";
import DatePicker from "../../../components/ui/DatePicker/DatePicker.tsx";
import Input from "../../../components/ui/Input/Input.tsx";
import {Dropdown} from "../../../components/ui/Dropdown/Dropdown.tsx";
import Button from "../../../components/ui/Button/Button.tsx";
import TextArea from "../../../components/ui/TextArea/TextArea.tsx";
import {ROUTES} from "../../../constants/routes.ts";
import {useNavigate, useOutletContext} from "react-router";
import {showErrorToast, showSuccessToast} from "../../../components/ui/Toaster/Toaster.tsx";
import {useTranslation} from "react-i18next";
import {createTraining, getAllTrainers} from "../../../api/training.ts";
import {handleApiError} from "../../../utils/errorHelpers.ts";
import {TRAINING_TYPES} from "../../../data/trainingTypeData.ts";
import {CreateNewTraining, CreateTraining} from "../../../types/training.ts";
import {validateForm} from "../../../utils/validateForm.ts";
import {createTrainingSchema} from "../../../schemas/createTrainingSchema.ts";
import {AuthContext} from "../../../context/AuthContext.tsx";
import LoaderOverlay from "../../../components/ui/LoaderOverlay/LoaderOverlay.tsx";

interface TrainingContextType {
    fetchTrainings: () => Promise<void>;
}

function AddTraining() {
    const { fetchTrainings } = useOutletContext<TrainingContextType>();
    const { t } = useTranslation(['button', 'pages', 'input', 'dropdown', 'textArea', 'datePicker', 'toaster']);
    const { t: tError } = useTranslation('error');
    const { user } = useContext(AuthContext);

    if (!user) return null;

    const [newTraining, setNewTraining] = useState<CreateNewTraining>({
        name: '',
        duration: '',
        typeId: '',
        description: '',
        trainerId: '',
        date: dayjs().utc().startOf('day').unix(),
    });

    const [errors, setErrors] = useState<Partial<CreateNewTraining>>({});

    const [loading, setLoading] = useState(false);
    const [allTrainers, setAllTrainers] = useState<any[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchTrainers() {
            try {
                setLoading(true);
                const data = await getAllTrainers();

                setAllTrainers(data.map(trainer => ({
                    id: trainer.id,
                    label: `${trainer.firstName} ${trainer.lastName}`,
                })));
            } catch (error) {
                const { global } = handleApiError(error, tError);
                if (global) {
                    showErrorToast(global);
                }
            } finally {
                setLoading(false);
            }
        }

        fetchTrainers();
    }, [setLoading]);

    const handleFieldChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setNewTraining((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors({
            ...errors,
            [name]: '',
        });
    };

    const handleDropdownChange = (name: string, value: string) => {
        setNewTraining((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors({
            ...errors,
            [name]: '',
        });
    };

    const handleDateChange = (newDate: Dayjs | null) => {
        if (newDate) {
            setNewTraining((prev) => ({
                ...prev,
                date: newDate.utc().startOf('day').unix(),
            }));
        }
    };

    const handleCancel = () => {
        navigate(`${ROUTES.MY_ACCOUNT}/${ROUTES.TRAINING}`);
    };

    const handleAddTraining = async () => {
        const schema = createTrainingSchema(tError)
        const {isValid, errors: validationErrors} = validateForm(newTraining, schema);

        if (!isValid) {
            setErrors(validationErrors);
            return;
        }

        const trainingType = TRAINING_TYPES.find((training) => training.id === newTraining.typeId);

        if (!trainingType) {
            throw new Error(`Training type with id ${newTraining.typeId} not found`);
        }

        const payload: CreateTraining = {
            studentId: user.roleData.id,
            trainerId: newTraining.trainerId,
            name: newTraining.name,
            date: newTraining.date,
            duration: Number(newTraining.duration),
            description: newTraining.description,
            type: {
                id: newTraining.typeId,
                trainingType: trainingType.label.toLowerCase()
            },
        };

        try {
            setLoading(true)

            await createTraining(payload);
            await fetchTrainings();
            setNewTraining({
                name: '',
                duration: '',
                typeId: '',
                description: '',
                trainerId: '',
                date: dayjs().utc().startOf('day').unix()
            });

            showSuccessToast(t('toaster:TRAININGS_ADDED'));
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

    return (
        <LoaderOverlay isLoading={loading}>
            <div className={'max-w-full flex flex-col gap-7'}>
                <h2 className={'heading'}>{t('pages:ADD_TRAINING.HEADING')}</h2>
                <form className={'flex flex-col gap-4 w-full'}>
                    <div className={'w-full flex flex-col md:flex-row items-start gap-4 md:gap-20 lg:gap-40'}>
                        <div className={'flex flex-col gap-4 w-full md:w-sm'}>
                            <Input
                                name={'name'}
                                label={t('input:LABELS.NAME')}
                                placeholder={t('input:PLACEHOLDERS.NAME')}
                                value={newTraining.name}
                                onChange={handleFieldChange}
                                error={errors.name}
                            />
                            <DatePicker
                                fromDate={dayjs.unix(newTraining.date)}
                                labelFrom={t('datePicker:LABEL_FROM.TRAINING_START')}
                                showTo={false}
                                setFromDate={handleDateChange}
                            />
                            <Input
                                name={'duration'}
                                label={t('input:LABELS.DURATION')}
                                placeholder={t('input:PLACEHOLDERS.DURATION')}
                                value={newTraining.duration}
                                onChange={handleFieldChange}
                                error={errors.duration}
                            />
                            <Dropdown
                                options={TRAINING_TYPES}
                                onChange={(value) => handleDropdownChange("typeId", value)}
                                id={newTraining.typeId}
                                defaultValue={t('dropdown:VALUE.SELECT')}
                                showInteractions={true}
                                showValidation={true}
                                dropdownStyles={'w-full mt-1 max-h-50 md:max-h-80'}
                                buttonStyles={'w-full'}
                                wrapperStyles={'w-full'}
                                label={t('dropdown:LABELS.TYPE')}
                                labelStyles={'font-bold'}
                                error={errors.typeId}
                            />
                            <TextArea
                                name={'description'}
                                value={newTraining.description}
                                onChange={handleFieldChange}
                                label={t('textArea:LABELS.DESCRIPTION')}
                                placeholder={t('textArea:PLACEHOLDERS.DESCRIPTION')}
                                error={errors.description}
                            />
                        </div>
                        <div className={'flex flex-col w-full md:w-sm'}>
                            <Dropdown
                                options={allTrainers}
                                onChange={(value) => handleDropdownChange("trainerId", value)}
                                id={newTraining.trainerId}
                                defaultValue={t('dropdown:VALUE.SELECT')}
                                showInteractions={true}
                                showValidation={true}
                                dropdownStyles={'w-full mt-1 max-h-40 md:max-h-80'}
                                buttonStyles={'w-full'}
                                wrapperStyles={'w-full'}
                                label={t('dropdown:LABELS.ADD_TRAINER')}
                                labelStyles={'font-bold'}
                                showRadio={true}
                                error={errors.trainerId}
                            />
                        </div>
                    </div>

                    <div className={'flex flex-wrap justify-center md:justify-end gap-4'}>
                        <Button
                            variant={'btnTransparent'}
                            className={'text-body-300'}
                            onClick={handleCancel}
                        >
                            {t('button:CANCEL')}
                        </Button>
                        <Button
                            variant={'btnPrimary'}
                            onClick={handleAddTraining}
                        >
                            {t('button:ADD')}
                        </Button>
                    </div>
                </form>
            </div>
        </LoaderOverlay>
    )
}

export default AddTraining;
