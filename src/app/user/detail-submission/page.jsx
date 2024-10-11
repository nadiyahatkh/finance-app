import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

export default function DetailSubmission() {
  return (
    <div className="py-4">
      <div className="max-w-7xl w-full mx-auto">
        <p className="title font-manrope font-bold text-2xl leading-10">
          Pengajuan Pembayaran/Reimbursement
        </p>
        <p className="title text-muted-foreground text-sm mb-5">Pengajuan Detail</p>
        <div className="mt-4">
          <Card className="lg:w-5/6 p-4">
            <CardContent className="w-full">
              <div className="grid gap-x-8 gap-y-4 grid-cols-3"> {/* Ubah menjadi 2 kolom */}
                {/* Kolom pertama */}
                <div className="w-full">
                  <div className="flex text-sm mb-2">
                    <div className="text-muted-foreground w-1/3">Tanggal</div> {/* Sesuaikan ukuran */}
                    <div className="font-semibold w-2/3">Pengajuan</div>
                  </div>
                  <div className="flex text-sm mb-2">
                    <div className="text-muted-foreground w-1/3">Tujuan Pembayaran/Pengeluaran</div>
                    <div className="font-semibold w-2/3">Waktu Pengajuan</div>
                  </div>
                  <div className="flex text-sm mb-2">
                    <div className="text-muted-foreground w-1/3">Tanggal Pembayaran</div>
                    <div className="font-semibold w-2/3">Waktu Pengajuan</div>
                  </div>
                  <div className="flex text-sm mb-2">
                    <div className="text-muted-foreground w-1/3">Tipe</div>
                    <div className="font-semibold w-2/3 bg-green-500 rounded text-white">
                      Reimbursement
                    </div>
                  </div> 
                  <div className="flex text-sm mb-2">
                    <div className="text-muted-foreground w-1/3">Bukti</div>
                    <div className="font-semibold w-2/3">Lihat Bukti</div>
                  </div>
                </div>
                {/* Kolom kedua */}
                <div className="w-full">
                  <div className="flex text-sm mb-2">
                    <div className="text-muted-foreground w-1/3">Nama Bank</div>
                    <div className="font-semibold w-2/3">Bank Mandiri</div>
                  </div>
                  <div className="flex text-sm mb-2">
                    <div className="text-muted-foreground w-1/3">Nama Pemilik Rekening</div>
                    <div className="font-semibold w-2/3">Ontario Branch</div>
                  </div>
                  <div className="flex text-sm mb-2">
                    <div className="text-muted-foreground w-1/3">Nomor Rekening</div>
                    <div className="font-semibold w-2/3">16073434121</div>
                  </div>
                  <div className="flex text-sm mb-2">
                    <div className="text-muted-foreground w-1/3">Jumlah (Rp)</div>
                    <div className="font-semibold w-2/3">Rp. 2.997.000</div>
                  </div>
                </div>
              <div className="flex justify-end"> {/* Atur margin agar tombol lebih ke bawah */}
                <Button className="mr-2">Tolak</Button>
                <Button>Terima</Button> {/* Ubah tombol untuk perbedaan aksi */}
              </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
