import { useEffect, useRef, useState } from 'react';
import {
  arrow,
  autoUpdate,
  flip,
  offset,
  safePolygon,
  shift,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
  useTransitionStyles,
} from '@floating-ui/react';
import TooltipBasics from './Tooltip/1.basics';
import ToolTipReusable from './Tooltip/2.reusable';
import PopoverExample from './Popover/PopoverExample';
import DialogExample from './Dialog/DialogExample';
import SelectDownshift, { SelectDownshiftMultiple } from './downshift/Select';
import SingleDatePicker, {
  CustomComponentsDatePickerExample,
  DatePickerCustomized,
  ModifiersDatePickerExample,
  MultipleDatePicker,
  RangeDatePicker,
} from './DatePicker/DatePicker';

function App() {
  return (
    <div className="h-[8000px]">
      <h1 className="text-7xl font-bold text-center">Hello, World!</h1>

      <div className="m-20 flex justify-center">
        {/* <TooltipBasics /> */}
        {/* <ToolTipReusable /> */}
        {/* <PopoverExample /> */}
        {/* <DialogExample /> */}
        {/* <SelectDownshift /> */}
        {/* <SelectDownshiftMultiple /> */}
        {/* <SingleDatePicker /> */}
        {/* <DatePickerCustomized /> */}
        {/* <MultipleDatePicker /> */}
        {/* <RangeDatePicker /> */}
        {/* <ModifiersDatePickerExample /> */}
        <CustomComponentsDatePickerExample />
      </div>
    </div>
  );
}

export default App;
