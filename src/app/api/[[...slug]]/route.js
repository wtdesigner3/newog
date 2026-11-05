// Master Consolidated API Router for Vercel Serverless Optimization
// Automatically dispatches all /api/* requests while keeping serverless function count = 1

export const dynamic = 'force-dynamic';

import * as h_career_resumes__id_ from '@/api-handlers/career/resumes/[id]/route';
import * as h_analytics_stats from '@/api-handlers/analytics/stats/route';
import * as h_analytics_track from '@/api-handlers/analytics/track/route';
import * as h_auth_login from '@/api-handlers/auth/login/route';
import * as h_auth_logout from '@/api-handlers/auth/logout/route';
import * as h_auth_me from '@/api-handlers/auth/me/route';
import * as h_auth_profile from '@/api-handlers/auth/profile/route';
import * as h_blogs_bulk from '@/api-handlers/blogs/bulk/route';
import * as h_career_apply from '@/api-handlers/career/apply/route';
import * as h_dashboard_stats from '@/api-handlers/dashboard/stats/route';
import * as h_email_templates_test from '@/api-handlers/email-templates/test/route';
import * as h_enquiries_export from '@/api-handlers/enquiries/export/route';
import * as h_files_upload from '@/api-handlers/files/upload/route';
import * as h_files_usage from '@/api-handlers/files/usage/route';
import * as h_products_bulk from '@/api-handlers/products/bulk/route';
import * as h_resources_bulk from '@/api-handlers/resources/bulk/route';
import * as h_system_ai from '@/api-handlers/system/ai/route';
import * as h_system_backup from '@/api-handlers/system/backup/route';
import * as h_system_cache from '@/api-handlers/system/cache/route';
import * as h_system_errors from '@/api-handlers/system/errors/route';
import * as h_system_health from '@/api-handlers/system/health/route';
import * as h_system_maintenance from '@/api-handlers/system/maintenance/route';
import * as h_system_redirects from '@/api-handlers/system/redirects/route';
import * as h_about__id_ from '@/api-handlers/about/[id]/route';
import * as h_banner__id_ from '@/api-handlers/banner/[id]/route';
import * as h_blog__id_ from '@/api-handlers/blog/[id]/route';
import * as h_blogs__id_ from '@/api-handlers/blogs/[id]/route';
import * as h_categories__id_ from '@/api-handlers/categories/[id]/route';
import * as h_certification__id_ from '@/api-handlers/certification/[id]/route';
import * as h_company_certifications__id_ from '@/api-handlers/company-certifications/[id]/route';
import * as h_cta__id_ from '@/api-handlers/cta/[id]/route';
import * as h_custom_pages__id_ from '@/api-handlers/custom-pages/[id]/route';
import * as h_email_templates__id_ from '@/api-handlers/email-templates/[id]/route';
import * as h_enquiries__id_ from '@/api-handlers/enquiries/[id]/route';
import * as h_faqs__id_ from '@/api-handlers/faqs/[id]/route';
import * as h_gallery_images__id_ from '@/api-handlers/gallery-images/[id]/route';
import * as h_home_about__id_ from '@/api-handlers/home-about/[id]/route';
import * as h_home_extra__id_ from '@/api-handlers/home-extra/[id]/route';
import * as h_home_seo__id_ from '@/api-handlers/home-seo/[id]/route';
import * as h_milestones__id_ from '@/api-handlers/milestones/[id]/route';
import * as h_othercta__id_ from '@/api-handlers/othercta/[id]/route';
import * as h_page_banners__id_ from '@/api-handlers/page-banners/[id]/route';
import * as h_products__id_ from '@/api-handlers/products/[id]/route';
import * as h_resources__id_ from '@/api-handlers/resources/[id]/route';
import * as h_sections__id_ from '@/api-handlers/sections/[id]/route';
import * as h_testimonials__id_ from '@/api-handlers/testimonials/[id]/route';
import * as h_user__id_ from '@/api-handlers/user/[id]/route';
import * as h_why_choose__id_ from '@/api-handlers/why-choose/[id]/route';
import * as h_work__id_ from '@/api-handlers/work/[id]/route';
import * as h_about from '@/api-handlers/about/route';
import * as h_banner from '@/api-handlers/banner/route';
import * as h_blog from '@/api-handlers/blog/route';
import * as h_blogs from '@/api-handlers/blogs/route';
import * as h_categories from '@/api-handlers/categories/route';
import * as h_certification from '@/api-handlers/certification/route';
import * as h_company_certifications from '@/api-handlers/company-certifications/route';
import * as h_contact_page from '@/api-handlers/contact-page/route';
import * as h_cta from '@/api-handlers/cta/route';
import * as h_custom_pages from '@/api-handlers/custom-pages/route';
import * as h_email_templates from '@/api-handlers/email-templates/route';
import * as h_enquiries from '@/api-handlers/enquiries/route';
import * as h_faqs from '@/api-handlers/faqs/route';
import * as h_files from '@/api-handlers/files/route';
import * as h_gallery_images from '@/api-handlers/gallery-images/route';
import * as h_global_settings from '@/api-handlers/global-settings/route';
import * as h_home_about from '@/api-handlers/home-about/route';
import * as h_home_extra from '@/api-handlers/home-extra/route';
import * as h_home_seo from '@/api-handlers/home-seo/route';
import * as h_logs from '@/api-handlers/logs/route';
import * as h_milestones from '@/api-handlers/milestones/route';
import * as h_othercta from '@/api-handlers/othercta/route';
import * as h_page_banners from '@/api-handlers/page-banners/route';
import * as h_products from '@/api-handlers/products/route';
import * as h_resources from '@/api-handlers/resources/route';
import * as h_sections from '@/api-handlers/sections/route';
import * as h_security from '@/api-handlers/security/route';
import * as h_seed_sections from '@/api-handlers/seed-sections/route';
import * as h_seo_audit from '@/api-handlers/seo-audit/route';
import * as h_testimonials from '@/api-handlers/testimonials/route';
import * as h_upload from '@/api-handlers/upload/route';
import * as h_user from '@/api-handlers/user/route';
import * as h_why_choose from '@/api-handlers/why-choose/route';
import * as h_work from '@/api-handlers/work/route';

