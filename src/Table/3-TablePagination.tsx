import {
  randFirstName,
  randLastName,
  rand,
  randNumber,
  randLines,
} from '@ngneat/falso';
import {
  ColumnDef,
  ColumnOrderState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  PaginationState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import shuffle from '../utils/shuffle';
import usePagination from '../hooks/usePagination';

type Person = {
  firstName: string;
  lastName: string;
  paragraph: string;
  age: number;
  visits: number;
  status: string;
  progress: number;
};

const data: Person[] = Array.from({ length: 169 }).map(() => ({
  firstName: randFirstName(),
  lastName: randLastName(),
  paragraph: randLines(),
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
      columnHelper.accessor('paragraph', {
        cell: info => <i>{info.getValue()}</i>,
        header: info => <span>Random Text</span>,
        footer: info => info.column.id,
        size: 400,
      }),
      columnHelper.accessor('age', {
        header: info => 'Age',
        cell: info => info.renderValue(),
        footer: info => info.column.id,
        size: 100,
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

export default function TablePagination() {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      columnVisibility,
      columnOrder,
      pagination,
    },
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

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
        className={`w-full overflow-x-auto rounded-lg ${
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
                    className="py-4 px-4 text-left text-sm font-semibold text-gray-900 border-b"
                    style={{ width: header.getSize() }}
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
                  <td
                    key={cell.id}
                    className="py-4 px-4 text-left text-sm"
                    style={{ width: cell.column.getSize() }}
                  >
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
                    className="py-4 px-4 text-left text-sm font-semibold text-gray-900 border-t"
                    style={{ width: header.getSize() }}
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
      <div className="w-full">
        {/* table.getPageOptions() | table.getPageCount() */}
        <Pagination
          totalCount={table.options.data.length} // client side
          pageSize={table.getState().pagination.pageSize}
          pageIndex={table.getState().pagination.pageIndex}
          goToPage={page => table.setPageIndex(page)}
          canPrev={table.getCanPreviousPage()}
          canNext={table.getCanNextPage()}
          previousPage={() => table.previousPage()}
          nextPage={() => table.nextPage()}
        />
      </div>
    </div>
  );
}

type PaginationProps = {
  pageSize: number;
  totalCount: number;
  pageIndex: number;
  canPrev: boolean;
  canNext: boolean;
  nextPage: () => void;
  previousPage: () => void;
  goToPage: (page: number) => void;
};

const Pagination = ({
  pageIndex,
  pageSize,
  totalCount,
  canPrev,
  canNext,
  nextPage,
  previousPage,
  goToPage,
}: PaginationProps) => {
  const paginationRange = usePagination({
    currentPage: pageIndex + 1,
    pageSize,
    totalCount,
    siblingCount: 2,
  });

  return (
    <div className="flex items-center justify-between bg-white px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between md:hidden">
        <button
          disabled={!canPrev}
          onClick={previousPage}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          disabled={!canNext}
          onClick={nextPage}
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>

      <div className="hidden md:flex md:flex-1 md:items-center md:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing{' '}
            <span className="font-medium">{pageSize * pageIndex + 1}</span> to{' '}
            <span className="font-medium">{pageSize * (pageIndex + 1)}</span> of{' '}
            <span className="font-medium">{totalCount}</span> results
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <button
              disabled={!canPrev}
              onClick={previousPage}
              className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20
              disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>

            {paginationRange.map((pageNumber, idx) => {
              if (pageNumber === pageIndex + 1)
                return (
                  <button
                    key={pageNumber}
                    aria-current="page"
                    className="relative z-10 inline-flex items-center border border-indigo-500 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600 focus:z-20"
                  >
                    {pageNumber}
                  </button>
                );

              if (pageNumber === usePagination.DOTS)
                return (
                  <span
                    key={pageNumber + idx}
                    className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
                  >
                    &#8230;
                  </span>
                );

              return (
                <button
                  key={pageNumber}
                  onClick={() => goToPage(+pageNumber - 1)}
                  className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
                >
                  {pageNumber}
                </button>
              );
            })}

            <button
              disabled={!canNext}
              onClick={nextPage}
              className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};
