'use client'
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Form, FormField, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { TailSpin } from "react-loader-spinner";
import { z } from "zod";
import { fetchProfileUserId, updateProfileUser } from "../apiService";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchBankAll, fetchBanks } from "@/app/apiService";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

const FormSchema = z.object({
    name: z.string().min(1, { message: "Nama karyawan is required." }),
    username: z.string().min(1, { message: "Nama karyawan is required." }),
    email: z.string().min(1, { message: "Email is required." }),
    password: z.string().optional(),
    path: z.any().optional(),
    bank: z.array(
        z.object({
          id: z.preprocess((val) => Number((val)), z.number().optional()),
          bank_id: z.preprocess((val) => Number((val)), z.number().optional()),
          account_name: z.string().optional(),
          account_number:  z.preprocess((val) => Number((val)), z.number().optional()),
        })
      ).optional(),
  });

export default function UpdateProfile() {

    const [profileImage, setProfileImage] = useState();
    const { data: session } = useSession();
    const token = session?.user?.token;
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter()
    const [openSuccess, setOpenSuccess] = useState(false);
    const [openError, setOpenError] = useState(false);
    const [errorMessages, setErrorMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [banks, setBanks] = useState()
    const [bankId, setBankId] = useState()
    const [id, setId] = useState()

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            path: null
        }
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "bank",
      });


    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const filteredData = { ...data };
    
            if (!data.password) {
                delete filteredData.password;
            }
    
            filteredData.path = data.path ? data.path[0] : null;

            console.log('Filtered Data:', filteredData);
    
            const result = await updateProfileUser({ data: filteredData, token });
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

    useEffect(() => {
        const loadDataBanks = async () => {
            try {
              const bankData = await fetchBankAll({ token });
              setBanks(bankData.data);
            } catch (error) {
              console.error('Failed to fetch positions:', error);
            }
          };

          loadDataBanks()
    }, [token])
    


    useEffect(() => {
        const fetchData = async () => {
            if(token) {
                const response = await fetchProfileUserId({ token });
                form.setValue('name', response.user.name, {shouldValidate: true})
                form.setValue('username', response.user.username, {shouldValidate: true})
                form.setValue('email', response.user.email, {shouldValidate: true})
                form.setValue('password', response.user.password, {shouldValidate: true})
                setProfileImage(response.profile_image_url);

                remove();
            
                response.user.bank_accounts.forEach(item => {
                append({
                    id: item.id || "",
                    bank_id: item.bank_id,
                    account_name: item.account_name,
                    account_number: item.account_number,
                });
                });
            }
        };
        fetchData()
      }, [token, form])

      const handleProfileImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(URL.createObjectURL(file));
            form.setValue('path', e.target.files);
        }
    };

    return(
        <>
        <div className="py-4">
            <div className="w-full max-w-7xl mx-auto">
                <p className="title font-manrope font-bold text-2xl leading-10">Profile</p>
                <p className="title text-muted-foreground text-sm mb-5">Manage your account setting and set e-mail preferences</p>
                <hr className="mb-4" />
                <div className="flex items-start">
                    {/* Left Side - Profile Button */}
                    <div className="flex flex-col items-center">
                        <div className="profile">
                            Profile
                        </div>
                    </div>
                    
                    {/* Right Side - Change Profile Form */}
                    <div className="ml-5 w-full max-w-lg">
                        <p className="title font-manrope font-bold text-lg">Profile</p>
                        <p className="title text-muted-foreground text-sm mb-5">This is how others will see you on the site</p>
                        <hr className="mb-4" />
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <div className="mb-4">
                                    <p className="font-bold text-sm mb-2">Profile Image</p>
                                    <div className="flex items-center">
                                    <img src={profileImage} name="foto" alt="Profile Image" className="w-12 h-12 rounded-full mr-4" />
                                        <input
                                            name="path"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleProfileImageChange}
                                            style={{ display: 'none' }}
                                            id="fileInput"
                                        />
                                            <button type="button" onClick={() => document.getElementById('fileInput').click()} className="px-4 py-2 font-semibold shadow-sm border rounded-md">Change</button>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <Label className="block font-bold text-sm mb-2" htmlFor="username">Name</Label>
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <Input {...field} placeholder="name" type="text" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" />
                                        )}
                                        />
                                </div>
                                <div className="mb-4">
                                    <Label className="block font-bold text-sm mb-2" htmlFor="username">Username</Label>
                                    <FormField
                                        control={form.control}
                                        name="username"
                                        render={({ field }) => (
                                            <Input {...field} placeholder="username" type="text" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" />
                                        )}
                                        />
                                </div>
                                <div className="mb-4">
                                    <Label className="block font-bold text-sm mb-2">Email</Label>
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <Input {...field} placeholder="name@example.com" type="email" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" />
                                        )}
                                        />
                                </div>
                                <div className="mb-4">
                                    <Label className="block font-bold text-sm mb-2" htmlFor="password">Password</Label>
                                    <div className="relative">
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <Input {...field} placeholder="*****" type={showPassword ? "text" : "password"} id="password" name="password" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" />
                                        )}
                                        />
                                            <button type='button' className="absolute top-0 right-0 mt-2 mr-3" onClick={togglePasswordVisibility}>
                                                {showPassword ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                                    </svg> 
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                    </svg>
                                                )}
                                            </button>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <Label className="block text-sm mb-2">Item</Label>
                                    <Card className="">
                                    <CardContent className="p-4">
                                        {fields.map((item, index) => (
                                        <div key={item.id} className="mb-4">
                                            <div className="mb-4">
                                            <FormField
                                                control={form.control}
                                                name={`bank.${index}.id`}
                                                render={({ field }) => (
                                                    <Input 
                                                        onValueChange={(value) => {
                                                            field.onChange(value);
                                                        }}
                                                        {...field}
                                                        type="hidden" 
                                                        value={field.value ?? ""} 
                                                    />
                                                )}
                                            />
                                            <Label className="block text-sm mb-2">Bank</Label>
                                            <FormField
                                                control={form.control}
                                                name={`bank.${index}.bank_id`}
                                                render={({ field }) => (
                                                    <>
                                                    <Select
                                                    value={field.value ?? ""}
                                                    onValueChange={(value) => {
                                                        field.onChange(Number(value));
                                                        setBankId(Number(value));
                                                    }}
                                                    {...field}
                                                    >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Pilih bank untuk ditampilkan" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {banks?.map((bank) => (
                                                        <SelectItem key={bank.id} value={bank.id}>{bank.name}</SelectItem>
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
                                            <div className="flex justify-between items-center">
                                            <div className="w-full mr-2">
                                                <Label className="block text-sm mb-2">Nama Rekening</Label>
                                                <FormField
                                                control={form.control}
                                                name={`bank.${index}.account_name`} // Nama yang unik untuk setiap field kuantitas
                                                render={({ field }) => (
                                                    <Input {...field} placeholder="Masukan Nama Rekening..." type="text" />
                                                )}
                                                />
                                            </div>
                                            <div className="w-full ml-2">
                                                <Label className="block text-sm mb-2">Nomer Rekening</Label>
                                                <FormField
                                                control={form.control}
                                                name={`bank.${index}.account_number`} // Nama yang unik untuk setiap field jumlah
                                                render={({ field }) => (
                                                    <Input {...field} placeholder="Masukan Nomer Rekening..." type="number" />
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
                                            onClick={() => append({ bank_id: "", account_name: "", account_number: "", id:"" })} // Menambah item baru
                                        >
                                            <Plus className="w-4 h-4 mr-1" /> Tambah item
                                        </Button>
                                        </div>
                                    </CardContent>
                                    </Card>
                                </div>
                                <div className="flex justify-end">
                                    <Button type="submit" disabled={isLoading} className="px-4 py-2 font-semibold rounded-lg" style={{ background: "#F9B421" }}>
                                    {isLoading ? (
                                        <TailSpin
                                        height="20"
                                        width="20"
                                        color="#ffffff"
                                        ariaLabel="loading"
                                        />
                                    ) : (
                                        "Save Profile"
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
                                        <AlertDialogDescription className="">Anda telah berhasil mengubah profile.</AlertDialogDescription>
                                        <AlertDialogAction
                                            onClick={() => router.push('/dashboard')}
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
        </>
    )
}