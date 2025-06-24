"use client";

import { useState } from "react";
import CustomerContextProvider from "~/app/_components/customer/customerprovider";
import { type Customer } from "@prisma/client";

export default function CustomersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [customer, setCustomer] = useState({} as Customer);
  return (
    <CustomerContextProvider customer={customer} setCustomer={setCustomer}>
      {children}
    </CustomerContextProvider>
  );
}
