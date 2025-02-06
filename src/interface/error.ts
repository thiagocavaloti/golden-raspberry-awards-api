import { ZodError } from "zod";

export class HttpError extends Error {
  public messages?: string | string[];
  constructor(
    messages?: string[] | string,
  ) {
    super(Array.isArray(messages) ? messages.join(", ") : messages);
  }
}

export class HttpZodParserError extends HttpError {
  constructor(public error: ZodError) {
    super(
      error.issues.map((e) => {
        return (e?.path as any).join(".") + " is required";
      }).join(", ")
    );
  }
}