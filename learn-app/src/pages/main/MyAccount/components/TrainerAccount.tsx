import Table from "../../../../components/ui/Table/Table.tsx";
import {getStudentColumns} from "../../../../tables/studentsTableColumns.tsx";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import {getMyStudents} from "../../../../api/training.ts";
import {StudentData} from "../../../../types/training.ts";
import {handleApiError} from "../../../../utils/errorHelpers.ts";
import {showErrorToast} from "../../../../components/ui/Toaster/Toaster.tsx";

interface TrainerAccountProps {
    setLoading: (loading: boolean) => void;
}

function TrainerAccount({ setLoading }: TrainerAccountProps) {
    const { t } = useTranslation(['pages']);
    const { t: tTables } = useTranslation(['tables', 'global']);
    const { t: tError } = useTranslation('error');
    const [studentsData, setStudentsData] = useState<StudentData[]>([]);

    useEffect(() => {
        async function fetchTrainers() {
            try {
                setLoading(true);
                const data = await getMyStudents();

                setStudentsData(data.map(student => ({
                    name: `${student.firstName} ${student.lastName}`,
                    isActive: student.isActive
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
        <div className={'w-full md:w-1/2 flex flex-col space-y-6'}>
            <h3 className="text-2xl lg:text-3xl font-bold">{t('pages:MY_ACCOUNT.SECTIONS.TRAINER.HEADER')}</h3>
            <Table columns={getStudentColumns(tTables)} data={studentsData}/>
        </div>
    )
}

export default TrainerAccount;
