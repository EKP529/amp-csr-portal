"use client";

import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
} from "@mui/x-data-grid";
import { api } from "~/trpc/react";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { CurrentCustomerContext } from "~/app/_components/customer/customerprovider";
import { type Customer } from '@prisma/client'

export default function CustomerList() {
  const context = useContext(CurrentCustomerContext);
  const router = useRouter();

  // const data = Array.from({ length: 100 }, (_, i) => ({
  //   id: `user-${i + 1}`,
  //   name: `User ${i + 1}`,
  //   email: `user${i + 1}@example.com`,
  //   phone: `123-456-789${i}`,
  //   address: `12${i + 1} Example St, City ${i + 1}, GA, USA`,
  //   birthdate: new Date(1990 + i, 0, 1).toLocaleDateString(),
  // }));

  const data: Customer[] | undefined  = api.customer.getAll.useQuery().data;

  const customerRows = data?.map((customer) => ({
    id: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    address: customer.address,
    birthdate: dayjs(customer.birthdate).add(1, "day").format("MM/DD/YYYY"),
    options: "", // Placeholder for options cell
  }));

  const renderOptionsCell = (params: GridRenderCellParams) => {
    return (
      <div className="flex items-center justify-center m-2">
        <Button
          size="small"
          variant="contained"
          onClick={() => {
            context?.setCustomer(data!.find((customer) => customer.id === params.row.id)!);
            router.push(`/customers/${params.row.name}`);
          }}
        >
          View
        </Button>
      </div>
    );
  };

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", width: 250 },
    { field: "email", headerName: "Email", width: 250 },
    { field: "phone", headerName: "Phone", width: 150 },
    { field: "address", headerName: "Address", width: 350 },
    { field: "birthdate", headerName: "Birthday", width: 200 },
    {
      field: "options",
      headerName: "",
      width: 150,
      renderCell: renderOptionsCell,
    },
  ];

  return (
    <>
      {!data ? (
        <div className="flex h-full items-center justify-center">
          <CircularProgress />
        </div>
      ) : (
        <DataGrid rows={customerRows} columns={columns} showToolbar />
      )}
    </>
  );
}
