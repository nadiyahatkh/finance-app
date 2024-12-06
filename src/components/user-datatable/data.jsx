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
    label: "Reimbursement",
    value: "Reimbursement",
    icon: ArrowUpIcon
  },
  {
    label: "Payment Request",
    value: "Payment Request",
    icon: ArrowDownIcon
  }
];