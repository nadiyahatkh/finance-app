import localFont from "next/font/local";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "./navbar";
import NextAuth from "@/lib/next-auth/NextAuth";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})
// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

export const metadata = {
  title: "Finance App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable)}
      >
        <NextAuth>

          <Navbar />
          {children}
        </NextAuth>
      </body>
    </html>
  );
}
