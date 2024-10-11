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
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, CircleX, CloudDownload, Plus, Trash, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { format } from "date-fns";


export default function AddEmployee() {
    const FormSchema = z.object({
        dob: z.date({
          required_error: "A date of birth is required.",
        }),
      })

    const form = useForm({
        resolver: zodResolver(FormSchema),
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
                            <form action="">
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
                            <div className="mb-4">
                                <Label className="block text-sm mb-2">NIP</Label>
                                <FormField
                                control={form.control}
                                name="nip"
                                render={({ field }) => (
                                <>
                                    <Input {...field} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" placeholder="121300" type="text" />
                                    {/* {form.formState.errors.nip && (
                                    <FormMessage type="error" className="italic">{form.formState.errors.nip.message}</FormMessage>
                                    )} */}
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
                                {/* {form.formState.errors.email && (
                                    <FormMessage type="error" className="italic">{form.formState.errors.email.message}</FormMessage>
                                )} */}
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
                                        // setDepartmentId(value);
                                    }}
                                    {...field}
                                    >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih departement untuk ditampilkan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Fruits</SelectLabel>
                                            <SelectItem value="apple">Apple</SelectItem>
                                            <SelectItem value="banana">Banana</SelectItem>
                                            <SelectItem value="blueberry">Blueberry</SelectItem>
                                            <SelectItem value="grapes">Grapes</SelectItem>
                                            <SelectItem value="pineapple">Pineapple</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                    </Select>
                                    {/* {form.formState.errors.department_id && (
                                        <FormMessage type="error" className="italic">{form.formState.errors.department_id.message}</FormMessage>
                                    )} */}
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
                                        // setPositionId(value);
                                    }}
                                    {...field}
                                    >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih posisi untuk ditampilkan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem>gasakhg</SelectItem>
                                    </SelectContent>
                                    </Select>
                                    {/* {form.formState.errors.position_id && (
                                        <FormMessage type="error" className="italic">{form.formState.errors.position_id.message}</FormMessage>
                                    )} */}
                                </>
                                )}
                                />
                            </div>
                            <div className="flex justify-end">
                            <Button
                            type="submit"
                            // disabled={isLoading}
                            className="px-4 py-2 text-sm font-semibold rounded-lg"
                            style={{ background: "#F9B421" }}
                            >
                            {/* {isLoading ? (
                                <TailSpin
                                height="20"
                                width="20"
                                color="#ffffff"
                                ariaLabel="loading"
                                />
                            ) : (
                                "Tambah Karyawan"
                            )} */}
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