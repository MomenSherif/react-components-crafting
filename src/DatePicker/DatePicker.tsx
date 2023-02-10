import {
  format,
  formatISO,
  startOfMonth,
  endOfMonth,
  isFirstDayOfMonth,
  isLastDayOfMonth,
  addDays,
  addMonths,
  parse,
  isValid,
} from 'date-fns';
import { ar } from 'date-fns/locale';
import { useState } from 'react';
import {
  CaptionProps,
  DateRange,
  DayClickEventHandler,
  DayContent,
  DayContentProps,
  DayPicker,
  useDayPicker,
  useNavigation,
} from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import {
  Popover,
  PopoverAnchor,
  PopoverArrow,
  PopoverContent,
  PopoverOverlay,
  PopoverTrigger,
} from '../Popover/PopoverExample';

export default function SingleDatePicker() {
  const [selected, setSelected] = useState<Date>();

  console.log(selected); //Wed Feb 01 2023 00:00:00 GMT+0200 (Eastern European Standard Time)
  console.log(selected && formatISO(selected)); //2023-02-01T00:00:00+02:00
  console.log(selected && selected.toISOString()); //2023-01-31T22:00:00.000Z

  return (
    <DayPicker
      mode="single"
      selected={selected}
      onSelect={date => setSelected(date)}
      classNames={{ day_selected: 'bg-blue-500 [&:not(:hover)]:text-white' }}
      footer={
        selected ? (
          <p>You picked {format(selected, 'PP')}</p>
        ) : (
          <p>Please pick a day.</p>
        )
      }
      // required
      // disabled
      captionLayout="dropdown"
      fromYear={2023}
      toYear={2029}

      /**
       * https://react-day-picker.js.org/basics/navigation
       * DayPicker displays the month of the current day.
       * defaultMonth={new Date(1996, 4)} 1996-05 | defaultMonth={subMonths(new Date(), 1)}
       *
       * - controlled month
       * month={subMonths(new Date(), 1)}
       * onMonthChange={(month) => setMonth(month)}
       *
       * disableNavigation
       * fromDate={new Date(2023, 0, 10)} // 10/1/2023 The earliest day to start the month navigation.
       * toDate={} // The latest day to end the month navigation.
       * fromYear={2023} // The earliest year to start the month navigation.
       * toYear={2029} // The latest year to end the month navigation.
       */
    />
  );
}

// https://react-day-picker.js.org/basics/customization
export function DatePickerCustomized() {
  const [selected, setSelected] = useState<Date>();
  return (
    <DayPicker
      className="w-fit bg-slate-900 text-white p-4 rounded-lg shadow-lg [--rdp-background-color:theme(colors.slate.700/30)]
      [--rdp-accent-color:theme(colors.indigo.600/50)]"
      classNames={{
        day_selected: 'bg-indigo-600/50',
      }}
      mode="single"
      selected={selected}
      onSelect={setSelected}
      // numberOfMonths={2}
      // pagedNavigation //When rendering multiple months, use pagedNavigation to navigate the number of months per time.
      showOutsideDays
      fixedWeeks
      showWeekNumber
    />
  );
}

export function MultipleDatePicker() {
  const [days, setDays] = useState<Date[] | undefined>([]);

  return (
    <DayPicker
      mode="multiple"
      min={1}
      max={7}
      selected={days}
      onSelect={setDays}
      className="w-fit bg-slate-900 text-white p-4 rounded-lg shadow-lg [--rdp-background-color:theme(colors.slate.700/30)]
  [--rdp-accent-color:theme(colors.indigo.600/50)]"
      classNames={{
        day_selected: 'bg-indigo-600/50',
      }}
      footer={
        days && days?.length > 0 ? (
          <p>You selected {days.length} day(s).</p>
        ) : (
          <p>Please pick one or more day.</p>
        )
      }
    />
  );
}

