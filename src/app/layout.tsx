import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { TRPCReactProvider } from "~/trpc/react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { AppProvider, type Navigation } from "@toolpad/core/AppProvider";
import { customTheme } from "~/styles/theme";
// import AccountBoxIcon from "@mui/icons-material/AccountBox";
import LogoutIcon from "@mui/icons-material/Logout";
import PeopleIcon from "@mui/icons-material/People";
import LoyaltyIcon from "@mui/icons-material/Loyalty";
import Image from "next/image";

export const metadata: Metadata = {
  title: "AMP Admin Portal",
  description:
    "A portal for customer service representatives to manage customer interactions and support requests.",
  icons: [{ rel: "icon", url: "/amp_favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const navigation: Navigation = [
  {
    segment: "customers",
    title: "Customers",
    icon: <PeopleIcon />,
  },
  {
    segment: "subscriptions",
    title: "Subscriptions",
    icon: <LoyaltyIcon />,
  },
  {
    segment: "api/auth/signout",
    title: "Logout",
    icon: <LogoutIcon />,
  },
];

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        <TRPCReactProvider>
          <AppRouterCacheProvider options={{ enableCssLayer: true }}>
            <AppProvider
              navigation={navigation}
              theme={customTheme}
              branding={{
                logo: (
                  <Image
                    src="/amp-logo.png"
                    alt="AMP logo"
                    width={90}
                    height={60}
                  />
                ),
                title: "",
                homeUrl: "/customers",
              }}
            >
              {children}
            </AppProvider>
          </AppRouterCacheProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
