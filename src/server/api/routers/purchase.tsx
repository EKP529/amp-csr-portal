import { protectedProcedure, createTRPCRouter } from "../trpc";
import { db } from "~/server/db";
import { TRPCError } from "@trpc/server";
import * as z from "zod";
import { get } from "http";
import { connect } from "http2";
import { procedureTypes } from "@trpc/server/unstable-core-do-not-import";

export const purchaseRouter = createTRPCRouter({
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      try {
        const purchase = await db.purchase.findUnique({
          where: { id: input.id },
          include: {
            product: true,
          },
        });
        if (!purchase) {
          console.error(`Purchase with ID ${input.id} not found`);
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Purchase not found`,
          });
        }
        return purchase;
      } catch (error) {
        console.error(`Error fetching purchase with ID: ${input.id}`, error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch purchase",
        });
      }
    }
  ),
  getAllByCustomerId: protectedProcedure
    .input(z.object({ customerId: z.string() }))
    .query(async ({ input }) => {
      try {
        const purchases = await db.purchase.findMany({
          where: { customerId: input.customerId },
          include: {
            product: true,
          },
        });
        if (purchases) {
          return purchases;
        }
      } catch (error) {
        console.error("Error fetching purchases by customer ID:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch purchases by customer ID",
        });
      }
    }
  ),
  create: protectedProcedure
    .input(
      z.object({
        customerId: z.string(),
        productId: z.string(),
        productPrice: z.number().min(0),
        productName: z.string(),
        quantity: z.number().min(1),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const createData = {
          totalPrice: input.quantity * input.productPrice,
          quantity: input.quantity,
          customer: {
            connect: { id: input.customerId },
          },
          product: {
            connect: { id: input.productId },
          }
        }
        const newPurchase = await db.purchase.create({
          data: createData,
        });
        if (newPurchase) {
          return newPurchase;
        }
      } catch (error) {
        console.error("Error creating purchase:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create purchase",
        });
      }
    }
  ),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const deletedPurchase = await db.purchase.delete({
          where: { id: input.id },
        });
        return deletedPurchase;
      } catch (error) {
        console.error(`Error deleting purchase with ID ${input.id}:`, error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete purchase",
        });
      }
    }
  ),
});