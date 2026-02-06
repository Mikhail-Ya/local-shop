import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

const ADMIN_SESSION_COOKIE_NAME = 'admin_session';
const USER_SESSION_COOKIE_NAME = 'user_session';

export async function POST() {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0, // сразу удалить
    path: '/',
    sameSite: 'lax' as const,
  };

  const clearUserSession = serialize(USER_SESSION_COOKIE_NAME, '', cookieOptions);
  const clearAdminSession = serialize(ADMIN_SESSION_COOKIE_NAME, '', cookieOptions);

  const response = NextResponse.json({ success: true });

  response.headers.append('Set-Cookie', clearUserSession);
  response.headers.append('Set-Cookie', clearAdminSession);

  return response;
}

