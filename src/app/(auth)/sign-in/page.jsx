import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignIn(){
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
                    <form className="space-y-2">
                        {/* {error && <div className="text-red-600 text-center mb-4">{error}</div>} */}
                        <Input
                        placeholder="name@example.com"
                        type="email"
                        id="email"
                        className="w-full shadow-sm"
                        // onChange={(e) => {
                        //     setValue({ ...value, email: e.target.value });
                        // }}
                        />
                        <Input
                        type="password"
                        id="password"
                        placeholder="*****"
                        className="w-full shadow-sm"
                        // onChange={(e) => {
                        //     setValue({ ...value, password: e.target.value });
                        // }}
                        />
                        <div className="flex flex-col items-center space-y-4">
                        <Button
                            style={{ backgroundColor: '#F9B421' }}
                            className="text-gray-800 w-full"
                            type="submit"
                            // disabled={isSubmitting}
                        >
                            {/* {isSubmitting ? (
                                <TailSpin
                                height="20"
                                width="20"
                                color="#ffffff"
                                ariaLabel="loading"
                                />
                            ) : (
                                "Sign In"
                            )} */}
                            Sign In
                        </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}