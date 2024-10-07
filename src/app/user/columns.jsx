"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";


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
//   {
//     id: "actions",
//     cell: ({ row }) => <DataTableRowActions row={row} />,
//   },
];
