import pino from "pino";

// Check if the code is running in an Edge Runtime (e.g., Next.js middleware, edge functions)
const isEdge = process.env.NEXT_RUNTIME === "edge";

// Check if the environment is production
const isProduction = process.env.NODE_ENV === "production";

// Create a Pino logger instance with specific config
const logger = pino({
  // Set log level (default to "info" if LOG_LEVEL is not set)
  level: process.env.LOG_LEVEL || "info",

  // Use "pino-pretty" (for human-readable logs) only if:
  // - not running in Edge (Edge doesn't support Node-based transports)
  // - and not in production (for performance and machine-readable JSON logs)
  transport:
    !isEdge && !isProduction
      ? {
          target: "pino-pretty", // Pretty-print logs in dev
          options: {
            colorize: true,               // Adds color to logs in terminal
            ignore: "pid,hostname",       // Don't show process ID or host
            translateTime: "SYS:standard" // Format timestamps nicely
          },
        }
      : undefined, // Otherwise, use default JSON output (no pretty-printing)

  // Custom formatter to change log level format
  formatters: {
    level: (label) => ({ level: label.toUpperCase() }), // e.g., "info" -> "INFO"
  },

  // Use ISO time for timestamps (e.g., 2025-05-27T22:12:00.000Z)
  timestamp: pino.stdTimeFunctions.isoTime,
});

// Export the logger to use in your app
export default logger;
