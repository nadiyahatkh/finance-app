import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

export default function DetailSubmission(){
    return(
        <div className="py-4">
            <div className="max-w-7xl w-full mx-auto">
            <p className="title font-manrope font-bold text-2xl leading-10">Pengajuan Pembayaran/Reimbursement</p>
            <p className="title text-muted-foreground text-sm mb-5">Pengajuan Detail</p>
            <Card className="py-4">
                <CardContent>
                    <div className="flex justify-between">
                        <div className="w-1/4">
                            <div className="flex text-sm mb-2">
                                <div className="text-muted-foreground w-2/5">Tanggal</div>
                                <div className="font-semibold w-3/5">Pengajuan</div>
                            </div>
                            <div className="flex text-sm mb-2">
                                <div className="text-muted-foreground w-2/5">Tujuan Pembayaran/Pengeluaran</div>
                                <div className="font-semibold w-3/5">Waktu Pengajuan</div>
                            </div>
                            <div className="flex text-sm mb-2">
                                <div className="text-muted-foreground w-2/5">Tanggal Pembayaran</div>
                                <div className="font-semibold w-3/5">Waktu Pengajuan</div>
                            </div>
                            <div className="flex text-sm mb-2">
                                <div className="text-muted-foreground w-2/5">Tipe</div>
                                <div className="font-semibold w-3/5 bg-green-500 rounded text-white">Reimbursement</div>
                            </div>
                            <div className="flex text-sm mb-2">
                                <div className="text-muted-foreground w-2/5">Bukti</div>
                                <div className="font-semibold w-3/5">Lihat Bukti</div>
                            </div>
                        </div>
                        <div className="w-1/4">
                            <div className="flex text-sm mb-2">
                                <div className="text-muted-foreground w-1/4">Nama Bank</div>
                                <div className="font-semibold w-2/4">Bank Mandiri</div>
                            </div>
                            <div className="flex text-sm mb-2">
                                <div className="text-muted-foreground w-1/4">Nama Pemilik Rekening</div>
                                <div className="font-semibold w-2/4">Ontario Branch</div>
                            </div>
                            <div className="flex text-sm mb-2">
                                <div className="text-muted-foreground w-1/4">Nomor Rekening</div>
                                <div className="font-semibold w-2/4">16073434121</div>
                            </div>
                            <div className="flex text-sm mb-2">
                                <div className="text-muted-foreground w-1/4">Jumlah (Rp)</div>
                                <div className="font-semibold w-2/4">Rp. 2.997.000</div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            </div>
        </div>
    )
}