import Modal from "../../ui/Modal/Modal.tsx";
import React, {ChangeEvent, useState} from "react";
import {PiCloudArrowUpThin} from "react-icons/pi";
import {useTranslation} from "react-i18next";
import Spinner from "../../ui/Spinner/Spinner.tsx";

interface FileUploadModalProps {
    open: boolean;
    onClose: () => void,
    onUpload: (base64String: string) => Promise<void>;
}

function FileUploadModal({ open, onClose, onUpload }: FileUploadModalProps) {
    const { t } = useTranslation(['button', 'modal']);
    const { t: tError } = useTranslation('error');

    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const MAX_FILE_SIZE_KB = 70;
    const SUPPORTED_FORMATS = ['image/png', 'image/jpeg'];

    const validateFile = (file: File) => {
        if (file.size > MAX_FILE_SIZE_KB * 1024) {
            setError(tError('error:FILE_SIZE_INVALID', { maxSize: MAX_FILE_SIZE_KB }));
            return false;
        }

        if (!SUPPORTED_FORMATS.includes(file.type)) {
            setError(tError('error:UNSUPPORTED_FILE_FORMAT'));
            return false;
        }
        setError(null);
        return true;
    };

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const droppedFiles = e.dataTransfer.files;

        if (droppedFiles.length > 0) {
            const droppedFile = droppedFiles[0];

            if (validateFile(droppedFile)) {
                setFile(droppedFile);
            }
        }
    };

    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;

        if (selectedFiles && selectedFiles.length > 0) {
            const selectedFile = selectedFiles[0];

            if (validateFile(selectedFile)) {
                setFile(selectedFile);
            }
        }
    };

    const handleUpload = async () => {
        setLoading(true);
        if (!file) {
            setError(tError('error:FILE_REQUIRED'));
            return;
        }

        const base64String = await fileToBase64(file);
        await onUpload(base64String);
        setFile(null);
        onClose();
        setLoading(false);
    };

    const handleCancel = () => {
        setFile(null);
        setError(null);
        onClose();
    };

    const dragDropContent = (
        <div
            className="border-2 flex flex-col gap-2 border-dashed border-basic-350 bg-basic-100 rounded-lg px-4 py-6 text-center"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
        >
            <PiCloudArrowUpThin className="w-14 h-14 text-body-150 mx-auto mb-3"/>
            <p className="text-xl">{t('modal:FILE_UPLOAD.DESCRIPTION.DRAG_DROP.HEADER')}</p>
            <p className="text-sm text-body-150">{t('modal:FILE_UPLOAD.DESCRIPTION.DRAG_DROP.INSTRUCTIONS')}</p>
            <p className="text-sm font-bold text-body-150">{t('modal:FILE_UPLOAD.DESCRIPTION.DRAG_DROP.OR')}</p>
            <label
                htmlFor="file-input"
                className="text-primary-100 text-sm cursor-pointer hover:underline"
            >
                {t('modal:FILE_UPLOAD.DESCRIPTION.DRAG_DROP.LABEL')}
            </label>
            <input
                id="file-input"
                type="file"
                multiple={false}
                accept=".png, .jpg, .jpeg"
                className="hidden"
                onChange={handleFileSelect}
            />
        </div>
    )

    const renderFileDetails = file && (
        <div className="mt-4">
            <p className="text-sm text-body-250">
                <span className={'font-bold'}>{t('modal:FILE_UPLOAD.DESCRIPTION.FILE.NAME')}</span>
                {file.name}
            </p>
            <p className="text-sm text-body-300">
                <span className={'font-bold'}>{t('modal:FILE_UPLOAD.DESCRIPTION.FILE.SIZE')}</span>
                {(file.size / 1024).toFixed(2)} KB
            </p>
        </div>
    );

    return (
        <>
            {loading && <Spinner/>}
            <Modal
                open={open}
                onClose={handleCancel}
                title={t('modal:FILE_UPLOAD.TITLE')}
                description={
                    <>
                        {dragDropContent}
                        {file && renderFileDetails}
                        {error && <p className={"text-(--color-important-150) text-sm mt-1"}>{error}</p>}
                    </>
                }
                cancelText={t('button:CANCEL')}
                primaryConfirmText={t('button:UPLOAD')}
                onPrimaryConfirm={handleUpload}
            />
        </>

    );
}

export default FileUploadModal;