export function RangeDatePicker() {
  const [range, setRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  return (
    <DayPicker
      mode="range"
      selected={range}
      onSelect={setRange}
      // min={3}
      // max={6}
      className="w-fit bg-slate-900 text-white p-4 rounded-lg shadow-lg [--rdp-background-color:theme(colors.slate.700/30)]
  [--rdp-accent-color:theme(colors.indigo.600/50)]"
      classNames={{
        day_selected: 'bg-indigo-600/50',
      }}
      footer={
        !range?.from ? (
          <p>Please select the first day.</p>
        ) : (
          <p>
            {format(range.from, 'PPP')}{' '}
            {range.to ? `- ${format(range.to, 'PPP')}` : ''}
          </p>
        )
      }
    />
  );
}

// Custom selection logic with (onDayClick) https://react-day-picker.js.org/basics/selecting-days#custom-selections

// Modifiers matchers https://react-day-picker.js.org/api/types/matcher
export function ModifiersDatePickerExample() {
  const [selected, setSelected] = useState<Date>();

  const handleDayClick: DayClickEventHandler = (day, modifiers) => {
    // modifiers: {today?: true, selected?: true}
    console.log(day, modifiers);
  };

  const NU_LOCALE = 'ar-u-nu-arab';

  return (
    <DayPicker
      mode="single"
      dir="rtl"
      locale={ar}
      formatters={{
        formatDay: day => day.getDate().toLocaleString(NU_LOCALE),
        formatCaption: (date, options) => {
          const month = format(date, 'LLLL', { locale: options?.locale });
          const year = date
            .getFullYear()
            .toLocaleString(NU_LOCALE, { useGrouping: false });

          return `${month} ${year}`;
        },
      }} // custom formatters
      selected={selected} // selected modifier
      // disabled={new Date()} // single modifier
      // disabled={[ // array of modifiers
      //   new Date(),
      //   { from: addDays(new Date(), 5), to: addDays(new Date(), 10) },
      // ]}
      // disabled={(date) => { // apply disable modifiers for first and last day of each month
      //   return isFirstDayOfMonth(date) || isLastDayOfMonth(date);
      // }}
      // disabled={{ // Interval
      //   before: new Date(), // disable past dates
      //   // after: new Date(), // disable future dates
      // }}
      // disabled={{
      //   // Range
      //   from: new Date(),
      //   to: addDays(new Date(), 10),
      // }}

      // hidden={new Date()} // The hidden modifier removes the day from the calendar.

      modifiers={{ booked: { from: new Date(), to: addDays(new Date(), 5) } }} // custom modifiers -> will be added to date handlers
      modifiersClassNames={{
        booked: 'border border-gray-400 border-dashed',
      }}
      // modifiersStyles={{}}
      onSelect={date => setSelected(date)}
      onDayClick={handleDayClick}
      classNames={{ day_selected: 'bg-blue-500 [&:not(:hover)]:text-white' }}
      // ISOWeek
      showOutsideDays
      footer={
        selected ? (
          <p>You picked {format(selected, 'PP')}</p>
        ) : (
          <p>Please pick a day.</p>
        )
      }
    />
  );
}

// https://react-day-picker.js.org/guides/custom-components
// https://react-day-picker.js.org/api/interfaces/CustomComponents
export function CustomComponentsDatePickerExample() {
  const [selected, setSelected] = useState<Date>();
  return (
    <DayPicker
      mode="single"
      selected={selected}
      onSelect={date => setSelected(date)}
      classNames={{ day_selected: 'bg-blue-500 [&:not(:hover)]:text-white' }}
      components={{
        Caption: CustomCaption,
        DayContent: CustomDayContent,
      }}
    />
  );
}

const CustomCaption = (props: CaptionProps) => {
  const { goToMonth, nextMonth, previousMonth, currentMonth } = useNavigation();
  return (
    <div className="flex justify-between items-center">
      <span className="text-slate-900 text-lg font-medium relative after:absolute after:top-full after:left-0 after:mt-px after:w-10 after:h-0.5 after:bg-indigo-600">
        {format(currentMonth, 'MMM yyy')}
      </span>
      <div className="flex items-center space-x-2">
        <button
          disabled={!previousMonth}
          onClick={() => previousMonth && goToMonth(previousMonth)}
          className="bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700"
        >
          Previous
        </button>
        <button
          disabled={!nextMonth}
          onClick={() => nextMonth && goToMonth(nextMonth)}
          className="bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700"
        >
          Next
        </button>
      </div>
    </div>
  );
};

const CustomDayContent = (props: DayContentProps) => {
  return (
    <time dateTime={format(props.date, 'yyy-MM-dd')}>
      <DayContent {...props} />
    </time>
  );
};

// https://react-day-picker.js.org/guides/input-fields
export function DatePickerWithInputExample() {
  const [selected, setSelected] = useState<Date>();
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover modal open={isOpen} onOpenChange={setIsOpen}>
      <PopoverAnchor>
        <div className="relative">
          <input
            type="text"
            className="px-3 py-1.5 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
            value={inputValue}
            onChange={e => {
              setInputValue(e.target.value);
              const date = parse(e.currentTarget.value, 'y-MM-dd', new Date());
              if (isValid(date)) {
                setSelected(date);
              } else {
                setSelected(undefined);
              }
            }}
            // we can onBlur validate date entered
          />
          <PopoverTrigger
            type="button"
            aria-label="Pick a date"
            className="absolute right-0 top-0 flex justify-center items-center  rounded-md h-full px-2
          hover:bg-gray-200/40 border border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
          >
            <span role="img" aria-label="calendar icon">
              📅
            </span>
          </PopoverTrigger>
        </div>
      </PopoverAnchor>
      <PopoverOverlay lockScroll />
      <PopoverContent>
        <PopoverArrow className="!bg-slate-900 w-5 h-5 rotate-45 m-1" />
        <DayPicker
          mode="single"
          numberOfMonths={2}
          pagedNavigation
          selected={selected}
          defaultMonth={selected}
          onSelect={date => {
            setSelected(date);
            if (date) {
              setInputValue(format(date, 'y-MM-dd'));
              setIsOpen(false);
            } else {
              setInputValue('');
            }
          }}
          initialFocus
          className="m-0 w-fit bg-slate-900 text-white p-4 rounded-lg shadow-lg [--rdp-background-color:theme(colors.slate.700/30)]
  [--rdp-accent-color:theme(colors.indigo.600/50)]"
          classNames={{
            day_selected: 'bg-indigo-600/50',
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
