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
  DatePickerWithInputExample,
  ModifiersDatePickerExample,
  MultipleDatePicker,
  RangeDatePicker,
} from './DatePicker/DatePicker';
import SingleComboBox from './downshift/Combobox';
import BasicTable from './Table/1-BasicTable';
import TableColumnGrouping from './Table/2-TableColumnGrouping';
import TablePagination from './Table/3-TablePagination';
import TableServerSide from './Table/4-TableServerSide';
import CMDK from './CMDK/CMDK';

function App() {
  return (
    <div className="">
      <h1 className="text-7xl font-bold text-center">Hello, World!</h1>

      <div className="m-20 flex justify-center">
        {/* <TooltipBasics /> */}
        {/* <ToolTipReusable /> */}
        {/* <PopoverExample /> */}
        {/* <DialogExample /> */}
        {/* <SelectDownshift /> */}
        {/* <SingleComboBox /> */}
        {/* <SelectDownshiftMultiple /> */}
        {/* <SingleDatePicker /> */}
        {/* <DatePickerCustomized /> */}
        {/* <MultipleDatePicker /> */}
        {/* <RangeDatePicker /> */}
        {/* <ModifiersDatePickerExample /> */}
        {/* <CustomComponentsDatePickerExample /> */}
        {/* <DatePickerWithInputExample /> */}
        {/* <BasicTable /> */}
        {/* <TableColumnGrouping /> */}
        {/* <TablePagination /> */}
        {/* <TableServerSide /> */}
        <CMDK />
      </div>
    </div>
  );
}

export default App;
