import { IncomingMessage, ServerResponse } from 'http'
import { isMethod, sendError } from 'h3'
import cryptoRandomString from 'crypto-random-string'
import { createError } from '~/server/error-helpers'
import Prisma from '@prisma/client'

const prisma = new Prisma.PrismaClient();

export default async function invite(req: IncomingMessage, res: ServerResponse)
{
  if (!isMethod(req, 'GET')) {
    return sendError(res, createError(404));
  }

  if (!req.user) {
    return sendError(res, createError(401, 'must be logged in to create invite'));
  }

  const invites = await prisma.userInvitation.findMany({
    select: { id: true, token: true },
    where: { createdById: req.user.id },
  });
  if (invites.length >= 5) {
    return sendError(res, createError(409, 'user already has 5 unused invites'));
  }

  const inviteToken = cryptoRandomString({ length: 32 });
  const invite = await prisma.userInvitation.create({ data: {
    token: inviteToken,
    createdById: req.user.id,
  }});

  return {
    inviteToken: invite.token,
    otherInvites: invites,
    invitesLeft: 4 - invites.length,
  };
}
