import { db } from "../../db";
import { rolesTable, movieStatusTable, genresTable, ticketTypesTable, scheduleTable } from "../../db/schema"
import logger from "../utils/logger";
import { genresSeedData, movieStatusSeedData, rolesSeedData, scheduleSeedData, ticketTypesSeedData } from "./data";

const seedRoles = async () => {
    const roles = await db.select().from(rolesTable);
    if(!roles.length){
        await db.insert(rolesTable).values(rolesSeedData)
        console.log('completed roles seed')
    }
}

const seedMovieStatus = async () => {
    const movieStatus = await db.select().from(movieStatusTable);
    if(!movieStatus.length){
        await db.insert(movieStatusTable).values(movieStatusSeedData)
        console.log('completed movie status seed')
    }
}

const seedGenres = async () => {
    const genres = await db.select().from(genresTable);
    if(!genres.length){
        await db.insert(genresTable).values(genresSeedData)
        console.log('completed genres seed')
    }
}

const seedTicketTypes = async () => {
    const ticketTypes = await db.select().from(ticketTypesTable);
    if(!ticketTypes.length){
        await db.insert(ticketTypesTable).values(ticketTypesSeedData)
        console.log('completed ticket types seed')
    }
}

const seedSchedule = async () => {
    const schedule = await db.select().from(scheduleTable);
    if(!schedule.length){
        await db.insert(scheduleTable).values(scheduleSeedData)
        console.log('completed schedule seed')
    }
}

export const seed = async () => {
    try {
        await seedRoles()
        await seedMovieStatus()
        await seedGenres()
        await seedTicketTypes()
        await seedSchedule()
        // console.log('completed db seed')
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "db seed error";
        logger.error(errorMessage, {service: "database-seed", error: error instanceof Error ? error.stack : error})
    }
}