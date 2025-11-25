// scripts/sync-autotrader.ts
import { MongoClient } from 'mongodb';
import { fetchAutotraderStock, mapAutotraderStockToOffer } from '../lib/autotrader';

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI missing');
    process.exit(1);
  }

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db();
  const coll = db.collection('offers');

  console.log('Fetching stock from Auto Trader…');
  const stock = await fetchAutotraderStock();
  console.log(`Fetched ${stock.length} stock items from Auto Trader`);

  let upserted = 0;

  for (const s of stock) {
    try {
      const doc = mapAutotraderStockToOffer(s);
      if (!doc.id) continue;

      await coll.updateOne(
        { id: doc.id },
        { $set: doc },
        { upsert: true },
      );
      upserted += 1;
    } catch (err) {
      console.error('Failed to map/upsert stock item', s.metadata?.stockId, err);
    }
  }

  console.log(`Upserted ${upserted} Auto Trader offers into 'offers' collection`);
  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});