import { defineEventHandler, sendError, readBody } from "h3";
import { createError } from "~/server/error-helpers";
import Prisma from "@prisma/client";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

const prisma = new Prisma.PrismaClient();

export type UserRegisterRequest = {
  name: string;
  email: string;
  password: string;
  inviteToken: string;
};

export type UserRegisterResponse = {
  id: number;
  name: string;
  email: string;
  token: string;
};

// POST /api/user/register
export default defineEventHandler(
  async (event): Promise<UserRegisterResponse | void> => {
    if (event.context.user) {
      return sendError(
        event,
        createError(409, "cannot register with authorized request"),
      );
    }

    const { name, email, password, inviteToken } =
      await readBody<UserRegisterRequest>(event);

    let invite: Prisma.UserInvitation | null = null;
    if ((await prisma.user.count()) > 0) {
      if (!inviteToken) {
        return sendError(event, createError(400, "inviteToken is required"));
      } else {
        invite = await prisma.userInvitation.findUnique({
          where: { token: inviteToken },
        });
        if (!invite) {
          return sendError(event, createError(401, "invalid invite token"));
        }
      }
    }

    if ([name, email, password].some((v) => !v || typeof v != "string")) {
      return sendError(
        event,
        createError(400, "name, email and password are required"),
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return sendError(event, createError(409, "user with this e-mail already exists"));
    }

    const passHash = await argon2.hash(password);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: passHash,
        invitedById: invite?.createdById,
      },
    });

    if (invite) {
      await prisma.userInvitation.delete({ where: { id: invite.id } });
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
  },
);
