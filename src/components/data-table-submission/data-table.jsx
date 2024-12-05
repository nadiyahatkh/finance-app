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
import { ThreeDots } from 'react-loader-spinner';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { incomeType, statuses } from './data';



export function DataTable({ 
    columns,
    data, 
    search, 
    setSearch, 
    openSuccess, 
    setOpenSuccess, 
    openSuccessDenied,
    setOpenSuccessDenied,
    handleApproveAll, 
    handleDeniedAll,
    setIsApprovedAllDialogOpen,
    isApprovedAllDialogOpen, 
    notes, 
    setNotes, 
    errorMessages , 
    openError,
    setOpenError, 
    isDialogOpen, 
    setIsDialogOpen, 
    isLoadingTolak, 
    statusFilter , 
    setStatusFilter, 
    totalPage, 
    currentPage, 
    setPage, 
    perPage, 
    setPerPage, 
    onDelete, 
    isLoading, 
    setIsLoading, 
    typeFilter, 
    setTypeFilter
  }) {
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

  const handleSelectApproveAll = () => {
    const approveRows = table.getSelectedRowModel().rows.map(row => row.original.id);
    handleApproveAll(approveRows);
  };

  const handleSelectDeniedAll = (event) => {
    event.preventDefault();
    const deniedRows = table.getSelectedRowModel().rows.map(row => row.original.id);
    if (deniedRows.length === 0) {
      alert("Please select at least one row to deny.");
      return;
    }
    handleDeniedAll(deniedRows);
  };
  

  return (
    <>
      {/* Filters */}
      <div className='flex flex-wrap items-center justify-between'>
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

        
      <div className='flex items-center space-x-2'>
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            className="text-[#F9B421]" 
                          >
                            Tolak Semua
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Alasan Penolakan</DialogTitle>
                          </DialogHeader>
                          <form onSubmit={handleSelectDeniedAll}>
                            <div className="grid w-full gap-1.5">
                              <Textarea
                                id="notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                              />
                              <p className="text-sm text-muted-foreground">
                                Tuliskan alasan penolakan pengajuan
                              </p>
                            </div>
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => setIsDialogOpen(false)}
                                type="button"
                                className="mr-2 shadow-md h-8 w-[20%] text-[#F9B421]"
                              >
                                Kembali
                              </Button>
                              <Button 
                                type="submit"
                                className="text-white h-8 w-[20%] bg-[#F9B421]"
                                disabled={isLoadingTolak}
                              >
                                {isLoadingTolak ? (
                                  <ThreeDots
                                  height="20"
                                  width="20"
                                  color="#ffffff"
                                  ariaLabel="loading"
                                  />
                                ) : (
                                  'Simpan'
                                )}
                              </Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                      ) : null}
                   {table.getFilteredSelectedRowModel().rows.length > 0 ? (   
              <Button className="" onClick={() => setIsApprovedAllDialogOpen(true)} style={{ background: "#F9B421" }}>
                  Setujui Semua
              </Button>
            ) : null}
              <AlertDialog open={isApprovedAllDialogOpen} onClose={() => setIsApprovedAllDialogOpen(false)}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Ingin Mensetujui semua pengajuan ini?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setIsApprovedAllDialogOpen(false)}>Batal</AlertDialogCancel>
                  <AlertDialogAction disabled={isLoading} onClick={handleSelectApproveAll} className="bg-[#F9B421]">
                  {isLoading ? (
                                  <ThreeDots
                                  height="20"
                                  width="20"
                                  color="#ffffff"
                                  ariaLabel="loading"
                                  />
                                ) : (
                                  'Ya'
                                )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

        {/* Success Dialog */}
        <AlertDialog open={openSuccess} onOpenChange={setOpenSuccess}>
            <AlertDialogContent className="flex flex-col items-center justify-center text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full" style={{ background: "#DCFCE7" }}>
                    <svg
                        className="w-6 h-6 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                        ></path>
                    </svg>
                </div>
                <AlertDialogTitle className="">Yeay! Sukses</AlertDialogTitle>
                <AlertDialogDescription className="">Anda telah berhasil mensetujui semua pengajuan ini.</AlertDialogDescription>
                <AlertDialogAction
                    onClick={() => setOpenSuccess(false)}
                    style={{ background: "#F9B421" }}
                    className="w-full"
                >
                    Kembali
                </AlertDialogAction>
            </AlertDialogContent>
        </AlertDialog>
        {/* Success Dialog Denied */}
        <AlertDialog open={openSuccessDenied} onOpenChange={setOpenSuccessDenied}>
            <AlertDialogContent className="flex flex-col items-center justify-center text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full" style={{ background: "#DCFCE7" }}>
                    <svg
                        className="w-6 h-6 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                        ></path>
                    </svg>
                </div>
                <AlertDialogTitle className="">Yeay! Sukses</AlertDialogTitle>
                <AlertDialogDescription className="">Anda telah berhasil menolak semua pengajuan ini.</AlertDialogDescription>
                <AlertDialogAction
                    onClick={() => setOpenSuccess(false)}
                    style={{ background: "#F9B421" }}
                    className="w-full"
                >
                    Kembali
                </AlertDialogAction>
            </AlertDialogContent>
        </AlertDialog>

        {/* Error Dialog */}
        <AlertDialog open={openError} onOpenChange={setOpenError}>
          <AlertDialogContent className="flex flex-col items-center justify-center text-center">
          <div className="flex items-center justify-center w-12 h-12 rounded-full" style={{ background: "#FEE2E2" }}>
              <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
              >
                  <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                  ></path>
              </svg>
          </div>
          <AlertDialogTitle>Yahh! Error</AlertDialogTitle>
              <AlertDialogDescription>
              <div className="max-h-32 overflow-y-auto font-semibold">
                  {errorMessages.map((message, index) => (
                  <p key={index} className="text-red-500 italic">{message}</p>
                  ))}
              </div>
              </AlertDialogDescription>
              <AlertDialogAction className="w-full" onClick={() => setOpenError(false)} style={{ background: "#F9B421" }}>Kembali</AlertDialogAction>
          </AlertDialogContent>
          </AlertDialog>
        
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