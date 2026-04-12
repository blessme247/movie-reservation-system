import { env } from './config/env';
import { eq } from 'drizzle-orm';
import { usersTable } from './db/schema';
import { db } from './db';
import { migrate } from "drizzle-orm/node-postgres/migrator"
import express from "express"

const app = express()
  

async function init() {
  console.log(env.NODE_ENV)

  if(env.NODE_ENV === "production"){
    await migrate(db, { migrationsFolder: "../drizzle" });
  }

  await main();
}

async function main() {
  const user: typeof usersTable.$inferInsert = {
    name: 'John',
    age: 30,
    email: 'john@example.com',
  };

  await db.insert(usersTable).values(user);
  console.log('New user created!')

  const users = await db.select().from(usersTable);
  console.log('Getting all users from the database: ', users)
  /*
  const users: {
    id: number;
    name: string;
    age: number;
    email: string;
  }[]
  */

  await db
    .update(usersTable)
    .set({
      age: 31,
    })
    .where(eq(usersTable.email, user.email));
  console.log('User info updated!')

  await db.delete(usersTable).where(eq(usersTable.email, user.email));
  console.log('User deleted!')

  app.listen(env.PORT, () => {
  console.log(`Server is listening on port ${env.PORT}`);
});
}

init();
