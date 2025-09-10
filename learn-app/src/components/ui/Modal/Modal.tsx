import {Box, IconButton, Modal as MuiModal, Typography} from "@mui/material";
import Button from "../Button/Button.tsx";
import {RxCross2} from "react-icons/rx";
import {ReactNode} from "react";

interface ModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    description?: ReactNode;
    primaryConfirmText?: string;
    dangerConfirmText?: string;
    cancelText?: string;
    onPrimaryConfirm?: () => void;
    onDangerConfirm?: () => void;
}

function Modal ({
    open,
    onClose,
    title,
    description,
    primaryConfirmText,
    dangerConfirmText,
    cancelText,
    onPrimaryConfirm,
    onDangerConfirm}: ModalProps) {
    return (
        <MuiModal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "90%",
                    maxWidth: 560,
                    backgroundColor: "var(--color-bg)",
                    boxShadow: "var(--box-shadow-card-100)",
                    borderRadius: 2,
                    p: { xs: 2, sm: 4 },
                    overflowY: "auto",
                    maxHeight: "90vh",
                }}
            >
                <IconButton
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                    }}
                >
                    <RxCross2 size={24} className={'text-body-300'} />
                </IconButton>

                <Typography variant="h6"
                            component="h2"
                            gutterBottom
                            fontWeight={'bold'}
                            fontFamily={'var(--font-family-heading)'}
                            fontSize={'24px'}
                >
                    {title}
                </Typography>

                <Box sx={{ mb: 3 }}>
                    {typeof description === 'string'
                        ? description.split('\n\n').map((para, index) => (
                            <Typography
                                key={index}
                                variant="body1"
                                sx={{ mb: 2 }}
                                fontSize="14px"
                            >
                                {para.trim()}
                            </Typography>
                        ))
                        : description}
                </Box>

                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                    {cancelText && (
                        <Button variant="btnTransparent" className={'text-body-300'} onClick={onClose}>
                            {cancelText}
                        </Button>
                    )}

                    {primaryConfirmText && (
                        <Button variant={'btnPrimary'} onClick={onPrimaryConfirm}>
                            {primaryConfirmText}
                        </Button>
                    )}

                    {dangerConfirmText && (
                        <Button variant="btnImportant" onClick={onDangerConfirm}>
                            {dangerConfirmText}
                        </Button>
                    )}
                </Box>
            </Box>
        </MuiModal>
    );
}

export default Modal;
