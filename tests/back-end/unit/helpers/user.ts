import { DB_MIGRATIONS_TABLE_NAME } from "back-end/config";
import { connectToDatabase } from "back-end/index";
import { generateUuid } from "back-end/lib";
import { CreateUserParams, RawUser, rawUserToUser } from "back-end/lib/db";
import { SessionRecord } from "shared/lib/resources/session";
import { User, UserStatus, UserType } from "shared/lib/resources/user";

const dbConnexion = connectToDatabase();

const user = {
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
}

const opUser = {
  ...user,
  id: generateUuid(),
  type: UserType.Government
}

const vendorUser = {
  ...user,
  id: generateUuid(),
  type: UserType.Vendor
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


export async function createVendorUser(){
  const now = new Date();
  const [result] = await dbConnexion<RawUser>('users')
      .insert({
        ...vendorUser,
        id: generateUuid(),
        createdAt: now,
        updatedAt: now,
      } as CreateUserParams, '*')
  return await rawUserToUser(dbConnexion, result);
}


export function createUserSession(user: User): SessionRecord {
  return {
    id: generateUuid(),
    createdAt: new Date,
    updatedAt: new Date,
    accessToken: generateUuid(),
    user,
  }
}

var knexCleaner = require('knex-cleaner');


export async function cleanupDatabase() {
  await knexCleaner.clean(dbConnexion, {
    ignoreTables: [DB_MIGRATIONS_TABLE_NAME]
  })
}