import {useEffect, useState} from "react";
import Button from "../../../components/ui/Button/Button.tsx";
import Table from "../../../components/ui/Table/Table.tsx";
import {getTrainerColumns} from "../../../tables/trainerTableColumns.tsx";
import {useTranslation} from "react-i18next";
import {getAllTrainers, getMyTrainers} from "../../../api/training.ts";
import {handleApiError} from "../../../utils/errorHelpers.ts";
import {showErrorToast} from "../../../components/ui/Toaster/Toaster.tsx";
import {TrainerData} from "../../../types/training.ts";
import LoaderOverlay from "../../../components/ui/LoaderOverlay/LoaderOverlay.tsx";
import {capitalize} from "../../../utils/capitalize.ts";

function AddTrainer() {
    const { t } = useTranslation(['button', 'pages', 'global']);
    const { t: tTables } = useTranslation('tables');
    const { t: tError } = useTranslation('error');
    const [loading, setLoading] = useState(false);

    const [allTrainersTableData, setAllTrainersTableData] = useState<TrainerData[]>([]);
    const [myTrainersTableData, setMyTrainersTableData] = useState<TrainerData[]>([]);

    const handleMoveToMyTrainersTable = (selectedRows: any[]) => {
        setAllTrainersTableData((prev) => prev.filter((row) => !selectedRows.includes(row)));
        setMyTrainersTableData((prev) => [...prev, ...selectedRows]);
    };

    useEffect(() => {
        async function fetchTrainers() {
            try {
                setLoading(true);
                const allTrainersData = await getAllTrainers();
                const myTrainersData = await getMyTrainers();

                setAllTrainersTableData(allTrainersData.map(trainer => ({
                    name: `${trainer.firstName} ${trainer.lastName}`,
                    specialization: capitalize(trainer.specialization)
                })));

                setMyTrainersTableData(myTrainersData.map(trainer => ({
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
    }, [setLoading]);

    return (
        <LoaderOverlay isLoading={loading}>
            <div className={'flex flex-col gap-8 sm:gap-10'}>
                <h1 className={'heading'}>{t('pages:ADD_TRAINER.HEADER')}</h1>
                <div className={'text-center md:text-left'}>
                    <p>{t('pages:ADD_TRAINER.INSTRUCTIONS')}</p>
                    <p>{t('pages:ADD_TRAINER.NO_REMOVAL_NOTE')}</p>
                </div>
                <div className={'flex flex-col lg:flex-row w-full gap-10 lg:gap-40'}>
                    <div className={'w-full lg:w-1/2 flex flex-col gap-5'}>
                        <h4 className={'text-4xl font-bold'}>{t('global:HEADING.ALL_TRAINERS')}</h4>
                        <Table
                            columns={getTrainerColumns(tTables)}
                            data={allTrainersTableData}
                            selectable={true}
                            onAction={handleMoveToMyTrainersTable}
                            renderAction={(handleAction) => (
                                <div className="flex justify-start mt-4">
                                    <Button variant={"btnPrimary"} onClick={handleAction}>
                                        {t('button:ADD')}
                                    </Button>
                                </div>
                            )}
                        />
                    </div>

                    <div className={'w-full lg:w-1/2 flex flex-col gap-5'}>
                        <h4 className={'text-4xl font-bold'}>{t('global:HEADING.MY_TRAINERS')}</h4>
                        <Table columns={getTrainerColumns(tTables)} data={myTrainersTableData}/>
                    </div>
                </div>

            </div>
        </LoaderOverlay>
    )
}

export default AddTrainer;
