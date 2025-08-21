import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'csv-parse/sync';
import { MongoClient } from 'mongodb';

(async () => {
  const csv = fs.readFileSync(path.join(process.cwd(), 'data/offers.csv'), 'utf8');
  const records = parse(csv, { columns: true, skip_empty_lines: true });
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI missing');
    process.exit(1);
  }
  const client = new MongoClient(uri);
  await client.connect();
  const coll = client.db().collection('offers');

  for (const r of records) {
    const doc: any = { ...r };
    doc.monthlyFromExVat = Number(r.monthlyFromExVat);
    doc.inStock = String(r.inStock).toLowerCase() === 'true';
    ['powerKw','payloadKg','loadLengthMm','loadHeightMm','rangeMiles'].forEach((k)=> {
      if (r[k]) doc[k] = Number(r[k]);
      else delete doc[k];
    });
    doc.images = (r.images || '').split('|').filter(Boolean);
    doc.terms = {
      termMonths: (r['terms.termMonths'] || '').split('|').map(Number),
      mileagesPerYear: (r['terms.mileagesPerYear'] || '').split('|').map(Number),
      initialPaymentMultiples: (r['terms.initialPaymentMultiples'] || '').split('|').map(Number)
    };
    doc.hotOffer = String(r.hotOffer || '').toLowerCase() === 'true';
    await coll.updateOne({ id: r.id }, { $set: doc }, { upsert: true });
  }
  console.log(`Imported ${records.length} offers`);
  await client.close();
})();