'use client'
import { Card } from "@/components/ui/card";
import StoreSwitcher from "./StoreSwitcher";
import { MainNav } from "@/components/MainNav";
import { usePathname } from "next/navigation";

const disabledNavbar = ["/sign-in"];



export default function Navbar() {
    const pathname = usePathname();

  if (disabledNavbar.includes(pathname)) {
    return <div></div>;
  }
    return (
        <div className="border-b">
            <div className="flex h-16 items-center px-4">
                <StoreSwitcher items={[]} />
                <MainNav className="mx-6" />
            </div>
        </div>
    )
} 