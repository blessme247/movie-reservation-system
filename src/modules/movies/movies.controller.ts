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
import { and, count, eq, ilike, sql } from "drizzle-orm";
import { handleSuccess } from "../../lib/utils/handleSuccess";
import { ErrorLogService } from "../../services/logger";
import { PosterImage } from "../../lib/types";

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
        genreIds.map((id) =>
          db.select().from(genresTable).where(eq(genresTable.id, id)).limit(1),
        ),
      );

      if (genreChecks.some((g) => !g[0]))
        return handleError(req, res, 400, { message: "Invalid genre" });

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

      const movieGenres: (typeof movieGenresTable.$inferInsert)[] =
        genreIds.map((id) => ({ movieId: newMovie?.id!, genreId: id }));
      await db.insert(movieGenresTable).values(movieGenres).returning();
      return handleSuccess(req, res, 201, {
        data: { title: newMovie?.title },
        message: "New movie created",
      });
    } catch (error) {
      this.errorLogService.logServerError("movie-controller", error, req);
      return handleError(req, res, 500, {
        success: false,
        message: "server error",
      });
    }
  }

  async getMovies(req: Request, res: Response) {
    const { ...queries } = req.query;
    const page = parseInt(queries.page as string) || 1;
    const limit = parseInt(queries.limit as string) || 10;
    const search = queries.search as string | undefined
    const releaseDate = queries.releaseDate as string | undefined
    const offset = (page - 1) * limit;

    // build conditions dynamically
    const conditions = []
    if(search) conditions.push(ilike(moviesTable.title, `%${search}%`))
      if(releaseDate) conditions.push(eq(moviesTable.releaseDate, releaseDate))
        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    try {
      const [movies, countResult] = await Promise.all([
         db.select({
          title: moviesTable.title,
          description: moviesTable.description,
          runtime: moviesTable.runtime,
          releaseDate: moviesTable.releaseDate,
          posterImageUrl: sql<string>`${moviesTable.posterImage}->'url'`,
          trailerLink: moviesTable.trailerLink,
          status: movieStatusTable.name,
        })
        .from(moviesTable)
        .leftJoin(
          movieStatusTable,
          eq(movieStatusTable.id, moviesTable.statusId),
        ).where(whereClause)
        .limit(limit)
        .offset(offset),

        db.select({ total: count() })
            .from(moviesTable)
            .where(whereClause)

      ])

      const total = countResult[0]?.total ?? 0;
      const totalPages = Math.ceil(total / limit)
       
      return handleSuccess(req, res, 200, { success: true, data: movies, pagination: {total, page, limit, totalPages, hasNextPage: totalPages > page, hasPrevPage: page > 1} });
    } catch (error) {
      this.errorLogService.logServerError("movie-controller", error, req);
      return handleError(req, res, 500, {
        success: false,
        message: "server error",
      });
    }
  }
}
