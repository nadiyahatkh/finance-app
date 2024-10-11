"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { TrendingUp, TrendingDown, MoreHorizontal, Trash2, PencilLine } from "lucide-react";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";


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
        className="translate-y-0.5"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-0.5"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "label",
    header: 'label',
    cell: ({ row }) => (
      <div className="w-[150px] capitalize">{row.getValue("label")}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "note",
    header: 'note'
  },
  {
    accessorKey: "category",
    header: 'category'
  },
  {
    accessorKey: "type",
    header: 'type'
  },
  {
    accessorKey: "amount",
    header: 'amount'
  },
  {
    accessorKey: "date",
    header: 'date',
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
            <DropdownMenuItem >
              <Link href={`./user/update-submission`} className="flex items-center">
                <PencilLine className="mr-2 h-4 w-4" />
                Ubah
              </Link>
            </DropdownMenuItem>
              <DropdownMenuItem className="text-red-500">
                <Trash2 className='h-4 w-4 mr-2' /> Hapus
              </DropdownMenuItem>
            <DropdownMenuItem>
            <Link href={`./user/detail-submission`} className="flex items-center">
                <PencilLine className="mr-2 h-4 w-4" />
                Detail
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
