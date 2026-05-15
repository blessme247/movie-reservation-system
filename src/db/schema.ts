import { integer, pgTable, varchar, uniqueIndex, index, date, time, timestamp, AnyPgColumn, } from "drizzle-orm/pg-core";
import { timestamps } from "./columns.helpers";


export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  firstName: varchar({ length: 255 }).notNull(),
  lastName: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  roleId: integer().references(() => rolesTable.id).notNull(),
  password: varchar({length: 100}),
  refreshToken: varchar({length: 3000}),
  ...timestamps
},
(table) => [
  uniqueIndex("email_idx").on(table.email)
]
);

export const moviesTable = pgTable("movies", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 500 }).notNull(),
  runTime: integer().notNull(),
  releaseDate: date().notNull(),
  posterImageId: integer().references((): AnyPgColumn => posterImagesTable.id),
  statusId: integer().references((): AnyPgColumn => movieStatusTable.id),
  ...timestamps
},
(table) => [
  index("title_idx").on(table.title),
  index("status_idx").on(table.statusId),
]
);


export const showTimesTable = pgTable("showtimes", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  movieId: integer().references(() => moviesTable.id),
  cinemaId: integer().references(() => cinemaTable.id),
  // scheduleId: integer().references(() => scheduleTable.id),
  totalReservations: integer().notNull(),
  datetime: timestamp().notNull(),
  ...timestamps
});

export const scheduleTable = pgTable("schedules", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
});

/**
 * A joining table between showtimes and schedules
 */
export const showTimeScheduleTable = pgTable("showtime_schedules", {
  showTimeId: integer().references(() => showTimesTable.id),
  scheduleId: integer().references(() => scheduleTable.id)
});

export const cinemaTable = pgTable("cinemas", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  capacity: integer().notNull()
},
(table)=> [
  (index("name_idx").on(table.name))
]);

export const rolesTable = pgTable("roles", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
});

export const posterImagesTable = pgTable("poster_images", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  movieId: integer().references(() => moviesTable.id),
  publicId: varchar({length: 255}).notNull(),
  assetId: varchar({length: 255}).notNull(),
  secureUrl: varchar({length: 1000}).notNull(),
  width: integer().notNull(),
  height: integer().notNull(),
  format: varchar({length: 100}).notNull(),
  resourceType: varchar({length: 100}).notNull(),
  folder: varchar({length: 100}).notNull(),
  bytes: integer().notNull(),
  ...timestamps
},
(table) => [
  index("movie_id_idx").on(table.movieId)
]
);

export const genresTable = pgTable("genres", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
})

/**
 * A joining table between movies and genres 
 */
export const movieGenresTable = pgTable("movie_genres", {
  movieId: integer().references(() => moviesTable.id),
  genreId: integer().references(() => genresTable.id),
})

export const seatReservationsTable = pgTable("seat_reservations", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  showTimeId: integer().references(() => showTimesTable.id),
  userId: integer().references(() => usersTable.id),
  ticketTypeId: integer().references(() => ticketTypesTable.id),
  ...timestamps
}, (table) => [
  index('showtime_id_idx').on(table.showTimeId),
  index('user_id_idx').on(table.userId),
])

export const ticketTypesTable = pgTable("ticket_types", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
});

export const movieStatusTable = pgTable("status", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
});

export const seatsTable = pgTable("seats", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  cinemaId: integer().references(() => cinemaTable.id),
  seatNumber: varchar({ length: 10}).notNull()
})

export const reservationTicketsTable = pgTable("reservation_tickets", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  reservationId: integer().references(() => seatReservationsTable.id),
  ticketTypeId: integer().references(() => ticketTypesTable.id),
  ...timestamps
},
(table) => [
  index('reservation_id_idx').on(table.reservationId),
])

/**
 * A joining table between reservations and seats
 */
export const reservationSeatsTable = pgTable("reservation_seats", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  reservationId: integer().references(() => seatReservationsTable.id),
  seatId: integer().references(() => seatsTable.id),
  ...timestamps
},
(table) => [
  index('reservation_id_idx_seats').on(table.reservationId),
])


export const showtimeReservedSeatsTable = pgTable("showtime_reserved_seats", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  showTimeId: integer().references(() => showTimesTable.id),
  seatId: integer().references(() => seatsTable.id),
  ...timestamps
}, (table) => [
  index('showtime_id_idx_reserved_seats').on(table.showTimeId),
  index('seat_id_idx').on(table.seatId),
])