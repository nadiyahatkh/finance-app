import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, ChevronRight, CircleUserRound, Receipt } from "lucide-react";

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
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="">
                  <div className="text-xs mb-2 grid grid-cols-2">
                    <div className="text-muted-foreground">Tanggal</div>
                    <div className="font-semibold">Pengajuan</div>
                  </div>
                  <div className="text-xs mb-2 grid grid-cols-2">
                    <div className="text-muted-foreground">Tujuan Pembayaran/Pengeluaran</div>
                    <div className="font-semibold">Waktu Pengajuan</div>
                  </div>
                  <div className="text-xs mb-2 grid grid-cols-2">
                    <div className="text-muted-foreground">Tanggal Pembayaran</div>
                    <div className="font-semibold">Waktu Pengajuan</div>
                  </div>
                  <div className="text-xs mb-2 grid grid-cols-2">
                    <div className="text-muted-foreground">Tipe</div>
                    <div className="font-semibold bg-green-500 w-40 rounded text-white p-1">
                      Request Payment
                    </div>
                  </div>
                  <div className="text-xs mb-2 grid grid-cols-2">
                    <div className="text-muted-foreground">Bukti</div>
                    <div className="font-semibold">Lihat Bukti</div>
                  </div>
                </div>
                <div className="">
                  <div className="text-xs mb-2 grid grid-cols-2">
                    <div className="text-muted-foreground">Nama Bank</div>
                    <div className="font-semibold">Bank Mandiri</div>
                  </div>
                  <div className="text-xs mb-2 grid grid-cols-2">
                    <div className="text-muted-foreground">Nama Pemilik Rekening</div>
                    <div className="font-semibold">Ontario Branch</div>
                  </div>
                  <div className="text-xs mb-2 grid grid-cols-2">
                    <div className="text-muted-foreground">Nomor Rekening</div>
                    <div className="font-semibold">16073434121</div>
                  </div>
                  <div className="text-xs mb-2 grid grid-cols-2">
                    <div className="text-muted-foreground">Jumlah (Rp)</div>
                    <div className="font-semibold">Rp. 2.997.000</div>
                  </div>
                </div>
                <div className="flex justify-end"> 
                  <Button className="mr-2">Tolak</Button>
                  <Button>Terima</Button> 
                </div>
              </div>
              <div className="flex justify-center items-center mb-4">

                <div className="grid grid-cols-10 gap-4 justify-center items-center">
                      <div className="rounded-full flex justify-center items-center border-2 border-green-400 w-[45px] h-[45px]">
                          <CircleUserRound className="h-5 w-5 text-green-400" />
                      </div>  
                      <hr className="border-green-400" />
                      <div className="rounded-full flex justify-center items-center border-2 border-green-400 w-[45px] h-[45px]">
                          <CircleUserRound className="h-5 w-5 text-green-400" />
                      </div>  
                      <hr className="border-green-400" />
                      <div className="rounded-full flex justify-center items-center border-2 border-green-400 w-[45px] h-[45px]">
                          <CircleUserRound className="h-5 w-5 text-green-400" />
                      </div>  
                      <hr className="border-green-400" />
                      <div className="rounded-full flex justify-center items-center border-2 border-green-400 w-[45px] h-[45px]">
                          <CircleUserRound className="h-5 w-5 text-green-400" />
                      </div>  
                      <div className="border border-green-400 W-[55px]"></div>
                      <div className="rounded-full flex justify-center items-center border-2 border-green-400 w-[45px] h-[45px]">
                          <CircleUserRound className="h-5 w-5 text-green-400" />
                      </div>
                </div>
              </div>
              {/* <div className="flex justify-center items-center mb-4">

                <div className="flex items-center">
                  <div className="flex flex-col">
                    <div className="flex items-center">

                    <div className="rounded-full flex justify-center items-center border-2 border-green-400 w-[45px] h-[45px]">
                        <Receipt className="h-5 w-5 text-green-400" />
                    </div>
                    <div className="border border-green-400 w-[100px]"></div>
                    </div>
                  <span style={{ marginLeft:-10 }}>testjjkjjkjk</span>

                  </div>

                </div>
                    <div className="rounded-full flex justify-center items-center border-2 border-green-400 w-[45px] h-[45px]">
                        <CircleUserRound className="h-5 w-5 text-green-400" />
                    </div>  
                    <div className="border border-green-400 w-[100px]"></div>
                    <div className="rounded-full flex justify-center items-center border-2 border-green-400 w-[45px] h-[45px]">
                        <CircleUserRound className="h-5 w-5 text-green-400" />
                    </div>
                    <div className="border border-red-400 w-[100px]"></div>
                    <div className="rounded-full flex justify-center items-center border-2 border-red-400 w-[45px] h-[45px]">
                        <CircleUserRound className="h-5 w-5 text-muted-foreground text-red-400" />
                    </div>
                    <div className="border w-[100px]"></div>
                    <div className="rounded-full flex justify-center items-center border-2 w-[45px] h-[45px]">
                        <CircleUserRound className="h-5 w-5 text-muted-foreground" />
                    </div>
              </div> */}
              {/* <div className="grid grid-cols-5 gap-4 justify-content-center">
                    <div className="">
                        <span>Test</span>
                        
                    </div>
                    <div>
                        <span>Test</span>
                        
                    </div>
                    <div>
                        <span>Test</span>
                        
                    </div>
                    <div>
                        <span>Test</span>
                        
                    </div>
                    <div>
                        <span>Test</span>
                        
                    </div>
              </div> */}

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
