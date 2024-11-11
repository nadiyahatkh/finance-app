'use client'
import { Card, CardContent } from "@/components/Card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ValueIcon } from "@radix-ui/react-icons";
import { Circle } from "lucide-react";
import { fetchAmount } from "../apiService";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const colorStyles = ["#335CFF", "#1DAF61", "#FB3748", "#09090B"]; 

export default function Dashboard(){
  const { data: session } = useSession();
  const token = session?.user?.token;
  const [cardData, setCardData] = useState()

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchAmount({ token });
        console.log(data)
        setCardData([
          {
            label: "Permintaan Tertunda",
            amount: data.data.approval,
            image: "./Vector.png",
            color: colorStyles[0]
          },
          {
            label: "Permintaan yang Disetujui",
            amount: data.data.denied,
            image: "./CekCircle.png",
            color: colorStyles[1],
          },
          {
            label: "Permintaan yang Ditolak",
            amount: data.data.process,
            image: "./VectorX.png",
            color: colorStyles[2]
          },
          {
            label: "Jumlah (Rp)",
            amount: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(data.data.amount),
            image: "./Rp.png",
            color: colorStyles[3]
          }
        ]);
      } catch (error) {
        console.error('Gagal mengambil data:', error);
      }
    };
    if (token) {
      loadData();
    }
  }, [token]);

    return(
        <div className="py-4">
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <p className="title font-manrope font-bold text-2xl leading-10">Dashboard</p>
          
        </div>
        <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-4 mb-4">
          {cardData?.map((d, i) => (
            <Card
              key={i}
              amount={d.amount}
              label={d.label}
              image = {d.image}
            />
          ))}
        </section>
        <section className="">
          <CardContent className="">
            <div className="flex justify-between items-center mb-8">
                <p className="font-bold">Pengeluaran</p>
                <div className="flex items-center space-x-4">
                <Select>
                  <SelectTrigger className="w-[150px] font-semibold">
                    <SelectValue placeholder="Bulan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
                </div>

            </div>
            {/* <BarChart data={chartData} /> */}
            <div className="flex justify-center items-center space-x-4">
                    <p className="flex items-center font-semibold text-sm">
                        <Circle className="h-4 w-4 mr-2 fill-green-600" style={{ color: "#28A745" }} /> Reimburesent
                    </p>
                    <p className="flex items-center font-semibold text-sm">
                        <Circle className="h-4 w-4 mr-2 fill-blue-600" style={{ color: "#2563EB" }} /> Payment Procces
                    </p>
            </div>
          </CardContent>
          {/* <CardContent className="lg:col-span-2 flex flex-col gap-4">
            <section>
              <p className="text-base font-bold">Pengembalian Terdekat</p>
              <p className="text-sm text-gray-400">
                Terdapat 5 pengembalian terdekat
              </p>
            </section>
            <div className="flex flex-col gap-4 overflow-y-auto scrollbar-hide"
                  style={{ maxHeight: '400px' }}>
              {nearest?.map((d, i) => (
                <SalesCard
                  key={i}
                  expiry_date={d.expiry_date}
                  name={d.name}
                  assetname={d.assetname}
                />
              ))}
            </div>
          </CardContent> */}
        </section>
      </div>
    </div>
    )
}