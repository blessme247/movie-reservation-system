import type { Request, Response } from "express";
import { createMovieDto } from "./movies.dto";
import { handleError } from "../../lib/utils/handleError";
import { uploadToCloud } from "../../services/cloudUpload";
import { db } from "../../db";
import {
  genresTable,
  movieGenresTable,
  moviesTable,
  movieStatusTable,
} from "../../db/schema";
import { eq } from "drizzle-orm";
import { handleSuccess } from "../../lib/utils/handleSuccess";
import { ErrorLogService } from "../../services/logger";

export class MovieController {
  errorLogService = new ErrorLogService();
  async createMovie(req: Request, res: Response) {
    const parseResult = createMovieDto.safeParse(req.body);
    if (!parseResult.success) {
      return handleError(req, res, 400, {
        success: false,
        message: "Validation failed",
        errors: parseResult.error.flatten().fieldErrors,
      });
    }

    try {
      const { result: uploadResult, error } = await uploadToCloud(req);

      if (!uploadResult || error) {
        return handleError(req, res, 500, {
          success: false,
          message: "Upload failed",
          error: error,
        });
      }

      const {
        title,
        description,
        runtime,
        releaseDate,
        trailerLink,
        statusId,
        genreIds,
      } = parseResult.data;

      const matchingStatus = await db
        .select()
        .from(movieStatusTable)
        .where(eq(movieStatusTable.id, statusId))
        .limit(1);
      const status = matchingStatus[0];
      if (!status || status?.id !== statusId)
        return handleError(req, res, 400, {
          success: false,
          message: "Invalid status",
        });

       const genreChecks = await Promise.all(
        genreIds.map((id)=>  db
          .select()
          .from(genresTable)
          .where(eq(genresTable.id, id))
          .limit(1))
       )

       if(genreChecks.some(g => !g[0])) return handleError(req, res, 400, { message: "Invalid genre" });

      const movie: typeof moviesTable.$inferInsert = {
        title,
        description,
        runtime,
        releaseDate: releaseDate,
        ...(trailerLink ? { trailerLink } : {}),
        statusId,
        posterImage: {
          assetId: uploadResult.asset_id,
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id,
        },
      };

      const newMovies = await db
        .insert(moviesTable)
        .values(movie)
        .returning({ id: moviesTable.id, title: moviesTable.title });
      const newMovie = newMovies[0];

      const movieGenres: (typeof movieGenresTable.$inferInsert)[] = genreIds.map((id) => ({ movieId: newMovie?.id!, genreId: id }));
      await db.insert(movieGenresTable).values(movieGenres).returning();
      return handleSuccess(req, res, 201, {
        data: { title: newMovie?.title },
        message: "New movie created",
      });
    } catch (error) {
      this.errorLogService.logServerError("movie-controller", error, req);
      return handleError(req, res, 500, {
        success: false,
        message: "server error"
      });
    }
  }
}
