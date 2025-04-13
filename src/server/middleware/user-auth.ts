import { createError } from "~/server/error-helpers";
import { defineEventHandler, sendError } from "h3";
import Prisma from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new Prisma.PrismaClient();

export default defineEventHandler(async (event) => {
  const authHeader = event.headers.get("authorization");
  if (!authHeader) return;

  const token = /^Bearer (?<token>.*?)$/.exec(authHeader)?.groups?.token;
  if (!token) return;

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    if (payload && typeof payload == "object") {
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
      });

      if (!user || user.email != payload.email) {
        return sendError(event, createError(403));
      }

      event.context.user = {
        id: payload.userId,
        name: payload.name,
        email: payload.email,
      };
    }
  } catch (e) {
    if (!(e instanceof jwt.JsonWebTokenError)) {
      throw e;
    }
    return sendError(event, createError(403));
  }
});

declare module "h3" {
  interface H3EventContext {
    user?: {
      id: number;
      name: string;
      email: string;
    };
  }
}
