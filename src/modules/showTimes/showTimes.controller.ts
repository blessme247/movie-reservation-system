import { ErrorLogService } from "../../services/logger";
import type { Request, Response } from "express";
import { createShowtimeDto } from "./showTimes.dto";
import { handleError } from "../../lib/utils/handleError";
import { ShowTimeService } from "./showTimes.service";
import { db } from "../../db";
import { scheduleTable, showTimesTable } from "../../db/schema";
import { eq } from "drizzle-orm";

export class ShowTimeController {
  errorLogService = new ErrorLogService();
  showTimesService = new ShowTimeService();

  async createShowtime(req: Request, res: Response) {
    const parseResult = createShowtimeDto.safeParse(req.body);
    if (!parseResult.success) {
      return handleError(req, res, 400, {
        success: false,
        message: "Validation failed",
        errors: parseResult.error.flatten().fieldErrors,
      });
    }

    try {
      const { movieId, cinemaId, time, scheduleIds } = parseResult.data;
      const foundMovie = await this.showTimesService.checkIfMovieExists(movieId);
      if (!foundMovie) {
        return handleError(req, res, 400, {
          success: false,
          message: "Invalid movie id",
        });
      }
      const foundCinema = await this.showTimesService.checkIfCinemaExists(cinemaId);
      if (!foundCinema) {
        return handleError(req, res, 400, {
          success: false,
          message: "Invalid cinema id",
        });
      }

      const scheduleChecks = await Promise.all(
              scheduleIds.map((id) =>
                db.select().from(scheduleTable).where(eq(scheduleTable.id, id)).limit(1),
              ),
            );
      
        if (scheduleChecks.some((g) => !g[0])) return handleError(req, res, 400, { message: "Invalid schedule" });
        const showtime: typeof showTimesTable.$inferInsert = {
            movieId,
            time,
            cinemaId
        }
        const newShowtime = await db.insert(showTimesTable).values(showtime)
        
    } catch (error) {}
  }
}
