// src/app/api/admin/products/import/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { Readable } from 'stream';
import { parse } from 'csv-parse';
import { prisma } from '@/lib/prisma';

// Тип для одной строки CSV
interface CsvRow {
  sku: string;
  name: string;
  slug?: string;
  description?: string;
  price: string; // будет преобразовано в число
  category_slug: string;
  stock: string;
  images?: string; // строки, разделённые \n или ;
  attributes?: string; // JSON-строка
}

export async function POST(request: NextRequest) {
console.log('🔍 Начало импорта...');

  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  console.log('📁 Файл получен:', file?.name, file?.type, file?.size);

  if (!file || file.type !== 'text/csv') {
    console.log('❌ Ошибка: файл не CSV или отсутствует');
    return NextResponse.json({ error: 'Требуется CSV-файл' }, { status: 400 });
  }


  try {

    // 1. Получаем форму с файлом
   /* const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file || file.type !== 'text/csv') {
      return NextResponse.json({ error: 'Требуется CSV-файл' }, { status: 400 });
    }*/

    // 2. Преобразуем File в Node.js Readable Stream
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const stream = Readable.from(buffer);

    // 3. Парсим CSV
    const records: CsvRow[] = [];
    const parser = stream.pipe(
      parse({
        columns: true,
        skip_empty_lines: true,
        trim: true,
        delimiter: ',',
        relax_column_count: true,
        skip_lines_with_error: false,
      })
    );

    for await (const record of parser) {
      records.push(record as CsvRow);
    }

    // 4. Подгружаем категории один раз
    const allCategories = await prisma.category.findMany({
      select: { id: true, slug: true },
    });
    const categoryMap = new Map<string, string>();
    for (const cat of allCategories) {
      categoryMap.set(cat.slug, cat.id);
    }

    // 5. Обрабатываем каждую строку
    const results = {
      success: 0,
      created: 0,
      updated: 0,
      errors: [] as { line: number; message: string }[],
    };

    for (let i = 0; i < records.length; i++) {
      const row = records[i];
      const lineNumber = i + 2; // +1 header, +1 zero-index

      try {
        // Валидация обязательных полей
        if (!row.sku?.trim()) {
          throw new Error('Поле "sku" обязательно');
        }
        if (!row.name?.trim()) {
          throw new Error('Поле "name" обязательно');
        }
        if (!row.price) {
          throw new Error('Поле "price" обязательно');
        }
        if (!row.category_slug?.trim()) {
          throw new Error('Поле "category_slug" обязательно');
        }

        // Нормализация данных
        const price = parseFloat(row.price);
        if (isNaN(price)) {
          throw new Error('Цена должна быть числом');
        }

        const categoryId = categoryMap.get(row.category_slug.trim());
        if (!categoryId) {
          throw new Error(`Категория "${row.category_slug}" не найдена`);
        }

        let images: string[] = [];
        if (row.images) {
          // Поддерживаем \n или ; как разделитель
          images = row.images
            .split(/[\n;]/)
            .map(s => s.trim())
            .filter(s => s);
        }

        let attributes = {};
        if (row.attributes) {
          try {
            attributes = JSON.parse(row.attributes);
          } catch (e) {
            throw new Error('Некорректный JSON в поле "attributes"');
          }
        }

        const slug = row.slug?.trim() || row.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');

        // 6. Upsert в БД
        const existing = await prisma.product.findUnique({ where: { sku: row.sku } });
        if (existing) {
          await prisma.product.update({
            where: { id: existing.id },
            data: {
              name: row.name,
              slug,
              description: row.description || null,
              price,
              category_id: categoryId,
              stock: parseInt(row.stock),
              images,
              attributes,
            },
          });
          results.updated++;
        } else {
          await prisma.product.create({
            data: {
              sku: row.sku,
              name: row.name,
              slug,
              description: row.description || null,
              price,
              category_id: categoryId,
              stock: parseInt(row.stock),
              images,
              attributes,
            },
          });
          results.created++;
        }
        results.success++;

      } catch (error: any) {
        results.errors.push({
          line: lineNumber,
          message: error.message || 'Неизвестная ошибка',
        });
      }
    }

    return NextResponse.json({
      success: results.success,
      created: results.created,
      updated: results.updated,
      errors: results.errors,
    });

  } catch (error: any) {
    console.error('Import error:', error);
    return NextResponse.json(
      { error: 'Ошибка при импорте: ' + (error.message || 'неизвестно') },
      { status: 500 }
    );
  }
}