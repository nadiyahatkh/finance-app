'use client';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ChevronsUpDown, LogIn, LogOut, User } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { TailSpin } from "react-loader-spinner";

export default function StoreSwitcher({ className, items = [] }){
    const [open, setOpen] = useState(false);
    const [showDialogLogOut, setShowDialogLogOut] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const { status, data: session } = useSession();
    const [foto, setFoto] = useState()
    const router = useRouter();
    const isAdminRole = [1, 2, 3, 4].includes(session?.user?.role);
    const isUserRole = session?.user?.role === 5;
    const handleSignOut = () => {
        setIsLoading(true)
        signOut({ callbackUrl: '/sign-in' });
    };

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
                        <AvatarImage src={session?.user?.path} alt="@shadcn" />
                        <AvatarFallback>{session?.user?.name || 'Guest'}</AvatarFallback>
                    </Avatar>
                    <span className="truncate max-w-[120px]">{session?.user?.name || 'Guest'}</span>
                    <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-2">
                <div className="flex flex-col space-y-1">
                            <div className="px-2 py-1 text-sm font-medium text-gray-900">
                                My Account
                            </div>
                            <hr className="my-1 border-gray-200" />
                            {isAdminRole && (
                                <Link href="/update-profile" className="flex items-center p-1 rounded-md hover:bg-gray-100">
                                    <User className="mr-2 h-4 w-4" />
                                    Profile
                                </Link>
                            )}

                            {isUserRole && (
                                <Link href="/user/update-profile" className="flex items-center p-1 rounded-md hover:bg-gray-100">
                                    <User className="mr-2 h-4 w-4" />
                                    Profile
                                </Link>
                            )}
                    
                        {status === 'authenticated' ? (
                        <button className="flex items-center p-1 rounded-md hover:bg-gray-100" onClick={() => setShowDialogLogOut(true)}>
                            <LogOut className="mr-2 h-4 w-4" />
                            Log Out
                        </button>
                    ) : (
                        <button className="flex items-center p-1 rounded-md hover:bg-gray-100" onClick={() => router.push("/sign-in")}>
                            <LogIn className="mr-2 h-4 w-4" />
                            Log In
                        </button>
                    )}

                    <AlertDialog open={showDialogLogOut} onClose={() => setShowDialogLogOut(false)}>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Anda Ingin Keluar Dari Akun {session?.user?.name}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setShowDialogLogOut(false)}>Batal</AlertDialogCancel>
                      <AlertDialogAction onClick={handleSignOut} className="hover:bg-black" style={{ background: "#F9B421" }}>
                                    {isLoading ? (
                                        <TailSpin
                                            height="20"
                                            width="20"
                                            color="#021526"
                                            ariaLabel="loading"
                                        />
                                    ) : (
                                        'Ya'
                                    )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                </div>
            </PopoverContent>
        </Popover>
    )
}