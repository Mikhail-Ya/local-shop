// src/lib/deliveryZones.ts
import { prisma } from '@/lib/prisma';

export async function getActiveDeliveryZones() {
  return await prisma.deliveryZone.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
  });
}