"use client";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useState } from "react";
import ProfileInfo from "~/app/_components/customer/profile/profileinfo";
import SubscriptionList from "~/app/_components/customer/subscriptions/subcriptions";
import PurchaseList from "~/app/_components/customer/purchases/purchases";

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

export default function CustomerAccountPage() {
  const [value, setValue] = useState(0);
  // const subcriptions =

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="User Tabs"
        centered
        variant="fullWidth"
        className="border border-gray-500"
      >
        <Tab label="Account" {...TabProps(0)} />
        <Tab label="Subscriptions" {...TabProps(1)} />
        <Tab label="Purchases" {...TabProps(2)} />
      </Tabs>
      <CustomTabPanel 
        value={value} 
        index={0} 
        {...{ className: "" }}
      >
        <ProfileInfo />
      </CustomTabPanel>
      <CustomTabPanel
        value={value}
        index={1}
        {...{ className: "" }}
      >
        <SubscriptionList />
      </CustomTabPanel>
      <CustomTabPanel 
        value={value}
        index={2}
        {...{ className: "" }}
      >
        <PurchaseList />
      </CustomTabPanel>
    </div>
  );
}
