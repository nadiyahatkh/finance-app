'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSession, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TailSpin, ThreeDots } from "react-loader-spinner";
export default function SignIn(){

    const { data: session, status } = useSession();
    const [error, setError] = useState()    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [value, setValue] = useState({
        email: "",
        password: ""
    })

    const [showPassword, setShowPassword] = useState(false)

    const router = useRouter()

    const handleLogin = async (e) => {
      e.preventDefault();
      
      setError("");
      
      if (!value.email || !value.password) {
        setError("Email and password are required");
        return;
      }
    
      setIsSubmitting(true);
      
      try {
        const res = await signIn("credentials", {
          redirect: false,
          email: value.email,
          password: value.password,
        });
    
        console.log(res);
    
        if (res && !res.error) {
          const session = await getSession();
          const userRole = session?.user?.role;
          if ([1, 2, 3, 4].includes(+userRole)) {
            router.push('/dashboard');
          } else if (+userRole === 5) {
            router.push('/user');
          } else {
            setError("Unauthorized access");
          }
        } else {
          setError("Invalid email or password");
        }
      } catch (error) {
        console.log('Handle login error:', error);
        setError("An unexpected error occurred");
      } finally {
        setIsSubmitting(false);
      }
    };

    useEffect(() => {
      if (status === 'authenticated') {
        if (session?.user?.role === 1, 2, 3, 4) {
          router.push('/dashboard');
        } else {
          router.push('/user');
        }
      }
    }, [status, session, router]);


    return(
        <div className="w-full h-screen flex">
            <div className="relative w-1/2 h-full">
                <img src="./signin.png" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="w-1/2 h-full flex flex-col justify-center p-20">
                <div className="w-full max-w-md mx-auto">
                    <div className="mb-5 text-center">
                        <Label className="text-2xl font-semibold mb-4 block">Sign In</Label>
                    </div>
                    <form className="space-y-2" onSubmit={handleLogin} method="POST">
                        {error && <div className="text-red-600 text-center mb-4">{error}</div>}
                        <Input
                        placeholder="name@example.com"
                        type="email"
                        id="email"
                        className="w-full shadow-sm"
                        onChange={(e) => {
                            setValue({ ...value, email: e.target.value });
                        }}
                        />
                        <div className="relative">
                        <Input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        placeholder="*****"
                        className="w-full shadow-sm"
                        onChange={(e) => {
                            setValue({ ...value, password: e.target.value });
                        }}
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
                        <div className="flex flex-col items-center space-y-4">
                        <Button
                            style={{ backgroundColor: '#F9B421' }}
                            className="text-gray-800 w-full"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <ThreeDots
                                height="20"
                                width="20"
                                color="#021526"
                                ariaLabel="loading"
                                />
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}