import MyAccountList from "../../../components/features/MyAccountList/MyAccountList.tsx";
import {useContext, useState} from "react";
import {AuthContext} from "../../../context/AuthContext.tsx";
import {ROLES} from "../../../constants/roles.ts";
import Button from "../../../components/ui/Button/Button.tsx";
import MyAccountEditForm from "../../../components/features/MyAccountEditForm/MyAccountEditForm.tsx";
import {UserAccountData} from "../../../types/user.ts";
import {ROUTES} from "../../../constants/routes.ts";
import Breadcrumbs, {BreadcrumbItem} from "../../../components/ui/Breadcrumbs/Breadcrumbs.tsx";
import {Outlet, useLocation, useNavigate} from "react-router";
import Modal from "../../../components/ui/Modal/Modal.tsx";
import StudentAccount from "./components/StudentAccount.tsx";
import TrainerAccount from "./components/TrainerAccount.tsx";
import {useTranslation} from "react-i18next";
import {deleteUser, getUserInfo, updateUser, uploadPhoto} from "../../../api/user.ts";
import {handleApiError} from "../../../utils/errorHelpers.ts";
import {showErrorToast} from "../../../components/ui/Toaster/Toaster.tsx";
import LoaderOverlay from "../../../components/ui/LoaderOverlay/LoaderOverlay.tsx";

function MyAccount() {
    const { t } = useTranslation(['button', 'pages', 'modal', 'global']);
    const { t: tError } = useTranslation('error');

    const { user, setUser, signOut } = useContext(AuthContext);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);

    const isRootPath = location.pathname === ROUTES.MY_ACCOUNT;

    const breadcrumbs: BreadcrumbItem[] = [{ label: t('global:COMMON.MY_ACCOUNT'), path: ROUTES.MY_ACCOUNT }];

    const routesWithLabels = [
        { path: `${ROUTES.MY_ACCOUNT}/${ROUTES.ADD_TRAINER}`, label: t('global:COMMON.ADD_TRAINER')},
        { path: `${ROUTES.MY_ACCOUNT}/${ROUTES.TRAINING}`, label: t('global:COMMON.TRAININGS') },
        {
            path: `${ROUTES.MY_ACCOUNT}/${ROUTES.TRAINING}/${ROUTES.ADD_TRAINING}`,
            label: t('global:COMMON.ADD_TRAINING'),
            parentPath: `${ROUTES.MY_ACCOUNT}/${ROUTES.TRAINING}`
        },
        { path: `${ROUTES.MY_ACCOUNT}/${ROUTES.CHANGE_PASSWORD}`, label: t('global:COMMON.CHANGE_PASSWORD') },
    ];


    const currentRoute = routesWithLabels.find(route => route.path === location.pathname);

    if (currentRoute) {
        if (currentRoute.parentPath) {
            const parentRoute = routesWithLabels.find(r => r.path === currentRoute.parentPath);
            if (parentRoute) {
                breadcrumbs.push({
                    label: parentRoute.label,
                    path: parentRoute.path,
                });
            }
        }
        breadcrumbs.push({ label: currentRoute.label });
    }

    const handleEdit = () => {
        setIsEditing(true);
    }

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    const handleSaveProfile = async (updatedUserData: UserAccountData) => {
        try {
            setLoading(true)
            await updateUser(updatedUserData);

            const fullUser = await getUserInfo();
            setUser(fullUser);
        } catch (error) {
            throw error;
        } finally {
            setLoading(false)
        }
    };

    const handleUploadPhoto = async (base64String: string) => {
        try {
            await uploadPhoto({ data: base64String });

            const fullUser = await getUserInfo();
            setUser(fullUser);
        } catch (error) {
            const {global} = handleApiError(error, tError);
            if (global) {
                showErrorToast(global);
            }
        }

    };

    const handleViewTrainings = () => {
        navigate(ROUTES.TRAINING);
    };

    const handleAddTraining = () => {
        navigate(`${ROUTES.TRAINING}/${ROUTES.ADD_TRAINING}`);
    };

    const handleAddTrainer = () => {
        navigate(ROUTES.ADD_TRAINER);
    };

    function handleOpenDeleteModal() {
        setDeleteModalOpen(true);
    }

    const handleDeleteProfile = async () => {
        try {
            setLoading(true)
            await deleteUser()
            await signOut();
        } catch (error) {
            const {global} = handleApiError(error, tError);
            if (global) {
                showErrorToast(global);
            }
        } finally {
            setDeleteModalOpen(false);
            setLoading(false);
        }
    };

    return (
        <LoaderOverlay isLoading={loading}>
            <div className="flex flex-col gap-5 w-full px-4 md:px-10 lg:px-20 xl:px-28">
                {breadcrumbs.length > 1 && <Breadcrumbs items={breadcrumbs} />}
                {isRootPath && (
                    <div className={'flex flex-col gap-7 sm:gap-14 items-center'}>
                        <h2 className={"heading"}>{t('pages:MY_ACCOUNT.HEADER')}</h2>
                        <div className={"flex flex-col md:flex-row w-full justify-between gap-12 lg:gap-12 xl:gap-20"}>
                            {isEditing ? (
                                <div className="w-full">
                                    <MyAccountEditForm
                                        onCancel={handleCancelEdit}
                                        onSave={handleSaveProfile}
                                        onUpdateAvatar={handleUploadPhoto}
                                        setIsEditing={setIsEditing}
                                    />
                                </div>
                            ) : (
                                <>
                                    <div className="w-full md:w-1/2">
                                        <MyAccountList onEdit={handleEdit}/>
                                    </div>

                                    {user?.role === ROLES.STUDENT && (
                                        <StudentAccount
                                            onAddTrainer={handleAddTrainer}
                                            onDeleteProfile={handleOpenDeleteModal}
                                            setLoading={setLoading}
                                        />
                                    )}

                                    {user?.role === ROLES.TRAINER && ( <TrainerAccount setLoading={setLoading}/>)}
                                </>
                            )}

                        </div>
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-center">
                            {t('pages:MY_ACCOUNT.TRAININGS.HEADER')}
                        </h2>
                        <p className={'text-center max-w-3xl'}>
                            {t('pages:MY_ACCOUNT.TRAININGS.DESCRIPTION')}
                        </p>
                        <Button variant={'btnPrimary'}
                                onClick={handleViewTrainings}
                        >
                            {t('button:VIEW_TRAININGS')}
                        </Button>
                    </div>
                )}

                <Modal open={isDeleteModalOpen}
                       onClose={() => setDeleteModalOpen(false)}
                       onDangerConfirm={handleDeleteProfile}
                       title={t('modal:DELETE_PROFILE.TITLE')}
                       description={t('modal:DELETE_PROFILE.DESCRIPTION')}
                       dangerConfirmText={t('button:CONFIRM')}
                       cancelText={t('button:CANCEL')}
                />
                <Outlet context={{ handleAddTraining }} />
            </div>
        </LoaderOverlay>
    )
}

export default MyAccount;
