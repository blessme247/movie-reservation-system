import { rolesTable, movieStatusTable, genresTable, ticketTypesTable, scheduleTable } from "../../db/schema"

export const rolesSeedData: typeof rolesTable.$inferInsert[] = [
    {name: "Admin"},
    {name: "User"},
]

export const movieStatusSeedData: typeof movieStatusTable.$inferInsert[] = [
    {name: "Now Showing"},
    {name: "Coming Soon"},
]

export const genresSeedData: typeof genresTable.$inferInsert[] = [
    {name: "Action"},
    {name: "Adventure"},
    {name: "Comedy"},
    {name: "Fantasy"},
    {name: "Sci-fi"},
]

export const ticketTypesSeedData: typeof ticketTypesTable.$inferInsert[] = [
    {name: "Adult"},
    {name: "Student"}
]

export const scheduleSeedData: typeof scheduleTable.$inferInsert[] = [
    {name: "Mon - Thur", days: [1,2,3,4]},
    {name: "Fri - Sun", days: [5,6,0]},
    {name: "Fri", days: [5]},
    {name: "Sat - Sun", days: [6,0]},
    {name: "Fri - Sat", days: [5,6]},
]