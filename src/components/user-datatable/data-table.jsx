'use client';

import { useState } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CirclePlus, Settings2, TrashIcon } from 'lucide-react';

import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandSeparator } from '@/components/ui/command';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { cn } from '@/lib/utils';
import { Checkbox } from '../ui/checkbox';
import { ChevronLeftIcon, ChevronRightIcon, Cross2Icon, DoubleArrowLeftIcon, DoubleArrowRightIcon } from '@radix-ui/react-icons';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { DataTablePagination } from './data-table-pagination';
import { DataTableFacetedFilter } from './data-table-faceted-filter';
import { categories, incomeType, statuses } from './data';


export function DataTable({ columns, data, search, setSearch,typeFilter, setTypeFilter, statusFilter , setStatusFilter, totalPage, currentPage, setPage, perPage, setPerPage, onDelete, isLoading, setIsLoading}) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [isSelectDeleteOpen, setIsSelectDeleteOpen] = useState(false);
  const [pendingSearch, setPendingSearch] = useState(search);

  const table = useReactTable({
    data,
    columns,
    pageCount: totalPage,
    manualPagination: true,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination: {
        pageIndex: currentPage - 1,
        pageSize: perPage,
      },
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: (updater) => {
      const pageIndex = typeof updater === "function" ? updater(table.getState().pagination).pageIndex : updater.pageIndex;
      setPage(pageIndex + 1);
    },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });


const isFiltered = statusFilter.length > 0 || typeFilter.length > 0;

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      setSearch(pendingSearch);
    }
  };

  const handleOnChangeSearch = (e) => {
    if (e.target.value === "") {
      setSearch(e.target.value)
    } 
    setPendingSearch(e.target.value)
  }

  return (
    <>
      {/* Filters */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center py-4'>
        <Input
          placeholder="Filter pengajuan..."
          value={pendingSearch}
            onChange={(e) => handleOnChangeSearch(e)}
            onKeyDown={handleSearchKeyDown}
          className="h-8 w-[150px] lg:w-[250px]"
        />
          {table.getColumn("type") && (
          <DataTableFacetedFilter
            column={table.getColumn("type")}
            title="Status"
            options={statuses}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
        )}
        {table.getColumn("type") && (
          <DataTableFacetedFilter
            column={table.getColumn("type")}
            title="Type"
            options={incomeType}
            statusFilter={typeFilter}
            setStatusFilter={setTypeFilter}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              setStatusFilter([]);
              setTypeFilter([]);
            }}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
        </div>
        

        {/* Column visibility */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='ml-auto'>
              <Settings2 className='h-4 w-4 mr-2' /> View
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem>
              View
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {table
              .getAllColumns()
              .filter(column => column.getCanHide())
              .map(column => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className='capitalize'
                  checked={column.getIsVisible()}
                  onCheckedChange={value => column.toggleVisibility(!!value)}
                >
                  {(column.id).replace(/_/g,' ')}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className='rounded-md border mb-2'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination 
        table={table} 
        currentPage={currentPage} 
        setPage={setPage} 
        totalPage={totalPage} 
        perPage={perPage} 
        setPerPage={setPerPage}
      />
    </>
  );
}