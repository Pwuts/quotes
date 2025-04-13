import { defineEventHandler, getRouterParam, sendError } from "h3";
import { createError } from "~/server/error-helpers";
import Prisma from "@prisma/client";

const prisma = new Prisma.PrismaClient();

// DELETE /api/quotes/[id]
export default defineEventHandler(async (event) => {
  const quoteID = parseInt(getRouterParam(event, "id")!);
  if (isNaN(quoteID)) {
    return sendError(event, createError(404));
  }

  const deletedQuote = await prisma.quote.delete({ where: { id: quoteID } });
  if (!deletedQuote) {
    return sendError(event, createError(404));
  }

  return { success: true };
});
