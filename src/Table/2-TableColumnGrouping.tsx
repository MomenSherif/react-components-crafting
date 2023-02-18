import { randFirstName, randLastName, rand, randNumber } from '@ngneat/falso';
import {
  ColumnDef,
  ColumnOrderState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { useState } from 'react';
import shuffle from '../utils/shuffle';

type Person = {
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  status: string;
  progress: number;
};

const data: Person[] = Array.from({ length: 20 }).map(() => ({
  firstName: randFirstName(),
  lastName: randLastName(),
  age: randNumber({ min: 18, max: 80 }),
  progress: randNumber({ min: 0, max: 100 }),
  status: rand(['In Relationship', 'Single', 'Married', 'Complicated']),
  visits: randNumber(),
}));

const columnHelper = createColumnHelper<Person>();

const columns: ColumnDef<Person, unknown>[] = [
  columnHelper.group({
    id: 'user-info',
    header: 'User Info',
    footer: info => info.column.id,
    columns: [
      columnHelper.accessor('firstName', {
        header: 'First Name',
        cell: info => info.getValue(),
        footer: info => info.column.id,
      }),
      columnHelper.accessor(row => row.lastName, {
        id: 'lastName',
        cell: info => <i>{info.getValue()}</i>,
        header: info => <span>Last Name</span>,
        footer: info => info.column.id,
      }),
      columnHelper.accessor('age', {
        header: info => 'Age',
        cell: info => info.renderValue(),
        footer: info => info.column.id,
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        footer: info => info.column.id,
      }),
    ],
  }),
  columnHelper.group({
    id: 'user-details',
    header: 'User Details',
    footer: info => info.column.id,
    columns: [
      columnHelper.accessor('visits', {
        header: info => <span>Visits</span>,
        footer: info => info.column.id,
      }),
      columnHelper.accessor('progress', {
        header: 'Profile Progress',
        footer: info => info.column.id,
      }),
    ],
  }),
];

export default function TableColumnGrouping() {
  /**
   * Record<sting, boolean>
   * { firstName: false }
   */
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  /**
   * string[]
   * ['lastName', 'firstName']
   */
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      columnVisibility,
      columnOrder,
    },
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    getCoreRowModel: getCoreRowModel(),
  });

  console.log(table.getState());

  return (
    <div className="w-full flex flex-col space-y-2 items-start">
      <div className="flex items-start space-x-4">
        <div className="p-4 rounded-lg border space-y-1">
          <label className="flex items-center space-x-1 border-b pb-2">
            <input
              type="checkbox"
              checked={table.getIsAllColumnsVisible()}
              onChange={table.getToggleAllColumnsVisibilityHandler()}
            />
            <span>Toggle All</span>
          </label>

          {table.getAllLeafColumns().map(column => (
            <label key={column.id} className="flex items-center space-x-1">
              <input
                type="checkbox"
                checked={column.getIsVisible()}
                onChange={column.getToggleVisibilityHandler()}
              />
              {/* @ts-expect-error */} {/* Or specify human readable ids */}
              <span>{flexRender(column.columnDef.header, column)}</span>
              {/* <span>{column.id}</span> */}
            </label>
          ))}
        </div>

        <button
          className="px-3 py-2 border rounded-lg hover:bg-gray-100/70 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-indigo-500 font-medium"
          onClick={() => {
            table.setColumnOrder(
              shuffle(table.getAllLeafColumns().map(col => col.id)),
            );

            // setColumnOrder(
            //   shuffle(table.getAllLeafColumns().map(col => col.id)),
            // );
          }}
        >
          Shuffle columns
        </button>
      </div>

      <div
        className={`min-w-full overflow-x-auto rounded-lg ${
          table.getIsSomeColumnsVisible() ? 'border' : ''
        }`}
      >
        <table className="min-w-full">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className="py-4 px-4 text-left text-sm font-semibold text-gray-900 whitespace-nowrap border-b"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className="divide-y w-4">
            {table.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="py-4 px-4 text-left text-sm">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>

          <tfoot>
            {table.getFooterGroups().map(footerGroup => (
              <tr key={footerGroup.id}>
                {footerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className="py-4 px-4 text-left text-sm font-semibold text-gray-900 whitespace-nowrap border-t"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.footer,
                          header.getContext(),
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </tfoot>
        </table>
      </div>
    </div>
  );
}
