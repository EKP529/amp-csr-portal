"use client";

import { useContext, useEffect, useState } from "react";
import { type Customer } from "@prisma/client";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { CurrentCustomerContext } from "~/app/_components/customer/customerprovider";
import { api } from "~/trpc/react";
import AlertDialog from "~/app/_components/dialog";
import CircularProgress from "@mui/material/CircularProgress";

export default function ProfileInfo() {
  const context = useContext(CurrentCustomerContext);
  const [formData, setFormData] = useState({} as Customer);
  const [disabled, setDisabled] = useState(true);
  const [disabledSave, setDisabledSave] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const updateCustomer = api.customer.update.useMutation();

  useEffect(() => {
    if (context?.customer) {
      setFormData(context.customer);
      setLoading(false);
    }
  }, [context?.customer]);

  useEffect(() => {
    if (validateFormData(formData)) {
      setDisabledSave(false);
    } else {
      setDisabledSave(true);
    }
  }, [formData]);

  const handleEdit = () => {
    setDisabled(!disabled);
  };
  const handleCancel = () => {
    setDisabled(!disabled);
    setFormData(context!.customer);
    setShowCancelDialog(false);
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
      setDisabled(true);
      context!.setCustomer(formData);
      setShowSaveDialog(false);
      alert("Customer updated successfully!");
    } else {
      alert("Please fill in all required fields.");
      setShowSaveDialog(false);
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
    <div className="flex w-full flex-col items-start justify-center gap-10 border border-gray-500 py-24 text-center shadow-2xl px-10">
      <div className="flex flex-col items-start gap-10 w-full">
        <TextField
          disabled={disabled}
          required
          fullWidth
          error={!formData.name || formData.name === ""}
          helperText={!formData.name || formData.name === "" ? "Name is required" : ""}
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
          disabled={disabled}
          fullWidth
          required
          error={!formData.email || formData.email === ""}
          helperText={!formData.email || formData.email === "" ? "Email is required" : ""}
          id="customer-email"
          label="Email"
          variant="standard"
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
          disabled={disabled}
          fullWidth
          id="customer-phone"
          label="Phone"
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
          disabled={disabled}
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
          disabled={disabled}
          required
          className="w-1/2"
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
      </div>
      <div className="flex flex-row w-full justify-center">
        <Button
          onClick={disabled ? handleEdit : () => setShowCancelDialog(true)}
          color={disabled ? undefined : "error"}
        >
          {disabled ? "Edit" : "Cancel"}
        </Button>
        <AlertDialog
          title="Unsaved Changes"
          text="You have unsaved changes. Are you sure you want to cancel?"
          showDialog={showCancelDialog}
          onCancel={() => setShowCancelDialog(false)}
          onConfirm={handleCancel}
        />
        <Button onClick={() => setShowSaveDialog(true)} disabled={disabled || disabledSave}>
          Save
        </Button>
        <AlertDialog
          title="Confirm Updates"
          text="Are you sure you want to save these changes to the customer?"
          showDialog={showSaveDialog}
          onCancel={() => setShowSaveDialog(false)}
          onConfirm={handleSave}
        />
      </div>
    </div>
  );
}
