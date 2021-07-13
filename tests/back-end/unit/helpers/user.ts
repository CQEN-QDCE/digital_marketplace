import { connectToDatabase } from "back-end/index";
import { generateUuid } from "back-end/lib";
import { CreateUserParams, RawUser, rawUserToUser } from "back-end/lib/db";
import { SessionRecord } from "shared/lib/resources/session";
import { User, UserStatus, UserType } from "shared/lib/resources/user";

const dbConnexion = connectToDatabase();


const opUser = {
  id: generateUuid(),
  acceptedTermsAt: new Date(),
  capabilities: [],
  deactivatedBy: null,
  deactivatedOn: null,
  email: null,
  idpId: 'b',
  idpUsername: 'a',
  jobTitle: 'c',
  lastAcceptedTermsAt: null,
  locale: 'fr',
  name: 'd',
  notificationsOn: null,
  status: UserStatus.Active,
  type: UserType.Government
}


export async function createOpUser(){
  const now = new Date();
  const [result] = await dbConnexion<RawUser>('users')
      .insert({
        ...opUser,
        id: generateUuid(),
        createdAt: now,
        updatedAt: now,
      } as CreateUserParams, '*')
  return await rawUserToUser(dbConnexion, result);
}


export function createOpSession(opUser: User): SessionRecord {
  return {
    id: generateUuid(),
    createdAt: new Date,
    updatedAt: new Date,
    accessToken: generateUuid(),
    user: opUser,
  }
}

var knexCleaner = require('knex-cleaner');


export async function cleanupUsers() {
  await knexCleaner.clean(dbConnexion, {
    ignoreTable: ['migrations', 'migrations_lock']
  })
  await dbConnexion<RawUser>('users').delete()
}