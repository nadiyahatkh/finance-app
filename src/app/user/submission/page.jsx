'use client'
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, CircleX, CloudDownload, Plus, Trash, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useFieldArray } from "react-hook-form";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { fetchBanks } from "@/app/apiService";
import { createSubmissionUser, fetchBankDetail, fetchSubmissionUser } from "../apiService";


export default function SubmissionUser() {
    const { data: session } = useSession();
    const token = session?.user?.token;
    const [banks, setBanks] = useState()
    const [bankId, setBankId] = useState()
    const [transactionType, setTransactionType] = useState()
    const [data, setData] = useState()
    const [selectedFiles, setSelectedFiles] = useState([]);



    const FormSchema = z.object({
        due_date: z.date().min(new Date(), { message: "Due date cannot be in the past." }),
        type: z.string().min(1, { message: "Type is required." }),
        purpose: z.string().min(1, { message: "Purpose is required." }),
        bank_account_id: z.string().min(1, { message: "Bank account is required." }),
        
        submission_item: z.array(
          z.object({
            description: z.string().min(1, { message: "Description is required." }),
            quantity: z.number().min(1, { message: "Quantity must be at least 1." }),
            price: z.number().min(0, { message: "Price cannot be negative." })
          })
        ).min(1, { message: "At least one submission item is required." })
      });

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
            console.log(response)
            form.setValue('account_name', response.account_name, {shouldValidate: true})
            form.setValue('account_number', response.account_number, {shouldValidate: true})
          }
        };
    
        fetchData();
      }, [token, bankId]);
      

    const form = useForm({
        resolver: zodResolver(FormSchema),
    });
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "submission_item",
      });

    //   const onSubmit= async (data) => {
    //     data.bank_account_id = bankId;
        
    //     try{
    //         const result = await createSubmissionUser({data, token, file });
    //     } catch (error) {
    //         // const message = JSON.parse(error.message)
    //         // setErrorMessages(Object.values(message.error).flat());
    //         console.error('Error creating asset:', error);
    //     } finally {
    //         setIsLoading(false);
    //       }
    // }

    const onSubmit = async (data) => {
        // Remove account_name and account_number before sending to server
        delete submissionData.account_name;
        delete submissionData.account_number;
        // Only include bank_account_id in the submission data
        const submissionData = {
            ...data,
            bank_account_id: bankId, // Ensure the bank_id is included
        };
    
    
        try {
            const result = await createSubmissionUser({ data: submissionData, file });
            // Handle success response if needed
        } catch (error) {
            console.error('Error creating asset:', error);
        } finally {
            setIsLoading(false);
        }
    };
    

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
        
    };

    const handleRemoveFile = (fileName) => {
        setSelectedFiles((prevFiles) => prevFiles.filter(file => file.name !== fileName));
    };

    console.log(selectedFiles)

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
                                            }} value={field.value?.toString()}
                                            >
                                                    <div className="border-none rounded-lg p-4 bg-gray-50">
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem name="type" value="1" id="r1" style={{ color: "#F9B421" }} />
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
                                                    {field.value ? format(field.value, 'PPP') : <span>Pilih tanggal pengajuan</span>}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date('1900-01-01') || date > new Date('2100-12-31')} initialFocus />
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
                                            <FormField
                                                control={form.control}
                                                name="account_name"
                                                render={({ field }) => (
                                                    <>
                                                    <Input {...field} className="" placeholder="Masukkan Nama Rekening tujuan..." type="text" />
                                                    {/* {form.formState.errors.purpose && (
                                                    <FormMessage type="error" className="italic">{form.formState.errors.purpose.message}</FormMessage>
                                                    )} */}
                                                    </>
                                                )}
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
                                    <FormField
                                        control={form.control}
                                        name="account_number"
                                        render={({ field }) => (
                                            <>
                                            <Input {...field} className="" placeholder="Masukkan Rekening tujuan..." type="text" />
                                            {/* {form.formState.errors.purpose && (
                                            <FormMessage type="error" className="italic">{form.formState.errors.purpose.message}</FormMessage>
                                            )} */}
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
                                                    <Input {...field} placeholder="Masukan jumlah..." />
                                                )}
                                                />
                                            </div>
                                            <div className="w-full ml-2">
                                                <Label className="block text-sm mb-2">Jumlah (Rp)</Label>
                                                <FormField
                                                control={form.control}
                                                name={`submission_item.${index}.price`} // Nama yang unik untuk setiap field jumlah
                                                render={({ field }) => (
                                                    <Input {...field} placeholder="Masukan harga..." />
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
                                            name="path"
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
                                                    <span className="text-sm text-muted-foreground p-2">{file.name}</span>
                                                    <Button type="button" variant="danger" onClick={() => handleRemoveFile(file.name)}>
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
                                    // disabled={isLoading}
                                    onClick={() => console.log(form)}
                                    className="px-4 py-2 text-sm font-semibold rounded-lg text-black"
                                    style={{ background: "#F9B421" }}
                                    >
                                    {/* {isLoading ? (
                                        <Tai
                                        height="20"
                                        width="20"
                                        color="#ffffff"
                                        ariaLabel="loading"
                                        />
                                    ) : (
                                        "Pengajuan"
                                    )} */}
                                    Buat Pengajuan
                                </Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    )
}