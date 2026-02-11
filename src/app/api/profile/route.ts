import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { parse } from 'cookie';

const USER_SESSION_COOKIE_NAME = 'user_session';

// Схема валидации для обновления профиля
const profileSchema = z.object({
  full_name: z.string().min(2, 'Имя слишком короткое').optional(),
  phone: z.string().min(5, 'Некорректный телефон').optional(),
  email: z.string().email('Некорректный email').optional(),
});

// GET - получение данных профиля
export async function GET(request: NextRequest) {
  const cookieHeader = request.headers.get('cookie');
  const cookies = cookieHeader ? parse(cookieHeader) : {};
  const userId = cookies[USER_SESSION_COOKIE_NAME];

  if (!userId) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        full_name: true,
        phone: true,
        role: true,
        created_at: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Ошибка получения профиля:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

// PATCH - обновление данных профиля
export async function PATCH(request: NextRequest) {
  const cookieHeader = request.headers.get('cookie');
  const cookies = cookieHeader ? parse(cookieHeader) : {};
  const userId = cookies[USER_SESSION_COOKIE_NAME];

  if (!userId) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validatedData = profileSchema.parse(body);

    // Если email изменяется, проверяем его уникальность
    if (validatedData.email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email: validatedData.email,
          NOT: { id: userId },
        },
      });

      if (existingUser) {
        return NextResponse.json({ error: 'Email уже используется' }, { status: 400 });
      }
    }

    // Обновляем данные пользователя
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...validatedData,
      },
      select: {
        id: true,
        email: true,
        full_name: true,
        phone: true,
        role: true,
        created_at: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Ошибка обновления профиля:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Ошибка валидации', details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Ошибка обновления профиля' },
      { status: 500 }
    );
  }
}
