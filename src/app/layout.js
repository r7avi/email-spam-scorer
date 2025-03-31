import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Email Spam Scorer",
  description: "Test your email deliverability and spam score",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans bg-gray-900 text-white`}>
        {children}
      </body>
    </html>
  );
}
