import type { Metadata } from 'next'
import './globals.css'

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
    <html lang="en">
      <body className={` antialiased`}>{children}</body>
    </html>
  )
}
