'use client'
import { Card, CardContent } from "@/components/Card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DataTable } from "@/components/data-table-submission/data-table";
import { columns } from "./columns";
import { useSession } from "next-auth/react";
import { approvedAllSubmission, deniedAllSubmission, fetchSubmission } from "./apiService";
import { useQuery } from "@tanstack/react-query";
import { fetchAmount } from "../apiService";
import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const colorStyles = ["#335CFF", "#1DAF61", "#FB3748", "#09090B"]; 

export default function SubmissionAdmin(){
  const { data: session } = useSession();
  const token = session?.user?.token;
  const [cardData, setCardData] = useState([])
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState([]);
  const [statusFilter, setStatusFilter] = useState([]);
  const [data, setData] = useState([])
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openSuccessDenied, setOpenSuccessDenied] = useState(false)
    const [openError, setOpenError] = useState(false);
    const [errorMessages, setErrorMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingTolak, setIsLoadingTolak] = useState(false);
    const [notes, setNotes] = useState('')
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isApprovedAllDialogOpen, setIsApprovedAllDialogOpen] = useState(false)
    const [date, setDate] = useState();
    const [page, setPage] = useState(1)
    const [perPage, setPerPage] = useState(10)
    const [totalPage, setTotalPage] = useState(0);
  
  
  


  const submissionData = async () => {
    try {
      const due_date = date ? format(date, "yyyy-MM-dd") : "";
        const pengajuan = await fetchSubmission({ token, search, due_date,page, per_page: perPage,  status: statusFilter, type: typeFilter});
        setData(pengajuan.submissions.data);
        setTotalPage(pengajuan.submissions.last_page)
        setCardData([
          {
            label: "Permintaan Tertunda",
            amount: pengajuan.data.process,
            image: "./Vector.png",
            color: colorStyles[0]
          },
          {
            label: "Permintaan yang Disetujui",
            amount: pengajuan.data.approval,
            image: "./CekCircle.png",
            color: colorStyles[1],
          },
          {
            label: "Permintaan yang Ditolak",
            amount: pengajuan.data.denied,
            image: "./VectorX.png",
            color: colorStyles[2]
          },
          {
            label: "Pending Balance",
            amount: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(pengajuan.data.amount),
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

 


 


  const handleApproveAll = async (selected_ids) => {
    setIsLoading(true)
    try {
      await approvedAllSubmission({ selected_ids, token });
      submissionData()
      setIsApprovedAllDialogOpen(false)
      setOpenSuccess(true)
    } catch (error) {
      let message = '';
    try {
      // Periksa apakah error.message adalah JSON
      const errorDetail = JSON.parse(error.message);
      if (errorDetail.message) {
        message = errorDetail.message; // Ambil pesan dari respons error
        setErrorMessages([message]);
      } else {
        setErrorMessages(Object.values(errorDetail.errors).flat());
      }
    } catch (e) {
      // Jika JSON parsing gagal, gunakan pesan string bawaan
      message = error.message || "An unexpected error occurred.";
      setErrorMessages([message]);
    }
    setIsApprovedAllDialogOpen(false)
    setOpenError(true);
    console.error('Error deniedall:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeniedAll = async (selected_ids) => {
    if (!notes) return; 
    setIsLoadingTolak(true)
    try {
      await deniedAllSubmission({ selected_ids, token, notes });
      submissionData()
      setNotes('');
      setIsDialogOpen(false);
      setOpenSuccessDenied(true)
    } catch (error) {
      let message = '';
    try {
      // Periksa apakah error.message adalah JSON
      const errorDetail = JSON.parse(error.message);
      if (errorDetail.message) {
        message = errorDetail.message; // Ambil pesan dari respons error
        setErrorMessages([message]);
      } else {
        setErrorMessages(Object.values(errorDetail.errors).flat());
      }
    } catch (e) {
      // Jika JSON parsing gagal, gunakan pesan string bawaan
      message = error.message || "An unexpected error occurred.";
      setErrorMessages([message]);
    }

    setOpenError(true);
    console.error('Error deniedall:', error);
    } finally {
      setIsLoadingTolak(false);
    }
  };

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
                      {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
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
                defaultMonth={date?.from || new Date().setMonth(0)} // Start of the year
                selected={date}
                onSelect={(selectedDate) => {
                  setDate(selectedDate);
                  // Trigger fetching data when date is selected
                  submissionData();
                }}
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
            columns={columns}
            data={data}
            search={search}
            setSearch={setSearch}
            statusFilter={statusFilter} 
            setStatusFilter={setStatusFilter}
            typeFilter={typeFilter} 
            setTypeFilter={setTypeFilter} 
            handleDeniedAll={handleDeniedAll}
            handleApproveAll={handleApproveAll}
            setIsLoading={setIsLoading}
            isLoading={isLoading}
            openError={openError}
            setOpenError={setOpenError}
            errorMessages={errorMessages}
            openSuccess={openSuccess}
            setOpenSuccess={setOpenSuccess}
            openSuccessDenied={openSuccessDenied}
            setOpenSuccessDenied={setOpenSuccessDenied}
            setIsDialogOpen={setIsDialogOpen}
            isDialogOpen={isDialogOpen}
            isLoadingTolak={isLoadingTolak}
            setIsLoadingTolak={setIsLoadingTolak}
            notes={notes}
            setNotes={setNotes}
            currentPage={page} 
              setPage={setPage} 
              totalPage={totalPage} 
              perPage={perPage} 
              setPerPage={setPerPage}
              setIsApprovedAllDialogOpen={setIsApprovedAllDialogOpen}
              isApprovedAllDialogOpen={isApprovedAllDialogOpen}
          />
          </div>
        </CardContent>
      </div>
    </div>
    )
}