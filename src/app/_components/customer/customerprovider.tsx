import { createContext } from "react";
import { type Customer } from "@prisma/client";

export const CurrentCustomerContext = createContext<
  | {
      customer: Customer;
      setCustomer: React.Dispatch<React.SetStateAction<Customer>>;
    }
  | undefined
>(undefined);

export default function CustomerContextProvider({
  customer,
  setCustomer,
  children,
}: {
  customer: Customer;
  setCustomer: React.Dispatch<React.SetStateAction<Customer>>;
  children: React.ReactNode;
}) {
  return (
    <CurrentCustomerContext value={{ customer, setCustomer }}>
      {children}
    </CurrentCustomerContext>
  );
}