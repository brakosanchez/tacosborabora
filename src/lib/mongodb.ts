import 'server-only'

import { MongoClient, type Db } from 'mongodb'

const mongoUri = process.env.MONGODB_URI
const databaseName = process.env.DATABASE_NAME

if (!mongoUri) {
  throw new Error('Missing env var: MONGODB_URI')
}

type GlobalWithMongo = typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>
}

const globalWithMongo = global as GlobalWithMongo

let clientPromise: Promise<MongoClient>
if (!globalWithMongo._mongoClientPromise) {
  const client = new MongoClient(mongoUri)
  globalWithMongo._mongoClientPromise = client.connect()
}
if (!globalWithMongo._mongoClientPromise) {
  throw new Error('MongoDB client promise was not initialized')
}
clientPromise = globalWithMongo._mongoClientPromise

export async function getMongoClient(): Promise<MongoClient> {
  return clientPromise
}

export async function getDb(): Promise<Db> {
  const client = await getMongoClient()
  return databaseName ? client.db(databaseName) : client.db()
}
