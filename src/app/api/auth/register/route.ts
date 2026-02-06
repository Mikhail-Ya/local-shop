import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { serialize } from 'cookie';

const USER_SESSION_COOKIE_NAME = 'user_session';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, full_name, phone } = body || {};

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email и пароль обязательны' },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Пароль должен содержать не менее 6 символов' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Пользователь с таким email уже зарегистрирован' },
        { status: 400 }
      );
    }

    const password_hash = hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password_hash,
        full_name: full_name ? String(full_name).trim() : null,
        phone: phone ? String(phone).trim() : null,
        // role по умолчанию 'user' из Prisma-схемы
      },
    });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 дней
      path: '/',
      sameSite: 'lax' as const,
    };

    // Автоматически авторизуем пользователя после регистрации
    const userSessionCookie = serialize(USER_SESSION_COOKIE_NAME, user.id, cookieOptions);

    const response = NextResponse.json({
      success: true,
      user: {
        email: user.email,
        role: user.role,
        full_name: user.full_name,
      },
    });

    response.headers.append('Set-Cookie', userSessionCookie);

    return response;
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}

