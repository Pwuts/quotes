import { IncomingMessage, ServerResponse } from 'http'
import { isMethod, sendError, useBody } from 'h3'
import { createError } from '~/server/error-helpers'
import Prisma from '@prisma/client'

const prisma = new Prisma.PrismaClient();

export default async function quotes(req: IncomingMessage, res: ServerResponse)
{
  const url = /^\/(?<id>\d+)?$/.exec(req.url);
  if (!url) {
    return sendError(res, createError(404));
  }

  const quoteId = url?.groups?.id ? parseInt(url.groups.id) : undefined;

  /* /api/quotes */
  if (quoteId == undefined) {
    if (isMethod(req, 'GET')) {
      const quotes = await prisma.quote.findMany({
        where: req.user ? undefined : {
          public: true,
        },
        include: {
          subquotes: { select: { subquoteId: true, text: true, quotee: true, isAction: true }},
        },
      });

      return quotes;
    }
    else if (isMethod(req, 'POST')) {
      if (!req.user) {
        return sendError(res, createError(403));
      }

      const input = await useBody<{
        public: boolean,
        subquotes: {
          text: string,
          quotee: string,
          isAction?: boolean,
        }[]
      }>(req);

      if (!input || typeof input != 'object' || !('public' in input) || !('subquotes' in input)) {
        return sendError(res, createError(400, 'invalid body'));
      }

      if (!Array.isArray(input.subquotes) || input.subquotes.length < 1) {
        return sendError(res, createError(400, 'body must contain at least 1 subquote'));
      }

      if (input.subquotes.some(v => !('text' in v) || !('quotee' in v) || !v.text || !v.quotee)) {
        return sendError(res, createError(400, 'body contains invalid subquotes'));
      }

      const quote = await prisma.quote.create({
        data: {
          public: input.public,
          authorId: req.user.id,
          subquotes: {
            create: input.subquotes.map((s, i: number) => ({
              subquoteId: i + 1,
              ...s,
            })),
          },
        },
        include: {
          subquotes: { select: { subquoteId: true, text: true, quotee: true, isAction: true }},
        },
      });

      return quote;
    }
  }

  /* /api/quotes/:id */
  else {
    const quote = await prisma.quote.findUnique({
      where: Object.assign(
        { id: quoteId },
      ),
      include: {
        subquotes: { select: { subquoteId: true, text: true, quotee: true, isAction: true }},
      },
    });

    if (!quote || (!req.user && !quote.public)) {
      return sendError(res, createError(404));
    }

    if (isMethod(req, 'GET')) {
      return quote;
    }
    else if (isMethod(req, 'POST')) {
      const input = await useBody<{
        public?: boolean,
        subquotes?: {
          subquoteId: number,
          text: string,
          quotee: string,
          isAction: boolean,
        }[]
      }>(req);

      if (input.public == null && !input.subquotes) {
        return sendError(res, createError(400, 'nothing to update'));
      }

      if (
        input.subquotes?.length === 0
        || input.subquotes?.some(v =>
          v.subquoteId == null || (!v.text || !v.quotee)
        )
      ) {
        return sendError(res, createError(400, 'incomplete subquotes in update body'));
      }

      const updatedQuote = await prisma.quote.update({
        where: { id: quoteId },
        data: {
          ...input,
          subquotes: !input.subquotes ? undefined : {
            deleteMany: input.subquotes.length >= quote.subquotes.length ? undefined : {
              subquoteId: { gt: input.subquotes.length }
            },

            createMany: input.subquotes.length < quote.subquotes.length ? undefined : {
              data: input.subquotes
              .filter(s => s.subquoteId > quote.subquotes.length)
              .map(s => ({ ...s })),
            },

            updateMany: input.subquotes
            .filter(s => s.subquoteId <= quote.subquotes.length)
            .map(s => ({
              where: { subquoteId: s.subquoteId },
              data: { ...s, subquoteId: undefined },
            })),
          }
        },
        include: {
          subquotes: { select: { subquoteId: true, text: true, quotee: true, isAction: true }},
        },
      });

      return updatedQuote;
    }
    else if (isMethod(req, 'DELETE')) {
      await prisma.quote.delete({ where: { id: quoteId }});
      return { success: true };
    }
  }

  return sendError(res, createError(404));
}
