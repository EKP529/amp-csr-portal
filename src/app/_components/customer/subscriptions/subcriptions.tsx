"use client";

import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
} from "@mui/x-data-grid";
import { api } from "~/trpc/react";
import CircularProgress from "@mui/material/CircularProgress";
import dayjs from "dayjs";
import { useState, useContext } from "react";
import { CurrentCustomerContext } from "~/app/_components/customer/customerprovider";
import Button from "@mui/material/Button";
import SubscriptionForm from "./form";
import { type Subscription, type Vehicle } from '@prisma/client';

export type ShowForm = {
  show: boolean;
  editSubscription: boolean;
};
export type SubscriptionData = {
  subscription: Subscription,
  vehicle: Vehicle,
}

export default function SubscriptionList() {
  const context = useContext(CurrentCustomerContext);
  const [showForm, setShowForm] = useState({
    show: false,
    editSubscription: false,
  });
  const [subscriptionData, setSubscriptionData] = useState({} as SubscriptionData);

  const renderOptionsCell = (params: GridRenderCellParams) => {
    return (
      <div className="flex items-center justify-center my-2">
        <Button
          onClick={() => {
            const { vehicle, ...rest } = data!.find((subscription) => subscription.id === params.row.id)!; 
            setSubscriptionData({
              subscription: rest,
              vehicle: vehicle,
            });
            setShowForm({ show: true, editSubscription: true });
          }}
        >
          View
        </Button>
      </div>
    );
  };

  const columns: GridColDef[] = [
    { field: "plan", headerName: "Plan", width: 150 },
    { field: "vehicle", headerName: "Vehicle", width: 250 },
    { field: "licensePlate", headerName: "License Plate", width: 200 },
    { field: "startDate", headerName: "Start Date", width: 150 },
    { field: "endDate", headerName: "End Date", width: 150 },
    { field: "nextBillingDate", headerName: "Next Billing Date", width: 150 },
    { field: "status", headerName: "Status", width: 150 },
    {
      field: "options",
      headerName: "",
      width: 150,
      renderCell: renderOptionsCell,
    },
  ];

  const data = api.subscription.getAllByCustomerId.useQuery({
    customerId: context!.customer.id,
  }).data;

  if (!data) {
    return (
      <div className="mt-56 flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }
  const subsciptionRows = data?.map((subscription) => ({
    id: subscription.id,
    plan: subscription.plan.toString(),
    vehicle: `${subscription.vehicle.make} ${subscription.vehicle.model} (${subscription.vehicle.year})`,
    licensePlate: subscription.vehicle.licensePlate,
    vin: subscription.vehicle.vin,
    startDate: subscription.startDate
      ? dayjs(subscription.startDate).add(1, "day").format("MM/DD/YYYY")
      : "",
    endDate: subscription.endDate
      ? dayjs(subscription.endDate).add(1, "day").format("MM/DD/YYYY")
      : "",
    nextBillingDate: subscription.nextBillingDate
      ? dayjs(subscription.nextBillingDate).add(1, "day").format("MM/DD/YYYY")
      : "",
    status: subscription.status.toString(),
    options: "", // Placeholder for options cell
  }));

  return (
    <div className="flex flex-col h-full w-full items-center justify-center">
      {showForm.editSubscription ? (
        <SubscriptionForm
          subscriptionData={subscriptionData}
          setSubscriptionData={setSubscriptionData}
          setShowForm={setShowForm}
        />
      ) : showForm.show ? (
        <SubscriptionForm setSubscriptionData={setSubscriptionData} setShowForm={setShowForm}/>
      ) : (
        <>
          <div className="mx-2 my-5 flex w-full flex-row items-center justify-center gap-4">
            {/* <LinkButton href="" text="Add a Subscription" /> */}
            <Button
              onClick={() => setShowForm({ show: true, editSubscription: false })}
              variant="contained"
            >
              Add a Subscription
            </Button>
          </div>
          <DataGrid rows={subsciptionRows} columns={columns} showToolbar />
        </>
      )}
    </div>
  );
}
