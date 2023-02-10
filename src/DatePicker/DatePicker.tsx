import { format, formatISO } from 'date-fns';
import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

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
