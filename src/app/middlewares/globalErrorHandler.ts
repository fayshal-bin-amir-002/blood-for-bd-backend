import { NextFunction, Request, Response } from "express";
import status from "http-status";
import config from "../config";
import { TErrorSources } from "../interfaces/error";
import { ZodError } from "zod";
import handleZodError from "../errors/handleZodError";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode: number = status.INTERNAL_SERVER_ERROR;
  let message = err?.message || "Something went wrong!";
  let errorSources: TErrorSources = [
    {
      path: "",
      message: "Something went wrong!",
    },
  ];

  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  }

  res.status(status.INTERNAL_SERVER_ERROR).json({
    success: false,
    message,
    errorSources,
    error: config.env === "development" ? err : "",
  });
};
