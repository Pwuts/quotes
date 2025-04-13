import { defineEventHandler } from "h3";
import Prisma from "@prisma/client";

import type { QuoteResponse } from "./[id].get";

const prisma = new Prisma.PrismaClient();

export type QuotesResponse = QuoteResponse[];

// GET /api/quotes
export default defineEventHandler(async (event): Promise<QuotesResponse> => {
  return await prisma.quote.findMany({
    where: event.context.user ? undefined : { public: true },
    include: {
      subquotes: {
        select: {
          subquoteId: true,
          text: true,
          quotee: true,
          isAction: true,
        },
      },
    },
  });
});
