import { eq } from "drizzle-orm";
import { db } from "../../db";
import { cinemaTable, moviesTable } from "../../db/schema";

export class ShowTimeService  {
    checkIfMovieExists = async (movieId: number) => {
        try {
            
            const [movie] = await db
                    .select()
                    .from(moviesTable)
                    .where(eq(moviesTable.id, movieId))
                    .limit(1)
    
                    return movie
        } catch (error) {
            throw error
        }
              
    }

    checkIfCinemaExists = async (cinemaId: number) => {
        try {
            
            const [cinema] = await db
                    .select()
                    .from(cinemaTable)
                    .where(eq(cinemaTable.id, cinemaId))
                    .limit(1)
    
                    return cinema
        } catch (error) {
            throw error
        }
              
    }
}