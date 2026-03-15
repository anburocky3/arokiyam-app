import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'

const inter = Inter({
  variable: '--font-body',
  subsets: ['latin']
})

const poppins = Poppins({
  variable: '--font-heading',
  weight: ['400', '500', '600', '700'],
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'Arokiyam | The Open Source Wellness App for Developers',
  description:
    'Boost your productivity and maintain your health with Arokiyam. A free, open-source desktop wellness app designed specifically for computer professionals. Features include eye rest reminders, posture alerts, and productivity tracking.',
  keywords: [
    'Arokiyam',
    'wellness app',
    'developer wellness',
    'eye strain prevention',
    'open source health app',
    'desktop wellness',
    'productivity tools',
    'cross-platform app',
    'health tracker for programmers'
  ],
  authors: [{ name: 'Anbuselvan Annamalai' }],
  creator: 'Anbuselvan Annamalai',
  publisher: 'Anbuselvan Annamalai',
  formatDetection: {
    email: false,
    address: false,
    telephone: false
  },
  openGraph: {
    title: 'Arokiyam | The Open Source Wellness App for Developers',
    description:
      'Take control of your wellness with Arokiyam. Eye rest, posture alerts, and posture correction for better coding health.',
    url: 'https://arokiyam.vercel.app',
    siteName: 'Arokiyam',
    images: [
      {
        url: '/images/1.png',
        width: 1200,
        height: 630,
        alt: 'Arokiyam App Preview'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Arokiyam | Open Source Desktop Wellness App',
    description:
      'Protect your health while you code. Arokiyam helps developers prevent eye strain and maintain good posture.',
    images: ['/images/1.png'],
    creator: '@anburocky3'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png'
  }
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Arokiyam',
  operatingSystem: 'Windows, macOS, Linux',
  applicationCategory: 'HealthApplication',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD'
  },
  description:
    'Arokiyam is an open-source cross-platform desktop application for managing your personal health and wellness while increasing your productivity.',
  author: {
    '@type': 'Person',
    name: 'Anbuselvan Annamalai'
  }
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} ${poppins.variable} antialiased`}>{children}</body>
    </html>
  )
}
