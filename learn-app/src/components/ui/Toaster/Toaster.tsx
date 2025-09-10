import {CloseButtonProps, Slide, toast, ToastContainer} from "react-toastify";
import {FaRegCheckCircle} from "react-icons/fa";
import {IoIosClose} from "react-icons/io";
import {useTranslation} from "react-i18next";
import {BiError} from "react-icons/bi";

function CustomCloseButton({ closeToast }: CloseButtonProps) {
    const { t } = useTranslation(['ariaLabel']);
    return (
        <button
            onClick={closeToast}
            className="text-white cursor-pointer transition"
            aria-label={t('ariaLabel:CLOSE')}
        >
            <IoIosClose className="w-6 h-6" />
        </button>
    );
}

export function showSuccessToast(message: string) {
    toast.success(
        <div className="flex items-center gap-3">
            <FaRegCheckCircle className="text-white w-5 h-5" />
            <div className="break-words">{message}</div>
        </div>,
        {
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            icon: false,
        }
    );
}


export function showErrorToast(message: string) {
    toast.error(
        <div className="flex items-center gap-3">
            <BiError className="text-white w-5 h-5" />
            <div className="break-words">{message}</div>
        </div>,
        {
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            icon: false,
        }
    );
}

export default function Toaster() {
    return (
        <ToastContainer
            toastClassName={(context) => {
                const base = 'fixed text-white rounded-md p-4 flex items-center shadow-(--box-shadow-card-100) top-[80px] right-4 max-w-[90vw] gap-2';

                return context?.type === 'error'
                    ? `bg-important-100 ${base}`
                    : `bg-success-100 ${base}`;
            }}
            position="top-right"
            closeButton={CustomCloseButton}
            transition={Slide}
            limit={3}
        />
    );
}
