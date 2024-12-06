'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, ChevronRight, CircleUserRound, Receipt } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchSubmissionUserDetail } from "../../apiService";
import { formatCurrency } from "@/app/utils/formatCurrency";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay"
import Image from "next/image";

export default function DetailSubmission() {
  const { data: session } = useSession();
  const token = session?.user?.token;
  const {id} = useParams()
  const [detail, setDetail] = useState()
  const [file, setFile] = useState()
  
  useEffect(() => {
    const loadDetail = async () => {
      if (token && id) {
        const response = await fetchSubmissionUserDetail({ token, id });
        setDetail(response?.data.submission);
        setFile(response?.data.submission.proofs)
      }
    };

    loadDetail();
  }, [token, id]);

  const steps = [
    { role: "Pengajuan dibuat", role_id: null },
    { role: "General Affairs", role_id: 3 },
    { role: "Manager", role_id: 2 },
    { role: "CEO", role_id: 1 },
    { role: "Head of FAT", role_id: 4 },
  ];
  
  const userPositionName = detail?.user?.position?.name; // Contoh: "Manager"

// Filter langkah sesuai posisi
let filteredSteps;

if (userPositionName === "GA") {
  filteredSteps = steps.filter((step) =>
    ["Pengajuan dibuat", "Manager", "CEO", "Head of FAT"].includes(step.role)
  );
} else if (userPositionName === "Manager") {
  filteredSteps = steps.filter((step) =>
    ["Pengajuan dibuat", "CEO", "Head of FAT"].includes(step.role)
  );
} else if (userPositionName === "CEO") {
  filteredSteps = steps.filter((step) =>
    ["Pengajuan dibuat", "Head of FAT"].includes(step.role)
  );
} else if (userPositionName === "Finance") {
  filteredSteps = steps.filter((step) =>
    ["Pengajuan dibuat", "Head of FAT"].includes(step.role)
  );
} else {
  filteredSteps = steps; // Default: Tampilkan semua langkah jika posisi tidak ditentukan
}
  

  const images = detail?.files?.map(file => file.image_urls)?.flat() || [];
  const pdfs = detail?.files?.map(file => file.pdf_urls)?.flat() || [];
  const files = file?.map(file => file.url)?.flat() || [];

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
                    <div className="font-semibold">
                    {detail?.submission_date
                      ? `${new Date(detail.submission_date).toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }).replace(/\//g, '-')}, ${new Date(detail.submission_date).toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })} WIB`
                      : ""}
                  </div>
                  </div>
                  <div className="text-xs mb-2 grid grid-cols-2">
                    <div className="text-muted-foreground">Tujuan Pembayaran/Pengeluaran</div>
                    <div className="font-semibold">{detail?.purpose}</div>
                  </div>
                  <div className="text-xs mb-2 grid grid-cols-2">
                    <div className="text-muted-foreground">Tanggal Pembayaran</div>
                    <div className="font-semibold">
                      {detail?.due_date ? 
                        `${new Date(detail.submission_date).toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }).replace(/\//g, '-')}` : ""
                      }
                    </div>
                  </div>
                  <div className="text-xs mb-2 grid grid-cols-2">
                  <div className="text-muted-foreground">Tipe</div>
                  <div
                    className={`font-semibold w-[90px] rounded text-white px-1 ${
                      detail?.type === 'Reimbursement' ? 'bg-green-500' : 
                      detail?.type === 'Payment Request' ? 'bg-blue-500' : ''
                    }`}
                  >
                    {detail?.type}
                  </div>
                </div>
                    {images.length > 0 ? (
                <div className="text-xs mb-2 grid grid-cols-2">
                  <div className="text-muted-foreground">Bukti</div>
                  <div className="font-semibold">
                      <Dialog >
                          <DialogTrigger>
                            <span className="h-4 w-4 p-0 cursor-pointer">Lihat</span>
                          </DialogTrigger>
                          <DialogContent className="flex items-center justify-center">
                            <div className="w-full max-w-xs">
                              <Carousel
                                plugins={[Autoplay({ delay: 2000 })]}
                                className="w-full"
                                >
                                <CarouselContent>
                                {images.map((image, index) => (
                                  <CarouselItem key={index}>
                                    <div className="p-1">
                                      <Card>
                                        <CardContent className="flex aspect-square items-center justify-center p-0">
                                          <img
                                            src={image}
                                            alt={`${index}`}
                                            width={500}
                                            height={500}
                                            className="w-full h-full object-cover rounded"
                                          />
                                        </CardContent>
                                      </Card>
                                    </div>
                                  </CarouselItem>
                                ))}
                                </CarouselContent>
                                <CarouselPrevious />
                                <CarouselNext />
                              </Carousel>
                            </div>
                          </DialogContent>
                        </Dialog>
                  </div>
                  </div>
                    ) : (
                      ""
                    )}
                <div className="text-xs mb-2 grid grid-cols-2">
                  <div className="text-muted-foreground">Bukti Transfer</div>
                  <div className="font-semibold">
                    {files.length > 0 ? (
                      <Dialog>
                          <DialogTrigger>
                            <span className="h-4 w-4 p-0 cursor-pointer">Lihat</span>
                          </DialogTrigger>
                          <DialogContent className="flex items-center justify-center">
                            <div className="w-full max-w-xs">
                              <Carousel
                                plugins={[Autoplay({ delay: 2000 })]}
                                className="w-full"
                                >
                                <CarouselContent>
                                {files.map((image, index) => (
                                  <CarouselItem key={index}>
                                    <div className="p-1">
                                      <Card>
                                        <CardContent className="flex aspect-square items-center justify-center p-0">
                                          <img
                                            src={image}
                                            alt={`${index}`}
                                            width={500}
                                            height={500}
                                            className="w-full h-full object-cover rounded"
                                          />
                                        </CardContent>
                                      </Card>
                                    </div>
                                  </CarouselItem>
                                  ))}
                                </CarouselContent>
                                <CarouselPrevious />
                                <CarouselNext />
                              </Carousel>
                            </div>
                          </DialogContent>
                        </Dialog>
                    ) : (
                      "Belum di setujui"
                    )}
                  </div>
                </div>
                </div>
                <div className="">
                  <div className="text-xs mb-2 grid grid-cols-2">
                    <div className="text-muted-foreground">Nama Bank</div>
                    <div className="font-semibold">{detail?.bank_name}</div>
                  </div>
                  <div className="text-xs mb-2 grid grid-cols-2">
                    <div className="text-muted-foreground">Nama Pemilik Rekening</div>
                    <div className="font-semibold">{detail?.account_name}</div>
                  </div>
                  <div className="text-xs mb-2 grid grid-cols-2">
                    <div className="text-muted-foreground">Nomor Rekening</div>
                    <div className="font-semibold">{detail?.account_number}</div>
                  </div>
                  <div className="text-xs mb-2 grid grid-cols-2">
                    <div className="text-muted-foreground">Jumlah (Rp)</div>
                    <div className="font-semibold">{formatCurrency(detail?.amount)}</div>
                  </div>
                  {pdfs.length > 0 ? (
                    <div className="text-xs mb-2 grid grid-cols-2">
                      <div className="text-muted-foreground">Bukti Pdf</div>
                      <div className="font-semibold">
                      {pdfs.map((pdfUrl, index) => (
                          <a
                            key={index}
                            href={pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline"
                            download
                          >
                            Download PDF
                          </a>
                        ))}
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <ul className="relative flex flex-col md:flex-row gap-2">
                {filteredSteps.map((step, index) => {
                  const approval = detail?.admin_approvals?.find(
                    (approval) => approval.user?.role_id === step.role_id
                  );

                  const isFirstStep = index === 0;
                  const isApproved = approval?.status === "approved" || isFirstStep;
                  const isDenied = approval?.status === "denied";

                  const borderColor = isDenied
                    ? "border-red-400"
                    : isApproved
                    ? "border-green-400"
                    : "border-gray-200";
                  const iconColor = isDenied
                    ? "text-red-400"
                    : isApproved
                    ? "text-green-400"
                    : "text-gray-200";
                  const bgColor = isDenied
                    ? "bg-red-400"
                    : isApproved
                    ? "bg-green-400"
                    : "bg-gray-200";

                  const displayDate =
                    isFirstStep && detail?.created_at
                      ? new Date(detail.created_at).toLocaleString("id-ID", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "";

                  return (
                    <li
                      key={index}
                      className="md:shrink md:basis-0 flex-1 group flex gap-x-2 md:block"
                    >
                      <div className="min-w-7 min-h-7 flex flex-col items-center md:w-full md:inline-flex md:flex-wrap md:flex-row text-xs align-middle">
                        <span
                          className={`size-7 flex justify-center items-center shrink-0 border ${borderColor} rounded-full w-[45px] h-[45px]`}
                        >
                          {isFirstStep ? (
                            <Receipt className={`h-5 w-5 ${iconColor}`} />
                          ) : (
                            <CircleUserRound className={`h-5 w-5 ${iconColor}`} />
                          )}
                        </span>
                        <div
                          className={`mt-2 w-px h-full md:mt-0 md:ms-2 md:w-full md:h-px md:flex-1 ${bgColor} group-last:hidden dark:bg-neutral-700`}
                        ></div>
                      </div>
                      <div className="grow md:grow-0 md:mt-3 pb-5 flex flex-col">
                        {isFirstStep ? (
                          <>
                            <span className="block text-xs font-medium text-gray-800 dark:text-white">
                              Pengajuan dibuat
                            </span>
                            <p className="text-xs text-gray-500 dark:text-neutral-500">
                              {displayDate}
                            </p>
                          </>
                        ) : (
                          <>
                            <span className="block text-xs font-medium text-gray-800 dark:text-white">
                              {isDenied ? "Denied" : isApproved ? "Approved" : "Menunggu"}
                            </span>
                            <p className="text-xs text-gray-500 dark:text-neutral-500">
                              {step.role}
                            </p>
                          </>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="flex justify-center items-center mb-4">
                {detail?.admin_approvals?.map((approval) => (
                    approval.status === 'denied' && approval.notes ? (
                      <div key={approval.id} className="text-red-500 mt-2">
                        *Catatan: {approval.notes} ({approval.user.role.name})
                      </div>
                    ) : null
                  ))}
              </div>

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
              

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
