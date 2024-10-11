// 'use client'
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
// import { Card } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DataTable } from "@/components/user-datatable/data-table";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import Link from "next/link";
import path from "path";
import fs from "fs";
import { Card, CardContent } from "@/components/Card";
// import { useState } from "react";



export default async function HomeUser() {
    // const cardData = [
    //     {
    //       label: "Permintaan Tertunda",
    //       amount: 20,
    //       image: "./Vector.png"
    //     },
    //     {
    //       label: "Permintaan yang Disetujui",
    //       amount: 30,
    //       image: "./CekCircle.png"
    //     },
    //     {
    //       label: "Permintaan yang Ditolak",
    //       amount: 40,
    //       image: "./VectorX.png"
    //     },
    //     {
    //       label: "Jumlah (Rp)",
    //       amount: 50,
    //       image: "./Rp.png"
    //     },
    //   ];
    // const defaultDate = {
    //     from: new Date(2024, 0, 1),
    //     to: new Date(2024, 11, 31)
    //   };
    
    //   const [date, setDate] = useState(defaultDate);

    //   const data = await getData()
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
          {/* <DataTable data={data} columns={columns} /> */}
          </div>
        </CardContent>
      </div>
    </div>
    )
}