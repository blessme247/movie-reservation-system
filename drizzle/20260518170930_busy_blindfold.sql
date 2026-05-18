ALTER TABLE "movies" RENAME COLUMN "runTime" TO "runtime";--> statement-breakpoint
ALTER TABLE "movie_genres" ALTER COLUMN "movieId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "movie_genres" ALTER COLUMN "genreId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "movies" ALTER COLUMN "posterImage" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "movies" DROP COLUMN "posterImageUrl";