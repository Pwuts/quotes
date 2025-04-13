import { PrismaClient, type Prisma, type User } from "@prisma/client";
import { defineEventHandler, sendError } from "h3";
import { createError } from "~/server/error-helpers";

import type { QuotesResponse } from "../quotes/index.get";

const prisma = new PrismaClient();

export type UserResponse = Omit<User, "password" | "createdAt" | "updatedAt"> & {
  authoredQuotes: QuotesResponse;
  password?: undefined;
  createdAt?: undefined;
  updatedAt?: undefined;

  _count: Prisma.UserCountOutputType;
};

// GET /api/user
export default defineEventHandler(async (event): Promise<UserResponse | void> => {
  if (!event.context.user) {
    return sendError(event, createError(401));
  }

  const user = await prisma.user.findUnique({
    include: {
      authoredQuotes: {
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
      },
      _count: {
        select: {
          invitees: true,
          invitations: true,
          authoredQuotes: true,
        },
      },
    },
    where: { id: event.context.user.id },
  });
  if (!user) {
    return sendError(event, createError(404));
  }

  return {
    ...user,
    password: undefined,
    createdAt: undefined,
    updatedAt: undefined,
  };
});
