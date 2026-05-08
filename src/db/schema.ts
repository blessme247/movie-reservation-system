import { integer, pgTable, varchar, uniqueIndex, index, timestamp } from "drizzle-orm/pg-core";
import { timestamps } from "./columns.helpers";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  firstName: varchar({ length: 255 }).notNull(),
  lastName: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  roleId: integer().references(() => rolesTable.id),
  ...timestamps
},
(table) => [
  uniqueIndex("email_idx").on(table.email)
]
);

export const moviesTable = pgTable("movies", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 255 }).notNull(),
  ...timestamps
},
(table) => [
  index("title_idx").on(table.title)
]
);

export const showTimesTable = pgTable("showtimes", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  movieId: integer().references(() => moviesTable.id),
  startTime: timestamp(),
  endTime: timestamp(),
  ...timestamps
});

export const rolesTable = pgTable("roles", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
});
