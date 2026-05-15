CREATE TABLE "showtime_schedules" (
	"showTimeId" integer,
	"scheduleId" integer
);
--> statement-breakpoint
ALTER TABLE "showtimes" DROP CONSTRAINT "showtimes_scheduleId_schedules_id_fk";
--> statement-breakpoint
ALTER TABLE "showtime_schedules" ADD CONSTRAINT "showtime_schedules_showTimeId_showtimes_id_fk" FOREIGN KEY ("showTimeId") REFERENCES "public"."showtimes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "showtime_schedules" ADD CONSTRAINT "showtime_schedules_scheduleId_schedules_id_fk" FOREIGN KEY ("scheduleId") REFERENCES "public"."schedules"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "showtimes" DROP COLUMN "scheduleId";