import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker as MuiDatePicker } from "@mui/x-date-pickers/DatePicker";
import { Dayjs } from "dayjs";
import {AiOutlineCalendar} from "react-icons/ai";
import {commonLabelStyles, sharedSlotProps} from "./datePickerStyles.ts";
import {DemoItem} from "@mui/x-date-pickers/internals/demo";
import {useTranslation} from "react-i18next";

interface DatePickerProps {
    fromDate?: Dayjs | null;
    toDate?: Dayjs | null;
    setFromDate?: (date: Dayjs | null) => void;
    setToDate?: (date: Dayjs | null) => void;
    showFrom?: boolean;
    showTo?: boolean;
    labelFrom?: string;
    labelTo?: string;
}

function DatePicker({
    fromDate,
    toDate,
    setFromDate,
    setToDate,
    showFrom = true,
    showTo = true,
    labelFrom,
    labelTo,
}: DatePickerProps) {
    const { t } = useTranslation(['datePicker']);
    const CustomIcon = () => <AiOutlineCalendar color="var(--color-body-100)" size={20} />;

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="flex flex-col gap-6 w-full">
                <div className="flex flex-col md:flex-row gap-3 md:gap-6">
                    {showFrom && (
                        <div className={'flex-1 w-full min-w-0'}>
                            <DemoItem label={labelFrom || t('datePicker:LABEL_FROM.FROM')} sx={commonLabelStyles}>
                                <MuiDatePicker
                                    value={fromDate}
                                    onChange={setFromDate}
                                    dayOfWeekFormatter={(day) => day.format("ddd")}
                                    format="DD MMM YYYY"
                                    slots={{openPickerIcon: CustomIcon}}
                                    slotProps={sharedSlotProps}
                                />
                            </DemoItem>
                        </div>
                    )}

                    {showTo && (
                        <div className={'flex-1 min-w-0'}>
                            <DemoItem label={labelTo || t('datePicker:LABEL_TO.TO')} sx={commonLabelStyles}>
                                <MuiDatePicker
                                    value={toDate}
                                    onChange={setToDate}
                                    dayOfWeekFormatter={(day) => day.format("ddd")}
                                    format="DD MMM YYYY"
                                    slots={{openPickerIcon: CustomIcon}}
                                    slotProps={sharedSlotProps}
                                />
                            </DemoItem>
                        </div>
                    )}
                </div>
            </div>
        </LocalizationProvider>
    );
}

export default DatePicker;
