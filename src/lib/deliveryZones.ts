// src/lib/deliveryZones.ts
import { prisma } from '@/lib/prisma';

export async function getActiveDeliveryZones() {
  return await prisma.deliveryZone.findMany({
    where: { is_active: true },
    orderBy: { city_name: 'asc' },
  });
}