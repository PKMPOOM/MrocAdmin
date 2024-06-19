import { z } from "zod";

const envSchema = z.object({
  VITE_API_URL: z.string().url(),
  VITE_AUTH_API_URL: z.string().url(),
});

type envType = z.infer<typeof envSchema>;

const env: envType = {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  VITE_AUTH_API_URL: import.meta.env.VITE_AUTH_API_URL,
};

export default env;
