import { defineEventHandler, getRouterParam, sendError } from "h3";
import { createError } from "~/server/error-helpers";
import Prisma from "@prisma/client";

import type { QuoteResponse } from "./[id].get";

const prisma = new Prisma.PrismaClient();

export type QuoteUpdateRequest = {
  public?: boolean;
  subquotes?: {
    subquoteId: number;
    text: string;
    quotee: string;
    isAction: boolean;
  }[];
};

// POST /api/quotes/[id]
export default defineEventHandler(async (event): Promise<QuoteResponse | void> => {
  const quoteID = parseInt(getRouterParam(event, "id")!);
  if (isNaN(quoteID)) {
    return sendError(event, createError(400));
  }

  if (!event.context.user) {
    return sendError(event, createError(401));
  }

  const existing = await prisma.quote.findUnique({
    where: { id: quoteID },
    include: { subquotes: true },
  });
  if (!existing) {
    return sendError(event, createError(404));
  }

  const input = await readBody<QuoteUpdateRequest>(event);

  if (input.public == null && !input.subquotes) {
    return sendError(event, createError(400, "nothing to update"));
  }

  if (
    input.subquotes?.length === 0 ||
    input.subquotes?.some((v) => v.subquoteId == null || !v.text || !v.quotee)
  ) {
    return sendError(event, createError(400, "incomplete subquotes in update body"));
  }

  const updatedQuote = await prisma.quote.update({
    where: { id: quoteID },
    data: {
      ...input,
      subquotes: !input.subquotes
        ? undefined
        : {
            deleteMany:
              input.subquotes.length >= existing.subquotes.length
                ? undefined
                : {
                    subquoteId: { gt: input.subquotes.length },
                  },

            createMany:
              input.subquotes.length < existing.subquotes.length
                ? undefined
                : {
                    data: input.subquotes
                      .filter((s) => s.subquoteId > existing.subquotes.length)
                      .map((s) => ({ ...s })),
                  },

            updateMany: input.subquotes
              .filter((s) => s.subquoteId <= existing.subquotes.length)
              .map((s) => ({
                where: { subquoteId: s.subquoteId },
                data: { ...s, subquoteId: undefined },
              })),
          },
    },
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

  return updatedQuote;
});
