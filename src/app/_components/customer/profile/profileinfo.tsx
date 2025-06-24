"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { type Customer } from "@prisma/client";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { CurrentCustomerContext } from "~/app/_components/customer/customerprovider";
import { api } from "~/trpc/react";
import AlertDialog from "~/app/_components/dialog";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function ProfileInfo() {
  const context = useContext(CurrentCustomerContext);
  const router = useRouter();
  const [formData, setFormData] = useState({} as Customer);
  const [disabled, setDisabled] = useState({ fields: true, save: true });
  // const [disabled, setDisabled] = useState(true);
  // const [disabledSave, setDisabledSave] = useState(false);
  const [showDialogs, setShowDialogs] = useState({
    cancel: false,
    save: false,
    delete: false,
  });
  // const [showCancelDialog, setShowCancelDialog] = useState(false);
  // const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const updateCustomer = api.customer.update.useMutation();
  const deleteCustomer = api.customer.delete.useMutation();

  useEffect(() => {
    if (context?.customer) {
      setFormData(context.customer);
      setLoading(false);
    }
  }, [context?.customer]);

  useEffect(() => {
    if (validateFormData(formData)) {
      // setDisabledSave(false);
      setDisabled((disabled) => ({ ...disabled, save: false }));
    } else {
      setDisabled((disabled) => ({ ...disabled, save: true }));
    }
  }, [formData]);

  const handleEdit = () => {
    // setDisabled(!disabled);
    setDisabled((disabled) => ({ ...disabled, fields: !disabled.fields }));
  };
  const handleCancel = () => {
    // setDisabled(!disabled);
    setDisabled((disabled) => ({ ...disabled, fields: !disabled.fields }));
    setFormData(context!.customer);
    setShowDialogs({ ...showDialogs, cancel: false });
  };

  const validateFormData = (data: Customer) => {
    return (
      data.name &&
      data.name !== "" &&
      data.email &&
      data.email !== "" &&
      data.birthdate
    );
  };

  const handleSave = () => {
    if (validateFormData(formData)) {
      try {
        updateCustomer.mutate({
          id: context!.customer.id,
          data: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone ?? undefined,
            address: formData.address ?? undefined,
            birthdate: formData.birthdate,
          },
        });
        // setDisabled(true);
        setDisabled((disabled) => ({ ...disabled, fields: true }));
        context!.setCustomer(formData);
        // setShowSaveDialog(false);
        setShowDialogs({ ...showDialogs, save: false });
        alert("Customer updated successfully!");
      } catch (error) {
        console.error("Error updating customer:", error);
        // setShowSaveDialog(false);
        setShowDialogs({ ...showDialogs, save: false });
        alert("Failed to update customer. Please try again.");
      }
    } else {
      // setShowSaveDialog(false);
      setShowDialogs({ ...showDialogs, save: false });
      alert("Please fill in all required fields.");
    }
  };

  const handleDelete = () => {
    try {
      deleteCustomer.mutate({ id: context!.customer.id });
      context?.setCustomer({} as Customer);
      router.push("/customers");
      alert("Customer deleted successfully!");
    } catch (error) {
      console.error("Error deleting customer:", error);
      alert("Failed to delete customer. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="mt-56 flex flex-col items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center justify-center py-10 text-center shadow-2xl">
      <Box
        color={"secondary.main"}
        className="mt-2 mb-16 text-4xl font-semibold underline"
      >
        {context?.customer.name ?? "Customer Profile"}
      </Box>
      <div className="flex w-3/9 flex-col items-start gap-10">
        <TextField
          disabled={disabled.fields}
          required
          className="w-5/9"
          error={!formData.name || formData.name === ""}
          helperText={
            !formData.name || formData.name === "" ? "Name is required" : ""
          }
          id="customer-name"
          label="Name"
          variant="standard"
          value={formData.name ?? ""}
          onChange={(e) => {
            const customerName = e.target.value;
            if (formData) {
              setFormData({
                ...formData,
                name: customerName,
              });
            }
          }}
        />
        <TextField
          disabled={disabled.fields}
          className="w-5/6"
          required
          error={!formData.email || formData.email === ""}
          helperText={
            !formData.email || formData.email === "" ? "Email is required" : ""
          }
          id="customer-email"
          label="Email"
          variant="standard"
          type="email"
          value={formData.email ?? ""}
          onChange={(e) => {
            const customerEmail = e.target.value;
            if (formData) {
              setFormData({
                ...formData,
                email: customerEmail,
              });
            }
          }}
        />
        <TextField
          disabled={disabled.fields}
          className="3/9"
          id="customer-phone"
          label="Phone"
          type="tel"
          variant="standard"
          value={formData.phone ?? ""}
          onChange={(e) => {
            const customerPhone = e.target.value;
            if (formData) {
              setFormData({
                ...formData,
                phone: customerPhone,
              });
            }
          }}
        />
        <TextField
          disabled={disabled.fields}
          fullWidth
          id="customer-address"
          label="Address"
          variant="standard"
          value={formData.address ?? ""}
          onChange={(e) => {
            const customerAddress = e.target.value;
            if (formData) {
              setFormData({
                ...formData,
                address: customerAddress,
              });
            }
          }}
        />
        <TextField
          disabled={disabled.fields}
          required
          className="w-1/4"
          error={!formData.birthdate}
          helperText={!formData.name ? "Date of Birth is required" : ""}
          id="customer-birthdate"
          label="Date of Birth"
          variant="standard"
          value={formData.birthdate?.toISOString().split("T")[0] ?? ""}
          type="date"
          onChange={(e) => {
            const birthday = new Date(e.target.value);
            if (formData) {
              setFormData({
                ...formData,
                birthdate: birthday,
              });
            }
          }}
        />
        <div className="mt-2 flex w-full flex-row justify-center gap-6">
          <Button
            variant={disabled ? "contained" : "outlined"}
            onClick={
              disabled
                ? handleEdit
                : () => {
                    if (
                      JSON.stringify(formData) !==
                      JSON.stringify(context?.customer)
                    ) {
                      // setShowCancelDialog(true);
                      setShowDialogs({ ...showDialogs, cancel: true });
                    } else {
                      handleCancel();
                    }
                  }
            }
            color={disabled ? undefined : "error"}
          >
            {disabled ? "Edit" : "Cancel"}
          </Button>
          <AlertDialog
            title="Unsaved Changes"
            text="You have unsaved changes. Are you sure you want to proceed?"
            showDialog={showDialogs.cancel}
            onCancel={() => setShowDialogs({ ...showDialogs, cancel: false })}
            onConfirm={handleCancel}
          />
          <Button
            variant="contained"
            onClick={() => setShowDialogs({ ...showDialogs, save: true })}
            disabled={disabled.fields || disabled.save}
          >
            Save
          </Button>
          <AlertDialog
            title="Confirm Updates"
            text="Are you sure you want to save these changes to the customer?"
            showDialog={showDialogs.save}
            onCancel={() => setShowDialogs({ ...showDialogs, save: false })}
            onConfirm={handleSave}
          />
        </div>
        <div className="mt-10 flex w-full flex-col items-center justify-center">
          {/* <LinkButton size="large" href="/customers" text="Back to Customers" /> */}
          <Button
            color="secondary"
            variant="outlined"
            className="h-1/2 w-1/3"
            onClick={() => {
              if (
                JSON.stringify(formData) !== JSON.stringify(context?.customer)
              ) {
                setShowDialogs({ ...showDialogs, cancel: true });
              }
              context?.setCustomer({} as Customer);
              router.push("/customers");
            }}
          >
            Back to Customers
          </Button>
          <Button
            color="error"
            variant="contained"
            className="mt-8 mb-2 w-2/3"
            onClick={() => setShowDialogs({ ...showDialogs, delete: true })}
          >
            Delete Account
          </Button>
          <AlertDialog
            title="Confirm Deletion"
            text={`${context?.customer.name}'s account will be deleted. This change cannot be undone. Are you sure you want to proceed?`}
            showDialog={showDialogs.delete}
            onCancel={() => setShowDialogs({ ...showDialogs, delete: false })}
            onConfirm={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}
