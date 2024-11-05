"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { TrendingUp, TrendingDown, MoreHorizontal, Trash2, PencilLine, CheckCheckIcon, XCircle, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatCurrency } from "../utils/formatCurrency";


export const columns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="accent-yellow-400 border-yellow-400"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-0.5 accent-pink-500"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "submission_date",
    header: 'Tanggal',
    cell: ({ row }) => {
      const submissionDate = new Date(row.original.submission_date);
      return submissionDate.toLocaleString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short",
      }).replace(/\//g, '-');
    },
  },
  {
    accessorKey: "purpose",
    header: 'Tujuan Pembayaran/Pengeluaran'
  },
  {
    accessorKey: "due_date",
    header: 'Tanggal Pembayaran',
    cell: ({ row }) => {
      const dueDate = new Date(row.original.due_date);
      return dueDate.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).replace(/\//g, '-');
    },
  },
  {
    accessorKey: "type",
    header: 'Type',
    cell: ({ row }) => {
      const type = row.original.type;
      const bgColor = type === "Payment Process" ? "bg-blue-500" : "bg-green-500";

      return (
        <span className={`px-2 rounded text-white text-sm ${bgColor}`}>
          {type}
        </span>
      );
    }
  },
  {
    accessorKey: "amount",
    header: 'Jumlah (Rp)',
    cell: info => formatCurrency(info.getValue())
  },
  {
    accessorKey: 'finish_status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue("finish_status");

      let statusColor, statusIcon;

      if (status === 'approved') {
        statusColor = 'text-green-500';
        statusIcon = <CheckCheckIcon className="h-4 w-4 mr-2" />;
      } else if (status === 'dinied') {
        statusColor = 'text-red-500';
        statusIcon = <XCircle className="h-4 w-4 mr-2" />;
      } else if (status === 'process') {
        statusColor = 'text-black';
        statusIcon = <RotateCw className="h-4 w-4 mr-2" />;
      }

      return (
        <div className={`flex items-center ${statusColor}`}>
          {statusIcon}
          <span className="capitalize font-semibold">{status}</span>
        </div>
      );
    },
  },
  {
    id: 'aksi',
    cell: ({ row, data }) => {
      
      const id = row.original.id;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Buka menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
            <Link href={`./user/detail-submission/${id}`} className="flex items-center">
                <PencilLine className="mr-2 h-4 w-4" />
                Detail
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
            <Link href={`./user/update-submission/${id}`} className="flex items-center">
                <PencilLine className="mr-2 h-4 w-4" />
                Update
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
          {/* <AlertDialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                <AlertDialogDescription>
                  Tindakan ini tidak dapat dibatalkan. Ini akan menghapus data secara permanen dari server.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Hapus</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog> */}
        </DropdownMenu>
      );
    }
  }
];
