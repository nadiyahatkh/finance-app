'use client'

import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, CircleX, Plus, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation"
import { useFieldArray, useForm } from "react-hook-form";
import { ThreeDots } from "react-loader-spinner";
import { z } from "zod";
import { fetchBankDetail, fetchSubmissionUser, submissionDetailId, updateSubmissionUser } from "../../apiService";
import { useEffect, useState } from "react";
import { fetchBanks } from "@/app/apiService";
import { cn } from "@/lib/utils";
import { format } from "date-fns";



export default function UpdateSubmission(){
    const {id} = useParams()
    const { data: session } = useSession();
    const token = session?.user?.token;
    const [transactionType, setTransactionType] = useState()
    const [data, setData] = useState()
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [openSuccess, setOpenSuccess] = useState(false);
    const [openError, setOpenError] = useState(false);
    const [errorMessages, setErrorMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [image, setImage] = useState([]);
    const [pdfFiles, setPdfFiles] = useState([]);
    const [deletedImages, setDeletedImages] = useState([]);
    const router = useRouter()
    const [total, setTotal] = useState(0)

    const FormSchema = z.object({
        due_date: z.date().optional(),
        type: z.string().optional(),
        purpose: z.string().optional(),
        bank_name: z.string().min(1, { message: "Bank is required." }),
        account_name: z.string().min(1, { message: "Account Name is required." }),
        account_number: z.preprocess((val) => Number((val)), z.number().min(1, { message: "Account number must be at least 1" })),
        
        submission_item: z.array(
          z.object({
            description: z.string().optional(),
            quantity: z.preprocess((val) => Number((val)), z.number().optional()),
            price:  z.preprocess((val) => Number(String(val).replace(/[^0-9]/g, '')), z.number().optional()),
          })
        ).optional()
    });

    const form = useForm({
        resolver: zodResolver(FormSchema),
      });

      const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "submission_item",
      });

      useEffect(() => {
        const fetchData = async () => {
          if (token && id) {
            const response = await submissionDetailId({ token, id });
      
            form.setValue('bank_name', response.data.submission.bank_name, { shouldValidate: true });
            form.setValue('account_name', response.data.submission.account_name, { shouldValidate: true });
            form.setValue('account_number', response.data.submission.account_number, { shouldValidate: true });
            form.setValue('purpose', response.data.submission.purpose, { shouldValidate: true });
            form.setValue('due_date', new Date(response.data.submission.due_date), { shouldValidate: true });
            form.setValue('type', response.data.submission.type, { shouldValidate: true });
            remove();
            
            response.data.submission.items.forEach(item => {
              append({
                description: item.description,
                quantity: item.quantity,
                price: item.price,
              });
            });
            setImage(response.data.submission.files?.map(file => file.image)?.flat() || []);
            setPdfFiles(response.data.submission.files?.map(file => file.pdf)?.flat() || []);
            setTransactionType(response.data.submission.type);
          }
        };
      
        fetchData();
      }, [token, id, append, remove, form, setTransactionType, setImage]);
    
      useEffect(() => {
        const loadData = async () => {
          try {
            const response = await fetchSubmissionUser({ token, type: transactionType });
            setData(response);
          } catch (error) {
            console.error('Failed to fetch data:', error);
          }
        };
        if (token && transactionType) {
          loadData();
        }
    }, [token, transactionType]);

    // useEffect(() => {
    //     const fetchSubmissions = async () => {
    //         if (transactionType === "Reimburesent" ) {
    //             const response = await fetchSubmissionUser({ token, type: transactionType });
    //             console.log(response)
    //             setData(response);
    //         }
    //     };

    //     if (token && transactionType) {
    //         fetchSubmissions();
    //     }
    // }, [transactionType, token]);

    const onSubmit = async (data) => {
    
        const payload = {
            ...data,
            file: selectedFiles.map(file => file.file),
            delete_images: deletedImages
        };
    
        setIsLoading(true);
        try {
            const result = await updateSubmissionUser({
                data: payload,
                id,
                token,
                file: selectedFiles.map(file => file.file)
            });
            setOpenSuccess(true);
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
            setIsLoading(false);
        }
    };
    
        const handleFileChange = (event) => {
            const files = Array.from(event.target.files);
            const newFiles = files.map(file => ({ file: file }));
            setSelectedFiles([...selectedFiles, ...newFiles]);
        };

        const handleRemoveFile = (fileName) => {
            setSelectedFiles(selectedFiles.filter(file => file.file.name !== fileName));
        };

        const handleRemoveImage = (filePath) => {
            setImage(prevImage => prevImage.filter(file => file !== filePath));
            setDeletedImages(prevDeletedImages => [...prevDeletedImages, filePath]);
        };

        const handleRemovePdf = (pdfPath) => {
            setPdfFiles(prevPdfFiles => prevPdfFiles.filter(file => file !== pdfPath));
            setDeletedImages((prevDeletedPdf) => [...prevDeletedPdf, pdfPath]);
        };

        const formatPrice = (value) => {
            if (!value) return "";
            const numberValue = Number(value.replace(/[^0-9]/g, ""));
            const numberFormat = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            });
            return numberFormat.format(numberValue).replace('Rp', 'Rp ');
        };

        useEffect(() => {
            const calculateTotal = () => {
                const totalAmount = fields.reduce((acc, item) => {
                    const quantity = Number(item.quantity) || 0; // Pastikan quantity adalah angka
                    const price = Number(String(item.price).replace(/[^0-9]/g, '')) || 0; // Pastikan price adalah angka
                    return acc + quantity * price; // Tambahkan total per item
                }, 0);
                setTotal(totalAmount); // Update state total
            };

            calculateTotal();
        }, [fields]); // Memantau perubahan pada fields

    return(
        <div className="py-4">
            <div className="w-full max-w-7xl mx-auto">
                {/* <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/" className="text-black leading-10 " >Home</BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <hr className="mb-4" /> */}
                <p className="title font-manrope font-bold text-2xl leading-10">Pengajuan Pengajuan Pembayaran/Reimbursement:</p>
                <p className="title text-muted-foreground text-sm mb-5">Data pengajuan pembayaran atau penggantian biaya.</p>
                <hr className="mb-4" />
                <div className="flex items-start">
                    <div className="flex flex-col">
                        <div className="text-lg font-semibold">
                            Pengajuan
                        </div>
                        <div className="text-muted-foreground text-xs">
                            Silahkan form mengisikan pengajuan
                        </div>
                    </div>
                    <div className="ml-20 w-full max-w-lg">
                        <Form {...form}>
                            <form action="" onSubmit={form.handleSubmit(onSubmit)}>
                                <div className="mb-4">
                                    <Label className="block text-sm mb-2 font-semibold">Tipe</Label>
                                    <FormField
                                        control={form.control}
                                        name="type"
                                        render={({ field }) => (
                                            <RadioGroup
                                            onValueChange={(value) => {
                                                field.onChange(value);
                                                setTransactionType(value);
                                              }}
                                              value={field.value?.toString() || ""}
                                            >
                                                    <div className="border-none rounded-lg p-4 bg-gray-50">
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem name="type" value="Reimbursement" id="r1" style={{ color: "#F9B421" }} disabled={transactionType === "Payment Request"} />
                                                            <Label htmlFor="r1">Pengembalian <span className="italic">(Reimbursement)</span></Label>
                                                        </div>
                                                        <p className="title text-muted-foreground text-xs ml-6">Proses penggantian biaya yang dikeluarkan karyawan untuk keperluan bisnis.</p>
                                                    </div>
                                                    <div className="border-none rounded-lg p-4 bg-gray-50">
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem name="type" value="Payment Request" id="r2" style={{ color: "#F9B421" }} disabled={transactionType === "Reimbursement"} />
                                                            <Label htmlFor="r2">Permintaan Pembayaran <span className="italic">(Payment Request)</span></Label>
                                                        </div>
                                                        <p className="title text-muted-foreground text-xs ml-6">Pengajuan pembayaran kepada pihak ketiga untuk barang atau jasa yang diterima.</p>
                                                    </div>
                                            </RadioGroup>
                                        )}
                                    />
                                    
                                </div>
                                <div className="mb-4">
                                    <Label className="block text-sm mb-2 font-semibold">Tujuan</Label>
                                    <FormField
                                        control={form.control}
                                        name="purpose"
                                        render={({ field }) => (
                                            <>
                                            <Input {...field} className="" placeholder="Masukkan tujuan..." type="text" />
                                            {form.formState.errors.purpose && (
                                            <FormMessage type="error" className="italic">{form.formState.errors.purpose.message}</FormMessage>
                                            )}
                                            </>
                                        )}
                                    />
                                </div>
                                <div className="mb-4">
                                            <Label className="block text-sm mb-2">Jangka Waktu</Label>
                                            <FormField
                                            control={form.control}
                                            name="due_date"
                                            render={({ field }) => (
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button variant="outline" className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
                                                    {field.value instanceof Date && !isNaN(field.value)
                                                        ? format(field.value, 'PPP')
                                                        : <span>Pilih tanggal pengajuan</span>}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar mode="single" selected={field.value} onSelect={(date) => field.onChange(date || null)} disabled={(date) => date < new Date().setHours(0, 0, 0, 0)} initialFocus />
                                                </PopoverContent>
                                            </Popover>
                                            )}
                                        />
                                </div>
                                <div className="mb-4">
                                    <div className="flex justify-between items-center">
                                        <div className="w-full mr-2">
                                            <Label className="block text-sm mb-2">Nama Rekening</Label>
                                            <FormField
                                                control={form.control}
                                                name="account_name"
                                                render={({ field }) => (
                                                <>
                                                    <Input {...field} className="" placeholder="Masukkan nama rekening..." type="text" />
                                                    {form.formState.errors.account_name && (
                                                        <FormMessage type="error" className="italic">{form.formState.errors.account_name.message}</FormMessage>
                                                    )}
                                                </>
                                                )}
                                                />
                                        </div>
                                        <div className="w-full ml-2">
                                            <Label className="block text-sm mb-2">Bank</Label>
                                            <FormField
                                                control={form.control}
                                                name="bank_name"
                                                render={({ field }) => (
                                                <>
                                                    <Input {...field} className="" placeholder="Masukkan tujuan..." type="text" />
                                                    {form.formState.errors.bank_name && (
                                                        <FormMessage type="error" className="italic">{form.formState.errors.bank_name.message}</FormMessage>
                                                    )}
                                                </>
                                                )}
                                                />
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <Label className="block text-sm mb-2">Nomor Rekening</Label>
                                    <FormField
                                    control={form.control}
                                    name="account_number"
                                    render={({ field }) => (
                                    <>
                                        <Input {...field} className="" placeholder="Masukkan nama rekening..." type="text" />
                                        {form.formState.errors.account_number && (
                                            <FormMessage type="error" className="italic">{form.formState.errors.account_number.message}</FormMessage>
                                        )}
                                    </>
                                    )}
                                    />
                                </div>
                                <hr className="mb-4" />
                                <div className="mb-4">
                                    <Label className="block text-sm mb-2">Item</Label>
                                    <Card className="">
                                    <CardContent className="p-4">
                                        {fields.map((item, index) => (
                                        <div key={item.id} className="mb-4">
                                            <div className="mb-4">
                                            <Label className="block text-sm mb-2">Deskripsi</Label>
                                            <FormField
                                                control={form.control}
                                                name={`submission_item.${index}.description`}
                                                render={({ field }) => (
                                                <Input {...field} placeholder="Contoh: Pembelian Laptop untuk karyawan" />
                                                )}
                                            />
                                            </div>
                                            <div className="flex justify-between items-center">
                                            <div className="w-full mr-2">
                                                <Label className="block text-sm mb-2">Kuantitas</Label>
                                                <FormField
                                                control={form.control}
                                                name={`submission_item.${index}.quantity`}
                                                render={({ field }) => (
                                                    <Input {...field} placeholder="Masukan jumlah..." type="number" />
                                                )}
                                                />
                                            </div>
                                            <div className="w-full ml-2">
                                                <Label className="block text-sm mb-2">Jumlah (Rp)</Label>
                                                <FormField
                                                control={form.control}
                                                name={`submission_item.${index}.price`}
                                                render={({ field }) => (
                                                    <Input {...field} placeholder="Masukan harga..." type="text"  onChange={(e) => field.onChange(formatPrice(e.target.value))} />
                                                )}
                                                />
                                            </div>
                                            </div>
                                            <div className="flex justify-end mt-2">
                                            <Button variant="ghost" className="text-red-600 text-xs" onClick={() => remove(index)}>
                                                <Trash2 className="w-4 h-4 mr-1" /> Hapus item
                                            </Button>
                                            </div>
                                        </div>
                                        ))}
                                        <div className="flex justify-end">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            className="text-blue-600 text-xs"
                                            onClick={() => append({ description: "", quantity: "", price: "" })} 
                                        >
                                            <Plus className="w-4 h-4 mr-1" /> Tambah item
                                        </Button>
                                        </div>
                                    </CardContent>
                                    </Card>
                                </div>
                                <div className="mb-4">
                                    <span className="flex justify-end font-bold text-sm">Jumlah keseluruhan: {new Intl.NumberFormat('id-ID', {
                                        style: 'currency',
                                        currency: 'IDR',
                                        minimumFractionDigits: 0,
                                    }).format(total)}</span>
                                </div>
                                <div className="mb-4">
                                    <Label className="block text-sm mb-2 font-semibold">Bukti Pembayaran/Pengeluaran</Label>
                                    <div className="border-dashed border-2 rounded-lg flex flex-col items-center justify-center p-4 mb-1">
                                        <img src=".././upload.png" className="mb-4" alt="" />
                                        <div className="font-semibold text-xs mb-5">Drag your file to start uploading format PDF</div>

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
                                        <div className="mt-4 space-y-2">
                                            {selectedFiles.map(file => (
                                                <Card key={file.name} className="flex justify-between items-center">
                                                    <span className="text-sm text-muted-foreground p-2">{file.file.name}</span>
                                                    <Button type="button" variant="danger" onClick={() => handleRemoveFile(file.name)}>
                                                        <CircleX className="h-4 w-4"/>
                                                    </Button>
                                                </Card>
                                            ))}
                                        </div>
                                    )}
                                    {image?.length > 0 && (
                                        <div className="mt-4 space-y-2">
                                            {image?.map((file, index) => (
                                                <Card key={index} className="flex justify-between items-center">
                                                    <span className="text-sm text-muted-foreground p-2">{file}</span>
                                                    <Button type="button" variant="danger" onClick={() => handleRemoveImage(file)}>
                                                        <CircleX className="h-4 w-4"/>
                                                    </Button>
                                                </Card>
                                            ))}
                                        </div>
                                    )}
                                    {/* Render existing PDF URLs */}
                                    {pdfFiles?.length > 0 && (
                                        <div className="mt-4 space-y-2">
                                            {pdfFiles.map((file, index) => (
                                                <Card key={index} className="flex justify-between items-center">
                                                    <span className="text-sm text-muted-foreground p-2">
                                                        <a href={file} target="_blank" rel="noopener noreferrer">{file}</a>
                                                    </span>
                                                    <Button type="button" variant="danger" onClick={() => handleRemovePdf(file)}>
                                                        <CircleX className="h-4 w-4"/>
                                                    </Button>
                                                </Card>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="flex justify-end">
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-4 py-2 text-sm font-semibold rounded-lg text-black"
                                    style={{ background: "#F9B421" }}
                                    >
                                    {isLoading ? (
                                        <ThreeDots
                                        height="20"
                                        width="20"
                                        color="#ffffff"
                                        ariaLabel="loading"
                                        />
                                    ) : (
                                        "Ubah Pengajuan"
                                    )}
                                </Button>
                                </div>
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
                                        <AlertDialogDescription className="">Anda telah berhasil mengubah pengajuan Reimbursement/Payment Request.</AlertDialogDescription>
                                        <AlertDialogAction
                                            onClick={() => router.push('/user')}
                                            style={{ background: "#F9B421" }}
                                            className="w-full"
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
                                    <AlertDialogAction className="w-full" onClick={() => setOpenError(false)} style={{ background: "#F9B421" }}>Kembali</AlertDialogAction>
                                </AlertDialogContent>
                                </AlertDialog>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    )
}