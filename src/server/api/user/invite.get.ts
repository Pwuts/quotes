import { defineEventHandler, sendError } from "h3";
import cryptoRandomString from "crypto-random-string";
import { createError } from "~/server/error-helpers";
import Prisma, { type UserInvitation } from "@prisma/client";

const prisma = new Prisma.PrismaClient();

export type UserInviteResponse = {
  inviteToken: string;
  otherInvites: Pick<UserInvitation, "id" | "token">[];
  invitesLeft: number;
};

// GET /api/user/invite
export default defineEventHandler(async (event): Promise<UserInviteResponse | void> => {
  if (!event.context.user) {
    return sendError(event, createError(401, "must be logged in to create invite"));
  }

  const invites = await prisma.userInvitation.findMany({
    select: { id: true, token: true },
    where: { createdById: event.context.user.id },
  });
  if (invites.length >= 5) {
    return sendError(event, createError(409, "user already has 5 unused invites"));
  }

  const inviteToken = cryptoRandomString({ length: 32 });
  const invite = await prisma.userInvitation.create({
    data: {
      token: inviteToken,
      createdById: event.context.user.id,
    },
  });

  return {
    inviteToken: invite.token,
    otherInvites: invites,
    invitesLeft: 4 - invites.length,
  };
});
