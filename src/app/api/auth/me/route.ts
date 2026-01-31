// src/app/api/auth/me/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { parse } from 'cookie';

const SESSION_COOKIE_NAME = 'admin_session';

export async function GET(request: NextRequest) {
  const cookieHeader = request.headers.get('cookie');
  const cookies = cookieHeader ? parse(cookieHeader) : {};
  const session = cookies[SESSION_COOKIE_NAME];

  if (session !== 'authenticated') {
    return NextResponse.json({ user: null });
  }

  const adminUser = await prisma.user.findFirst({
    where: { role: 'admin' },
    select: { email: true, role: true },
  });

  return NextResponse.json({ user: adminUser });
}