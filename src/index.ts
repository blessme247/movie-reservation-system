import { env } from './config/env';
import { db } from './db';
import { migrate } from "drizzle-orm/node-postgres/migrator"
import express from "express"
import { requestsLogger } from './middleware/logger';
import { corsOptions } from './config/cors';
import cors from "cors";
import { apiRateLimiter } from './config/rateLimit';
import { seed } from './lib/seed';
import { usersTable } from './db/schema';
import { eq } from 'drizzle-orm';

const app = express()
  

async function init() {
  console.log(env.NODE_ENV)
  console.log(Date.now(), 'date')

  if(env.NODE_ENV === "production"){
    await migrate(db, { migrationsFolder: "../drizzle" });
  }

  await main();
}

async function main() {
  await seed()
  // const user: typeof usersTable.$inferInsert = {
  //   firstName: 'John',
  //   lastName: 'Bailey',
  //   email: 'john@example.com',
  //   roleId: 1
  // };

  // await db.insert(usersTable).values(user);
  // console.log('New user created!') 

  // const users = await db.select().from(usersTable);
  // console.log('Getting all users from the database: ', users)
  /*
  const users: {
    id: number;
    name: string;
    age: number;
    email: string;
  }[]
  */

  // const updatedUser = await db
  //   .update(usersTable)
  //   .set({
  //     roleId: 2,
  //   })
  //   .where(eq(usersTable.email, user.email)).returning();
  // console.log('User info updated!', updatedUser)

  // await db.delete(usersTable);
  // console.log('Users deleted!')


  app.use(requestsLogger)
  app.use(cors(corsOptions))
  app.use(express.json())
  app.use(apiRateLimiter)

  app.listen(env.PORT, () => {
  console.log(`Server is listening on port ${env.PORT}`);
});
}

init();
