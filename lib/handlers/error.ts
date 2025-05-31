import { NextResponse } from "next/server";
import { RequestError, ValidationError } from "../http-errors";
import { ZodError } from "zod";
import logger from "../logger";

// Type to distinguish between API response (Next.js API route) or server context (e.g., server component or internal call)
export type ResponseType = "api" | "server";

// 🔹 Helper function to format a consistent error response object
const formatResponse = (
  responseType: ResponseType,                    // Whether to return a NextResponse (for API) or plain object (for server)
  status: number,                                // HTTP status code
  message: string,                               // Main error message
  errors?: Record<string, string[]> | undefined  // Optional detailed field-level errors
) => {
  const responseContent = {
    success: false,              // Always false for errors
    error: {
      message,                   // Error message
      details: errors,           // Optional field-specific validation messages
    },
  };

  // Return different formats depending on the context
  return responseType === "api"
    ? NextResponse.json(responseContent, { status }) // Used in Next.js API routes
    : { status, ...responseContent };                // Used in internal logic (e.g., server actions)
};

// 🔹 Universal error handler
const handleError = (error: unknown, responseType: ResponseType = "server") => {
  // Custom RequestError (includes status code and optional errors)
  if (error instanceof RequestError) {
    logger.error({err: error}, `${responseType.toUpperCase()} Error: ${error.message}`)

    return formatResponse(
      responseType,
      error.statusCode,
      error.message,
      error.errors
    );
  }

  // Zod validation error — convert it to a ValidationError for consistency
  if (error instanceof ZodError) {
    const validationError = new ValidationError(
      error.flatten().fieldErrors as Record<string, string[]>
    );

    return formatResponse(
      responseType,
      validationError.statusCode,
      validationError.message,
      validationError.errors
    );
  }

  // Built-in Error instance — return a generic 500 response
  if (error instanceof Error) {
    return formatResponse(responseType, 500, error.message);
  }

  // Unknown error type — fallback to a generic message
  return formatResponse(responseType, 500, "An unexpected error occured");
};

// Export this function so you can use it in routes, actions, etc.
export default handleError;
