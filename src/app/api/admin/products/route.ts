// src/app/api/admin/products/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
      orderBy: { created_at: 'desc' },
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
// src/app/api/admin/products/route.ts (дополнительно)
import { NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      sku,
      name,
      slug,
      description,
      price,
      category_id,
      brand,
      stock,
      images = [],
      attributes = {},
    } = body;

    // Генерация slug, если не задан
    const finalSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const product = await prisma.product.create({
      data: {
        /*id: uuidv4(),*/ // cuid() уже используется в схеме, но можно и так
        sku,
        name,
        slug: finalSlug,
        description,
        price,
        category_id,
        brand,
        stock,
        images,
        attributes,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}