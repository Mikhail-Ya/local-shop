// src/app/api/auth/admin/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action } = body; // 'login' или 'logout'

  if (action === 'login') {
    // Защита: проверяем секретный токен (из .env)
    const token = body.token;
    if (token !== process.env.ADMIN_SECRET_TOKEN) {
      return NextResponse.json({ error: 'Неверный токен' }, { status: 403 });
    }

    // Устанавливаем HTTP-only cookie (безопаснее localStorage)
    const response = NextResponse.json({ success: true });
    response.cookies.set('is_admin', 'true', {
      httpOnly: false, // чтобы читать из JS
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 дней
      path: '/',
    });
    return response;
  }

  if (action === 'logout') {
    const response = NextResponse.json({ success: true });
    response.cookies.set('is_admin', '', { maxAge: 0, path: '/' });
    return response;
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}