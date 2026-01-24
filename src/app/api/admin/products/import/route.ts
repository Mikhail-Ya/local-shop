// src/app/api/admin/products/import/route.ts
import { NextRequest } from 'next/server';
import { parse } from 'csv-parse';
import { pipeline } from 'stream/promises';
import { Readable } from 'stream';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // Получаем formData
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return new Response(JSON.stringify({ error: 'Файл не загружен' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      return new Response(JSON.stringify({ error: 'Поддерживается только формат CSV' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Читаем файл как Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Парсим CSV в массив объектов
    const records: Record<string, string>[] = [];
    const parser = parse({
      columns: true,           // первая строка — заголовки
      skip_empty_lines: true,
      trim: true,
      delimiter: ',',
      relax_column_count: true, // игнорировать строки с разным количеством колонок
    });

    // Собираем данные
    parser.on('data', (record: Record<string, string>) => {
      records.push(record);
    });

    // Запускаем парсинг
    await pipeline(
      Readable.from([buffer]),
      parser
    );

    if (records.length === 0) {
      return new Response(JSON.stringify({ message: 'Файл пуст или не содержит данных' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Преобразуем записи в формат Prisma
    const productsToCreate = records
      .filter(row => row.name && row.price) // обязательные поля
      .map(row => {
        const price = parseFloat(row.price.replace(',', '.').trim());
        const stock = parseInt(row.stock?.trim() || '0', 10);

        return {
          name: row.name.trim(),
          description: row.description?.trim() || null,
          price: isNaN(price) ? 0 : price,
          stock: isNaN(stock) ? 0 : stock,
          brand: row.brand?.trim() || null,
          imageUrl: row.imageUrl ? [row.imageUrl.trim()] : [],
          // categoryId будет установлен позже, если нужно
        };
      });

    if (productsToCreate.length === 0) {
      return new Response(JSON.stringify({ message: 'Нет валидных товаров для импорта' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Сохраняем в БД
    const result = await prisma.product.createMany({
      data: productsToCreate,
      skipDuplicates: true,
    });

    return new Response(
      JSON.stringify({
        message: `Успешно импортировано ${result.count} товаров`,
        count: result.count,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Ошибка при импорте CSV:', error);
    return new Response(
      JSON.stringify({ error: 'Ошибка при обработке файла' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}