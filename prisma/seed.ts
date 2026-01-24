// prisma/seed.ts
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('❌ DATABASE_URL is not set');
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 12);
}

async function main() {
  await prisma.user.upsert({
    where: { email: 'admin@localshop.ru' },
    update: {},
    create: {
      email: 'admin@localshop.ru',
      password_hash: hashPassword('secure_password_123'),
      full_name: 'Администратор',
      role: 'admin',
    },
  });

  await prisma.deliveryZone.createMany({
     data:[
      { name: 'Осташков', code: 'ostashkov', deliveryFee: 0, isActive: true },
      { name: 'Селижарово', code: 'selizharovo', deliveryFee: 100, isActive: true },
      { name: 'Пено', code: 'peno', deliveryFee: 150, isActive: true },
    ],
    skipDuplicates: true,
  });
}

main()
  .catch(e => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });