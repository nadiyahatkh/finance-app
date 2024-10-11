'use client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ChevronsUpDown, LogIn, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function StoreSwitcher({ className, items = [] }){
    const [open, setOpen] = useState(false);
    const router = useRouter();
    return(
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button 
                    variant="outline"
                    size="sm"
                    role="combobox"
                    aria-expanded={open}
                    aria-label="Select a store"
                    className={cn("w-[200px] justify-between", className)}
                >
                    <Avatar className="w-4 h-4 rounded-full mr-2">
                        <AvatarImage src="./signin.png" alt="@shadcn" />
                        <AvatarFallback>Nad</AvatarFallback>
                    </Avatar>
                    {/* <img src={profileImage} alt="Profile Image" className="w-4 h-4 rounded-full mr-2" /> */}
                    {/* {session?.user?.name || 'Guest'} */}
                    Nadiyah
                    <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-2">
                <div className="flex flex-col space-y-1">
                        <>
                            <div className="px-2 py-1 text-sm font-medium text-gray-900">
                                My Account
                            </div>
                            <hr className="my-1 border-gray-200" />
                            <Link href="./profile" className="flex items-center p-1 rounded-md hover:bg-gray-100">
                                <User className="mr-2 h-4 w-4" />
                                Profile
                            </Link>
                        </>
                    
                        <button className="flex items-center p-1 rounded-md hover:bg-gray-100" onClick={() => router.push("/sign-in")}>
                            <LogIn className="mr-2 h-4 w-4" />
                            Log In
                        </button>
                    {/* <AlertDialog open={showDialogLogOut} onClose={() => setShowDialogLogOut(false)}>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Anda Ingin Keluar Dari Akun {session?.user?.name}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setShowDialogLogOut(false)}>Batal</AlertDialogCancel>
                      <AlertDialogAction onClick={handleSignOut}>
                                    {isLoading ? (
                                        <TailSpin
                                            height="20"
                                            width="20"
                                            color="#ffffff"
                                            ariaLabel="loading"
                                        />
                                    ) : (
                                        'Ya'
                                    )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog> */}
                </div>
            </PopoverContent>
        </Popover>
    )
}