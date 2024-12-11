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
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { createEmployee, fetchDepartments, fetchManagers, fetchPositions } from "../apiService";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ThreeDots } from "react-loader-spinner";
import { useRouter } from "next/navigation";


export default function AddEmployee() {
    const { data: session } = useSession();
    const token = session?.user?.token;
    const router = useRouter()
    const [departments, setDepartments] = useState()
    const [positions, setPositions] = useState()
    const [departmentId, setDepartmentId] = useState();
    const [positionId, setPositionId] = useState();
    const [managers, setManagers] = useState()
    const [managerId, setManagerId] = useState()
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState("");
    const [openSuccess, setOpenSuccess] = useState(false);
    const [openError, setOpenError] = useState(false);
    const [errorMessages, setErrorMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false)

    const FormSchema = z.object({
        name: z.string().min(1, { message: "Nama karyawan is required." }),
        username: z.string().min(1, { message: "UserName karyawan is required." }),
        email: z.string().min(1, { message: "Email is required." }),
        password: z.string().min(1, { message: "Password wajib diisi." }),
        department_id: z.string().min(1, { message: "Department wajib diisi." }),
        position_id: z.string().min(1, { message: "Posisi wajib diisi." }),
        manager_id: z.string().min(1, { message: "Manager wajib diisi." }),
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
          } catch (error) {
            console.error('Failed to fetch departments:', error);
          }
        };
        const loadDataPositions = async () => {
          try {
            const positionsData = await fetchPositions({ token });
            setPositions(positionsData.data);
          } catch (error) {
            console.error('Failed to fetch positions:', error);
          }
        };
        const loadDataMangers = async () => {
          try {
            const managerData = await fetchManagers({ token });
            setManagers(managerData.data);
          } catch (error) {
            console.error('Failed to fetch managers:', error);
          }
        };

        if (token){
            loadDataMangers();
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
        data.manager_id = managerId;
        data.departement_id = departmentId;
        data.position_id = positionId;
        setIsLoading(true)
        try {
        const result = await createEmployee({ data, token , file: selectedFile });
        setOpenSuccess(true)
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
        }  finally {
            setIsLoading(false);
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
                                render={({ field, fieldState }) => (
                                    <>
                                    <Input {...field} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" placeholder="Alicia" type="text" />
                                    {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
                                    </>
                                )}
                                />
                            </div>
                            <div className="mb-4">
                                <Label className="block text-sm mb-2">username</Label>
                                <FormField
                                control={form.control}
                                name="username"
                                render={({ field, fieldState }) => (
                                    <>
                                    <Input {...field} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" placeholder="Alicia" type="text" />
                                    {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
                                    </>
                                )}
                                />
                            </div>
                            <div className="mb-4">
                                <Label className="block text-sm mb-2">Password</Label>
                                <div className="relative">
                                <FormField
                                control={form.control}
                                name="password"
                                render={({ field, fieldState }) => (
                                <>
                                <Input {...field} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" placeholder="****" type={showPassword ? "text" : "password"} />
                                {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
                                </>
                                )}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                                    >
                                    {showPassword ? 
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                        </svg> 
                                        : 
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                        </svg>
                                        }
                                    </button>

                                </div>
                            </div>
                            <div className="mb-4">
                                <Label className="block text-sm mb-2">Email</Label>
                                <FormField
                                control={form.control}
                                name="email"
                                render={({ field, fieldState }) => (
                                <>
                                <Input {...field} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" placeholder="name@gmail.com" type="email" />
                                {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
                                </>
                                )}
                                />
                            </div>
                            <div className="mb-4">
                                <Label className="block text-sm mb-2">Manager</Label>
                                <FormField
                                control={form.control}
                                name="manager_id"
                                render={({ field, fieldState }) => (
                                    <>
                                        <Select
                                        value={field.value ? field.value.toString() : ""}
                                        onValueChange={(value) => {
                                            field.onChange(value);
                                            setManagerId(value);
                                        }}
                                        {...field}
                                        >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih departement untuk ditampilkan" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {managers?.map((manager) => (
                                            <SelectItem key={manager.id} value={manager.id.toString()}>{manager.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                        </Select>
                                        {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
                                    </>
                                )}
                                />
                            </div>
                            <div className="mb-4">
                                <Label className="block text-sm mb-2" htmlFor="department_id">Departemen</Label>
                                <FormField
                                    control={form.control}
                                    name="department_id"
                                    render={({ field, fieldState }) => (
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
                                        {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
                                    </>
                                    )}
                                    />
                            </div>
                            <div className="mb-4">
                                <Label className="block text-sm mb-2" htmlFor="position_id">Posisi</Label>
                                <FormField
                                    control={form.control}
                                    name="position_id"
                                    render={({ field, fieldState }) => (
                                    <>
                                    
                                        <Select
                                        value={field.value ? field.value.toString() : ""}
                                        onValueChange={(value) => {
                                            field.onChange(value);
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
                                        {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
                                    </>
                                    )}
                                    />
                            </div>
                            <div className="flex justify-end">
                            <Button
                            type="submit"
                            onClick={() => console.log(form)}
                            disabled={isLoading}
                            className="px-4 py-2 text-sm font-semibold rounded-lg"
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
                                        "Tambah Karyawan"
                                    )}
                            </Button>
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
                                        <AlertDialogDescription className="">Anda telah berhasil menambahkan karyawan.</AlertDialogDescription>
                                        <AlertDialogAction
                                            onClick={() => router.push('/employee-management')}
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
                            </div>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    )
}