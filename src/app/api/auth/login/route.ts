// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword } from '@/lib/auth';
import { serialize } from 'cookie';

// Cookie для администратора (используется в middleware)
const ADMIN_SESSION_COOKIE_NAME = 'admin_session';
// Cookie для обычных пользователей и админов (идентификатор пользователя)
const USER_SESSION_COOKIE_NAME = 'user_session';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email и пароль обязательны' }, { status: 400 });
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

    if (!user || !verifyPassword(password, user.password_hash)) {
      return NextResponse.json({ error: 'Неверные учётные данные' }, { status: 401 });
    }

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 дней
      path: '/',
      sameSite: 'lax' as const,
    };

    // Сессия пользователя (для /profile, Navbar и т.п.) — сохраняем id пользователя
    const userSessionCookie = serialize(USER_SESSION_COOKIE_NAME, user.id, cookieOptions);

    const response = NextResponse.json({
      success: true,
      user: {
        email: user.email,
        role: user.role,
      },
    });

    response.headers.append('Set-Cookie', userSessionCookie);

    // Если это администратор — дополнительно ставим admin_session для middleware
    if (user.role === 'admin') {
      const adminSessionCookie = serialize(ADMIN_SESSION_COOKIE_NAME, 'authenticated', cookieOptions);
      response.headers.append('Set-Cookie', adminSessionCookie);
    }

    return response;
  } catch (error) {
    console.error('Ошибка входа:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}