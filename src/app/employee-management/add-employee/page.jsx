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
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, CircleX, CloudDownload, Plus, Trash, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { createEmployee, fetchDepartments, fetchPositions } from "../apiService";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";


export default function AddEmployee() {
    const { data: session } = useSession();
    const token = session?.user?.token;
    const [departments, setDepartments] = useState()
    const [positions, setPositions] = useState()
    const [departmentId, setDepartmentId] = useState();
    const [positionId, setPositionId] = useState();
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState("");

    const FormSchema = z.object({
        name: z.string().min(1, { message: "Nama karyawan is required." }),
        username: z.string().min(1, { message: "UserName karyawan is required." }),
        email: z.string().min(1, { message: "Email is required." }),
        password: z.string().min(1, { message: "Password wajib diisi." }),
        department_id: z.string().min(1, { message: "Department wajib diisi." }),
        position_id: z.string().min(1, { message: "Posisi wajib diisi." }),
        manager_id: z.string().min(1, { message: "Manager wajib diisi." }),
        bank_id: z.string().min(1, { message: "bank wajib diisi." }),
        account_name: z.string().min(1, { message: "nama akun wajib diisi." }),
        account_number: z.string().min(1, { message: "nomer rekening wajib diisi." }),
        path: z.any().optional()
      });

    const form = useForm({
        resolver: zodResolver(FormSchema),
    });

    useEffect(() => {
        const loadDataDepartments = async () => {
          try {
            const departmentData = await fetchDepartments({ token });
            setDepartments(departmentData.data);
            console.log(setDepartments)
          } catch (error) {
            console.error('Failed to fetch departments:', error);
          }
        };
        const loadDataPositions = async () => {
          try {
            const positionsData = await fetchPositions({ token });
            setPositions(positionsData.data);
            console.log(setPositions)
          } catch (error) {
            console.error('Failed to fetch positions:', error);
          }
        };

        if (token){
            loadDataDepartments();
            loadDataPositions();
        }
    }, [token])

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            const previewUrl = URL.createObjectURL(file);
            setImagePreviewUrl(previewUrl);
        }
    };


    const onSubmit = async (data) => {
        data.departement_id = departmentId;
        data.position_id = positionId;
        console.log("Token:", token);
        try {
        const result = await createEmployee({ data, token , file: selectedFile });
        console.log(result)
        } catch (error) {

        // const message = JSON.parse(error.message)
        // setErrorMessages(Object.values(message.error).flat());
        // setOpenError(true)
        console.error('Error creating employee:', error);
        }
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
                <p className="title font-manrope font-bold text-2xl leading-10">Manajemen Karyawan</p>
                <p className="title text-muted-foreground text-sm mb-5">Heres a list of your employe.</p>
                <hr className="mb-4" />
                <div className="flex items-start">
                    <div className="flex flex-col">
                        <div className="text-lg font-semibold">
                            Manajemen Karyawan
                        </div>
                        <div className="text-muted-foreground text-xs">
                            Silahkan mengisi form secara benar dan teliti
                        </div>
                    </div>
                    <div className="ml-20 w-full max-w-lg">
                        <Form {...form}>
                            <form action="" onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="mb-4">
                                                        <p className="font-bold text-sm mb-2">Photo</p>
                                                        <div className="flex items-center">
                                                        <img src={imagePreviewUrl || "/default-profile.png"} name="path" alt="Profile Image" className="w-12 h-12 rounded-full mr-4" />
                                                            <input
                                                                name="path"
                                                                type="file"
                                                                accept="image/*"
                                                                style={{ display: 'none' }}
                                                                id="fileInput"
                                                                onChange={handleFileChange}
                                                            />
                                                                <button type="button" onClick={() => document.getElementById('fileInput').click()} className="px-4 py-2 font-semibold shadow-sm border rounded-md">Change</button>
                                                        </div>
                                                    </div>
                            <div className="mb-4">
                                <Label className="block text-sm mb-2">Nama Karyawan</Label>
                                <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <>
                                    <Input {...field} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" placeholder="Alicia" type="text" />
                                    {/* {form.formState.errors.name && (
                                    <FormMessage type="error" className="italic">{form.formState.errors.name.message}</FormMessage>
                                    )} */}
                                    </>
                                )}
                                />
                            </div>
                            <div className="mb-4">
                                <Label className="block text-sm mb-2">username</Label>
                                <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <>
                                    <Input {...field} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" placeholder="Alicia" type="text" />
                                    {/* {form.formState.errors.name && (
                                    <FormMessage type="error" className="italic">{form.formState.errors.name.message}</FormMessage>
                                    )} */}
                                    </>
                                )}
                                />
                            </div>
                            <div className="mb-4">
                                <Label className="block text-sm mb-2">Password</Label>
                                <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                <>
                                <Input {...field} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" placeholder="****" type="password" />
                                {/* {form.formState.errors.password && (
                                    <FormMessage type="error" className="italic">{form.formState.errors.password.message}</FormMessage>
                                    )} */}
                                </>
                                )}
                                />
                            </div>
                            {/* <div className="mb-4">
                                <Label className="block text-sm mb-2">NIP</Label>
                                <FormField
                                control={form.control}
                                name="nip"
                                render={({ field }) => (
                                <>
                                    <Input {...field} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" placeholder="121300" type="text" />
                                    {form.formState.errors.nip && (
                                    <FormMessage type="error" className="italic">{form.formState.errors.nip.message}</FormMessage>
                                    )}
                                </>
                                )}
                                />
                            </div> */}
                            <div className="mb-4">
                                <Label className="block text-sm mb-2">Email</Label>
                                <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                <>
                                <Input {...field} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" placeholder="name@gmail.com" type="email" />
                                {/* {form.formState.errors.email && (
                                    <FormMessage type="error" className="italic">{form.formState.errors.email.message}</FormMessage>
                                )} */}
                                </>
                                )}
                                />
                            </div>
                            <div className="mb-4">
                                <Label className="block text-sm mb-2">Bank</Label>
                                <FormField
                                control={form.control}
                                name="bank_id"
                                render={({ field }) => (
                                    <>
                                    <Input {...field} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" placeholder="Isi id bank" type="number" />
                                    {form.formState.errors.bank_id && (
                                    <FormMessage type="error" className="italic">{form.formState.errors.bank_id.message}</FormMessage>
                                    )}
                                    </>
                                )}
                                />
                            </div>
                            <div className="mb-4">
                                <Label className="block text-sm mb-2">Manager</Label>
                                <FormField
                                control={form.control}
                                name="manager_id"
                                render={({ field }) => (
                                    <>
                                    <Input {...field} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" placeholder="Isi id bank" type="number" />
                                    {form.formState.errors.manager_id && (
                                    <FormMessage type="error" className="italic">{form.formState.errors.manager_id.message}</FormMessage>
                                    )}
                                    </>
                                )}
                                />
                            </div>
                            <div className="mb-4">
                                <Label className="block text-sm mb-2">Nomor Rekening</Label>
                                <FormField
                                control={form.control}
                                name="account_number"
                                render={({ field }) => (
                                    <>
                                    <Input {...field} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" placeholder="Isi nomer rekening anda" type="number" />
                                    {form.formState.errors.account_number && (
                                    <FormMessage type="error" className="italic">{form.formState.errors.account_number.message}</FormMessage>
                                    )}
                                    </>
                                )}
                                />
                            </div>
                            <div className="mb-4">
                                <Label className="block text-sm mb-2">Nama Akun Bank</Label>
                                <FormField
                                control={form.control}
                                name="account_name"
                                render={({ field }) => (
                                    <>
                                    <Input {...field} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" placeholder="Isi nama rekening anda" type="text" />
                                    {form.formState.errors.account_name && (
                                    <FormMessage type="error" className="italic">{form.formState.errors.account_name.message}</FormMessage>
                                    )}
                                    </>
                                )}
                                />
                            </div>
                            <div className="mb-4">
                                <Label className="block text-sm mb-2" htmlFor="department_id">Departemen</Label>
                                <FormField
                                    control={form.control}
                                    name="department_id"
                                    render={({ field }) => (
                                    <>
                                        <Select
                                        value={field.value ? field.value.toString() : ""}
                                        onValueChange={(value) => {
                                            field.onChange(value); // Update react-hook-form state
                                            setDepartmentId(value);
                                        }}
                                        {...field}
                                        >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih departement untuk ditampilkan" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {departments?.map((department) => (
                                            <SelectItem key={department.id} value={department.id.toString()}>{department.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                        </Select>
                                        {form.formState.errors.department_id && (
                                            <FormMessage type="error" className="italic">{form.formState.errors.department_id.message}</FormMessage>
                                        )}
                                    </>
                                    )}
                                    />
                            </div>
                            <div className="mb-4">
                                <Label className="block text-sm mb-2" htmlFor="position_id">Posisi</Label>
                                <FormField
                                    control={form.control}
                                    name="position_id"
                                    render={({ field }) => (
                                    <>
                                    
                                        <Select
                                        value={field.value ? field.value.toString() : ""}
                                        onValueChange={(value) => {
                                            field.onChange(value); // Update react-hook-form state
                                            setPositionId(value);
                                        }}
                                        {...field}
                                        >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih posisi untuk ditampilkan" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {positions?.map((position) => (
                                            <SelectItem key={position.id} value={position.id.toString()}>{position.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                        </Select>
                                        {form.formState.errors.position_id && (
                                            <FormMessage type="error" className="italic">{form.formState.errors.position_id.message}</FormMessage>
                                        )}
                                    </>
                                    )}
                                    />
                            </div>
                            <div className="flex justify-end">
                            <Button
                            type="submit"
                            onClick={() => console.log(form)}
                            // disabled={isLoading}
                            className="px-4 py-2 text-sm font-semibold rounded-lg"
                            style={{ background: "#F9B421" }}
                            >
                            
                            Tambah Karyawan
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