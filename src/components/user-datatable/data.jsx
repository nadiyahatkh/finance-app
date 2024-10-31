import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons";

export const statuses = [
  {
    value: "approved",
    label: "Approved"
  },
  {
    value: "denied",
    label: "Denied"
  },
  {
    value: "process",
    label: "Process"
  },
];

export const incomeType = [
  {
    label: "Reimburesment",
    value: "Reimburesent",
    icon: ArrowUpIcon
  },
  {
    label: "Payment Request",
    value: "Payment Process",
    icon: ArrowDownIcon
  }
];