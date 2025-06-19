import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { TRPCReactProvider } from "~/trpc/react";
import { AppRouterCacheProvider} from "@mui/material-nextjs/v15-appRouter"

export const metadata: Metadata = {
  title: "AMP Customer Service Rep Portal",
  description: "A portal for customer service representatives to manage customer interactions and support requests.",
  icons: [{ rel: "icon", url: "/amp_favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        <TRPCReactProvider>
          <AppRouterCacheProvider options={{ enableCssLayer: true }}>
            {children}
          </AppRouterCacheProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
