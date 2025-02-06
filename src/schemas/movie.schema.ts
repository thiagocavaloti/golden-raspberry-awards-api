import { z } from "zod";

export const MovieSchema = z.object({
  title: z.string().min(1, "Title is required"),
  year: z.number()
    .int("Year must be an integer")
    .min(1900, "Year must be at least 1900"),
  studios: z.string().min(1, "Studios field is required"),
  producers: z.string().min(1, "Producers field is required"),
  winner: z.string()
});

export type Movie = z.infer<typeof MovieSchema>;
