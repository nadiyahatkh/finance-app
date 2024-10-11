import { Card, CardContent } from "@/components/Card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ValueIcon } from "@radix-ui/react-icons";
import { Circle } from "lucide-react";

export default function Dashboard(){
    const cardData = [
        {
          label: "Jumlah Aset",
          amount: 20,
          image: "./Vector.png"
        },
        {
          label: "Total Aset Aktif",
          amount: 30,
          image: "./CekCircle.png"
        },
        {
          label: "Aset Rusak",
          amount: 40,
          image: "./VectorX.png"
        },
        {
          label: "Aset Dipinjamkan",
          amount: 50,
          image: "./Rp.png"
        },
      ];
    return(
        <div className="py-4">
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <p className="title font-manrope font-bold text-2xl leading-10">Dashboard</p>
          
        </div>
        <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-4 mb-4">
          {cardData.map((d, i) => (
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