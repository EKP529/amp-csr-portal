"use client";

import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
} from "@mui/x-data-grid";
import Link from "next/link";
import { api } from "~/trpc/react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string | undefined;
  address: string | undefined;
  birthdate: Date;
};

const renderOptionsCell = (params: GridRenderCellParams) => {
  return (
    <div className="flex items-center justify-center gap-2">
      <Box
        color={"secondary.main"}
      >
        <Link
          // className="hover:text-secondary text-blue-500"
          href={`/customers/${params.row.id}`}
        >
          View
        </Link>
      </Box>
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

export default function CustomerList() {
  // const data = Array.from({ length: 100 }, (_, i) => ({
  //   id: `user-${i + 1}`,
  //   name: `User ${i + 1}`,
  //   email: `user${i + 1}@example.com`,
  //   phone: `123-456-789${i}`,
  //   address: `12${i + 1} Example St, City ${i + 1}, GA, USA`,
  //   birthdate: new Date(1990 + i, 0, 1).toLocaleDateString(),
  // }));
  const data = api.customer.getAllDisplay.useQuery().data;
  if (!data) {
    return (
      <div className="flex h-full items-center justify-center">
        <CircularProgress />
      </div>
    );
  }
  const customerRows = data?.map((customer) => ({
    id: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    address: customer.address,
    birthdate: customer.birthdate.toLocaleDateString(),
    options: "", // Placeholder for options cell
  }));

  return (
    <DataGrid
      // columnVisibilityModel={{ id: false }}
      rows={customerRows}
      columns={columns}
      showToolbar
    />
  );
}
