import { createError as createH3Error, H3Error } from "h3";
import createHttpError, { HttpError } from "http-errors";
import status from "statuses";
import statuses from "statuses";

export function createError(error: HttpError): H3Error;
export function createError(
  status: number,
  message?: string,
  data?: Record<string, any>,
): H3Error;
export function createError(
  input: number | HttpError,
  message?: string,
  data?: Record<string, any>,
): H3Error {
  const httpError =
    typeof input == "number" ? createHttpError(status, ...arguments) : input;
  return createH3Error({
    statusMessage: statuses.message[httpError.statusCode],
    statusCode: httpError.statusCode,
    message: message ?? httpError.message,
    stack: httpError.stack,
    data: data,
  });
}
