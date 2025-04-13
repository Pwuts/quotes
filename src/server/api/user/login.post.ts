import { defineEventHandler, sendError, readBody } from "h3";
import { createError } from "~/server/error-helpers";
import Prisma from "@prisma/client";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

const prisma = new Prisma.PrismaClient();

export type UserLoginRequest = {
  email: string;
  password: string;
};

export type UserLoginResponse = {
  id: number;
  name: string;
  email: string;
  token: string;
};

// POST /api/user/login
export default defineEventHandler(async (event): Promise<UserLoginResponse | void> => {
  if (event.context.user) {
    return sendError(event, createError(409, "cannot login with authorized request"));
  }

  const { email, password } = await readBody<UserLoginRequest>(event);

  if ([email, password].some((v) => !v || typeof v != "string")) {
    return sendError(event, createError(400, "e-mail and password are required"));
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await argon2.verify(user.password, password))) {
    return sendError(event, createError(401));
  }

  const token = jwt.sign(
    {
      userId: user.id,
      name: user.name,
      email: user.email,
    },
    process.env.JWT_SECRET!,
  );

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    token,
  };
});
