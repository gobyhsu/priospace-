import "./globals.css";

import { Nunito } from "next/font/google";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-nunito",
});

export const metadata = {
  title: "优事空间 PrioSpace",
  description: "专注于重要的事。",
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body
        className={`${nunito.variable} antialiased font-nunito`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
