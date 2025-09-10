import {getTrainingsColumns} from "../../../tables/trainingsTableColumns.tsx";
import Table from "../../../components/ui/Table/Table.tsx";
import DatePicker from "../../../components/ui/DatePicker/DatePicker.tsx";
import SearchForm from "../../../components/ui/SearchForm/SearchForm.tsx";
import {ChangeEvent, useContext, useEffect, useMemo, useState} from "react";
import {AuthContext} from "../../../context/AuthContext.tsx";
import {Role, ROLES} from "../../../constants/roles.ts";
import {getSearchFieldsByRole} from "../../../utils/getSearchFieldsByRole.ts";
import Button from "../../../components/ui/Button/Button.tsx";
import {Outlet, useMatch, useOutletContext} from "react-router";
import {ROUTES} from "../../../constants/routes.ts";
import {useTranslation} from "react-i18next";
import {getMyTrainings, searchTrainings} from "../../../api/training.ts";
import {handleApiError} from "../../../utils/errorHelpers.ts";
import {showErrorToast} from "../../../components/ui/Toaster/Toaster.tsx";
import {TrainingData, TrainingResponse} from "../../../types/training.ts";
import {Dayjs} from "dayjs";
import dayjs from "../../../utils/dayjs.ts";
import {formatUnixTimestampToDate} from "../../../utils/formatUnixTimestampToDate.ts";
import LoaderOverlay from "../../../components/ui/LoaderOverlay/LoaderOverlay.tsx";
import {capitalize} from "../../../utils/capitalize.ts";

interface MyAccountContext {
    handleAddTraining: () => void;
}

function Training() {
    const { t } = useTranslation(['button', 'pages']);
    const { t: tTables } = useTranslation('tables')
    const { t: tError } = useTranslation('error');
    const { user } = useContext(AuthContext)

    const [loading, setLoading] = useState(false);
    const [trainingsData, setTrainingsData] = useState<TrainingData[]>([]);
    const [fromDate, setFromDate] = useState<Dayjs | null>(dayjs().utc().startOf('day'));
    const [toDate, setToDate] = useState<Dayjs | null>(dayjs().utc().add(14, "day").startOf('day'));
    const [searchValues, setSearchValues] = useState<Record<string, string>>({});

    if (!user) return null;

    const { role } = user;

    const { handleAddTraining } = useOutletContext<MyAccountContext>();

    const tableColumns = getTrainingsColumns(role, tTables);
    const initialFields = useMemo(() => getSearchFieldsByRole(role), [role]);

    const fetchTrainings = async () => {
        try {
            setLoading(true);
            const data = await getMyTrainings();
            setTrainingsData(formatTableData(data, role));
        } catch (error) {
            const { global } = handleApiError(error, tError);
            if (global) {
                showErrorToast(global);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrainings();
    }, [role]);

    const formatTableData = (data: TrainingResponse[], role: Role): TrainingData[] => {
        return data.map((training) => ({
            date: formatUnixTimestampToDate(training.date),
            name: training.name,
            type: capitalize(training.type.trainingType),
            studentName: role === ROLES.TRAINER ? `${training.studentFirstName || ''} ${training.studentLastName || ''}` : undefined,
            trainerName: role === ROLES.STUDENT ? `${training.trainerFirstName || ''} ${training.trainerLastName || ''}` : undefined,
            duration: `${training.duration} d`,
        }));
    };

    const fields = useMemo(() => {
        return initialFields.map((field) => ({
            ...field,
            value: searchValues[field.name] || '',
        }));
    }, [initialFields, searchValues]);

    const handleFieldChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSearchValues((prevValues) => {
            const updatedValues = {
                ...prevValues,
                [name]: value,
            };

            const allFieldsEmpty = Object.values(updatedValues).every(
                (val) => val === "" || val === undefined || val === null
            );

            if (allFieldsEmpty) {
                fetchTrainings();
            }

            return updatedValues;
        });
    };

    const handleFromDateChange = (newDate: Dayjs | null) => {
        if (newDate) setFromDate(newDate.utc().startOf('day'));
    };

    const handleToDateChange = (newDate: Dayjs | null) => {
        if (newDate) setToDate(newDate.utc().startOf('day'));
    };

    const handleSearchSubmit = async () => {
        try {
            setLoading(true);

            const formattedFromDate = fromDate ? fromDate.unix() : undefined;
            const formattedToDate = toDate ? toDate.unix() : undefined;

            const trimmedSearchValues = Object.fromEntries(
                Object.entries(searchValues).map(([key, value]) => [key, value.trim()])
            );

            const searchParams = {
                ...trimmedSearchValues,
                startDate: formattedFromDate,
                endDate: formattedToDate,
            };

            const data = await searchTrainings(searchParams);
            setTrainingsData(formatTableData(data, role));
        } catch (error) {
            const {global} = handleApiError(error, tError);
            if (global) {
                showErrorToast(global);
            }
        } finally {
            setLoading(false);
        }
    };

    const isChildRouteActive = useMatch(`${ROUTES.MY_ACCOUNT}/${ROUTES.TRAINING}/${ROUTES.ADD_TRAINING}`);

    if (isChildRouteActive) {
        return <Outlet context={{fetchTrainings}} />;
    }

    return (
        <LoaderOverlay isLoading={loading}>
            <div className={'max-w-full flex flex-col gap-7'}>
                <h1 className={'heading'}>{t('pages:TRAININGS.HEADER')}</h1>
                {role === ROLES.STUDENT &&
                    <Button
                        variant={'btnSecondary'}
                        className={'w-fit'}
                        onClick={handleAddTraining}
                    >
                        {t('button:ADD_TRAINING')}
                    </Button>
                }
                <h3 className={'text-xl font-bold'}>{t('pages:TRAININGS.SEARCH_HEADER')}</h3>
                <div className={'w-full flex flex-col md:flex-row flex-wrap justify-between gap-5 items-start'}>
                    <div className={'w-full md:max-w-md'}>
                        <SearchForm
                            fields={fields}
                            buttonText={t('button:SEARCH')}
                            onSubmit={handleSearchSubmit}
                            onChange={handleFieldChange}
                        />
                    </div>
                    <div className={'w-full md:max-w-md'}>
                        <DatePicker
                            fromDate={fromDate}
                            toDate={toDate}
                            setFromDate={handleFromDateChange}
                            setToDate={handleToDateChange}
                        />
                    </div>
                </div>
                <div>
                    <h3 className={'text-2xl lg:text-3xl font-bold mb-6'}>
                        {role === ROLES.STUDENT
                            ? t('pages:TRAININGS.TABLE_HEADER.STUDENT')
                            : t('pages:TRAININGS.TABLE_HEADER.TRAINER')
                        }
                    </h3>
                    <Table columns={tableColumns} data={trainingsData}/>
                </div>

                <Outlet/>
            </div>
        </LoaderOverlay>
    )
}

export default Training;
