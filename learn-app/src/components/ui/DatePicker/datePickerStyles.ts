export const commonTextFieldStyles = {
    height: '44px',
    "& .MuiPickersOutlinedInput-root": {
        fontSize: "0.875rem",
        borderRadius: "0.375rem",
        backgroundColor: "var(--color-basic-150)",
        "&:hover": {
            backgroundColor: "var(--color-bg)",
        },
        "&.Mui-focused": {
            backgroundColor: "var(--color-bg)",
        },
        "& fieldset": {
            borderColor: "var(--color-basic-350)",
        },
        "&:hover fieldset": {
            borderColor: "var(--color-primary-150)",
        },
        "&.Mui-focused fieldset": {
            borderColor: "var(--color-primary-100)",
        },
    },

    "& .MuiPickersInputBase-root": {
        color: "var(--color-body-100)",
        height: '100%',
        minHeight: 'unset',
    },
    "& .MuiInputAdornment-root": {
        marginRight: "0"
    },

    '& .MuiPickersInputBase-sectionsContainer': {
        padding: '0',
    }
};

export const commonPickerStyles = {
    "& .MuiDayCalendar-weekDayLabel": {
        color: "var(--color-primary-100)",
        fontSize: "0.875rem",
        fontWeight: 600,
    },
    "& .MuiYearCalendar-button": {
        color: "var(--color-body-100)",
        "&:hover": {
            color: "var(--color-primary-150)",
        },
        "&.Mui-selected": {
            backgroundColor: "var(--color-primary-100)",
        },
        "&:focus.Mui-selected": {
            backgroundColor: "var(--color-primary-100)",
        },
    },
    "& .MuiPickersCalendarHeader-switchViewButton": {
        display: "none",
    },
    "& .MuiPickersCalendarHeader-label": {
        fontSize: '1.5rem',
        fontFamily: 'var(--font-family-heading)',
        fontWeight: 'bold',
        color: "var(--color-body-100)",
        "&:hover": {
            color: "var(--color-primary-100)",
        },
    },
    "& .MuiPickersDay-root": {
        color: "var(--color-body-100)",
        "&:hover": {
            color: "var(--color-primary-150)",
        },
        "&.Mui-selected": {
            backgroundColor: "var(--color-primary-100)",
        },
        "&:focus.Mui-selected": {
            backgroundColor: "var(--color-primary-100)",
        },
        "&:not(.Mui-selected)": {
            border: "none",
        }
    },
    "& .MuiPickersArrowSwitcher-button": {
        color: "var(--color-body-100)",
        "&:hover": {
            color: "var(--color-primary-150)",
        },
    },
};

export const popperStyles = {
    ...commonPickerStyles,
    zIndex: 20,
    "& .MuiPaper-root": {
        borderRadius: "0.75rem",
        boxShadow: "var(--box-shadow-card-100)",
        padding: "25px 25px 0 25px",
        backgroundColor: "var(--color-bg)",
    },

};

export const dialogStyles = {
    ...commonPickerStyles,
    "& .MuiDialog-paper": {
        borderRadius: "0.75rem",
        backgroundColor: "var(--color-bg)",
        boxShadow: "var(--box-shadow-card-100)",
    },
    "& .MuiDialog-container .MuiTypography-root": {
        fontSize: "1rem",
        color: "var(--color-body-100)",
    },
};

export const commonLabelStyles = {
    "& .MuiTypography-root": {
        fontSize: "1rem",
        fontWeight: 'bold',
        lineHeight: "1.75rem",
    },
}

export const sharedSlotProps = {
    field: { openPickerButtonPosition: "start"},
    textField: {
        variant: "outlined",
        sx: commonTextFieldStyles,
        placeholder: "Select"
    },
    popper: {
        sx: popperStyles,
    },
    dialog: {
        sx: dialogStyles,
    },
} as const;
