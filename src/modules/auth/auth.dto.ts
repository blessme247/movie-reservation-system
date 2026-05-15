import {z} from "zod"

export const loginDto = z.object({
    email: z.email("Invalid email").trim(),
    password: z.string().trim().min(6, "Password must be at least 6 characters").max(100, "Password cannot exceed 100 characters")
})

export const registerDto = z.object({
    email: z.email("Invalid email"),
    password: z.string().trim().min(6, "Password must be at least 6 characters").max(100, "Password cannot exceed 100 characters"),
    firstName: z.string().trim().min(2, "First name must be at least 6 characters").max(30, "First name cannot exceed 30 characters"),
    lastName: z.string().trim().min(2, "Last name must be at least 6 characters").max(30, "Last name cannot exceed 30 characters"),
})
