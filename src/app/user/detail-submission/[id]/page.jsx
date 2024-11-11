'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, ChevronRight, CircleUserRound, Receipt } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchSubmissionUserDetail } from "../../apiService";
import { formatCurrency } from "@/app/utils/formatCurrency";

export default function DetailSubmission() {
  const { data: session } = useSession();
  const token = session?.user?.token;
  const {id} = useParams()
  const [detail, setDetail] = useState()
  
  useEffect(() => {
    const loadDetail = async () => {
      if (token && id) {
        const response = await fetchSubmissionUserDetail({ token, id });
        console.log(response)
        setDetail(response?.data);
      }
    };

    loadDetail();
  }, [token, id]);

  const items = detail?.items || [];
  const totalAmount = items.reduce((acc, item) => acc + (item.quantity * item.price), 0)

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
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="">
                  <div className="text-xs mb-2 grid grid-cols-2">
                    <div className="text-muted-foreground">Tanggal</div>
                    <div className="font-semibold">{new Date(detail?.submission_date).toLocaleDateString()}</div>
                  </div>
                  <div className="text-xs mb-2 grid grid-cols-2">
                    <div className="text-muted-foreground">Tujuan Pembayaran/Pengeluaran</div>
                    <div className="font-semibold">{detail?.purpose}</div>
                  </div>
                  <div className="text-xs mb-2 grid grid-cols-2">
                    <div className="text-muted-foreground">Tanggal Pembayaran</div>
                    <div className="font-semibold">{new Date(detail?.due_date).toLocaleDateString()}</div>
                  </div>
                  <div className="text-xs mb-2 grid grid-cols-2">
                  <div className="text-muted-foreground">Tipe</div>
                  <div
                    className={`font-semibold w-[90px] rounded text-white px-1 ${
                      detail?.type === 'Reimburesent' ? 'bg-green-500' : 
                      detail?.type === 'Payment Process' ? 'bg-blue-500' : ''
                    }`}
                  >
                    {detail?.type}
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
                    <div className="font-semibold">{detail?.bank_account.bank.name}</div>
                  </div>
                  <div className="text-xs mb-2 grid grid-cols-2">
                    <div className="text-muted-foreground">Nama Pemilik Rekening</div>
                    <div className="font-semibold">{detail?.bank_account.account_name}</div>
                  </div>
                  <div className="text-xs mb-2 grid grid-cols-2">
                    <div className="text-muted-foreground">Nomor Rekening</div>
                    <div className="font-semibold">{detail?.bank_account.account_number}</div>
                  </div>
                  <div className="text-xs mb-2 grid grid-cols-2">
                    <div className="text-muted-foreground">Jumlah (Rp)</div>
                    <div className="font-semibold">{formatCurrency(detail?.amount)}</div>
                  </div>
                </div>
              </div>

                <ul className="flex justify-center items-center">
                  <li className="md:shrink md:basis-0 flex-1 group flex gap-x-2 md:block">
                    <div className="min-w-7 min-h-7 flex flex-col items-center md:w-full md:inline-flex md:flex-wrap md:flex-row text-xs align-middle">
                      <span className="size-7 flex justify-center items-center shrink-0 border rounded-full w-[45px] h-[45px]">
                        <CircleUserRound className="h-5 w-5 text-green-400" />
                      </span>
                      <div className="mt-2 w-px h-full md:mt-0 md:ms-2 md:w-full md:h-px md:flex-1 bg-gray-200 group-last:hidden dark:bg-neutral-700"></div>
                    </div>
                    <div className="grow md:grow-0 md:mt-3 pb-5 flex flex-col">
                      <span className="block text-sm font-medium text-gray-800 dark:text-white">
                        Step
                      </span>
                      <p className="text-sm text-gray-500 dark:text-neutral-500">
                        This is a 
                      </p>
                    </div>
                  </li>
                  <li className="md:shrink md:basis-0 flex-1 group flex gap-x-2 md:block">
                    <div className="min-w-7 min-h-7 flex flex-col items-center md:w-full md:inline-flex md:flex-wrap md:flex-row text-xs align-middle">
                      <span className="size-7 flex justify-center items-center shrink-0 border rounded-full w-[45px] h-[45px]">
                        <CircleUserRound className="h-5 w-5 text-green-400" />
                      </span>
                      <div className="mt-2 w-px h-full md:mt-0 md:ms-2 md:w-full md:h-px md:flex-1 bg-gray-200 group-last:hidden dark:bg-neutral-700"></div>
                    </div>
                    <div className="grow md:grow-0 md:mt-3 pb-5">
                      <span className="block text-sm font-medium text-gray-800 dark:text-white">
                        Step
                      </span>
                      <p className="text-sm text-gray-500 dark:text-neutral-500">
                        This is a 
                      </p>
                    </div>
                  </li>
                  <li className="md:shrink md:basis-0 flex-1 group flex gap-x-2 md:block">
                    <div className="min-w-7 min-h-7 flex flex-col items-center md:w-full md:inline-flex md:flex-wrap md:flex-row text-xs align-middle">
                      <span className="size-7 flex justify-center items-center shrink-0 border rounded-full w-[45px] h-[45px]">
                        <CircleUserRound className="h-5 w-5 text-green-400" />
                      </span>
                      <div className="mt-2 w-px h-full md:mt-0 md:ms-2 md:w-full md:h-px md:flex-1 bg-gray-200 group-last:hidden dark:bg-neutral-700"></div>
                    </div>
                    <div className="grow md:grow-0 md:mt-3 pb-5">
                      <span className="block text-sm font-medium text-gray-800 dark:text-white">
                        Step
                      </span>
                      <p className="text-sm text-gray-500 dark:text-neutral-500">
                        This is a 
                      </p>
                    </div>
                  </li>
                  <li className="md:shrink md:basis-0 flex-1 group flex gap-x-2 md:block">
                    <div className="min-w-7 min-h-7 flex flex-col items-center md:w-full md:inline-flex md:flex-wrap md:flex-row text-xs align-middle">
                      <span className="size-7 flex justify-center items-center shrink-0 border rounded-full w-[45px] h-[45px]">
                        <CircleUserRound className="h-5 w-5 text-green-400" />
                      </span>
                      <div className="mt-2 w-px h-full md:mt-0 md:ms-2 md:w-full md:h-px md:flex-1 bg-gray-200 group-last:hidden dark:bg-neutral-700"></div>
                    </div>
                    <div className="grow md:grow-0 md:mt-3 pb-5">
                      <span className="block text-sm font-medium text-gray-800 dark:text-white">
                        Step
                      </span>
                      <p className="text-sm text-gray-500 dark:text-neutral-500">
                        This is a 
                      </p>
                    </div>
                  </li>
                  <li className="md:shrink md:basis-0 flex-1 group flex gap-x-2 md:block">
                    <div className="min-w-7 min-h-7 flex flex-col items-center md:w-full md:inline-flex md:flex-wrap md:flex-row text-xs align-middle">
                      <span className="size-7 flex justify-center items-center shrink-0 border rounded-full w-[45px] h-[45px]">
                        <CircleUserRound className="h-5 w-5 text-green-400" />
                      </span>
                      <div className="mt-2 w-px h-full md:mt-0 md:ms-2 md:w-full md:h-px md:flex-1 bg-gray-200 group-last:hidden dark:bg-neutral-700"></div>
                    </div>
                    <div className="grow md:grow-0 md:mt-3 pb-5">
                      <span className="block text-sm font-medium text-gray-800 dark:text-white">
                        Step
                      </span>
                      <p className="text-sm text-gray-500 dark:text-neutral-500">
                        This is a 
                      </p>
                    </div>
                  </li>
                  
                </ul>

                <div className="flex flex-col mb-4">
                <div className="flex items-center border-t justify-between w-full py-2">
                  <p className="font-normal text-sm w-1/4">DESKRIPSI</p>
                  <h6 className="font-normal text-sm w-1/6 text-gray-900 text-center">KUANTITAS</h6>
                  <h6 className="font-normal text-sm w-1/6 text-gray-900 text-center">HARGA</h6>
                  <h6 className="font-normal text-sm w-1/6 text-gray-900 text-center">TOTAL</h6>
                </div>

                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between border-t w-full py-2">
                    <p className="font-normal text-sm w-1/4">{item.description || 'N/A'}</p>
                    <h6 className="font-normal text-sm w-1/6 text-center text-gray-900">{item.quantity}</h6>
                    <h6 className="font-normal text-sm w-1/6 text-center text-red-600">
                      Rp. {item.price.toLocaleString('id-ID')}
                    </h6>
                    <h6 className="font-normal text-sm w-1/6 text-center text-red-600">
                      Rp. {(item.quantity * item.price).toLocaleString('id-ID')}
                    </h6>
                  </div>
                ))}

                <hr className="my-4" />

                <div className="flex items-center w-full justify-between">
                  <p className="text-sm font-bold w-1/4">Total</p>
                  <h6 className="text-sm font-bold w-1/6 text-center">Rp. {totalAmount.toLocaleString('id-ID')}</h6>
                </div>
              </div>
              {/* <div className="flex justify-center items-center">

                <div className="grid grid-cols-9 justify-center items-center">
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
              <div className="flex justify-center items-center">
                <div className="grid grid-cols-9 justify-center items-center">
                      <div className="text-center w-[80px] break-words">
                        <span>apalah</span>
                      </div>
                      <div>
                        
                      </div>
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
              </div> */}



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
