import { IncomingMessage, ServerResponse } from 'http'
import { isMethod, sendError, useBody } from 'h3'
import { createError } from '~~/server/error-helpers'
import Prisma from '@prisma/client'
import argon2 from 'argon2'
import jwt from 'jsonwebtoken'

const prisma = new Prisma.PrismaClient();

export default async function login(req: IncomingMessage, res: ServerResponse)
{
  if (!isMethod(req, 'POST')) {
    return sendError(res, createError(404));
  }

  if (req.user) {
    return sendError(res, createError(409, 'cannot login with authorized request'));
  }

  const { email, password } = await useBody<{ email: string, password: string }>(req);

  if ([email, password].some(v => !v || typeof v != 'string')) {
    return sendError(res, createError(400, 'e-mail and password are required'));
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !await argon2.verify(user.password, password)) {
    return sendError(res, createError(401));
  }

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
