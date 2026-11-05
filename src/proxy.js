import { NextResponse } from 'next/server';

// ─── Exact Public Endpoint Validator ──────────────────────────────────────────
function isPublicApiRequest(pathname, method) {
  // Public POST endpoints
  if (method === 'POST') {
    return (
      pathname === '/api/auth/login' ||
      pathname === '/api/auth/logout' ||
      pathname === '/api/enquiries' ||
      pathname === '/api/career/apply' ||
      pathname === '/api/analytics/track' ||
      pathname === '/api/system/errors'
    );
  }

  // Public GET endpoints
  if (method === 'GET') {
    if (
      pathname === '/api/system/health' ||
      pathname === '/api/system/maintenance'
    ) {
      return true;
    }

    // Public catalog, SEO, and content read-only routes
    const publicContentPrefixes = [
      '/api/products',
      '/api/categories',
      '/api/resources',
      '/api/banner',
      '/api/about',
      '/api/blog',
      '/api/blogs',
      '/api/gallery-images',
      '/api/certification',
      '/api/company-certifications',
      '/api/contact-page',
      '/api/cta',
      '/api/custom-pages',
      '/api/home-about',
      '/api/home-extra',
      '/api/home-seo',
      '/api/othercta',
      '/api/page-banners',
      '/api/sections',
      '/api/faqs',
      '/api/milestones',
      '/api/testimonials',
      '/api/why-choose',
      '/api/work',
      '/api/global-settings',
    ];

    return publicContentPrefixes.some(
      (prefix) => pathname === prefix || pathname.startsWith(prefix + '/')
    );
  }

  return false;
}

// ─── Auth Proxy — Next.js 16 Edge Interceptor ────────────────────────────────
export function proxy(request) {
  const { pathname } = request.nextUrl;

  // Extract token from either httpOnly cookie or Authorization header
  let token = request.cookies.get('admin_token')?.value;
  if (!token) {
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
      token = authHeader.slice(7).trim();
    }
  }

  if (token === 'null' || token === 'undefined') {
    token = null;
  }

  // 1. Protect Dashboard Routes: Redirect unauthenticated users to admin login
  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Protect Guest Routes: Redirect authenticated users away from login
  if (pathname === '/login' || pathname === '/admin/login') {
    if (token) {
      const dashboardUrl = new URL('/dashboard', request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  // 3. Protect API Routes: Strict whitelist enforcement
  if (pathname.startsWith('/api')) {
    const isPublic = isPublicApiRequest(pathname, request.method);

    if (!isPublic && !token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Missing or invalid admin token' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  // Match dashboard, login routes, and all API routes
  matcher: ['/dashboard/:path*', '/login', '/admin/login', '/api/:path*'],
};
