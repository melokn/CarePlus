import { z } from 'zod'

const envSchema = z.object({
    DATABASE_URL: z.string().url(),
    AWS_ACCESS_KEY_ID: z.string(),
    AWS_SECRET_ACCESS_KEY: z.string(),
    PORT: z.string().transform((val) => parseInt(val, 10)).default('4060') 
})

export const env = envSchema.parse(process.env)
