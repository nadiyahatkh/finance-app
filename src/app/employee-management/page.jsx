'use client'
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
// import { Card } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import Link from "next/link";

import { Card, CardContent } from "@/components/Card";
import { columns } from "./columns";
import { DataTable } from "@/components/employee-management-datatable/data-table";
import { fetchEmployee, removeEmployee } from "./apiService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function EmployeeManagement() {
  const { data: session } = useSession();
  const token = session?.user?.token;
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [idToDelete, setIdToDelete] = useState(null);

  // const deleteRow = (id, employeeData) => {
  //   return employeeData.filter(item => item.id !== id);
  // };


  const handleDelete = async () => {
    try {
      await removeEmployee({ id: idToDelete, token });
      // Refetch data setelah delete berhasil
      queryClient.invalidateQueries(['employees']);
      // Menutup dialog setelah berhasil menghapus
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Gagal menghapus data:', error);
    }
  };

  const { data: dataEmployee, error, isLoading } = useQuery({
    queryKey: ['employees'],
    refetchOnWindowFocus: false,
    queryFn: () => fetchEmployee({token}),
  });

  const employeeData = dataEmployee?.data.data || [];

  console.log(employeeData)
  // console.log(data)

  // if (isLoading) {
  //   return <p>Loading...</p>;
  // }

  // if (error) {
  //   console.log(error)
  //   return <p>error</p>;
  // }
    return(
        <div className="py-4">
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          {/* Left section */}
          <div>
            <p className="title font-manrope font-bold text-2xl leading-10">Manajemen Karyawan</p>
            <p className="text-muted-foreground text-sm">
                Heres a list of your employe.
            </p>
          </div>
          {/* Right section */}
          <div className="flex items-center space-x-4">
          
            {/* Add Asset Button */}
            <Button variant="solid" className="" style={{ background: "#F9B421" }}>
                <Link href="./employee-management/add-employee">
                    Tambah Karyawan
                </Link>
            </Button>
          </div>
        </div>
            {/* <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-4 mb-4">
                {cardData.map((d, i) => (
                    <Card key={i} amount={d.amount} label={d.label} image={d.image} />
                ))}
            </section> */}
        <CardContent className="shadow-md">
          <div className="container mx-auto">
          <DataTable data={employeeData} columns={columns(handleDelete, isDeleteDialogOpen, setIsDeleteDialogOpen, setIdToDelete)} />
          </div>
        </CardContent>
      </div>
    </div>
    )
}