import { IncomingMessage, ServerResponse } from 'http'
import { isMethod, sendError, useBody } from 'h3'
import { createError } from '~~/server/error-helpers'
import Prisma from '@prisma/client'
import argon2 from 'argon2'
import jwt from 'jsonwebtoken'

const prisma = new Prisma.PrismaClient();

export default async function register(req: IncomingMessage, res: ServerResponse)
{
  if (!isMethod(req, 'POST')) {
    return sendError(res, createError(404));
  }

  if (req.user) {
    return sendError(res, createError(409, 'cannot register with authorized request'));
  }

  const { name, email, password, inviteToken } = await useBody<{
    name: string,
    email: string,
    password: string,
    inviteToken: string,
  }>(req);

  if (!inviteToken && await prisma.user.count() > 0) {
    return sendError(res, createError(400, 'inviteToken is required'));
  }
  const invite = await prisma.userInvitation.findUnique({ where: { token: inviteToken }});
  if (!invite) {
    return sendError(res, createError(401, 'invalid invite token'));
  }

  if ([name, email, password].some(v => !v || typeof v != 'string')) {
    return sendError(res, createError(400, 'name, email and password are required'));
  }

  const existingUser = await prisma.user.findUnique({ where: { email }});
  if (existingUser) {
    return sendError(res, createError(409, 'user with this e-mail already exists'));
  }

  const passHash = await argon2.hash(password);
  const user = await prisma.user.create({ data: {
    name,
    email,
    password: passHash,
    invitedById: invite.createdById,
  }});

  await prisma.userInvitation.delete({ where: { id: invite.id } });

  const token = jwt.sign({
    userId: user.id,
    name: user.name,
    email: user.email,
  }, process.env.JWT_SECRET);

  return {
    name: user.name,
    email: user.email,
    token,
  };
}
