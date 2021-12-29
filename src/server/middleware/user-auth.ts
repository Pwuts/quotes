import { IncomingMessage, ServerResponse } from 'http'
import { createError } from '~/server/error-helpers'
import { sendError } from 'h3'
import Prisma from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new Prisma.PrismaClient();

export default async function userAuthMiddleware(req: IncomingMessage, res: ServerResponse)
{
  const authHeaderMatch = /^Bearer (?<token>.*?)$/.exec(req.headers['authorization']);
  const token = authHeaderMatch?.groups.token;

  if (token) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      if (payload && typeof payload == 'object') {
        const user = await prisma.user.findUnique({ where: { id: payload.userId }});

        if (!user || user.email != payload.email) {
          return sendError(res, createError(403));
        }

        req.user = {
          id: payload.userId,
          name: payload.name,
          email: payload.email,
        };
      }
    }
    catch (e) {
      if (!(e instanceof jwt.JsonWebTokenError)) {
        throw e;
      }
      return sendError(res, createError(403));
    }
  }
}

declare module 'http' {
  interface IncomingMessage {
    user?: {
      id: number
      name: string
      email: string
    }
  }
}
