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
    const [banks, setBanks] = useState()
    const [bankId, setBankId] = useState()
    const [transactionType, setTransactionType] = useState()
    const [data, setData] = useState()
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [accountName, setAccountName] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [openSuccess, setOpenSuccess] = useState(false);
    const [openError, setOpenError] = useState(false);
    const [errorMessages, setErrorMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [image, setImage] = useState()
    const [deletedImages, setDeletedImages] = useState([]);
    const router = useRouter()

    const FormSchema = z.object({
        due_date: z.date().optional(),
        type: z.string().optional(),
        purpose: z.string().optional(),
        bank_account_id: z.preprocess((val) => Number((val)), z.number().optional()),
        
        submission_item: z.array(
          z.object({
            description: z.string().optional(),
            quantity: z.preprocess((val) => Number((val)), z.number().optional()),
            price:  z.preprocess((val) => Number((val)), z.number().optional()),
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
            console.log(response);
      
            // Set value untuk field-field non-array
            form.setValue('bank_account_id', response.data.bank_account_id, { shouldValidate: true });
            form.setValue('purpose', response.data.purpose, { shouldValidate: true });
            form.setValue('due_date', new Date(response.data.due_date), { shouldValidate: true });
            form.setValue('type', response.data.type, { shouldValidate: true });
            
            // Kosongkan submission_item terlebih dahulu sebelum mengisi ulang
            remove();
            
            // Menambahkan setiap item dari response.data.items ke dalam submission_item
            response.data.items.forEach(item => {
              append({
                description: item.description,
                quantity: item.quantity,
                price: item.price,
              });
            });
            // Parse and set existing files
            const existingFiles = JSON.parse(response.data.files[0].file || '[]');
            setImage(existingFiles.map(filePath => ({ file: filePath })));
            setTransactionType(response.data.type);
            setBankId(response.data.bank_account_id);
          }
        };
      
        fetchData();
      }, [token, id, append, remove, form, setTransactionType, setBankId, setImage]);
      


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

    useEffect(() => {
        const fetchSubmissions = async () => {
            if (transactionType === "Reimburesent" ) {
                const response = await fetchSubmissionUser({ token, type: transactionType });
                console.log(response)
                setData(response);
            }
        };

        if (token && transactionType) {
            fetchSubmissions();
        }
    }, [transactionType, token]);

      useEffect(() => {
        const loadDataBanks = async () => {
            try {
              const bankData = await fetchBanks({ token });
              setBanks(bankData.data);
            } catch (error) {
              console.error('Failed to fetch positions:', error);
            }
          };

          if(token){
            loadDataBanks()
          }
    })

      useEffect(() => {
        const fetchData = async () => {
            if (token && bankId) {
                const response = await fetchBankDetail({ token, id: bankId });
                console.log(response);
                setAccountName(response.account_name);
                setAccountNumber(response.account_number);
            }
        };
    
        fetchData();
    }, [token, bankId]);

      const onSubmit= async (data) => {
        const payload = {
            ...data,
            bank_account_id: data.bank_account_id || bankId,
            file: selectedFiles.map(file => file.file),
            delete_images: deletedImages

        };
        setIsLoading(true)
        try{
            const result = await updateSubmissionUser({data: payload, token, file: selectedFiles.map(file => file.file) });
            setOpenSuccess(true)
        } catch (error) {
            const message = JSON.parse(error.message)
            setErrorMessages(Object.values(message.error).flat());
            setOpenError(true)
            console.error('Error creating asset:', error);
        }  finally {
            setIsLoading(false);
          }
    }

    
const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const newFiles = files.map(file => ({ file: file }));
    setSelectedFiles([...selectedFiles, ...newFiles]);
};

const handleRemoveFile = (fileName) => {
    setSelectedFiles(selectedFiles.filter(file => file.file.name !== fileName));
};

const handleRemoveImage = (filePath) => {
    setImage(prevImage => prevImage.filter(file => file.file !== filePath));
    setDeletedImages(prevDeletedImages => [...prevDeletedImages, filePath]);
};
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
                                                field.onChange(value); // Mengupdate nilai form
                                                setTransactionType(value); // Menyimpan nilai pada state lokal
                                              }}
                                              value={field.value?.toString() || ""}
                                            >
                                                    <div className="border-none rounded-lg p-4 bg-gray-50">
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem name="type" value="1" id="r1" style={{ color: "#F9B421" }} disabled={transactionType === "Payment Process"} />
                                                            <Label htmlFor="r1">Pengembalian <span className="italic">(Reimbursement)</span></Label>
                                                        </div>
                                                        <p className="title text-muted-foreground text-xs ml-6">Proses penggantian biaya yang dikeluarkan karyawan untuk keperluan bisnis.</p>
                                                    </div>
                                                    <div className="border-none rounded-lg p-4 bg-gray-50">
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem name="type" value="2" id="r2" style={{ color: "#F9B421" }} />
                                                            <Label htmlFor="r2">Permintaan Pembayaran <span className="italic">(Payment Request)</span></Label>
                                                        </div>
                                                        <p className="title text-muted-foreground text-xs ml-6">Pengajuan pembayaran kepada pihak ketiga untuk barang atau jasa yang diterima.</p>
                                                    </div>
                                            </RadioGroup>
                                        )}
                                    />
                                    
                                </div>
                                {/* Menampilkan nilai dari transactionType */}
