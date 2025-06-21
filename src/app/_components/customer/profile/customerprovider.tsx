import { createContext } from "react";
import { type Customer } from "~/app/_components/customer/customers";

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