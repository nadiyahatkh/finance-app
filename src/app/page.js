'use client'
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { TailSpin } from "react-loader-spinner";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/sign-in');
    }
  }, [status]);

  if (status === "loading") {
    return (
        <div className="w-full h-screen flex justify-center items-center">
            <TailSpin height="80" width="80" color="#021526" ariaLabel="loading" />
        </div>
    );
}
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Button>Ini Button</Button>
    </div>
  );
}
