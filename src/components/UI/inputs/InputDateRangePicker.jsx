import DatePicker from "react-datepicker";
import { es } from "date-fns/locale/es";
import { useState } from "react";
import { format } from "date-fns";

const InputDateRangePicker = ({ from, to, onChange, styles, label, portalId }) => {
    const [hoverDate, setHoverDate] = useState(null);

    return (
        <div className="w-full min-w-0 flex flex-col relative">
            <style>{`
        .idr-calendar .react-datepicker__header {
          padding: 0 !important;
          background-color: transparent !important;
          border-bottom: 0 !important;
        }
        .idr-popper .react-datepicker__triangle {
          stroke: var(--color-blue-900) !important;
        }
        .idr-popper[data-placement^="bottom"] .react-datepicker__triangle,
        .idr-popper[data-placement^="top"] .react-datepicker__triangle {
          fill: var(--color-blue-900) !important;
          color: var(--color-blue-900) !important;
        }
      `}</style>

            <label className="font-bold text-gray-500 pl-1">{label}</label>
            <DatePicker
                locale={es}
                startDate={from}
                endDate={to}
                onChange={onChange}
                selectsRange
                isClearable
                onFocus={(e) => e.target.blur()}
                onDayMouseEnter={(date) => setHoverDate(date)}
                onCalendarClose={() => setHoverDate(null)}
                popperClassName="idr-popper"
                calendarClassName="idr-calendar"
                dayClassName={(date) => {
                    if (!from) return undefined;
                    const isStart = date.toDateString() === from.toDateString();
                    const isEnd = to && date.toDateString() === to.toDateString();
                    const inRange = from && to && date > from && date < to;

                    const previewActive = !to && hoverDate && hoverDate > from;
                    const isPreviewEnd = previewActive && date.toDateString() === hoverDate.toDateString();
                    const inPreviewRange = previewActive && date > from && date < hoverDate;

                    if (isStart || isEnd) return "!bg-blue-900 !text-white";
                    if (inRange) return "!bg-blue-900/40 !rounded";
                    if (isPreviewEnd) return "!bg-blue-900 !text-white";
                    if (inPreviewRange) return "!bg-blue-900/40 !rounded";
                    return undefined;
                }}
                renderCustomHeader={({
                    date,
                    decreaseMonth,
                    increaseMonth,
                    prevMonthButtonDisabled,
                    nextMonthButtonDisabled,
                }) => (
                    <div className="flex items-center h-full justify-between bg-blue-900 px-3 py-2 rounded-t">
                        <button
                            onClick={decreaseMonth}
                            disabled={prevMonthButtonDisabled}
                            type="button"
                            className="text-white text-3xl disabled:opacity-30 hover:text-blue-200 cursor-pointer"
                        >
                            ‹
                        </button>
                        <span className="text-white text-base font-bold capitalize">
                            {format(date, "MMMM yyyy", { locale: es })}
                        </span>
                        <button
                            onClick={increaseMonth}
                            disabled={nextMonthButtonDisabled}
                            type="button"
                            className="text-white text-3xl disabled:opacity-30 hover:text-blue-200 cursor-pointer"
                        >
                            ›
                        </button>
                    </div>
                )}
                showIcon
                toggleCalendarOnIconClick={true}
                clearButtonClassName="after:!bg-blue-900 after:!rounded"
                icon="pi pi-calendar"
                calendarIconClassName="text-blue-800"
                placeholderText="mm/dd/aaaa - mm/dd/aaaa"
                className={`w-full bg-gray-100 rounded-lg inset-shadow-custom font-bold text-gray-600
                    focus:outline-none focus:ring-2 focus:ring-blue-800 pl-10! ${styles}`}
                portalId={portalId}
            />
        </div>
    );
};

export default InputDateRangePicker;