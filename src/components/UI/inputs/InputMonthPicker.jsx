import DatePicker from "react-datepicker";
import { es } from "date-fns/locale/es";
import { format } from "date-fns";

const InputMonthPicker = ({ value, onChange, styles, label, portalId }) => {
    return (
        <div className="w-full min-w-0 flex flex-col relative">
            <style>{`
        .imp-calendar .react-datepicker__header {
          padding: 0 !important;
          background-color: transparent !important;
          border-bottom: 0 !important;
        }
        .imp-calendar .react-datepicker__month-container {
          padding-bottom: 0.25rem;
        }
        .imp-calendar .react-datepicker__month-wrapper {
          display: flex;
          gap: 0.25rem;
          margin: 0.25rem 0.5rem;
        }
        .imp-calendar .react-datepicker__month-text {
          flex: 1;
          margin: 0;
          padding: 0.5rem 0;
          border-radius: 0.25rem;
          text-transform: capitalize;
          font-weight: 600;
          color: var(--color-gray-600);
          transition: background-color .15s ease, color .15s ease;
        }
        .imp-calendar .react-datepicker__month-text:hover {
          background-color: color-mix(in oklab, var(--color-blue-900) 25%, transparent);
        }
        .imp-calendar .react-datepicker__month-text--today {
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .imp-calendar .react-datepicker__month-text--keyboard-selected {
          background-color: transparent;
        }
        .imp-popper .react-datepicker__triangle {
          stroke: var(--color-blue-900) !important;
        }
        .imp-popper[data-placement^="bottom"] .react-datepicker__triangle,
        .imp-popper[data-placement^="top"] .react-datepicker__triangle {
          fill: var(--color-blue-900) !important;
          color: var(--color-blue-900) !important;
        }
      `}</style>

            <label className="font-bold text-gray-500 pl-1">{label}</label>
            <DatePicker
                locale={es}
                selected={value}
                onChange={onChange}
                showMonthYearPicker
                dateFormat="MM/yyyy"
                isClearable
                onFocus={(e) => e.target.blur()}
                popperClassName="imp-popper"
                calendarClassName="imp-calendar"
                monthClassName={(date) => {
                    if (!value) return undefined;
                    const isSelected =
                        date.getMonth() === value.getMonth() &&
                        date.getFullYear() === value.getFullYear();
                    return isSelected ? "!bg-blue-900 !text-white" : undefined;
                }}
                renderCustomHeader={({
                    date,
                    decreaseYear,
                    increaseYear,
                    prevYearButtonDisabled,
                    nextYearButtonDisabled,
                }) => (
                    <div className="flex items-center h-full justify-between bg-blue-900 px-3 py-2 rounded-t">
                        <button
                            onClick={decreaseYear}
                            disabled={prevYearButtonDisabled}
                            type="button"
                            className="text-white text-3xl disabled:opacity-30 hover:text-blue-200 cursor-pointer"
                        >
                            ‹
                        </button>
                        <span className="text-white text-base font-bold">
                            {format(date, "yyyy", { locale: es })}
                        </span>
                        <button
                            onClick={increaseYear}
                            disabled={nextYearButtonDisabled}
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
                placeholderText="mm/aaaa"
                className={`w-full bg-gray-100 rounded-lg inset-shadow-custom font-bold text-gray-600
                    focus:outline-none focus:ring-2 focus:ring-blue-800 pl-10! ${styles}`}
                portalId={portalId}
            />
        </div>
    );
};

export default InputMonthPicker;