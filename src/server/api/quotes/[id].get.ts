import { defineEventHandler, getRouterParam, sendError } from "h3";
import Prisma, { type Quote, type Subquote } from "@prisma/client";
import { createError } from "~/server/error-helpers";

const prisma = new Prisma.PrismaClient();

export type QuoteResponse = Quote & {
  subquotes: Pick<Subquote, "subquoteId" | "text" | "quotee" | "isAction">[];
};

// GET /api/quotes/[id]
export default defineEventHandler(async (event): Promise<QuoteResponse | void> => {
  const quoteID = parseInt(getRouterParam(event, "id")!);
  if (isNaN(quoteID)) {
    return sendError(event, createError(400));
  }

  if (!event.context.user) {
    return sendError(event, createError(401));
  }

  const quote = await prisma.quote.findUnique({
    where: { id: quoteID },
    include: { subquotes: true },
  });
  if (!quote) {
    return sendError(event, createError(404));
  }

  return quote;
});
