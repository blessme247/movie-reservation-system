import {z} from "zod"

export const loginDto = z.object({
    email: z.email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters").max(100, "Password cannot exceed 100 characters")
})
