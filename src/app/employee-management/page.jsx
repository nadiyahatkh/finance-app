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
import { fetchEmployee } from "./apiService";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function EmployeeManagement() {
  const { data: session } = useSession();
  const token = session?.user?.token;
  const [data, setData] = useState([])

  useEffect(() => {
    const loadData = async () => {
      try {
        const employeeData = await fetchEmployee({ token });
        setData(employeeData.data);
        console.log(setData)
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    if (token) {
      loadData();
    }
  }, [token]);

  // const { data, error, isLoading } = useQuery({
  //   queryKey: ['employees'],
  //   queryFn: () => fetchEmployee({token}),
  // });

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
          <DataTable data={data} columns={columns} />
          </div>
        </CardContent>
      </div>
    </div>
    )
}