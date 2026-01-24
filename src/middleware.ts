// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'cookie';

const SESSION_COOKIE_NAME = 'admin_session';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Защищаем только /admin и подпути
  if (path.startsWith('/admin')) {
    const cookieHeader = request.headers.get('cookie');
    const cookies = cookieHeader ? parse(cookieHeader) : {};
    const session = cookies[SESSION_COOKIE_NAME];

    if (session !== 'authenticated') {
      // Редирект на страницу входа
      const url = new URL('/admin/login', request.url);
      url.searchParams.set('redirect', path);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};