// src/app/api/test-db/route.ts
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const count = await prisma.product.count();
    return Response.json({ ok: true, productCount: count });
  } catch (e) {
    return Response.json({ ok: false, error: (e as Error).message }, { status: 500 });
  }
}