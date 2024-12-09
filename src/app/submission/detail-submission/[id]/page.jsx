'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, ChevronRight, CircleUserRound, CircleX, Receipt } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { formatCurrency } from "@/app/utils/formatCurrency";
import { approvedSubmission, checkBoxFinance, deniedSubmission, fetchSubmissionDetail, proofImage } from "../../apiService";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Hearts, ThreeDots } from "react-loader-spinner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay"
import { Checkbox } from "@/components/ui/checkbox";

export default function DetailSubmission() {
  const { data: session } = useSession();
  const token = session?.user?.token;
  const {id: submissionId} = useParams()
  const currentAdminId = session?.user?.id;
  const [notes, setNotes] = useState('');
  const [currentApplicantId, setCurrentApplicantId] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [loadingStatus, setLoadingStatus] = useState({});
  const [isLoading, setIsLoading] = useState(false)
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openSuccessDenied, setOpenSuccessDenied] = useState(false)
  const [openError, setOpenError] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);
  const [detail, setDetail] = useState()
  const router = useRouter();
  const [showActions, setShowActions] = useState(true);
  const role = session?.user?.role
  const [isDialogOpenUpload, setIsDialogOpenUpload] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loadingUpload, setLoadingUpload] = useState(false)
  const [openSuccesUpload, setOpenSuccesUpload ] = useState(false)
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false); 
  const [file, setFile] = useState()
  const [isOpenDialogApprove, setIsOpenDialogApproved] = useState(false)
  
  const loadDetail = async () => {
    if (token && submissionId) {
      const response = await fetchSubmissionDetail({ token, id: submissionId });
      setDetail(response?.submission);
        setFile(response?.submission?.proofs)
        const adminApproval = response?.submission?.admin_approvals?.find(
          (approval) => approval.user_id === currentAdminId
        );
        if (adminApproval && (adminApproval.status === 'approved' || adminApproval.status === 'denied')) {
          setShowActions(false);
        }

        if (adminApproval) {
          setIsChecked(adminApproval.is_checked === true);
        }
      }
    };

    useEffect(() => {
    if(token) {

      loadDetail();
    }
  }, [token, submissionId, currentAdminId]);

  const items = detail?.items || [];
  const totalAmount = items.reduce((acc, item) => acc + (item.quantity * item.price), 0)

  const handleAccept = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await approvedSubmission({ id: submissionId, token });
      setIsOpenDialogApproved(false)
      setOpenSuccess(true);
      loadDetail()
    } catch (error) {
      const message = JSON.parse(error.message);
      setErrorMessages(Object.values(message).flat());
      setOpenError(true);
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeny = async (event) => {
    event.preventDefault();

    if (!currentApplicantId || !notes) return;

    setLoadingStatus((prevState) => ({ ...prevState, [currentApplicantId]: true }));
    try {
      await deniedSubmission({ id: currentApplicantId, token, notes });
      setOpenSuccessDenied(true)
    } catch (error) {
      console.error('Error denying applicant:', error);
    } finally {
      setLoadingStatus((prevState) => ({ ...prevState, [currentApplicantId]: false }));
      setNotes('');
      setCurrentApplicantId(null);
      setIsDialogOpen(false); 
    }
  };

  const steps = [
    { role: "Pengajuan dibuat", role_id: null },
    { role: "General Affairs", role_id: 3 },
    { role: "Manager", role_id: 2 },
    { role: "CEO", role_id: 1 },
    { role: "Head of FAT", role_id: 4 },
  ];
  
  const userPositionName = detail?.user?.position?.name;
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
    filteredSteps = steps; 
  }

  const images = detail?.files?.map(file => file.image_urls)?.flat() || [];
  const pdfs = detail?.files?.map(file => file.pdf_urls)?.flat() || [];
  const imagesProofs = detail?.proofs?.map(file => file.image_urls)?.flat() || [];
  const pdfsProofs = detail?.proofs?.map(file => file.pdf_urls)?.flat() || [];

  

  const handleCheckboxChange = async (event) => {
    const checked = event.target.checked;
    setIsChecked(checked);

    if (checked) {
      setLoading(true);
      try {
        const result = await checkBoxFinance({ token, id: submissionId });
        console.log("API Response:", result);
      } catch (error) {
        console.error("Error calling API:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const uploadFile = async(event) => {
    event.preventDefault();
    setLoadingUpload(true)
  console.log("Upload button clicked");

  if (!selectedFiles || selectedFiles.length === 0) {
    console.error("No files selected");
    setErrorMessages(["Please select a file before uploading"]);
    setOpenError(true);
    return;
  }
    try{
      await proofImage({id: submissionId, token, file: selectedFiles.map(file => file.file)})
      loadDetail()
      setOpenSuccesUpload(true)
    } catch (error) {
      let message = '';
  try {
      const errorDetail = JSON.parse(error.message);
      setErrorMessages(Object.values(errorDetail.errors).flat());
  } catch (e) {
      message = error.message || "An unexpected error occurred.";
      setErrorMessages([message]);
  }

  setOpenError(true);
  console.error('Error creating asset:', error);
  } finally {
    setLoadingUpload(false)
  }
  }
  
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const newFiles = files.map(file => ({ file: file }));
    console.log("New Files: ", newFiles); // Debug file yang dipilih
    setSelectedFiles([...selectedFiles, ...newFiles]);
  };

  const handleRemoveFile = (fileName) => {
    setSelectedFiles(selectedFiles.filter(file => file.file.name !== fileName));
  };

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
                    <div className="text-muted-foreground">Tujuan Pembayaran/ Pengeluaran</div>
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

                {role === 4 && (

                  <div className="text-xs mb-2 grid grid-cols-2">
                      <div className="text-muted-foreground">Bukti Hard Copy</div>
                      <div className="">
                        <div className="items-top flex space-x-2">
                        <input 
                            type="checkbox" 
                            className="peer hidden"
                            id="terms1"
                            checked={isChecked} 
                            onChange={handleCheckboxChange} 
                            disabled={isChecked} 
                          />
                          <label
                            htmlFor="terms1"
                            className="w-5 h-5 border border-gray-300 rounded-sm cursor-pointer peer-checked:bg-[#F9B421] peer-checked:border-[#F9B421] peer-checked:text-white flex items-center justify-center peer-disabled:cursor-not-allowed"
                          >
                            ✓
                            </label>
                        {loading && <span>Loading...</span>}
                        </div>
                      </div>
                    </div>
                )}
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
                    <div className="font-semibold">{detail?.amount ? formatCurrency(detail.amount) : ""}</div>
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

                  {role === 4 && (
                    <>
                    {pdfsProofs.length > 0 ? (
                    <div className="text-xs mb-2 grid grid-cols-2">
                      <div className="text-muted-foreground">Bukti Tf pdf</div>
                      <div className="font-semibold">
                      {pdfsProofs.map((pdfUrl, index) => (
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
                    
                    {imagesProofs.length > 0 ? (
                    <div className="text-xs mb-2 grid grid-cols-2">
                    <div className="text-muted-foreground">Bukti Transfer</div>
                    <div className="font-semibold">
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
                                  {imagesProofs.map((image, index) => (
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
                    
                    </>
                  )}

                </div>

                {role === 4 && detail?.admin_approvals?.some(
                      (approval) => approval.user?.role_id === 4 && approval.status === 'approved'
                    ) && (!file || file.length === 0) && (
                    <div className="text-xs mb-2 grid grid-cols-2">
                      <div className="text-muted-foreground">Upload bukti Tf</div>
                      <div className="font-semibold">
                      <Dialog open={isDialogOpenUpload} onOpenChange={setIsDialogOpenUpload}>
                          <DialogTrigger asChild>
                            <span 
                              className="text-[#F9B421] cursor-pointer"
                            >
                              Upload
                            </span>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>Upload Bukti TF disini</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={uploadFile}>
                              <div className="grid w-full gap-1.5">
                              <input
                                    name="file"
                                    type="file"
                                    accept="image/*,application/pdf"
                                    className="hidden"
                                    id="fileInput"
                                    onChange={handleFileChange}
                                />
                                 <Button type="button" variant="outline" className="mb-4" onClick={() => document.getElementById('fileInput').click()}>Pilih File</Button>
                              </div>
                              {selectedFiles.length > 0 && (
                                        <div className=" space-y-2">
                                            {selectedFiles.map(file => (
                                                <Card key={file.name} className="flex justify-between items-center">
                                                    <span className="text-sm text-muted-foreground p-2">{file.file.name}</span>
                                                    <Button type="button" variant="danger" onClick={() => handleRemoveFile(file.file.name)}>
                                                        <CircleX className="h-4 w-4"/>
                                                    </Button>
                                                </Card>
                                            ))}
                                        </div>
                                    )}
                              <DialogFooter className="mt-4">
                                <Button
                                  variant="outline"
                                  onClick={() => setIsDialogOpenUpload(false)}
                                  type="button"
                                  className="mr-2 shadow-md h-8 w-[20%] text-[#F9B421]"
                                >
                                  Kembali
                                </Button>
                                <Button 
                                  type="submit"
                                  // onClick={() => console.log(form)}
                                  className="text-white h-8 w-[20%] bg-[#F9B421]"
                                  // disabled={loadingStatus[currentApplicantId]}
                                >
                                  {loadingUpload ? (
                                        <ThreeDots
                                        height="20"
                                        width="20"
                                        color="#ffffff"
                                        ariaLabel="loading"
                                        />
                                    ) : (
                                        "Upload"
                                    )}
                                </Button>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  )}

                  {role === 4 && 
                  detail?.admin_approvals?.some(
                    (approval) => approval.user?.role_id === 4 && approval.status === 'approved'
                  ) && 
                  detail?.proofs?.length > 0 && (
                    <div className="text-xs mb-2 grid grid-cols-2">
                      <div className="text-muted-foreground">Print Detail</div>
                      <div className="font-semibold">
                        <button
                          onClick={() => router.push(`/submission/print/${submissionId}`)}
                          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-black"
                        >
                          Print
                        </button>
                      </div>
                    </div>
                  )}

                <div className="flex justify-end">
                  {showActions && (
                    <>
                      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            className="text-[#F9B421]" 
                            onClick={() => setCurrentApplicantId(detail?.id)}
                          >
                            Tolak
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Alasan Penolakan</DialogTitle>
                          </DialogHeader>
                          <form onSubmit={handleDeny}>
                            <div className="grid w-full gap-1.5">
                              <Textarea
                                id="notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                              />
                              <p className="text-sm text-muted-foreground">
                                Tuliskan alasan penolakan pengajuan
                              </p>
                            </div>
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => setIsDialogOpen(false)}
                                type="button"
                                className="mr-2 shadow-md h-8 w-[20%] text-[#F9B421]"
                              >
                                Kembali
                              </Button>
                              <Button 
                                type="submit"
                                className="text-white h-8 w-[20%] bg-[#F9B421]"
                                disabled={loadingStatus[currentApplicantId]}
                              >
                                {loadingStatus[currentApplicantId] ? (
                                  <ThreeDots
                                  height="20"
                                  width="20"
                                  color="#ffffff"
                                  ariaLabel="loading"
                                  />
                                ) : (
                                  'Simpan'
                                )}
                              </Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>


                      <Button
                        onClick={() => setIsOpenDialogApproved(true)}
                        className="ml-2 bg-[#F9B421] hover:bg-[#E5A50F] transition-colors"
                      >
                        Setujui
                      </Button>
                      <AlertDialog open={isOpenDialogApprove} onClose={() => setIsOpenDialogApproved(false)}>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Apakah Anda sudah yakin?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Ingin Mensetujui pengajuan ini?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setIsOpenDialogApproved(false)}>Batal</AlertDialogCancel>
                            <AlertDialogAction disabled={isLoading} onClick={handleAccept} className="bg-[#F9B421]">
                            {isLoading ? (
                              <ThreeDots
                              height="20"
                              width="20"
                              color="#ffffff"
                              ariaLabel="loading"
                              />
                          ) : (
                              "Setujui"
                          )}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
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

                <div className="flex flex-col">
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
              <AlertDialog open={openSuccess} onOpenChange={setOpenSuccess}>
                        <AlertDialogContent className="flex flex-col items-center justify-center text-center">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full" style={{ background: "#DCFCE7" }}>
                                <svg
                                    className="w-6 h-6 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 13l4 4L19 7"
                                    ></path>
                                </svg>
                            </div>
                            <AlertDialogTitle className="">Yeay! Sukses</AlertDialogTitle>
                            <AlertDialogDescription className="">Anda telah berhasil menyetujui pengajuan pembayaran</AlertDialogDescription>
                            <AlertDialogAction
                                onClick={() =>setOpenSuccess(false)}
                                className="w-full bg-[#F9B421]"
                            >
                                Kembali
                            </AlertDialogAction>
                        </AlertDialogContent>
                    </AlertDialog>
                    {/* openSuccesUpload */}
                     <AlertDialog open={openSuccesUpload} onOpenChange={setOpenSuccesUpload}>
                        <AlertDialogContent className="flex flex-col items-center justify-center text-center">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full" style={{ background: "#DCFCE7" }}>
                                <svg
                                    className="w-6 h-6 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 13l4 4L19 7"
                                    ></path>
                                </svg>
                            </div>
                            <AlertDialogTitle className="">Yeay! Sukses</AlertDialogTitle>
                            <AlertDialogDescription className="">Anda telah berhasil mengirim bukti transfer</AlertDialogDescription>
                            <AlertDialogAction
                                onClick={() => setOpenSuccesUpload(false)}
                                className="w-full bg-[#F9B421]"
                            >
                                Kembali
                            </AlertDialogAction>
                        </AlertDialogContent>
                    </AlertDialog>
                    {/* openSuccesUDenied */}
                     <AlertDialog open={openSuccessDenied} onOpenChange={setOpenSuccessDenied}>
                        <AlertDialogContent className="flex flex-col items-center justify-center text-center">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full" style={{ background: "#DCFCE7" }}>
                                <svg
                                    className="w-6 h-6 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 13l4 4L19 7"
                                    ></path>
                                </svg>
                            </div>
                            <AlertDialogTitle className="">Yeay! Sukses</AlertDialogTitle>
                            <AlertDialogDescription className="">Anda telah berhasil menolak pengajuan ini</AlertDialogDescription>
                            <AlertDialogAction
                                onClick={() => router.push('/submission')}
                                className="w-full bg-[#F9B421]"
                            >
                                Kembali
                            </AlertDialogAction>
                        </AlertDialogContent>
                    </AlertDialog>

                    {/* Error Dialog */}
                    <AlertDialog open={openError} onOpenChange={setOpenError}>
                    <AlertDialogContent className="flex flex-col items-center justify-center text-center">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full" style={{ background: "#FEE2E2" }}>
                        <svg
                            className="w-6 h-6 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            ></path>
                        </svg>
                    </div>
                    <AlertDialogTitle>Yahh! Error</AlertDialogTitle>
                        <AlertDialogDescription>
                        <div className="max-h-32 overflow-y-auto font-semibold">
                            {errorMessages.map((message, index) => (
                            <p key={index} className="text-red-500 italic">{message}</p>
                            ))}
                        </div>
                        </AlertDialogDescription>
                        <AlertDialogAction className="w-full bg-[#F9B421]" onClick={() => setOpenError(false)}>Kembali</AlertDialogAction>
                    </AlertDialogContent>
                    </AlertDialog>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
