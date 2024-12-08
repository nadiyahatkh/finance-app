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
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ThreeDots } from "react-loader-spinner";
import { useParams, useRouter } from "next/navigation";
import { fetchDepartments, fetchManagers, fetchPositions, updateUsers, userDetailId } from "../../apiService";


export default function UpdateEmployee() {
    const { data: session } = useSession();
    const token = session?.user?.token;
    const {id} = useParams()
    const router = useRouter()
    const [departments, setDepartments] = useState()
    const [positions, setPositions] = useState()
    const [departmentId, setDepartmentId] = useState();
    const [positionId, setPositionId] = useState();
    const [managers, setManagers] = useState()
    const [managerId, setManagerId] = useState()
    const [profileImage, setProfileImage] = useState();
    const [openSuccess, setOpenSuccess] = useState(false);
    const [openError, setOpenError] = useState(false);
    const [errorMessages, setErrorMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const FormSchema = z.object({
        name: z.string().optional(),
        username: z.string().optional(),
        email: z.string().optional(),
        password: z.string().optional(),
        department_id: z.string().optional(),
        position_id: z.string().optional(),
        manager_id: z.string().optional(),
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
            setProfileImage(URL.createObjectURL(file));
            form.setValue('path', event.target.files);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
          if (token && id) {
            const response = await userDetailId({ token, id });
            form.setValue('name', response.data.name, { shouldValidate: true });
            form.setValue('username', response.data.username, { shouldValidate: true });
            form.setValue('email', response.data.email, { shouldValidate: true });
            form.setValue('password', response.data.password, { shouldValidate: true });
            form.setValue('department_id', response.data.department_id, { shouldValidate: true });
            form.setValue('position_id', response.data.position_id, { shouldValidate: true });
            const managerId = response.data.staff[0]?.manager_id || null;
            form.setValue('manager_id', managerId, { shouldValidate: true });

            setProfileImage(response.data.path)
          }
        };
      
        fetchData();
      }, [token, id]);

    const onSubmit = async (data) => {
        const filteredData = { ...data };
    
        if (!data.password) {
            delete filteredData.password;
        }
        setIsLoading(true)
        try {
        const result = await updateUsers({ data: filteredData, token, id });
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
                                <img src={profileImage} name="path" alt="Profile Image" className="w-12 h-12 rounded-full mr-4" />
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
                                    {form.formState.errors.name && (
                                    <FormMessage type="error" className="italic">{form.formState.errors.name.message}</FormMessage>
                                    )}
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
                                    {form.formState.errors.username && (
                                    <FormMessage type="error" className="italic">{form.formState.errors.username.message}</FormMessage>
                                    )}
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
                                {form.formState.errors.password && (
                                    <FormMessage type="error" className="italic">{form.formState.errors.password.message}</FormMessage>
                                    )}
                                </>
                                )}
                                />
                            </div>
                            <div className="mb-4">
                                <Label className="block text-sm mb-2">Email</Label>
                                <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                <>
                                <Input {...field} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" placeholder="name@gmail.com" type="email" />
                                {form.formState.errors.email && (
                                    <FormMessage type="error" className="italic">{form.formState.errors.email.message}</FormMessage>
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
                                        <Select
                                        value={field.value ? field.value.toString() : ""}
                                        onValueChange={(value) => {
                                            field.onChange(value); // Update react-hook-form state
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
                                    </>
                                    )}
                                    />
                            </div>
                            <div className="flex justify-end">
                            <Button
                            type="submit"
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
                                        "Ubah Karyawan"
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
                                        <AlertDialogDescription className="">Anda telah berhasil mengubah karyawan.</AlertDialogDescription>
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