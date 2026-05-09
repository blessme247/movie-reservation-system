CREATE TABLE "showtime_reserved_seats" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "showtime_reserved_seats_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"showTimeId" integer,
	"seatId" integer,
	"updatedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"deletedAt" timestamp
);
--> statement-breakpoint
ALTER TABLE "showtime_reserved_seats" ADD CONSTRAINT "showtime_reserved_seats_showTimeId_showtimes_id_fk" FOREIGN KEY ("showTimeId") REFERENCES "public"."showtimes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "showtime_reserved_seats" ADD CONSTRAINT "showtime_reserved_seats_seatId_seats_id_fk" FOREIGN KEY ("seatId") REFERENCES "public"."seats"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "showtime_id_idx_reserved_seats" ON "showtime_reserved_seats" USING btree ("showTimeId");--> statement-breakpoint
CREATE INDEX "seat_id_idx" ON "showtime_reserved_seats" USING btree ("seatId");--> statement-breakpoint
CREATE INDEX "name_idx" ON "cinemas" USING btree ("name");--> statement-breakpoint
CREATE INDEX "reservation_id_idx_seats" ON "reservation_seats" USING btree ("reservationId");--> statement-breakpoint
CREATE INDEX "reservation_id_idx" ON "reservation_tickets" USING btree ("reservationId");--> statement-breakpoint
CREATE INDEX "showtime_id_idx" ON "seat_reservations" USING btree ("showTimeId");--> statement-breakpoint
CREATE INDEX "user_id_idx" ON "seat_reservations" USING btree ("userId");