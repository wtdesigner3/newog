import { notFound } from "next/navigation";
import Image from "next/image";
import PageHeader from "src/components/layout/PageHeader";
import BlogSidebar from "src/components/features/blog/BlogSidebar";
import { cache } from "react";
import { connectDB } from "../../../lib/config";
import Blog from "../../../models/Blog";

export const revalidate = 3600; // 1 hour ISR

export async function generateStaticParams() {
  try {
    await connectDB();
    const blogs = await Blog.find({ isPublished: true }).select('slug').lean();
    return blogs.map((post) => ({
      slug: post.slug,
    }));
  } catch (err) {
    // Graceful fallback during offline builds
    return [];
  }
}

const getBlogPost = cache(async (slug) => {
  try {
    await connectDB();
    const post = await Blog.findOne({ slug }).lean();
    return post;
  } catch (err) {
    return null;
  }
});

// Dynamic SEO metadata generation
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  
  if (!post) return { title: "Blog Post | OG Heavy Duty" };

  return {
    title: post.metatag || post.title || "OG Heavy Duty Blog",
    description: post.metaDescription || post.excerpt || "",
    keywords: post.metakeywords?.length ? post.metakeywords : undefined,
    alternates: {
        canonical: post.canonicalUrl 
            ? (post.canonicalUrl.startsWith('http') ? post.canonicalUrl : `https://ogheavyduty.in${post.canonicalUrl}`)
            : `https://ogheavyduty.in/blogs/${post.slug}`,
    },
    openGraph: {
        title: post.ogTitle || post.metatag || post.title,
        description: post.ogDescription || post.metaDescription || post.excerpt,
        images: post.coverImage ? [post.coverImage] : undefined,
    },
    twitter: {
        card: post.twitterCard || 'summary_large_image',
    },
    robots: post.robots || "index, follow",
  };
}

export default async function BlogDetail({ params }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const breadcrumb = [
    { name: "Home", href: "/" },
    { name: "Blogs", href: "/blogs" },
    { name: post.title }
  ];

  const related = await getRelatedBlogs(post._id, post.category);

  return (
    <>
      <PageHeader 
        title={post.title} 
        breadcrumb={breadcrumb}
        image="/images/slide1.jpg"
      />

      <section className="blog-details-area py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Main Content */}
            <div className="w-full lg:w-2/3">
              <div className="blog-details-content bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
                {post.coverImage && (
                  <div className="relative w-full h-[320px] md:h-[450px] mb-8 rounded-xl overflow-hidden">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                )}

                <div className="meta-info flex items-center gap-4 text-sm text-slate-500 mb-6">
                  {post.category && (
                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-medium">
                      {post.category}
                    </span>
                  )}
                  <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : new Date(post.createdAt).toLocaleDateString()}</span>
                  {post.readTime && <span>• {post.readTime}</span>}
                </div>

                <div 
                  className="prose prose-lg max-w-none prose-slate"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-slate-100">
                    <span className="text-sm font-semibold text-slate-700 mr-2">Tags:</span>
                    <div className="inline-flex flex-wrap gap-2">
                      {post.tags.map((tag, i) => (
                        <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="w-full lg:w-1/3">
              <BlogSidebar relatedPosts={related} />
            </div>

          </div>
        </div>
      </section>
    </>
  );
}

async function getRelatedBlogs(currentId, category) {
  try {
    await connectDB();
    let related = await Blog.find({ 
        _id: { $ne: currentId }, 
        isPublished: true,
        category: category 
    }).sort({ createdAt: -1 }).limit(3).lean();
    
    if (related.length < 3) {
        const more = await Blog.find({
            _id: { $ne: currentId, $nin: related.map(r => r._id) },
            isPublished: true,
        }).sort({ createdAt: -1 }).limit(3 - related.length).lean();
        related = [...related, ...more];
    }

    return related.map(b => ({
        id: b._id.toString(),
        title: b.title,
        date: b.publishedAt || new Date(b.createdAt).toLocaleDateString(),
        image: b.coverImage || "/images/slide1.jpg",
        slug: b.slug,
    }));
  } catch (err) {
    return [];
  }
}
