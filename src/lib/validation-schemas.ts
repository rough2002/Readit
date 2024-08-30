import { z } from "zod";

export const subredditSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  description: z.string().optional(),
  icon: z.instanceof(File).optional(),
  banner: z.instanceof(File).optional(),
  is_private: z.boolean().default(false),
});
