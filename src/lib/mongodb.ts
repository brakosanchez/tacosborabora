import 'server-only'

import { MongoClient, type Db } from 'mongodb'

function getMongoUri(): string {
  const mongoUri = process.env.MONGODB_URI
  if (!mongoUri) {
    throw new Error('Missing env var: MONGODB_URI')
  }
  return mongoUri
}

function getDatabaseName(): string | undefined {
  return process.env.DATABASE_NAME
}

type GlobalWithMongo = typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>
}

const globalWithMongo = global as GlobalWithMongo

export async function getMongoClient(): Promise<MongoClient> {
  if (!globalWithMongo._mongoClientPromise) {
    const client = new MongoClient(getMongoUri())
    globalWithMongo._mongoClientPromise = client.connect()
  }

  return globalWithMongo._mongoClientPromise
}

export async function getDb(): Promise<Db> {
  const client = await getMongoClient()
  const databaseName = getDatabaseName()
  return databaseName ? client.db(databaseName) : client.db()
}
