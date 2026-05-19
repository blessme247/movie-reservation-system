import {z} from "zod"

export const createShowtimeDto = z.object({
    movieId: z.number("Invalid movie id"),
    cinemaId: z.number("Invalid cinema id"),
    time: z.string().trim()
    .regex(/^\d{2}:\d{2}$/, "Time must be in the format HH:MM")
    .refine((val) => {
        const [hours, minutes] = val.split(":").map(Number)
        if(!hours || !minutes) return false
        return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59
    }, "Invalid time"),
    scheduleIds: z.array(z.number()).min(1, "At least one schedule is required"),
})