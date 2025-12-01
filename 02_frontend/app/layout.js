import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Item Manager",
  description: "จัดการสินค้าและคลังสินค้า",
  icons: {
    icon: "/download.png", // ตรงนี้จะชี้ไปไฟล์ใน public/
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>📦 Item Manager</title>
        <link rel="icon" href="/download.png" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

