'use client'
import { Button } from "@/components/ui/button";
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
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)

  useEffect(() => {
    setPage(1);
  }, [perPage]);

  const handleDelete = async () => {
    try {
      await removeEmployee({ id: idToDelete, token });
      queryClient.invalidateQueries(['employees']);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Gagal menghapus data:', error);
    }
  };

  const { data: dataEmployee, error, isLoading } = useQuery({
    queryKey: ['employees', page, perPage],
    refetchOnWindowFocus: false,
    queryFn: () => fetchEmployee({token, page, per_page: perPage}),
  });

  const employeeData = dataEmployee?.data.data || [];
  const totalPage = dataEmployee?.data.last_page || 1;
    return(
        <div className="py-4">
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="title font-manrope font-bold text-2xl leading-10">Manajemen Karyawan</p>
            <p className="text-muted-foreground text-sm">
                Heres a list of your employe.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="solid" className="bg-[#F9B421] hover:bg-black hover:text-white" >
                <Link href="./employee-management/add-employee">
                    Tambah Karyawan
                </Link>
            </Button>
          </div>
        </div>
        <CardContent className="shadow-md">
          <div className="container mx-auto">
          <DataTable data={employeeData} columns={columns(handleDelete, isDeleteDialogOpen, setIsDeleteDialogOpen, setIdToDelete)} currentPage={page} setPage={setPage} totalPage={totalPage} perPage={perPage} setPerPage={setPerPage} />
          </div>
        </CardContent>
      </div>
    </div>
    )
}