import Button from "../../../../components/ui/Button/Button.tsx";
import Table from "../../../../components/ui/Table/Table.tsx";
import {getTrainerColumns} from "../../../../tables/trainerTableColumns.tsx";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import {getMyTrainers} from "../../../../api/training.ts";
import {handleApiError} from "../../../../utils/errorHelpers.ts";
import {showErrorToast} from "../../../../components/ui/Toaster/Toaster.tsx";
import {TrainerData} from "../../../../types/training.ts";
import {capitalize} from "../../../../utils/capitalize.ts";

interface StudentAccountProps {
    onAddTrainer: () => void;
    onDeleteProfile: () => void;
    setLoading: (loading: boolean) => void;
}

function StudentAccount({ onAddTrainer, onDeleteProfile, setLoading }: StudentAccountProps) {
    const { t } = useTranslation(['button', 'pages']);
    const { t: tTables } = useTranslation('tables');
    const { t: tError } = useTranslation('error');
    const [trainersData, setTrainersData] = useState<TrainerData[]>([]);

    useEffect(() => {
        async function fetchTrainers() {
            try {
                setLoading(true);
                const data = await getMyTrainers();

                setTrainersData(data.map(trainer => ({
                    name: `${trainer.firstName} ${trainer.lastName}`,
                    specialization: capitalize(trainer.specialization)
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
    }, []);

    return (
        <div className="w-full md:w-1/2 flex flex-col space-y-6">
            <div className="flex flex-col space-y-6 flex-grow">
                <div className="flex justify-between items-center flex-wrap gap-5">
                    <h3 className="text-2xl lg:text-3xl font-bold">{t('pages:MY_ACCOUNT.SECTIONS.STUDENT.HEADER')}</h3>
                    <Button variant="btnPrimary" onClick={onAddTrainer}>
                        {t('button:ADD_TRAINER')}
                    </Button>
                </div>

                <Table columns={getTrainerColumns(tTables)} data={trainersData}/>
            </div>

            <div className="flex justify-end">
                <Button variant={'btnImportant'}
                        onClick={onDeleteProfile}
                >
                    {t('button:DELETE_PROFILE')}
                </Button>
            </div>
        </div>
    )
}

export default StudentAccount;
