import type { Request, Response } from "express";
import { createMovieDto } from "./movies.dto";
import { handleError } from "../../lib/utils/handleError";
import { uploadToCloud } from "../../services/cloudUpload";

export class MovieController {
    async createMovie(req: Request, res: Response){
        const parseResult = createMovieDto.safeParse(req.body);
            if (!parseResult.success) {
              return handleError(req, res, 400, {
                success: false,
                message: "Validation failed",
                errors: parseResult.error.flatten().fieldErrors,
              });
            }

            const {result, error} = await uploadToCloud(req);
            
            if (error) {
                return handleError(req, res, 500, {
                    success: false,
                    message: "Upload failed",
                    error:  error,
                });
            }

            const { title, description, runtime, releaseDate, statusId, genreIds } = parseResult.data;
    }
}