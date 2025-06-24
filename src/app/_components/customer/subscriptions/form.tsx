"use client";

import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
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
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [disabledSubmit, setDisabledSubmit] = useState(true);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
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
      setDisabledSubmit(false);
    } else {
      setDisabledSubmit(true);
    }
  }, [formData]);

  const handleEdit = () => {
    setDisabled(!disabled);
  };
  const handleCancel = () => {
    setDisabled(!disabled);
    setFormData(subscriptionData!);
    setShowCancelDialog(false);
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
          console.log(context!.customer.id)
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
          });
        }
        setDisabled(true);
        setShowSubmitDialog(false);
        setSubscriptionData(formData);
        setShowForm({ show: false, editSubscription: true });
        alert("Submission successful!");
      } catch (e) {
        console.log('Error creating subscription: ', e)
        alert("Unable to complete submission. Please try again later.");
      }
    } else {
      alert("Please fill in all required fields.");
      setShowSubmitDialog(false);
    }
  };

  return (
    <div className="m-6 flex flex-col gap-4 px-4">
      <div className="mt-10 items-start">
        <Grid container rowSpacing={4} columnSpacing={2} className="w-full">
          <Grid size={12}>
            <div className="text-primary text-2xl font-semibold underline">
              Subscription Details
            </div>
          </Grid>
          <Grid size={2}>
            <TextField
              disabled={subscriptionData ? disabled : false}
              className=""
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
          </Grid>
          <Grid size={2}>
            <TextField
              disabled
              className=""
              label="Start Date"
              type="date"
              variant="standard"
              fullWidth
              value={new Date(Date.now()).toISOString().split("T")[0]}
            />
          </Grid>
          <Grid size={2}>
            <TextField
              disabled
              className=""
              label="End Date"
              type="date"
              variant="standard"
              fullWidth
              value={formData.subscription.endDate?.toISOString().split("T")[0]}
            />
          </Grid>
          <Grid size={12}>
            <div className="text-primary text-2xl font-semibold underline">
              Vehicle Details
            </div>
          </Grid>
          <Grid size={2}>
            <TextField
              disabled={subscriptionData ? disabled : false}
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
              disabled={subscriptionData ? disabled : false}
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
          <Grid size={2}>
            <TextField
              disabled={subscriptionData ? disabled : false}
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
          <Grid size={4}>
            <Grid size={6}>
              <TextField
                disabled={subscriptionData ? disabled : false}
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
          </Grid>
          <Grid size={4}>
            <TextField
              disabled={subscriptionData ? disabled : false}
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
              disabled={subscriptionData ? disabled : false}
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
      </div>
      <div className="h-full items-center justify-end">
        <div className="my-10 flex w-full flex-row justify-center gap-4">
          {subscriptionData && (
            <>
              <Button
                size="large"
                variant="contained"
                onClick={
                  disabled ? handleEdit : () => setShowCancelDialog(true)
                }
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
            </>
          )}
          <Button
            size="large"
            variant="contained"
            onClick={() => setShowSubmitDialog(true)}
            disabled={disabled || disabledSubmit}
          >
            Submit
          </Button>
          <AlertDialog
            title="Confirm Subscription"
            text="Are you sure you want to submit?"
            showDialog={showSubmitDialog}
            onCancel={() => setShowSubmitDialog(false)}
            onConfirm={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
