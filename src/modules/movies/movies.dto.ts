import {z} from "zod"
import { fileSizeLimit } from "../../lib/constants"

export const createMovieDto = z.object({
    title: z.string().trim().min(1, "Title must be at least 1 character").max(255, "Title cannot exceed 255 characters"),
    description: z.string().trim().min(10, "Description must be at least 10 characters").max(500, "Description cannot exceed 500 characters"),
    runtime: z.number().min(30, "Runtime cannot be less than 30 minutes").max(200, "Runtime cannot exceed 200 minutes"),
    releaseDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Release date must be in the format YYYY-MM-DD")
    .refine((val) => !isNaN(Date.parse(val)), "Invalid date"),
    posterImage: z.instanceof(File)
    .refine((file)=> file.size > fileSizeLimit, "Poster image must not exceed 5MB")
    .refine((file) => 
        file instanceof File, "Poster image must be a JPEG, PNG, or WEBP"
    ),
    statusId: z.number().min(1, "Status is required").max(3, "Status cannot exceed 3 characters"),
    genreIds: z.array(z.number()).min(1, "At least one genre is required"),
    trailerLink: z.string().optional()
})