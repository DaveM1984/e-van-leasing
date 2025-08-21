import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.offer) return NextResponse.json({ error: 'Invalid body' }, { status: 400 });

  const payload = {
    source: 'e-van-leasing.co.uk',
    offerId: body.offer.id,
    make: body.offer.make,
    model: body.offer.model,
    derivative: body.offer.derivative,
    name: body.name,
    email: body.email,
    phone: body.phone,
    company: body.company || '-',
    customerType: body.customerType,
    vatRegistered: body.vatRegistered === true || body.vatRegistered === 'true',
    preferredTermMonths: Number(body.preferredTermMonths),
    preferredMileage: Number(body.preferredMileage),
    initialPaymentMultiple: Number(body.initialPaymentMultiple),
    notes: body.notes || '',
    utm: body.utm || {}
  };

  const res = await fetch(process.env.CRM_WEBHOOK_URL!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const ok = res.ok;
  return NextResponse.json({ ok });
}