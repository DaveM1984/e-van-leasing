// app/api/autotrader/sync/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { fetchAutotraderStock, mapAutotraderStockToOffer } from '@/lib/autotrader';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  // Very simple protection: shared secret in header or query.
  const secret = process.env.AUTOTRADER_SYNC_SECRET;
  const provided = req.headers.get('x-sync-secret') || req.nextUrl.searchParams.get('secret');
  if (secret && secret !== provided) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    return NextResponse.json({ error: 'MONGODB_URI missing' }, { status: 500 });
  }

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    const coll = db.collection('offers');

    const stock = await fetchAutotraderStock();

    let upserted = 0;
    for (const s of stock) {
      try {
        const doc = mapAutotraderStockToOffer(s);
        if (!doc.id) continue;
        await coll.updateOne({ id: doc.id }, { $set: doc }, { upsert: true });
        upserted += 1;
      } catch (err) {
        console.error('Failed to map/upsert stock item', s.metadata?.stockId, err);
      }
    }

    return NextResponse.json({ ok: true, count: upserted });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
  } finally {
    await client.close();
  }
}