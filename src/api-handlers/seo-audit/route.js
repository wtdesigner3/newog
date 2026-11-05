import { NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/config';
import Product from '@/app/models/Product';
import Category from '@/app/models/Category';
import Blog from '@/app/models/Blog';
import HomeSeo from '@/app/models/HomeSeo';
import { requireAuth } from '@/app/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  try {
    await connectDB();

    const issues = [];
    let totalChecks = 0;
    let failedChecks = 0;

    // Helper to evaluate an entity
    const evaluate = (item, entityType, nameField, link) => {
      // 1. Meta Description
      totalChecks++;
      if (!item.metaDescription || item.metaDescription.trim() === '') {
        failedChecks++;
        issues.push({
          id: `${entityType}-${item._id}-desc`,
          entity: entityType,
          name: item[nameField] || 'Untitled',
          issue: 'Missing Meta Description',
          severity: 'high',
          link
        });
      }

      // 2. Meta Keywords
      totalChecks++;
      if (!item.metakeywords || item.metakeywords.length === 0 || (item.metakeywords.length === 1 && item.metakeywords[0] === '')) {
        failedChecks++;
        issues.push({
          id: `${entityType}-${item._id}-keys`,
          entity: entityType,
          name: item[nameField] || 'Untitled',
          issue: 'Missing Meta Keywords',
          severity: 'medium',
          link
        });
      }

      // 3. Canonical URL
      totalChecks++;
      if (!item.canonicalUrl || item.canonicalUrl.trim() === '') {
        failedChecks++;
        issues.push({
          id: `${entityType}-${item._id}-canon`,
          entity: entityType,
          name: item[nameField] || 'Untitled',
          issue: 'Missing Canonical URL',
          severity: 'medium',
          link
        });
      }

      // 4. Open Graph Title
      totalChecks++;
      if (!item.ogTitle || item.ogTitle.trim() === '') {
        failedChecks++;
        issues.push({
          id: `${entityType}-${item._id}-og`,
          entity: entityType,
          name: item[nameField] || 'Untitled',
          issue: 'Missing Open Graph (OG) Title',
          severity: 'low',
          link
        });
      }

      // 5. Image Alt Tag
      if (item.image && item.image.trim() !== '') {
        totalChecks++;
        if (!item.alt || item.alt.trim() === '') {
          failedChecks++;
          issues.push({
            id: `${entityType}-${item._id}-alt`,
            entity: entityType,
            name: item[nameField] || 'Untitled',
            issue: 'Main Image missing ALT Tag',
            severity: 'high',
            link
          });
        }
      }
    };

    // Fetch and evaluate Products
    const products = await Product.find({ isActive: true }).lean();
    products.forEach(p => evaluate(p, 'Product', 'name', `/dashboard/products`));

    // Fetch and evaluate Categories
    const categories = await Category.find({ isActive: true }).lean();
    categories.forEach(c => evaluate(c, 'Category', 'name', `/dashboard/products/categories`));

    // Fetch and evaluate Blogs
    const blogs = await Blog.find({ status: 'published' }).lean();
    blogs.forEach(b => evaluate(b, 'Blog', 'title', `/dashboard/blogs`));

    // Fetch and evaluate HomeSeo (Static Pages)
    const homeSeos = await HomeSeo.find({}).lean();
    homeSeos.forEach(h => evaluate(h, 'Static Page', 'pageName', `/dashboard/home/seo`));

    // Calculate Score
    let score = 100;
    if (totalChecks > 0) {
      score = Math.round(((totalChecks - failedChecks) / totalChecks) * 100);
    }

    return NextResponse.json({
      success: true,
      data: {
        score,
        totalChecks,
        issuesCount: failedChecks,
        issues
      }
    });

  } catch (err) {
    console.error('SEO Audit Error:', err);
    return NextResponse.json({ success: false, message: 'Server error: ' + err.message }, { status: 500 });
  }
}