const ROUTES = [
  { pattern: ["career","resumes","[id]"], handler: h_career_resumes__id_ },
  { pattern: ["analytics","stats"], handler: h_analytics_stats },
  { pattern: ["analytics","track"], handler: h_analytics_track },
  { pattern: ["auth","login"], handler: h_auth_login },
  { pattern: ["auth","logout"], handler: h_auth_logout },
  { pattern: ["auth","me"], handler: h_auth_me },
  { pattern: ["auth","profile"], handler: h_auth_profile },
  { pattern: ["blogs","bulk"], handler: h_blogs_bulk },
  { pattern: ["career","apply"], handler: h_career_apply },
  { pattern: ["dashboard","stats"], handler: h_dashboard_stats },
  { pattern: ["email-templates","test"], handler: h_email_templates_test },
  { pattern: ["enquiries","export"], handler: h_enquiries_export },
  { pattern: ["files","upload"], handler: h_files_upload },
  { pattern: ["files","usage"], handler: h_files_usage },
  { pattern: ["products","bulk"], handler: h_products_bulk },
  { pattern: ["resources","bulk"], handler: h_resources_bulk },
  { pattern: ["system","ai"], handler: h_system_ai },
  { pattern: ["system","backup"], handler: h_system_backup },
  { pattern: ["system","cache"], handler: h_system_cache },
  { pattern: ["system","errors"], handler: h_system_errors },
  { pattern: ["system","health"], handler: h_system_health },
  { pattern: ["system","maintenance"], handler: h_system_maintenance },
  { pattern: ["system","redirects"], handler: h_system_redirects },
  { pattern: ["about","[id]"], handler: h_about__id_ },
  { pattern: ["banner","[id]"], handler: h_banner__id_ },
  { pattern: ["blog","[id]"], handler: h_blog__id_ },
  { pattern: ["blogs","[id]"], handler: h_blogs__id_ },
  { pattern: ["categories","[id]"], handler: h_categories__id_ },
  { pattern: ["certification","[id]"], handler: h_certification__id_ },
  { pattern: ["company-certifications","[id]"], handler: h_company_certifications__id_ },
  { pattern: ["cta","[id]"], handler: h_cta__id_ },
  { pattern: ["custom-pages","[id]"], handler: h_custom_pages__id_ },
  { pattern: ["email-templates","[id]"], handler: h_email_templates__id_ },
  { pattern: ["enquiries","[id]"], handler: h_enquiries__id_ },
  { pattern: ["faqs","[id]"], handler: h_faqs__id_ },
  { pattern: ["gallery-images","[id]"], handler: h_gallery_images__id_ },
  { pattern: ["home-about","[id]"], handler: h_home_about__id_ },
  { pattern: ["home-extra","[id]"], handler: h_home_extra__id_ },
  { pattern: ["home-seo","[id]"], handler: h_home_seo__id_ },
  { pattern: ["milestones","[id]"], handler: h_milestones__id_ },
  { pattern: ["othercta","[id]"], handler: h_othercta__id_ },
  { pattern: ["page-banners","[id]"], handler: h_page_banners__id_ },
  { pattern: ["products","[id]"], handler: h_products__id_ },
  { pattern: ["resources","[id]"], handler: h_resources__id_ },
  { pattern: ["sections","[id]"], handler: h_sections__id_ },
  { pattern: ["testimonials","[id]"], handler: h_testimonials__id_ },
  { pattern: ["user","[id]"], handler: h_user__id_ },
  { pattern: ["why-choose","[id]"], handler: h_why_choose__id_ },
  { pattern: ["work","[id]"], handler: h_work__id_ },
  { pattern: ["about"], handler: h_about },
  { pattern: ["banner"], handler: h_banner },
  { pattern: ["blog"], handler: h_blog },
  { pattern: ["blogs"], handler: h_blogs },
  { pattern: ["categories"], handler: h_categories },
  { pattern: ["certification"], handler: h_certification },
  { pattern: ["company-certifications"], handler: h_company_certifications },
  { pattern: ["contact-page"], handler: h_contact_page },
  { pattern: ["cta"], handler: h_cta },
  { pattern: ["custom-pages"], handler: h_custom_pages },
  { pattern: ["email-templates"], handler: h_email_templates },
  { pattern: ["enquiries"], handler: h_enquiries },
  { pattern: ["faqs"], handler: h_faqs },
  { pattern: ["files"], handler: h_files },
  { pattern: ["gallery-images"], handler: h_gallery_images },
  { pattern: ["global-settings"], handler: h_global_settings },
  { pattern: ["home-about"], handler: h_home_about },
  { pattern: ["home-extra"], handler: h_home_extra },
  { pattern: ["home-seo"], handler: h_home_seo },
  { pattern: ["logs"], handler: h_logs },
  { pattern: ["milestones"], handler: h_milestones },
  { pattern: ["othercta"], handler: h_othercta },
  { pattern: ["page-banners"], handler: h_page_banners },
  { pattern: ["products"], handler: h_products },
  { pattern: ["resources"], handler: h_resources },
  { pattern: ["sections"], handler: h_sections },
  { pattern: ["security"], handler: h_security },
  { pattern: ["seed-sections"], handler: h_seed_sections },
  { pattern: ["seo-audit"], handler: h_seo_audit },
  { pattern: ["testimonials"], handler: h_testimonials },
  { pattern: ["upload"], handler: h_upload },
  { pattern: ["user"], handler: h_user },
  { pattern: ["why-choose"], handler: h_why_choose },
  { pattern: ["work"], handler: h_work },
];

