import { protectedProcedure, createTRPCRouter } from "../trpc";
import { db } from "~/server/db";
import { TRPCError } from "@trpc/server";
import * as z from "zod";

export const subscriptionRouter = createTRPCRouter({
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      try {
        const subscription = await db.subscription.findUnique({
          where: { id: input.id },
          include: {
            vehicle: true,
          }
        });
        if (!subscription) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Subscription with ID ${input.id} not found`,
          });
        }
        return subscription;
      } catch (error) {
        console.error(`Error fetching subscription with ID ${input.id}:`, error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch subscription",
        });
      }
    }
  ),
  getAllByCustomerId: protectedProcedure
    .input(z.object({ customerId: z.string() }))
    .query(async ({ input }) => {
      try {
        const subscriptions = await db.subscription.findMany({
          where: { customerId: input.customerId },
          include: {
            vehicle: true,
          },
        });
        if (subscriptions) {
          return subscriptions;
        }
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch subscriptions",
        });
      }
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(["ACTIVE", "CANCELED", "EXPIRED"]).optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        nextBillingDate: z.date().optional(),
        plan: z.enum(["STANDARD", "PREMIUM", "PREMIUM_PLUS"]).optional(),
        vehicleId: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const updateData = {
          status: input.status,
          startDate: input.startDate,
          endDate: input.endDate,
          nextBillingDate: input.nextBillingDate,
          plan: input.plan,
          vehicle: input.vehicleId
            ? { connect: { id: input.vehicleId } }
            : undefined,
        }
        const updatedSubscription = await db.subscription.update({
          where: { id: input.id },
          data: updateData,
        });
        if (!updatedSubscription) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Subscription with ID ${input.id} not found`,
          });
        }
        return updatedSubscription;
      } catch (error) {
        console.error(
          `Error updating subscription with ID: ${input.id}`,
          error,
        );
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update subscription",
        });
      }
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const deletedSubscription = await db.subscription.delete({
          where: { id: input.id },
        });
        if (!deletedSubscription) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Subscription with ID ${input.id} not found`,
          });
        }
        return deletedSubscription;
      } catch (error) {
        console.error(`Error deleting subscription with ID: ${input.id}`, error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete subscription",
        });
      }
    }
  ),
  create: protectedProcedure
    .input(z.object({
      status: z.enum(["ACTIVE", "CANCELED", "EXPIRED"]),
      startDate: z.date(),
      endDate: z.date(),
      nextBillingDate: z.date().optional(),
      plan: z.enum(["STANDARD", "PREMIUM", "PREMIUM_PLUS"]),
      customerId: z.string(),
      vehicleId: z.string(),
    }))
    .mutation(async ({ input }) => {
      try {
        const createData = {
          status: input.status,
          startDate: input.startDate,
          endDate: input.endDate,
          nextBillingDate: input.nextBillingDate,
          plan: input.plan,
          customer: {
            connect: { id: input.customerId },
          },
          vehicle: {
            connect: { id: input.vehicleId },
          },
        };
        const newSubscription = await db.subscription.create({
          data: createData,
        });
        return newSubscription;
      } catch (error) {
        console.error("Error creating subscription:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create subscription",
        });
      }
    }
  ),
  createWithVehicle: protectedProcedure
    .input(z.object({
      status: z.enum(["ACTIVE", "CANCELED", "EXPIRED"]),
      startDate: z.date(),
      endDate: z.date(),
      nextBillingDate: z.date().optional(),
      plan: z.enum(["STANDARD", "PREMIUM", "PREMIUM_PLUS"]),
      vehicle: z.object({
        make: z.string(),
        model: z.string(),
        year: z.number(),
        vin: z.string().optional(),
        color: z.string(),
        licensePlate: z.string(),
      }),
      customerId: z.string(),
    }))
    .mutation(async ({ input }) => {
      try {
        const createData = {
          status: input.status,
          startDate: input.startDate,
          endDate: input.endDate,
          nextBillingDate: input.nextBillingDate,
          plan: input.plan,
          vehicle: {
            create: {
              ...input.vehicle,
              customer: {
                connect: { id: input.customerId },
              }
            }
          },
          customer: {
            connect: { id: input.customerId },
          }
        } 
        const newSubscription = await db.subscription.create({
          data: createData,
        });
        return newSubscription;
      } catch (error) {
        console.error("Error creating subscription with new vehicle:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create subscription with new vehicle",
        });
      }
    }
  ),
});