<div className="mt-2">
    <p className="text-sm text-gray-600">Selected Type: {transactionType === "1" ? "Reimbursement" : transactionType === "2" ? "Payment Request" : "None"}</p>
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
                                    <div className="flex justify-between items-center">
                                        <div className="w-full mr-2">
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
                                                <Calendar mode="single" selected={field.value} onSelect={(date) => field.onChange(date || null)} disabled={(date) => date < new Date('1900-01-01') || date > new Date('2100-12-31')} initialFocus />
                                                </PopoverContent>
                                            </Popover>
                                            )}
                                        />
                                        </div>
                                        <div className="w-full ml-2">
                                            <Label className="block text-sm mb-2">Jumlah (RP)</Label>
                                            <Input type="" placeholder="Rp." />
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <div className="flex justify-between items-center">
                                        <div className="w-full mr-2">
                                            <Label className="block text-sm mb-2">Nama Rekening</Label>
                                            <Input
                                            value={accountName} // Use display-only state
                                            className=""
                                            placeholder="Masukan Nama Rekening..."
                                            type="text"
                                            readOnly
                                            />
                                        </div>
                                        <div className="w-full ml-2">
                                            <Label className="block text-sm mb-2">Bank</Label>
                                            <FormField
                                                control={form.control}
                                                name="bank_account_id"
                                                render={({ field }) => (
                                                <>
                                                    <Select
                                                    value={field.value ? field.value.toString() : ""}
                                                    onValueChange={(value) => {
                                                        field.onChange(value); // Update react-hook-form state
                                                        setBankId(value);
                                                    }}
                                                    {...field}
                                                    >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Pilih bank..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {banks?.map((bank) => (
                                                        <SelectItem key={bank.id} value={bank.id.toString()}>{bank.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                    </Select>
                                                    {form.formState.errors.bank_id && (
                                                        <FormMessage type="error" className="italic">{form.formState.errors.bank_id.message}</FormMessage>
                                                    )}
                                                </>
                                                )}
                                                />
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <Label className="block text-sm mb-2">Nomor Rekening</Label>
                                    <Input
                                        value={accountNumber} // Use display-only state
                                        className=""
                                        placeholder="Masukan Nomor Rekening..."
                                        type="text"
                                        readOnly
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
                                                name={`submission_item.${index}.description`} // Nama yang unik untuk setiap field deskripsi
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
                                                name={`submission_item.${index}.quantity`} // Nama yang unik untuk setiap field kuantitas
                                                render={({ field }) => (
                                                    <Input {...field} placeholder="Masukan jumlah..." type="number" />
                                                )}
                                                />
                                            </div>
                                            <div className="w-full ml-2">
                                                <Label className="block text-sm mb-2">Jumlah (Rp)</Label>
                                                <FormField
                                                control={form.control}
                                                name={`submission_item.${index}.price`} // Nama yang unik untuk setiap field jumlah
                                                render={({ field }) => (
                                                    <Input {...field} placeholder="Masukan harga..." type="number" />
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
                                            onClick={() => append({ description: "", quantity: "", price: "" })} // Menambah item baru
                                        >
                                            <Plus className="w-4 h-4 mr-1" /> Tambah item
                                        </Button>
                                        </div>
                                        <div className="mt-4">
                                        <div className="flex justify-end font-bold text-lg">
                                            Total: Rp. {/* Bisa tambahkan logika untuk menghitung total */}
                                        </div>
                                        </div>
                                    </CardContent>
                                    </Card>
                                </div>
                                <div className="mb-4">
                                    <Label className="block text-sm mb-2 font-semibold">Bukti Pembayaran/Pengeluaran</Label>
                                    <div className="border-dashed border-2 rounded-lg flex flex-col items-center justify-center p-4 mb-1">
                                        <img src="../upload.png" className="mb-4" alt="" />
                                        <div className="font-semibold text-xs mb-5">Drag your file to start uploading format PDF</div>

                                        <input
                                            name="file"
                                            type="file"
                                            accept="image/*"
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
            {image.map((file, index) => (
                <Card key={index} className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground p-2">{file.file}</span>
                    <Button type="button" variant="danger" onClick={() => handleRemoveImage(file.file)}>
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
                                    onClick={() => console.log(form)}
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
                                        "Pengajuan"
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
                                        <AlertDialogDescription className="">Anda telah berhasil menambahkan pengajuan Reimbursement/Payment Request.</AlertDialogDescription>
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