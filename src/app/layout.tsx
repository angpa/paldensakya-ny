import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vikramasila Foundation | Palden Sakya Center New York",
  description:
    "The Vikramasila Foundation is a nonprofit charitable organization dedicated to bringing meditation and the wisdom of the Buddha to the West, established under the auspices of His Holiness Sakya Trichen and directed by Venerable Khenpo Pema Wangdak.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-sakya-crimson/15 selection:text-sakya-crimson">
        {children}
      </body>
    </html>
  );
}
