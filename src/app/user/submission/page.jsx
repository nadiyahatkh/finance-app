'use client'
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField } from "@/components/ui/form";
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

// Di dalam komponen SubmissionUser

export default function SubmissionUser() {
    
    const FormSchema = z.object({
        dob: z.date({
          required_error: "A date of birth is required.",
        }),
      })

    const form = useForm({
        resolver: zodResolver(FormSchema),
    });
    const { fields, append, remove } = useFieldArray({
        control: form.control, // Mengambil kontrol dari react-hook-form
        name: "items", // Nama field yang akan dikelola
      });
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
                            <form action="">
                                <div className="mb-4">
                                    <Label className="block text-sm mb-2 font-semibold">Tipe</Label>
                                    <RadioGroup>
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
                                </div>
                                <div className="mb-4">
                                    <Label className="block text-sm mb-2 font-semibold">Tujuan</Label>
                                    <Input type="text" placeholder="Masukan tujuan..." />
                                </div>
                                <div className="mb-4">
                                    <div className="flex justify-between items-center">
                                        <div className="w-full mr-2">
                                            <Label className="block text-sm mb-2">Jangka Waktu</Label>
                                            <FormField
                                            control={form.control}
                                            name="submission_date"
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
                                            <Input type="text" placeholder="Masukan nama..." />
                                        </div>
                                        <div className="w-full ml-2">
                                            <Label className="block text-sm mb-2">Bank</Label>
                                            <Input type="" placeholder="Pilih Bank..." />
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <Label className="block text-sm mb-2">Nomor Rekening</Label>
                                    <Input type="text" placeholder="Masukan rekening tujuan..." />
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
                                                name={`items.${index}.description`} // Nama yang unik untuk setiap field deskripsi
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
                                                name={`items.${index}.quantity`} // Nama yang unik untuk setiap field kuantitas
                                                render={({ field }) => (
                                                    <Input {...field} placeholder="Masukan jumlah..." />
                                                )}
                                                />
                                            </div>
                                            <div className="w-full ml-2">
                                                <Label className="block text-sm mb-2">Jumlah (Rp)</Label>
                                                <FormField
                                                control={form.control}
                                                name={`items.${index}.amount`} // Nama yang unik untuk setiap field jumlah
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
                                            onClick={() => append({ description: "", quantity: "", amount: "" })} // Menambah item baru
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
                                        {/* <div className="text-sm font-semibold mb-2">Choose a file or drag & drop it here</div> */}
                                        <div className="font-semibold text-xs mb-5">Drag your file to start uploading format PDF</div>

                                        <input
                                            name="path"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            id="fileInput"
                                            // onChange={handleFileChange}
                                        />
                                        <Button type="button" variant="outline" className="mb-4" onClick={() => document.getElementById('fileInput').click()}>Pilih File</Button>
                                    </div>
                                    {/* {selectedFiles.length > 0 && (
                                        <div className="mt-4 space-y-2">
                                            {selectedFiles.map(file => (
                                                <Card key={file.name} className="flex justify-between items-center">
                                                    <span className="text-sm text-muted-foreground p-2">{file.file.name}</span>
                                                    <Button type="button" variant="danger" onClick={() => handleRemoveFile(file.file.name)}>
                                                        <CircleX className="h-4 w-4"/>
                                                    </Button>
                                                </Card>
                                            ))}
                                        </div>
                                    )} */}
                                </div>
                                <div className="flex justify-end">
                                <Button
                                    type="submit"
                                    // disabled={isLoading}
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