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
      { name: 'Осташков', deliveryFee: 1, code: 'ostashkov', isActive: true },
      { name: 'Селижарово', deliveryFee: 2, code: 'peno', isActive: true },
      { name: 'Пено', deliveryFee: 3, code: 'selijarovo', isActive: true },
    ],
    skipDuplicates: true,
  });
  await prisma.category.createMany({
     data:[
  { name: 'Туризм' },
  { name: 'Отдых' },
  { name: 'Дача' },
  { name: 'Огород' },
  { name: 'Бытовая техника'},
  {name: 'tech'}
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