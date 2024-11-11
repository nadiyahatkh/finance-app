'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, ChevronRight, CircleUserRound, Receipt } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { formatCurrency } from "@/app/utils/formatCurrency";
import { approvedSubmission, deniedSubmission, fetchSubmissionDetail } from "../../apiService";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Hearts, ThreeDots } from "react-loader-spinner";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from "@/components/ui/alert-dialog";

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
  const [openError, setOpenError] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);
  const [detail, setDetail] = useState()
  const router = useRouter();
  const [showActions, setShowActions] = useState(true);
  
  useEffect(() => {
    const loadDetail = async () => {
      if (token && submissionId) {
        const response = await fetchSubmissionDetail({ token, id: submissionId });
        console.log(response);
        setDetail(response?.submission);

        // Check if the current admin has already approved or denied
        const adminApproval = response?.submission?.admin_approvals?.find(
          (approval) => approval.user_id === currentAdminId
        );
        if (adminApproval && (adminApproval.status === 'approved' || adminApproval.status === 'denied')) {
          setShowActions(false); // Hide the buttons if already approved/denied by the current admin
        }
      }
    };

    loadDetail();
  }, [token, submissionId, currentAdminId]);

  const items = detail?.items || [];
  const totalAmount = items.reduce((acc, item) => acc + (item.quantity * item.price), 0)

  const handleAccept = async () => {
    setIsLoading(true)
    try {
      await approvedSubmission({ id: submissionId, token });
      setOpenSuccess(true)
    } catch (error) {
      const message = JSON.parse(error.message);
          setErrorMessages(Object.values(message).flat());
          setOpenError(true);
          console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false)
    }
  };

  const handleDeny = async (event) => {
    event.preventDefault(); // Prevent default form submission

    if (!currentApplicantId || !notes) return; // Ensure we have an ID and notes

    setLoadingStatus((prevState) => ({ ...prevState, [currentApplicantId]: true }));
    try {
      await deniedSubmission({ id: currentApplicantId, token, notes });
      router.push('/submission');
        
      
    } catch (error) {
      console.error('Error denying applicant:', error);
    } finally {
      setLoadingStatus((prevState) => ({ ...prevState, [currentApplicantId]: false }));
      setNotes(''); // Clear notes after submission
      setCurrentApplicantId(null);
      setIsDialogOpen(false); 
    }
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
                        onClick={handleAccept}
                        className="ml-2 bg-[#F9B421] hover:bg-[#E5A50F] transition-colors"
                      >
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
                      </Button>
                    </>
                  )}
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
              {/* Success Dialog */}
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
