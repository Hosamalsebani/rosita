import type { Metadata } from "next";
import { Cairo, Inter } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Roshita - منصة روشتة الصحية",
  description: "منصة روشتة الطبية الشاملة - لوحات تحكم الأدمن والطبيب والصيدلي",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${inter.variable}`}>
      <body style={{ margin: 0, padding: 0, fontFamily: "'Cairo', 'Inter', sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
