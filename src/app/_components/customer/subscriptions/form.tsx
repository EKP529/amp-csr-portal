"use client";

import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import AlertDialog from "../../dialog";
import {
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { api } from "~/trpc/react";
import { type ShowForm, type SubscriptionData } from "./subcriptions";
import {
  Status,
  type Subscription,
  SubscriptionType,
  type Vehicle,
} from "@prisma/client";
import dayjs from "dayjs";
import { CurrentCustomerContext } from "../customerprovider";

const getSubscriptionProductDetails = (status: SubscriptionType) => {
  switch (status) {
    case SubscriptionType.STANDARD:
      return {
        id: "cmc3jvj35000107lb3ngvh2yv",
        name: "Standard Monthly Subscription",
        price: 44.99,
      };
    case SubscriptionType.PREMIUM:
      return {
        id: "cmc3jy2mr000207lbgclh4nsk",
        name: "Premium Monthly Subscription",
        price: 74.99,
      };
    case SubscriptionType.PREMIUM_PLUS:
      return {
        id: "cmc3jzkt3000307lbgpbs5xzs",
        name: "Premium Yearly Subscription",
        price: 199.99,
      };
    default:
      return {
        id: "",
        name: "",
        price: 0,
      };
  }
}

const getSubscriptionEndDate = (
  startDate: Date,
  plan: SubscriptionType,
): Date => {
  const duration = plan === SubscriptionType.PREMIUM_PLUS ? 12 : 1; // months
  return dayjs(startDate).add(duration, "month").toDate();
};

const validateFormData = (vehicle: Vehicle): boolean => {
  return (
    vehicle.make !== "" && vehicle.model !== "" && vehicle.licensePlate !== ""
  );
};
const blankSubscription: Subscription = {
  id: "",
  customerId: "",
  vehicleId: "",
  purchaseId: "",
  plan: SubscriptionType.STANDARD,
  startDate: new Date(Date.now()),
  endDate: getSubscriptionEndDate(
    new Date(Date.now()),
    SubscriptionType.STANDARD,
  ),
  nextBillingDate: null,
  status: Status.ACTIVE,
};

const blankVehicle: Vehicle = {
  id: "",
  customerId: "",
  subscriptionId: "",
  make: "",
  model: "",
  year: new Date(Date.now()).getFullYear(),
  vin: "",
  color: "",
  licensePlate: "",
};

export default function SubscriptionForm({
  subscriptionData,
  setSubscriptionData,
  setShowForm,
}: {
  subscriptionData?: SubscriptionData;
  setSubscriptionData: Dispatch<SetStateAction<SubscriptionData>>;
  setShowForm: Dispatch<SetStateAction<ShowForm>>;
}) {
  const context = useContext(CurrentCustomerContext);
  const [disabled, setDisabled] = useState({
    fields: subscriptionData ? true : false,
    submit: true,
  });
  const [subscriptionStatus, setSubscriptionStatus] = useState<Status>(
    subscriptionData?.subscription.status ?? Status.ACTIVE,
  );
  // const [disabled, setDisabled] = useState(subscriptionData ? true : false);
  // const [disabledSubmit, setDisabledSubmit] = useState(true);
  const [showDialogs, setShowDialogs] = useState({
    submit: false,
    cancel: false,
    deactivate: false,
  });
  // const [showCancelDialog, setShowCancelDialog] = useState(false);
  // const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [formData, setFormData] = useState({
    subscription: blankSubscription,
    vehicle: blankVehicle,
  });
  const updateSubsciption = api.subscription.update.useMutation();
  const createSubscription = api.subscription.createWithVehicle.useMutation();

  useEffect(() => {
    if (subscriptionData) {
      setFormData(subscriptionData);
    }
  }, [subscriptionData]);

  useEffect(() => {
    if (validateFormData(formData.vehicle)) {
      // setDisabledSubmit(false);
      setDisabled((disabled) => ({ ...disabled, submit: false }));
    } else {
      // setDisabledSubmit(true);
      setDisabled((disabled) => ({ ...disabled, submit: true }));
    }
  }, [formData]);

  const handleEdit = () => {
    // setDisabled(!disabled);
    setDisabled({ ...disabled, fields: false });
  };
  const handleCancel = () => {
    // setDisabled(!disabled);
    setDisabled({ ...disabled, fields: true });
    setFormData(subscriptionData!);
    // setShowCancelDialog(false);
    setShowDialogs({ ...showDialogs, cancel: false });
  };
  const handleSubmit = () => {
    if (validateFormData(formData.vehicle)) {
      try {
        if (subscriptionData) {
          updateSubsciption.mutate({
            id: subscriptionData.subscription.id,
            plan: formData.subscription.plan,
            startDate: formData.subscription.startDate,
            endDate: formData.subscription.endDate,
            nextBillingDate: formData.subscription.nextBillingDate ?? undefined,
            status: formData.subscription.status,
            vehicleId: formData.vehicle.id,
          });
        } else {
          const { id, name, price } = getSubscriptionProductDetails(
            formData.subscription.plan,
          );
          createSubscription.mutate({
            status: Status.ACTIVE,
            startDate: formData.subscription.startDate,
            endDate: formData.subscription.endDate,
            nextBillingDate: formData.subscription.nextBillingDate ?? undefined,
            plan: formData.subscription.plan,
            vehicle: {
              make: formData.vehicle.make,
              model: formData.vehicle.model,
              year: formData.vehicle.year,
              vin: formData.vehicle.vin ?? undefined,
              color: formData.vehicle.color,
              licensePlate: formData.vehicle.licensePlate,
            },
            customerId: context!.customer.id,
            productId: id,
            productPrice: price,
            productName: name,
          });
        }
        setDisabled({ ...disabled, fields: true });
        // setShowSubmitDialog(false);
        setShowDialogs({ ...showDialogs, submit: false });
        setSubscriptionData(formData);
        setShowForm({ show: false, editSubscription: true });
        alert("Submission successful!");
      } catch (e) {
        console.log("Error creating subscription: ", e);
        alert("Unable to complete submission. Please try again later.");
      }
    } else {
      alert("Please fill in all required fields.");
      // setShowSubmitDialog(false);
      setShowDialogs({ ...showDialogs, submit: false });
    }
  };
  const handleStatusChange = () => {
    try {
      if (subscriptionStatus === Status.ACTIVE) {
        updateSubsciption.mutate({
          id: subscriptionData!.subscription.id,
          status: Status.CANCELED,
        });
        setSubscriptionStatus(Status.CANCELED);
        setDisabled({ ...disabled, fields: true });
        setFormData({
          ...formData,
          subscription: {
            ...formData.subscription,
            status: Status.CANCELED,
          },
        });
        setSubscriptionData({
          ...subscriptionData!,
          subscription: {
            ...subscriptionData!.subscription,
            status: Status.CANCELED,
          },
        });
        setShowDialogs({ ...showDialogs, submit: false });
        alert("Subscription canceled successfully!");
      } else {
        updateSubsciption.mutate({
          id: subscriptionData!.subscription.id,
          status: Status.ACTIVE,
        });
        setSubscriptionStatus(Status.ACTIVE);
        setDisabled({ ...disabled, fields: true });
        setFormData({
          ...formData,
          subscription: {
            ...formData.subscription,
            status: Status.CANCELED,
          },
        });
        setSubscriptionData({
          ...subscriptionData!,
          subscription: {
            ...subscriptionData!.subscription,
            status: Status.CANCELED,
          },
        });
        setShowDialogs({ ...showDialogs, submit: false });
        alert("Subscription activated successfully!");
      }
    } catch (error) {
      console.error("Error updating subscription status:", error);
      alert("Failed to update subscription status. Please try again.");
    }
  };

  return (
    <div className="flex w-5/6 flex-col items-center justify-center gap-4 py-16">
      <Box
        color={"secondary.main"}
        className="mb-5 text-3xl font-semibold underline"
      >
        Subscription Details
      </Box>
      <div className="mb-6 flex min-w-4/7 flex-row items-center justify-center gap-5">
        <TextField
          disabled={subscriptionData ? disabled.fields : false}
          className="w-2/7"
          label="Plan"
          select
          variant="standard"
          fullWidth
          defaultValue={SubscriptionType.STANDARD}
          onChange={(e) => {
            const selectedPlan = e.target.value as SubscriptionType;
            setFormData({
              subscription: {
                ...formData.subscription,
                plan: selectedPlan,
                endDate: getSubscriptionEndDate(
                  formData.subscription.startDate,
                  selectedPlan,
                ),
              },
              vehicle: formData.vehicle,
            });
          }}
        >
          <MenuItem value={SubscriptionType.STANDARD}>
            {SubscriptionType.STANDARD}
          </MenuItem>
          <MenuItem value={SubscriptionType.PREMIUM}>
            {SubscriptionType.PREMIUM}
          </MenuItem>
          <MenuItem value={SubscriptionType.PREMIUM_PLUS}>
            {SubscriptionType.PREMIUM_PLUS}
          </MenuItem>
        </TextField>
        <TextField
          disabled
          className="w-2/5"
          label="Start Date"
          type="date"
          variant="standard"
          fullWidth
          value={new Date(Date.now()).toISOString().split("T")[0]}
        />
        <TextField
          disabled
          className="w-2/5"
          label="End Date"
          type="date"
          variant="standard"
          fullWidth
          value={formData.subscription.endDate?.toISOString().split("T")[0]}
        />
      </div>
      <Box
        color={"secondary.main"}
        className="mb-5 text-3xl font-semibold underline"
      >
        Vehicle Details
      </Box>
      <div className="mb-6 flex min-w-4/7 flex-col items-center justify-center gap-4">
        <div className="mb-6 flex flex-row items-center justify-center gap-5"></div>
        <div className="mb-6 flex flex-row items-center justify-center gap-5"></div>
      </div>
      <Grid
        container
        rowSpacing={4}
        columnSpacing={2}
        className="w-full items-center justify-center"
      >
        <Grid size={12}></Grid>
        <Grid size={2}>
          <TextField
            disabled={subscriptionData ? disabled.fields : false}
            required
            className=""
            label="Make"
            variant="standard"
            fullWidth
            value={formData.vehicle.make}
            onChange={(e) => {
              setFormData({
                ...formData,
                vehicle: {
                  ...formData.vehicle,
                  make: e.target.value,
                },
              });
            }}
          />
        </Grid>
        <Grid size={3}>
          <TextField
            disabled={subscriptionData ? disabled.fields : false}
            required
            className=""
            label="Model"
            variant="standard"
            fullWidth
            value={formData.vehicle.model}
            onChange={(e) => {
              setFormData({
                ...formData,
                vehicle: {
                  ...formData.vehicle,
                  model: e.target.value,
                },
              });
            }}
          />
        </Grid>
        <Grid size={6}>
          <Grid size={4}>
            <TextField
              disabled={subscriptionData ? disabled.fields : false}
              required
              className=""
              label="Year"
              type="number"
              variant="standard"
              fullWidth
              value={formData.vehicle.year}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  vehicle: {
                    ...formData.vehicle,
                    year: parseInt(e.target.value, 10),
                  },
                });
              }}
            />
          </Grid>
        </Grid>
        <Grid size={3}>
          <TextField
            disabled={subscriptionData ? disabled.fields : false}
            className=""
            label="Color"
            variant="standard"
            fullWidth
            value={formData.vehicle.color}
            onChange={(e) => {
              setFormData({
                ...formData,
                vehicle: {
                  ...formData.vehicle,
                  color: e.target.value,
                },
              });
            }}
          />
        </Grid>
        <Grid size={4}>
          <TextField
            disabled={subscriptionData ? disabled.fields : false}
            className=""
            label="VIN"
            variant="standard"
            fullWidth
            value={formData.vehicle.vin}
            onChange={(e) => {
              setFormData({
                ...formData,
                vehicle: {
                  ...formData.vehicle,
                  vin: e.target.value,
                },
              });
            }}
          />
        </Grid>
        <Grid size={3}>
          <TextField
            required
            disabled={subscriptionData ? disabled.fields : false}
            className=""
            label="License Plate"
            variant="standard"
            fullWidth
            value={formData.vehicle.licensePlate}
            onChange={(e) => {
              setFormData({
                ...formData,
                vehicle: {
                  ...formData.vehicle,
                  licensePlate: e.target.value,
                },
              });
            }}
          />
        </Grid>
      </Grid>
      <div className="my-10 flex h-full w-full flex-row items-center justify-center">
        {subscriptionData && (
          <>
            <Button
              size="large"
              variant="contained"
              onClick={
                disabled
                  ? handleEdit
                  : () => setShowDialogs({ ...showDialogs, cancel: true })
              }
              color={disabled ? undefined : "error"}
            >
              {disabled ? "Edit" : "Cancel"}
            </Button>
            <AlertDialog
              title="Unsaved Changes"
              text="You have unsaved changes. Are you sure you want to cancel?"
              showDialog={showDialogs.cancel}
              onCancel={() => setShowDialogs({ ...showDialogs, cancel: false })}
              onConfirm={handleCancel}
            />
          </>
        )}
        <Button
          size="large"
          variant="contained"
          onClick={() => setShowDialogs({ ...showDialogs, submit: true })}
          disabled={disabled.submit}
        >
          Submit
        </Button>
        <AlertDialog
          title="Confirm Subscription"
          text="Are you sure you want to submit?"
          showDialog={showDialogs.submit}
          onCancel={() => setShowDialogs({ ...showDialogs, submit: false })}
          onConfirm={handleSubmit}
        />
      </div>
      <div className="mt-10 flex w-full flex-col items-center justify-center">
        {/* <LinkButton size="large" href="/customers" text="Back to Customers" /> */}
        <Button
          color="secondary"
          variant="outlined"
          className="h-1/2 w-1/3"
          onClick={() => {
            if (JSON.stringify(formData) !== JSON.stringify(subscriptionData)) {
              setShowDialogs({ ...showDialogs, cancel: true });
            }
            setSubscriptionData({} as SubscriptionData);
            setShowForm({ show: false, editSubscription: false });
          }}
        >
          Back to Subscriptions
        </Button>
        <Button
          color={subscriptionStatus === Status.ACTIVE ? "error" : "success"}
          variant="contained"
          className="mt-8 mb-2 w-2/3"
          onClick={() => setShowDialogs({ ...showDialogs, deactivate: true })}
        >
          {subscriptionStatus === Status.ACTIVE
            ? "Deactivate Subscription"
            : "Activate Subscription"}
        </Button>
        <AlertDialog
          title="Confirm Status Update"
          text={`Are you sure you want to ${subscriptionStatus === Status.ACTIVE ? "deactivate" : "activate"} 
            ${context?.customer.name}'s subscription?`}
          showDialog={showDialogs.deactivate}
          onCancel={() => setShowDialogs({ ...showDialogs, deactivate: false })}
          onConfirm={handleStatusChange} 
        />
      </div>
    </div>
  );
}
