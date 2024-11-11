'use client'
import { Card, CardContent } from "@/components/Card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ValueIcon } from "@radix-ui/react-icons";
import { Circle } from "lucide-react";
import { fetchAmount } from "../apiService";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { fetchDashboard } from "./apiService";

const colorStyles = ["#335CFF", "#1DAF61", "#FB3748", "#09090B"]; 

export default function Dashboard(){
  const { data: session } = useSession();
  const token = session?.user?.token;
  const [cardData, setCardData] = useState();
  const [chartData, setChartData] = useState([]);
  
  const chartConfig = {
    Reimburesent: {
      label: "Reimburesent",
      color: "hsl(var(--chart-1))",
    },
    PaymentProcess: {
      label: "Payment Process",
      color: "hsl(var(--chart-2))",
    },
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const amountData = await fetchAmount({ token });
        setCardData([
          {
            label: "Permintaan Tertunda",
            amount: amountData.data.approval,
            image: "./Vector.png",
            color: colorStyles[0],
          },
          {
            label: "Permintaan yang Disetujui",
            amount: amountData.data.denied,
            image: "./CekCircle.png",
            color: colorStyles[1],
          },
          {
            label: "Permintaan yang Ditolak",
            amount: amountData.data.process,
            image: "./VectorX.png",
            color: colorStyles[2],
          },
          {
            label: "Jumlah (Rp)",
            amount: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amountData.data.amount),
            image: "./Rp.png",
            color: colorStyles[3],
          },
        ]);

        const dashboardData = await fetchDashboard({ token });
        const formattedChartData = dashboardData.data.chart.map((item) => ({
          month: item.month,
          Reimburesent: item.types.Reimburesent,
          PaymentProcess: item.types["Payment Process"],
        }));
        setChartData(formattedChartData);
      } catch (error) {
        console.error('Gagal mengambil data:', error);
      }
    };

    if (token) {
      loadData();
    }
  }, [token]);

  const formatYAxisTick = (value) => {
    return value.toString(); // Mengembalikan angka apa adanya
  };

  return (
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
              image={d.image}
              color={d.color}
            />
          ))}
        </section>
        <section>
          <CardContent>
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
            <ChartContainer config={chartConfig}>
              <BarChart data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  stroke="#888888"
                  fontSize={12}
                  tickFormatter={formatYAxisTick}
                  domain={[0, 'auto']}
                  allowDecimals={false}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dashed" />}
                />
                <Bar dataKey="Reimburesent" fill="#28A745" radius={4} />
                <Bar dataKey="PaymentProcess" fill="#2563EB" radius={4} />
              </BarChart>
            </ChartContainer>
            <div className="flex justify-center items-center space-x-4">
              <p className="flex items-center font-semibold text-sm">
                <Circle className="h-4 w-4 mr-2 fill-green-600" style={{ color: "#28A745" }} barSize={20} /> Reimburesent
              </p>
              <p className="flex items-center font-semibold text-sm">
                <Circle className="h-4 w-4 mr-2 fill-blue-600" style={{ color: "#2563EB" }} barSize={20} /> Payment Process
              </p>
            </div>
          </CardContent>
        </section>
      </div>
    </div>
  );
}
