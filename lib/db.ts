import { MongoClient, Db } from 'mongodb';

let client: MongoClient | null = null;
let db: Db | null = null;

export async function getDb() {
  if (db) return db;
  const uri = process.env.MONGODB_URI;
  if (!uri) return null; // optional: allow JSON fallback without Mongo
  client = new MongoClient(uri);
  await client.connect();
  db = client.db();
  return db;
}