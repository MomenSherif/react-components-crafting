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

// function roundByDPR(value: number) {
//   const dpr = window.devicePixelRatio || 1;
//   return Math.round(value * dpr) / dpr;
// }

// .floating {
//   max-width: calc(100vw - 10px);
// }
// The constant 10 shown in the example should be double the padding given to the shift() middleware if it’s in use.

function App() {
  return (
    <div className="">
      <h1 className="text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-br from-indigo-500 to-teal-500">
        Hello, World!
      </h1>

      <div className="m-20 flex justify-center">
        <TooltipBasics />
      </div>
    </div>
  );
}

export default App;
