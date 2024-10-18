'use client'

import { cn } from "@/lib/utils"
import Link from "next/link";
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"

export function MainNav(props) {
    const { className, ...restProps } = props;
    const pathname = usePathname();
    const { data: session } = useSession();
    const userRole = session?.user?.role;

    const routes = [
        {
            href: `/dashboard`,
            label: `Dashboard`,
            active: pathname.startsWith(`/dashboard`),
            roles: [1,2,3,4]
            
        },
        {
            href: `/submission`,
            label: `Pengajuan`,
            active: pathname.startsWith(`/submission`),
            roles: [1,2,3,4]
        },
        {
            href: `/employee-management`,
            label: `Manajemen Karyawan`,
            active: pathname.startsWith(`/employee-management`),
            roles: [1,2,3,4]
        }
    ];

    const filteredRoutes = routes.filter(route => route.roles.includes(userRole));

    return (
        <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
            {filteredRoutes.map((route) => (
                <Link 
                    key={route.href}
                    href={route.href}
                    className={cn(
                        "text-sm font-medium transition-colors hover:text-primary",
                        route.active ? "text-[#F9B421]" : "text-muted-foreground"
                    )}
                >
                    {route.label}
                </Link>
            ))}
        </nav>
    )
}