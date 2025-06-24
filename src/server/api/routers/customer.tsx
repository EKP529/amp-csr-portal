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
  // getAllDisplay: protectedProcedure.query(async () => {
  //   try {
  //     const customers = await db.customer.findMany({
  //       select: {
  //         id: true,
  //         name: true,
  //         email: true,
  //         phone: true,
  //         address: true,
  //         birthdate: true,
  //       },
  //     });
  //     if (customers) {
  //       return customers;
  //     }
  //   } catch (error) {
  //     console.error("Error fetching customers for display:", error);
  //     throw new TRPCError({
  //       code: "INTERNAL_SERVER_ERROR",
  //       message: "Failed to fetch customers for display",
  //     });
  //   }
  // }),
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
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: z.object({
          name: z.string().optional(),
          email: z.string().email().optional(),
          phone: z.string().optional(),
          address: z.string().optional(),
          birthdate: z.date().optional(),
        }),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const updatedCustomer = await db.customer.update({
          where: { id: input.id },
          data: input.data,
        });
        return updatedCustomer;
      } catch (error) {
        console.error(`Error updating customer with ID ${input.id}:`, error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update customer",
        });
      }
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const deletedCustomer = await db.customer.delete({
          where: { id: input.id },
        });
        return deletedCustomer;
      } catch (error) {
        console.error(`Error deleting customer with ID ${input.id}:`, error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete customer",
        });
      }
    }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
        phone: z.string().optional(),
        address: z.string().optional(),
        birthdate: z.date(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const newCustomer = await db.customer.create({
          data: input,
        });
        return newCustomer;
      } catch (error) {
        console.error("Error creating customer:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create customer",
        });
      }
    }),
});
