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

    // Helpers to coerce currency-like strings: "£28,300 + vat" -> 28300
    const toNumber = (v: any) => {
      if (v == null || v === '') return undefined;
      const s = String(v).replace(/[,£]/g, '').trim();
      const m = s.match(/^-?\d+(?:\.\d+)?/);
      return m ? Number(m[0]) : undefined;
    };

    doc.monthlyFromExVat = toNumber(r.monthlyFromExVat);
    // Fall back if parsing fails
    if (typeof doc.monthlyFromExVat !== 'number') doc.monthlyFromExVat = Number(r.monthlyFromExVat);

    doc.inStock = String(r.inStock).toLowerCase() === 'true';

    // Optional new fields
    const cash = toNumber((r as any).cashPriceExVat);
    if (cash !== undefined) doc.cashPriceExVat = cash;
    const balloon = toNumber((r as any).balloonExVat);
    if (balloon !== undefined) doc.balloonExVat = balloon;

    const baseTerm = toNumber((r as any).baseTermMonths);
    if (baseTerm !== undefined) doc.baseTermMonths = baseTerm;
    const baseMileage = toNumber((r as any).baseMileage);
    if (baseMileage !== undefined) doc.baseMileage = baseMileage;
    const baseInitial = toNumber((r as any).baseInitialMultiple);
    if (baseInitial !== undefined) doc.baseInitialMultiple = baseInitial;

    ['powerKw','payloadKg','loadLengthMm','loadHeightMm','rangeMiles'].forEach((k)=> {
      if (r[k]) doc[k] = Number(r[k]);
      else delete doc[k];
    });
    doc.images = (r.images || '').split('|').filter(Boolean);
    doc.terms = {
      termMonths: (r['terms.termMonths'] || '').split('|').map((x: string) => Number(x)).filter((n: number) => Number.isFinite(n)),
      mileagesPerYear: (r['terms.mileagesPerYear'] || '').split('|').map((x: string) => Number(x)).filter((n: number) => Number.isFinite(n)),
      initialPaymentMultiples: (r['terms.initialPaymentMultiples'] || '').split('|').map((x: string) => Number(x)).filter((n: number) => Number.isFinite(n))
    };
    // Remove dotted CSV keys so we don't set both 'terms' and 'terms.*' in the same update
    delete (doc as any)["terms.termMonths"];
    delete (doc as any)["terms.mileagesPerYear"];
    delete (doc as any)["terms.initialPaymentMultiples"];
    // First, remove any previously stored dotted subfields under `terms.*` to avoid Mongo path conflicts
    await coll.updateOne(
      { id: r.id },
      {
        $unset: {
          'terms.termMonths': "",
          'terms.mileagesPerYear': "",
          'terms.initialPaymentMultiples': ""
        }
      }
    );
    doc.hotOffer = String(r.hotOffer || '').toLowerCase() === 'true';
    // Final safety: drop ANY dotted keys from the update doc to avoid Mongo path conflicts
    const setDoc: any = Object.fromEntries(Object.entries(doc).filter(([k]) => !k.includes('.')));
    try {
      await coll.updateOne({ id: r.id }, { $set: setDoc }, { upsert: true });
    } catch (e) {
      console.error('Update failed for id=', r.id, 'keys=', Object.keys(setDoc));
      throw e;
    }
  }
  console.log(`Imported ${records.length} offers`);
  await client.close();
})();