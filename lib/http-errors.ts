// Base error class that extends the built-in Error class
export class RequestError extends Error {
  statusCode: number; // HTTP status code (e.g., 400, 404)
  errors?: Record<string, string[]>; // Optional field-level error details

  constructor(
    statusCode: number,
    message: string,
    errors?: Record<string, string[]>
  ) {
    super(message); // Call parent Error constructor with the message
    this.statusCode = statusCode; // Set HTTP status code
    this.errors = errors; // Optional detailed errors
    this.name = "RequestError"; // Override error name
  }
}

// ValidationError represents 400 Bad Request due to invalid fields
export class ValidationError extends RequestError {
  constructor(fieldErrors: Record<string, string[]>) {
    // Format the field error messages into a readable string
    const message = ValidationError.formatFieldErrors(fieldErrors);

    // Call the parent RequestError with status 400 and the formatted message
    super(400, message, fieldErrors);

    // Override the name for clarity
    this.name = "ValidationError";

    // Set detailed errors explicitly
    this.errors = fieldErrors;
  }

  // Helper function to convert errors object into a readable message
  static formatFieldErrors(errors: Record<string, string[]>): string {
    const formattedMessages = Object.entries(errors).map(
      ([field, messages]) => {
        // Capitalize the field name
        const fieldName = field.charAt(0).toUpperCase() + field.slice(1);

        // Special handling if message is just "Required"
        if (messages[0] === "Required") {
          return `${fieldName} is required`;
        } else {
          // Join multiple messages with "and"
          return messages.join(" and ");
        }
      }
    );

    // Join all field messages with commas
    return formattedMessages.join(", ");
  }
}

// NotFoundError for 404 Not Found
export class NotFoundError extends RequestError {
  constructor(resource: string) {
    // Example message: "User not found"
    super(404, `${resource} not found`);
    this.name = "NotFoundError";
  }
}

// ForbiddenError for 403 Forbidden (user is authenticated but not allowed)
export class ForbiddenError extends RequestError {
  constructor(message: string = "Forbidden") {
    super(403, message);
    this.name = "ForbiddenError";
  }
}

// UnauthorizedError for 401 Unauthorized (user is not authenticated)
export class UnauthorizedError extends RequestError {
  constructor(message: string = "Unauthorized") {
    super(401, message);
    this.name = "UnauthorizedError";
  }
}
