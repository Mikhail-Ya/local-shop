// prisma/seed.ts
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

// Проверяем, что DATABASE_URL задан
if (!process.env.DATABASE_URL) {
  throw new Error('❌ DATABASE_URL is not set in environment variables');
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding delivery zones...');

  await prisma.deliveryZone.createMany({
     data:[
      { city_name: 'Осташков', delivery_days_min: 1, delivery_days_max: 2, is_active: true },
      { city_name: 'Селижарово', delivery_days_min: 2, delivery_days_max: 3, is_active: true },
      { city_name: 'Пено', delivery_days_min: 3, delivery_days_max: 4, is_active: true },
    ],
    skipDuplicates: true,
  });
  await prisma.category.createMany({
     data:[
  { name: 'Туризм', slug: 'turizm', description: 'Товары для отдыха на природе и походов' },
  { name: 'Отдых', slug: 'otdyh', description: 'Товары для пикников и активного отдыха' },
  { name: 'Дача', slug: 'dacha', description: 'Всё для дачи, сада и загородного дома' },
  { name: 'Огород', slug: 'ogorod', description: 'Инструменты и техника для сада и огорода' },
  { name: 'Бытовая техника', slug: 'bytovaya-tehnika', description: 'Техника для дома и кухни' },
  {name: 'tech', slug: 'tehnika',description:'техника'}
],
    skipDuplicates: true,
  });
  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });