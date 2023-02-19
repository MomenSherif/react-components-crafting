import {
  ColumnDef,
  ColumnOrderState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  RowSelectionState,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { HTMLProps, useEffect, useRef, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from 'lucide-react';
import axios from 'axios';
import shuffle from '../utils/shuffle';
import usePagination from '../hooks/usePagination';
import useDidUpdate from '../hooks/useDidUpdate';

const IndeterminateCheckbox = ({
  indeterminate,
  ...props
}: { indeterminate: boolean } & HTMLProps<HTMLInputElement>) => {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof indeterminate === 'boolean' && ref.current) {
      ref.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <input ref={ref} type="checkbox" className="cursor-pointer" {...props} />
  );
};

type Comment = {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
};

const columnHelper = createColumnHelper<Comment>();

const columns = [
  columnHelper.display({
    id: 'select',
    header: ({ table }) => (
      <div className="flex justify-center items-center">
        <IndeterminateCheckbox
          checked={table?.getIsAllRowsSelected()}
          disabled={!table?.options.enableRowSelection}
          indeterminate={table?.getIsSomeRowsSelected()}
          onChange={table?.getToggleAllRowsSelectedHandler()}
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-center items-center">
        <IndeterminateCheckbox
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          indeterminate={row.getIsSomeSelected()} // for nested selection
          onChange={row.getToggleSelectedHandler()}
        />
      </div>
    ),
    size: 10,
    maxSize: 10,
  }),
  columnHelper.accessor('id', {
    header: 'ID',
    size: 40,
    enableSorting: true,
  }),
  columnHelper.accessor('name', {
    header: 'Name',
    size: 300,
  }),
  columnHelper.accessor('email', {
    header: 'Email',
    cell: info => <i>{info.getValue()}</i>,
    size: 200,
  }),
  columnHelper.accessor('body', {
    header: 'Comment',
    cell: info => <i>{info.getValue()}</i>,
    size: 400,
    meta: {
      // we can pass meta data to define filter type component for <Filters />
      filter: 'string',
    },
  }),
];

const defaultColumn: Partial<ColumnDef<Comment>> = {
  enableSorting: false,
  enableMultiSort: false,
};

export default function TableServerSide() {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = useState('');
  const [pageCount, setPageCount] = useState<number>(-1);

  const [data, setData] = useState<Comment[]>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      columnVisibility,
      columnOrder,
      pagination,
      globalFilter,
      sorting,
      rowSelection,
    },
    defaultColumn,
    pageCount, // should be fetched from the backend (but json placeholder doesn't response with total || pageCount)
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: pagination => {
      setPagination(pagination);
      table.resetRowSelection();
    },
    onGlobalFilterChange: globalFilter => {
      setGlobalFilter(globalFilter); // use complex state to combine pagination, sorting and global filter with useReducer
      setPagination(prev => ({ ...prev, pageIndex: 0 }));
      table.resetRowSelection();
    },
    onSortingChange: sorting => {
      setSorting(sorting);
      setPagination(prev => ({ ...prev, pageIndex: 0 }));
      table.resetRowSelection();
    },
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true, // disabled getSortedRowModel() if defined for client side
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
    getRowId: row => `${row.id}`,
  });

  const { pageSize, pageIndex } = pagination;
  useEffect(() => {
    axios
      .get<Comment[]>('https://jsonplaceholder.typicode.com/comments', {
        params: {
          _page: pageIndex + 1,
          _limit: pageSize,
          q: globalFilter,
          _sort: sorting.length > 0 ? sorting[0].id : undefined,
          _order:
            sorting.length > 0 ? (sorting[0].desc ? 'desc' : 'asc') : undefined,
        },
      })
      .then(res => setData(res.data))
      .then(
        () => setPageCount(Math.ceil(500 / pageSize)), // 500 represents total data count
      );
  }, [pageSize, pageIndex, sorting, globalFilter]);

  console.log(table.getState());
  console.log(table.getSelectedRowModel().rows);

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
          }}
        >
          Shuffle columns
        </button>
      </div>

      <div className="w-full flex space-x-4">
        <GlobalSearch
          value={table.getState().globalFilter || ''}
          onChange={value => table.setGlobalFilter(value)}
        />
        <button
          onClick={() => table.setGlobalFilter('')}
          className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-500"
        >
          <XIcon className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>
      <div
        className={`w-full overflow-x-auto rounded-lg ${
          table.getIsSomeColumnsVisible() ? 'border' : ''
        }`}
      >
        <table className="min-w-full" style={{ width: table.getTotalSize() }}>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className={`relative py-4 px-4 text-left text-sm font-semibold text-gray-900 border-b ${
                      header.column.getCanSort()
                        ? 'cursor-pointer select-none'
                        : ''
                    }`}
                    style={{
                      // Fixed column width hack
                      width:
                        header.getSize() !== 150 ? header.getSize() : undefined,
                    }}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                    <span className="absolute ml-4">
                      {header.column.getIsSorted() === 'asc' && '🔼'}
                      {header.column.getIsSorted() === 'desc' && '🔽'}
                    </span>
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
                    style={{
                      // Fixed column width hack
                      width:
                        cell.column.getSize() !== 150
                          ? cell.column.getSize()
                          : undefined,
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="w-full">
        {/* table.getPageOptions() | table.getPageCount() */}
        <Pagination
          totalCount={500} // client side
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

const GlobalSearch = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const [_value, _setValue] = useState(value);

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  // debounce globalFilter table value
  useDidUpdate(() => {
    const timerId = setTimeout(() => {
      onChangeRef.current(_value);
    }, 400);
    return () => clearTimeout(timerId);
  }, [_value]);

  // sync if globalFilter updated from outside
  useDidUpdate(() => {
    _setValue(value);
  }, [value]);

  return (
    <input
      placeholder="Search..."
      className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:border-indigo-500 focus:ring-indigo-500/20"
      type="text"
      value={_value}
      onChange={e => _setValue(e.target.value)}
    />
  );
};

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
