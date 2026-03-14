import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-heading",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Arokiyam',
  description:
    'Arokiyam is health companion app for everyone. It helps you to track your health and fitness goals, and provides you with personalized recommendations based on your health data.'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${poppins.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  )
}
