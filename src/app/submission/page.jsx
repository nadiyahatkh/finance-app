'use client'
import { Card, CardContent } from "@/components/Card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DataTable } from "@/components/data-table-submission/data-table";
import { columns } from "./columns";
import { useSession } from "next-auth/react";
import { fetchSubmission } from "./apiService";
import { useQuery } from "@tanstack/react-query";



export default function SubmissionAdmin(){
  const { data: session } = useSession();
  const token = session?.user?.token;

  const { data: dataSubmission, error, isLoading } = useQuery({
    queryKey: ['submissions'],
    refetchOnWindowFocus: false,
    queryFn: () => fetchSubmission({token}),
  });

  console.log(dataSubmission)

  const submissionData = dataSubmission?.submissions || [];

    const cardData = [
        {
          label: "Permintaan Tertunda",
          amount: 20,
          image: "./Vector.png"
        },
        {
          label: "Permintaan yang Disetujui",
          amount: 30,
          image: "./CekCircle.png"
        },
        {
          label: "Permintaan yang Ditolak",
          amount: 40,
          image: "./VectorX.png"
        },
        {
          label: "Jumlah (Rp)",
          amount: 50,
          image: "./Rp.png"
        },
      ];
    return(
    <div className="py-4">
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          {/* Left section */}
          <div>
            <p className="title font-manrope font-bold text-2xl leading-10">Pengajuan Pembayaran/Reimbursement</p>
            <p className="text-muted-foreground text-sm">
                Tabel yang menampilkan data pengajuan pembayaran atau penggantian biaya.
            </p>
          </div>
          {/* Right section */}
          <div className="flex items-center space-x-4">
          {/* <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant={"outline"}
                      className={cn(
                        "w-[300px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date?.from ? (
                        date.to ? (
                          <>
                            {format(date.from, "LLL dd, y")} -{" "}
                            {format(date.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(date.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={date?.from}
                      selected={date}
                      onSelect={setDate}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
              </Popover> */}

              {/* {!isDateDefault() && (
              <Button variant="outline" className="text-red-500" style={{ color: '#F9B421', border: 'none' }} onClick={resetDateFilter}>
                Reset Date
              </Button>
            )} */}
          </div>
        </div>
            <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-4 mb-4">
                {cardData.map((d, i) => (
                    <Card key={i} amount={d.amount} label={d.label} image={d.image} />
                ))}
            </section>
        <CardContent className="shadow-md">
          <div className="container mx-auto">
          {/* <DataTable
            columns={columns(handleDelete, isDeleteDialogOpen, setIsDeleteDialogOpen, setIdToDelete)}
            data={data}
            search={search}
            setSearch={setSearch}
            onDelete={deleteRows}
            currentPage={page}
            totalPages={totalPages}
            setPage={setPage}
            perPage={perPage}
            setPerPage={setPerPage}
            statusFilter={statusFilter} 
            setStatusFilter={setStatusFilter} 
          /> */}
          <DataTable data={submissionData} columns={columns} />
          </div>
        </CardContent>
      </div>
    </div>
    )
}