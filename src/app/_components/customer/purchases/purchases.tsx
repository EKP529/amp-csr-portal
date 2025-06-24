"use client";

import {
  DataGrid,
  type GridColDef,
} from "@mui/x-data-grid";
import { api } from "~/trpc/react";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import dayjs from "dayjs";
import { useContext } from "react";
import { CurrentCustomerContext } from "~/app/_components/customer/customerprovider";

const SINGLE_CAR_WASH_PRODUCT_ID = "cmc3jsxya000007lb09s0c5qz";
const SINGLE_CAR_WASH_PRODUCT_NAME = "Single Car Wash";
const SINGLE_CAR_WASH_PRICE = 24.99; // Replace with actual price if needed

export default function PurchaseList() {
  const context = useContext(CurrentCustomerContext);
  const createPurchase = api.purchase.create.useMutation();
  // const data = Array.from({ length: 100 }, (_, i) => ({
  //   id: `user-${i + 1}`,
  //   name: `User ${i + 1}`,
  //   email: `user${i + 1}@example.com`,
  //   phone: `123-456-789${i}`,
  //   address: `12${i + 1} Example St, City ${i + 1}, GA, USA`,
  //   birthdate: new Date(1990 + i, 0, 1).toLocaleDateString(),
  // }));

  const data = api.purchase.getAllByCustomerId.useQuery({customerId: context!.customer.id,}).data;

  const purchaseRows = data?.map((purchase) => ({
    id: purchase.id,
    productName: purchase.productName,
    quantity: purchase.quantity,
    totalPrice: purchase.productPrice * purchase.quantity,
    purchaseDate: dayjs(purchase.purchaseDate).add(1, "day").format("MM/DD/YYYY")
  }));

  const columns: GridColDef[] = [
    { field: "productName", headerName: "Product Name", width: 250 },
    { field: "quantity", headerName: "Quantity", width: 250 },
    { field: "totalPrice", headerName: "Total Price", width: 150 },
    { field: "purchaseDate", headerName: "Date of Purchase", width: 350 },
  ];

  const handleAddPurchase = () => {
    try {
      // This is just for demonstration purposes.
      const quantity = Number(prompt("Enter the quantity for the car wash:", "1"));
      createPurchase.mutate({
        customerId: context!.customer.id,
        productName: SINGLE_CAR_WASH_PRODUCT_NAME,
        productPrice: SINGLE_CAR_WASH_PRICE, // Replace with actual price
        quantity: quantity || 1, // Default to 1 if no input
        productId: SINGLE_CAR_WASH_PRODUCT_ID, // Replace with actual product ID
      });
      alert("Purchase added successfully!");
    } catch (error) {
      console.error("Error creating purchase:", error);
      alert("Failed to add purchase. Please try again.");
    }
  };

  return (
    <>
      {!data ? (
        <div className="flex h-full items-center justify-center">
          <CircularProgress />
        </div>
      ) : (
        <>
          <div className="mx-2 my-5 flex w-full flex-row items-center justify-center gap-4">
            {/* <LinkButton href="" text="Add a Subscription" /> */}
            <Button
              onClick={handleAddPurchase}
              variant="contained"
            >
              Add a Single Car Wash
            </Button>
          </div>
          <DataGrid rows={purchaseRows} columns={columns} showToolbar />
        </>
      )}
    </>
  );
}
