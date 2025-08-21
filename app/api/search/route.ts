import { NextRequest, NextResponse } from 'next/server';
import { getOffers } from '@/lib/repositories/offers';
import { parseFiltersFromSearchParams } from '@/lib/filters';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const filters = parseFiltersFromSearchParams(Object.fromEntries(searchParams));
  const page = Number(searchParams.get('page') ?? 1);
  const pageSize = Number(searchParams.get('pageSize') ?? 50);
  const sort = searchParams.get('sort') || '';
  const ids = searchParams.getAll('id');
  const data = await getOffers({ filters, page, pageSize, sort, ids });
  return NextResponse.json(data);
}