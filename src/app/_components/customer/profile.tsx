"use client";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useParams } from "next/navigation";
import { useState, createContext, useEffect } from "react";
import AccountInfoPage from "./account";
import { type Customer } from "./customers";
import { api } from "~/trpc/react";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <>{children}</>}
    </div>
  );
}

function TabProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export const CurrentCustomerContext = createContext<
  | {
      customer: Customer;
      setCustomer: React.Dispatch<React.SetStateAction<Customer>>;
    }
  | undefined
>(undefined);

export default function CustomerProfilePage() {
  const [value, setValue] = useState(0);
  const { customer_id } = useParams<{ customer_id: string }>();
  const [customer, setCustomer] = useState({} as Customer);

  const customerData = api.customer.getById.useQuery({ id: customer_id })
    .data as Customer;

  useEffect(() => {
    if (customerData) {
      setCustomer(customerData);
    }
  }, [customerData]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <CurrentCustomerContext value={{ customer, setCustomer }}>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="User Tabs"
        centered
        variant="fullWidth"
        className="border-b border-gray-600"
      >
        <Tab label="Account" {...TabProps(0)} />
        <Tab label="Subscriptions" {...TabProps(1)} />
        <Tab label="Purchases" {...TabProps(2)} />
      </Tabs>
      <CustomTabPanel value={value} index={0} {...{ className: "w-1/3" }}>
        <AccountInfoPage />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        Item Two
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        Item Three
      </CustomTabPanel>
    </CurrentCustomerContext>
  );
}
