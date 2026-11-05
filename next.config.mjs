/** @type {import('next').NextConfig} */
const nextConfig = {
  // Server-only packages
  serverExternalPackages: [
    'mongoose',
    'bcryptjs',
    'jsonwebtoken',
    'dotenv',
  ],

  // CKEditor 5 support
  transpilePackages: [
    'ckeditor5',
    '@ckeditor/ckeditor5-react',
  ],

  // Image Optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    minimumCacheTTL: 60 * 60 * 24 * 30,

    // ✅ Cloudinary support
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },

  compress: true,

  async redirects() {
    return [
      {
        source: '/contact-us',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/contact-us.php',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/contact.php',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/career.php',
        destination: '/career',
        permanent: true,
      },
      {
        source: '/ac-sizing.php',
        destination: '/ac-sizing',
        permanent: true,
      },
      {
        source: '/products.php',
        destination: '/products',
        permanent: true,
      },
      {
        source: '/products/:file.php',
        destination: '/products/:file',
        permanent: true,
      },
      {
        source: '/products/category/:slug*',
        destination: '/products/:slug*',
        permanent: true,
      },
      // Legacy Technical Resource & Manual Redirects (Phase 5.5)
      {
        source: '/error-codes.php',
        destination: '/resources?category=error-codes',
        permanent: true,
      },
      {
        source: '/error-codes',
        destination: '/resources?category=error-codes',
        permanent: true,
      },
      {
        source: '/user-manual.php',
        destination: '/resources?category=manuals',
        permanent: true,
      },
      {
        source: '/user-manual',
        destination: '/resources?category=manuals',
        permanent: true,
      },
      {
        source: '/warranty-terms-and-conditions.php',
        destination: '/warranty-terms-and-conditions',
        permanent: true,
      },
      {
        source: '/warranty.php',
        destination: '/warranty-terms-and-conditions',
        permanent: true,
      },
      {
        source: '/warranty-terms.php',
        destination: '/warranty-terms-and-conditions',
        permanent: true,
      },
      {
        source: '/warranty-terms',
        destination: '/warranty-terms-and-conditions',
        permanent: true,
      },
      {
        source: '/warranty',
        destination: '/warranty-terms-and-conditions',
        permanent: true,
      },
      // Legacy Public Pages & Aliases (Phase 5.7 & 5.7.2 Remediation)
      {
        source: '/about-us.php',
        destination: '/about-us',
        permanent: true,
      },
      {
        source: '/clients.php',
        destination: '/clients',
        permanent: true,
      },
      {
        source: '/index.php',
        destination: '/',
        permanent: true,
      },
      {
        source: '/blog-detail.php',
        has: [
          {
            type: 'query',
            key: 'url',
            value: '(?<slug>[^&]+)',
          },
        ],
        destination: '/blogs/:slug',
        permanent: true,
      },
      {
        source: '/blog-detail.php',
        destination: '/blogs',
        permanent: true,
      },
      {
        source: '/faq.php',
        destination: '/faq',
        permanent: true,
      },
      {
        source: '/privacy-policy.php',
        destination: '/privacy-policy',
        permanent: true,
      },
      {
        source: '/terms-and-condition.php',
        destination: '/terms-and-condition',
        permanent: true,
      },
      {
        source: '/terms-and-conditions.php',
        destination: '/terms-and-condition',
        permanent: true,
      },
      {
        source: '/terms-and-conditions',
        destination: '/terms-and-condition',
        permanent: true,
      },
      {
        source: '/blogs.php',
        destination: '/blogs',
        permanent: true,
      },
      {
        source: '/blog',
        destination: '/blogs',
        permanent: true,
      },
      {
        source: '/blog/:slug',
        destination: '/blogs/:slug',
        permanent: true,
      },
      {
        source: '/blog-detail/:slug',
        destination: '/blogs/:slug',
        permanent: true,
      },
      {
        source: '/blogs/page/:page',
        destination: '/blogs',
        permanent: true,
      },
    ];
  },

  // ✅ Enable View Transitions API for smooth cross-fade navigations.
  // The CSS in globals.css anchors the header so it stays fixed.
  // Gracefully degrades to instant navigation in unsupported browsers.
  experimental: {
    viewTransition: true,
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
