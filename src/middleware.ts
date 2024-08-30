import { auth } from '@/auth';

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Allow access to the login and signup pages without authentication
  if (!req.auth && pathname !== '/login' && pathname !== '/signup') {
    const newUrl = new URL('/login', req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
