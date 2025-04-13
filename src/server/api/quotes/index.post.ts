import { defineEventHandler, readBody, sendError } from "h3";
import { createError } from "~/server/error-helpers";
import Prisma from "@prisma/client";

import type { QuoteResponse } from "./[id].get";

const prisma = new Prisma.PrismaClient();

export type QuoteCreateRequest = {
  public: boolean;
  subquotes: {
    text: string;
    quotee: string;
    isAction?: boolean;
  }[];
};

// POST /api/quotes
export default defineEventHandler(async (event): Promise<QuoteResponse | void> => {
  if (!event.context.user) {
    return sendError(event, createError(403));
  }

  const input = await readBody<QuoteCreateRequest>(event);

  if (
    !input ||
    typeof input != "object" ||
    !("public" in input) ||
    !("subquotes" in input)
  ) {
    return sendError(event, createError(400, "invalid body"));
  }

  if (!Array.isArray(input.subquotes) || input.subquotes.length < 1) {
    return sendError(event, createError(400, "body must contain at least 1 subquote"));
  }

  if (
    input.subquotes.some(
      (v) => !("text" in v) || !("quotee" in v) || !v.text || !v.quotee,
    )
  ) {
    return sendError(event, createError(400, "body contains invalid subquotes"));
  }

  const quote = await prisma.quote.create({
    data: {
      public: input.public,
      authorId: event.context.user.id,
      subquotes: {
        create: input.subquotes.map((s, i: number) => ({
          subquoteId: i + 1,
          ...s,
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

  return quote;
});
