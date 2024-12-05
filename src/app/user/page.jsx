'use client'
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
// import { Card } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DataTable } from "@/components/user-datatable/data-table";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import Link from "next/link";
import { columns } from "./columns";
import { Card, CardContent } from "@/components/Card";
import { fetchAmount } from "../apiService";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { fetchSubmissionUser } from "./apiService";
import { useQuery } from "@tanstack/react-query";

const colorStyles = ["#335CFF", "#1DAF61", "#FB3748", "#09090B"]; 

export default function HomeUser() {
  const { data: session } = useSession(); 
  const token = session?.user?.token;
  const [data, setData] = useState([])
  const [cardData, setCardData] = useState()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState([]);
  const [statusFilter, setStatusFilter] = useState([]);
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [totalPage, setTotalPage] = useState(0);
  const [date, setDate] = useState();

  const submissionData = async () => {
    try {
        const due_date = date ? format(date, "yyyy-MM-dd") : "";
        const pengajuan = await fetchSubmissionUser({ token, search, page,due_date, per_page: perPage,  finish_status: statusFilter, type: typeFilter});
        console.log(pengajuan)
        setData(pengajuan.data.submissions.data);
        setTotalPage(pengajuan.data.submissions.last_page)
        setCardData([
          {
            label: "Permintaan Tertunda",
            amount: pengajuan.data.amounts.process,
            image: "./Vector.png",
            color: colorStyles[0]
          },
          {
            label: "Permintaan yang Disetujui",
            amount: pengajuan.data.amounts.approval,
            image: "./CekCircle.png",
            color: colorStyles[1],
          },
          {
            label: "Permintaan yang Ditolak",
            amount: pengajuan.data.amounts.denied,
            image: "./VectorX.png",
            color: colorStyles[2]
          },
          {
            label: "Pending Balance",
            amount: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(pengajuan.data.amounts.amount),
            image: "./Rp.png",
            color: colorStyles[3]
          }
        ]);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    useEffect(() => {
    if (token) {
      submissionData();
    }
  }, [token, search, statusFilter, typeFilter, date, page, perPage]);

  const resetDateFilter = () => {
    setDate();
    submissionData();
  };

  const isDateDefault = () => !date; 

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
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[280px] justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(selectedDate) => {
                      console.log("Selected date:", selectedDate); // Debug date value
                      setDate(selectedDate);
                      submissionData(); // Memanggil ulang data setelah memilih tanggal
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              {!isDateDefault() && (
              <Button variant="outline" className="text-red-500" style={{ color: '#F9B421', border: 'none' }} onClick={resetDateFilter}>
                Reset Date
              </Button>
            )}
            {/* Add Asset Button */}
            <Button variant="solid" className="" style={{ background: "#F9B421" }}>
                <Link href="./user/submission">
                    Buat Pengajuan
                </Link>
            </Button>
          </div>
        </div>
            <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-4 mb-4">
                {cardData?.map((d, i) => (
                    <Card key={i} amount={d.amount} label={d.label} image={d.image} color={d.color} />
                ))}
            </section>
        <CardContent className="shadow-md">
          <div className="container mx-auto">
          <DataTable
              data={data} 
              columns={columns}
              search={search} 
              setSearch={setSearch}
              typeFilter={typeFilter} 
              setTypeFilter={setTypeFilter} 
              statusFilter={statusFilter} 
              setStatusFilter={setStatusFilter} 
              currentPage={page} 
              setPage={setPage} 
              totalPage={totalPage} 
              perPage={perPage} 
              setPerPage={setPerPage}
            />
          </div>
        </CardContent>
      </div>
    </div>
    )
}