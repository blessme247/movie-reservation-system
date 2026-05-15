CREATE TABLE "movie_genres" (
	"movieId" integer,
	"genreId" integer
);
--> statement-breakpoint
ALTER TABLE "genres" DROP CONSTRAINT "genres_movieId_movies_id_fk";
--> statement-breakpoint
ALTER TABLE "movie_genres" ADD CONSTRAINT "movie_genres_movieId_movies_id_fk" FOREIGN KEY ("movieId") REFERENCES "public"."movies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "movie_genres" ADD CONSTRAINT "movie_genres_genreId_genres_id_fk" FOREIGN KEY ("genreId") REFERENCES "public"."genres"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "genres" DROP COLUMN "movieId";