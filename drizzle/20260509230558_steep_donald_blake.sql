CREATE TABLE "cinemas" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "cinemas_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"capacity" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "genres" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "genres_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"movieId" integer,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "status" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "status_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "poster_images" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "poster_images_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"movieId" integer,
	"publicId" varchar(255) NOT NULL,
	"assetId" varchar(255) NOT NULL,
	"secureUrl" varchar(1000) NOT NULL,
	"width" integer NOT NULL,
	"height" integer NOT NULL,
	"format" varchar(100) NOT NULL,
	"resourceType" varchar(100) NOT NULL,
	"folder" varchar(100) NOT NULL,
	"bytes" integer NOT NULL,
	"updatedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"deletedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "reservation_seats" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "reservation_seats_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"reservationId" integer,
	"seatId" integer,
	"updatedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"deletedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "reservation_tickets" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "reservation_tickets_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"reservationId" integer,
	"ticketTypeId" integer,
	"updatedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"deletedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "schedules" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "schedules_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "seat_reservations" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "seat_reservations_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"showTimeId" integer,
	"userId" integer,
	"ticketTypeId" integer,
	"updatedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"deletedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "seats" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "seats_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"cinemaId" integer,
	"seatNumber" varchar(10) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ticket_types" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ticket_types_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "movies" ADD COLUMN "description" varchar(500) NOT NULL;--> statement-breakpoint
ALTER TABLE "movies" ADD COLUMN "runTime" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "movies" ADD COLUMN "releaseDate" date NOT NULL;--> statement-breakpoint
ALTER TABLE "movies" ADD COLUMN "posterImageId" integer;--> statement-breakpoint
ALTER TABLE "movies" ADD COLUMN "statusId" integer;--> statement-breakpoint
ALTER TABLE "showtimes" ADD COLUMN "cinemaId" integer;--> statement-breakpoint
ALTER TABLE "showtimes" ADD COLUMN "scheduleId" integer;--> statement-breakpoint
ALTER TABLE "showtimes" ADD COLUMN "totalReservations" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "showtimes" ADD COLUMN "datetime" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "genres" ADD CONSTRAINT "genres_movieId_movies_id_fk" FOREIGN KEY ("movieId") REFERENCES "public"."movies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "poster_images" ADD CONSTRAINT "poster_images_movieId_movies_id_fk" FOREIGN KEY ("movieId") REFERENCES "public"."movies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reservation_seats" ADD CONSTRAINT "reservation_seats_reservationId_seat_reservations_id_fk" FOREIGN KEY ("reservationId") REFERENCES "public"."seat_reservations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reservation_seats" ADD CONSTRAINT "reservation_seats_seatId_seats_id_fk" FOREIGN KEY ("seatId") REFERENCES "public"."seats"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reservation_tickets" ADD CONSTRAINT "reservation_tickets_reservationId_seat_reservations_id_fk" FOREIGN KEY ("reservationId") REFERENCES "public"."seat_reservations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reservation_tickets" ADD CONSTRAINT "reservation_tickets_ticketTypeId_ticket_types_id_fk" FOREIGN KEY ("ticketTypeId") REFERENCES "public"."ticket_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seat_reservations" ADD CONSTRAINT "seat_reservations_showTimeId_showtimes_id_fk" FOREIGN KEY ("showTimeId") REFERENCES "public"."showtimes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seat_reservations" ADD CONSTRAINT "seat_reservations_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seat_reservations" ADD CONSTRAINT "seat_reservations_ticketTypeId_ticket_types_id_fk" FOREIGN KEY ("ticketTypeId") REFERENCES "public"."ticket_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seats" ADD CONSTRAINT "seats_cinemaId_cinemas_id_fk" FOREIGN KEY ("cinemaId") REFERENCES "public"."cinemas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "movie_id_idx" ON "poster_images" USING btree ("movieId");--> statement-breakpoint
ALTER TABLE "movies" ADD CONSTRAINT "movies_posterImageId_poster_images_id_fk" FOREIGN KEY ("posterImageId") REFERENCES "public"."poster_images"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "movies" ADD CONSTRAINT "movies_statusId_status_id_fk" FOREIGN KEY ("statusId") REFERENCES "public"."status"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "showtimes" ADD CONSTRAINT "showtimes_cinemaId_cinemas_id_fk" FOREIGN KEY ("cinemaId") REFERENCES "public"."cinemas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "showtimes" ADD CONSTRAINT "showtimes_scheduleId_schedules_id_fk" FOREIGN KEY ("scheduleId") REFERENCES "public"."schedules"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "status_idx" ON "movies" USING btree ("statusId");--> statement-breakpoint
ALTER TABLE "showtimes" DROP COLUMN "startTime";--> statement-breakpoint
ALTER TABLE "showtimes" DROP COLUMN "endTime";