function matchRoute(slug) {
  for (const route of ROUTES) {
    if (route.pattern.length !== slug.length) continue;
    
    let matched = true;
    const params = {};
    
    for (let i = 0; i < route.pattern.length; i++) {
      const patternSeg = route.pattern[i];
      const actualSeg = slug[i];
      
      if (patternSeg.startsWith('[') && patternSeg.endsWith(']')) {
        const paramName = patternSeg.slice(1, -1);
        params[paramName] = actualSeg;
      } else if (patternSeg !== actualSeg) {
        matched = false;
        break;
      }
    }
    
    if (matched) {
      return { handler: route.handler, params };
    }
  }
  return null;
}

function createRouteContext(paramsObj) {
  const promise = Promise.resolve(paramsObj);
  Object.assign(promise, paramsObj);
  return { params: promise };
}

async function handle(method, request, context) {
  try {
    const contextParams = await (context?.params || Promise.resolve({}));
    const slug = contextParams?.slug || [];
    
    if (slug.length === 0) {
      return Response.json({
        status: 'healthy',
        service: 'OG Heavy Duty Consolidated API Router',
        version: '1.0.0'
      });
    }
    
    const matched = matchRoute(slug);
    if (!matched) {
      return Response.json(
        { error: 'Endpoint not found', path: '/api/' + slug.join('/') },
        { status: 404 }
      );
    }
    
    const handlerFunc = matched.handler[method];
    if (!handlerFunc) {
      return Response.json(
        { error: `Method ${method} not allowed on /api/${slug.join('/')}` },
        { status: 405 }
      );
    }
    
    const handlerContext = createRouteContext(matched.params);
    return await handlerFunc(request, handlerContext);
  } catch (error) {
    console.error('[Consolidated API Router Error]:', error);
    return Response.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function GET(request, context) {
  return handle('GET', request, context);
}

export async function POST(request, context) {
  return handle('POST', request, context);
}

export async function PUT(request, context) {
  return handle('PUT', request, context);
}

export async function DELETE(request, context) {
  return handle('DELETE', request, context);
}

export async function PATCH(request, context) {
  return handle('PATCH', request, context);
}

export async function HEAD(request, context) {
  return handle('HEAD', request, context);
}
