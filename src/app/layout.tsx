import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { ThemeProvider } from '@/components/shared/ThemeProvider';

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'], 
  variable: '--font-headline' 
});

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-body' 
});

export const metadata: Metadata = {
  title: "Suva Sanpui | Full Stack Developer",
  description: "Personal portfolio of Suva Sanpui, a passionate Full Stack Developer specializing in the MERN stack and building modern web applications.",
  keywords: ["Suva Sanpui", "Full Stack Developer", "Web Developer", "MERN Stack", "React", "Node.js", "MongoDB", "Portfolio", "JavaScript", "TypeScript"],
  authors: [{ name: "Suva Sanpui" }],
  creator: "Suva Sanpui",
  openGraph: {
    title: "Suva Sanpui | Full Stack Developer",
    description: "Explore the portfolio of Suva Sanpui, showcasing projects and skills in full-stack web development.",
    url: 'https://suva-lumina-portfolio.vercel.app', // Placeholder URL
    siteName: "Suva's Lumina Portfolio",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: "Suva Sanpui's Portfolio",
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    card: 'summary_large_image',
    title: "Suva Sanpui | Full Stack Developer",
    description: "Personal portfolio of Suva Sanpui, a passionate Full Stack Developer.",
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Space+Grotesk:wght@300..700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('font-body antialiased', spaceGrotesk.variable, inter.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main>{children}</main>
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
