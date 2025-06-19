/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { protectedProcedure, createTRPCRouter } from "../trpc";
import { db } from "~/server/db";
import { TRPCError } from "@trpc/server";
import * as z from "zod";

export const customerRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async () => {
    try {
      const customers = await db.customer.findMany();
      if (customers) {
        return customers;
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch customers",
      });
    }
  }),
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      try {
        const customer = await db.customer.findUnique({
          where: { id: input.id },
        });
        if (!customer) {
          console.error(`Customer with ID ${input.id} not found`);
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Customer not found`,
          });
        }
        return customer;
      } catch (error) {
        console.error(`Error fetching customer with ID: ${input.id}`, error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch customer",
        });
      }
    }),
});
