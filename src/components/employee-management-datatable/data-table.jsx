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
// import { DataTableFacetedFilter } from './data-table-faceted-filter';
import { ChevronLeftIcon, ChevronRightIcon, Cross2Icon, DoubleArrowLeftIcon, DoubleArrowRightIcon } from '@radix-ui/react-icons';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
// import { statuses } from './constants';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { DataTablePagination } from './data-table-pagination';
import { categories, incomeType } from './data';
import { DataTableFacetedFilter } from './data-table-faceted-filter';



export function DataTable({ columns, data, search, setSearch, statusFilter , setStatusFilter, totalPage, currentPage, setPage, perPage, setPerPage, onDelete, isLoading, setIsLoading}) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [isSelectDeleteOpen, setIsSelectDeleteOpen] = useState(false);
  const [pendingSearch, setPendingSearch] = useState(search);

  const table = useReactTable({
    data,
    columns,
    pageCount: totalPage, // Tambahkan totalPage
    manualPagination: true, // Gunakan paginasi manual
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination: {
        pageIndex: currentPage - 1, // halaman dalam index-based
        pageSize: perPage,
      },
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: (updater) => {
      const pageIndex = typeof updater === "function" ? updater(table.getState().pagination).pageIndex : updater.pageIndex;
      setPage(pageIndex + 1); // perbarui halaman ke state
    },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
  

//   const handleDelete = () => {
//     const deleteRows = table.getSelectedRowModel().rows.map(row => row.original.id);
//     onDelete(deleteRows);
//     setIsSelectDeleteOpen(false);
//   };


const isFiltered = table.getState().columnFilters.length > 0;
//   const isFiltered = statusFilter.length > 0;

//   const handleSearchKeyDown = (e) => {
//     if (e.key === 'Enter') {
//       setSearch(pendingSearch);
//     }
//   };

//   const handleOnChangeSearch = (e) => {
//     if (e.target.value === "") {
//       setSearch(e.target.value)
//     } 
//     setPendingSearch(e.target.value)
//   }

console.log("Jumlah baris per halaman:", perPage);

  return (
    <>
      {/* Filters */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center py-4'>
        <Input
          placeholder="Filter labels..."
          value={(table.getColumn("name")?.getFilterValue()) ?? ""}
          onChange={(event) => {
            table.getColumn("name")?.setFilterValue(event.target.value);
          }}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {/* {table.getFilteredSelectedRowModel().rows.length > 0 ? (
          <Button variant="outline" size="sm" onClick={() => setIsSelectDeleteOpen(true)} className="ml-4">
            <TrashIcon className="mr-2 size-4" aria-hidden="true" />
            Delete ({table.getFilteredSelectedRowModel().rows.length})
          </Button>
        ) : null}
        <AlertDialog open={isSelectDeleteOpen} onClose={() => setIsSelectDeleteOpen(false)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                <AlertDialogDescription>
                  Tindakan ini tidak dapat dibatalkan. Ini akan menghapus Rows secara permanen dari server.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setIsSelectDeleteOpen(false)}>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Hapus</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog> */}
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