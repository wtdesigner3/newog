import { connectDB } from "./lib/config";
import Product from "./models/Product";
import Category from "./models/Category";
import Blog from "./models/Blog";
import Section from "./models/Section";
import About from "./models/About";
import CustomPage from "./models/CustomPage";
import { getOGCategoryFilter, getOGProductFilter, getOGBlogFilter } from "../lib/dbScope";

export const revalidate = 86400; // Cache for 24 hours

export default async function sitemap() {
  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || 'https://ogheavyduty.in').replace(/\/$/, '');

  try {
    await connectDB();

    // Fetch dynamic routes from DB strictly scoped to published OG records
    const [products, categories, blogs, sections, aboutPages, customPages] = await Promise.all([
      Product.find(getOGProductFilter({ status: 'published', isActive: { $ne: false } })).populate('category', 'slug').lean(),
      Category.find(getOGCategoryFilter({ status: 'published', isActive: { $ne: false } })).lean(),
      Blog.find(getOGBlogFilter({ status: 'published' })).lean(),
      Section.find({ isActive: true }).lean(),
      About.find({ isActive: true }).lean(),
      CustomPage.find({ isActive: true }).lean(),
    ]);

    // ── Products: /products/{category-slug}/{product-slug}
    const productUrls = products
      .filter(p => (p.categorySlug || p.category?.slug) && p.slug)
      .map((product) => ({
        url: `${baseUrl}/products/${product.categorySlug || product.category?.slug}/${product.slug}`,
        lastModified: product.updatedAt || product.createdAt || new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      }));

    // ── Categories: /products/{category-slug} (canonical slug only, never historical aliases)
    const categoryUrls = categories
      .filter(c => c.slug)
      .map((category) => ({
        url: `${baseUrl}/products/${category.slug}`,
        lastModified: category.updatedAt || category.createdAt || new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      }));

    // ── Section landing pages: /{section-slug}
    const sectionUrls = sections
      .filter(s => s.slug)
      .map((section) => ({
        url: `${baseUrl}/${section.slug}`,
        lastModified: section.updatedAt || section.createdAt || new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      }));

    // ── About / Inner pages: /{section-slug}/{page-slug}
    const aboutUrls = aboutPages
      .filter(p => p.section && p.slug)
      .map((page) => ({
        url: `${baseUrl}/${page.section}/${page.slug}`,
        lastModified: page.updatedAt || page.createdAt || new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      }));

    // ── Blog posts: /blogs/{slug}
    const blogUrls = blogs
      .filter(b => b.slug)
      .map((blog) => ({
        url: `${baseUrl}/blogs/${blog.slug}`,
        lastModified: blog.updatedAt || blog.createdAt || new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      }));

    // ── Custom pages: /{slug}
    const customPageUrls = customPages
      .filter(p => p.slug)
      .map((page) => ({
        url: `${baseUrl}/${page.slug}`,
        lastModified: page.updatedAt || page.createdAt || new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      }));

    // ── Truly static pages (no DB slug)
    const staticPages = [
      { route: '', priority: 1.0, freq: 'daily' },
      { route: '/products', priority: 0.9, freq: 'daily' },
      { route: '/resources', priority: 0.85, freq: 'weekly' },
      { route: '/about-us', priority: 0.8, freq: 'monthly' },
      { route: '/contact', priority: 0.8, freq: 'monthly' },
      { route: '/ac-sizing', priority: 0.8, freq: 'monthly' },
      { route: '/career', priority: 0.75, freq: 'monthly' },
      { route: '/faq', priority: 0.7, freq: 'monthly' },
      { route: '/privacy-policy', priority: 0.5, freq: 'monthly' },
      { route: '/terms-and-condition', priority: 0.5, freq: 'monthly' },
      { route: '/blogs', priority: 0.8, freq: 'daily' },
      { route: '/gallery', priority: 0.6, freq: 'monthly' },
      { route: '/certifications', priority: 0.6, freq: 'monthly' },
    ].map(({ route, priority, freq }) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: freq,
      priority,
    }));

    return [
      ...staticPages,
      ...categoryUrls,
      ...sectionUrls,
      ...aboutUrls,
      ...customPageUrls,
      ...productUrls,
      ...blogUrls,
    ];

  } catch (error) {
    console.error("Sitemap generation error:", error);
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
    ];
  }
}


