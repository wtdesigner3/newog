import PageHeader from "src/components/layout/PageHeader";
import BlogCard from "src/components/features/blog/BlogCard";
import { connectDB } from "../../lib/config";
import Blog from "../../models/Blog";
import PageBanner from "../../models/PageBanner";

export const metadata = {
  title: "Blog & Technical Insights | OG Heavy Duty",
  description:
    "Read the latest engineering articles, high-ambient cooling updates, copper coil maintenance guides, and HVAC manufacturing news from OG Heavy Duty.",
  alternates: {
    canonical: "https://ogheavyduty.in/blogs",
  },
};

export const revalidate = 3600; // 1 hour ISR

async function getBlogs() {
  try {
    await connectDB();
    const blogs = await Blog.find({ isPublished: true }).sort({ sort: 1, createdAt: -1 }).lean();
    return blogs.map(b => ({
      id: b._id.toString(),
      image: b.coverImage || "/images/slide1.jpg",
      date: b.publishedAt ? new Date(b.publishedAt).toLocaleDateString() : new Date(b.createdAt).toLocaleDateString(),
      category: b.category || "HVAC Engineering",
      title: b.title,
      link: `/blogs/${b.slug}`,
    }));
  } catch (err) {
    return [];
  }
}

export default async function BlogPage() {
  let banner = null;
  let blogData = [];

  try {
    await connectDB();
    blogData = await getBlogs();
    banner = await PageBanner.findOne({ pageKey: 'blog', isActive: true }).lean();
  } catch (err) {
    // Offline build fallback
  }

  const breadcrumb = [
    { name: "Home", href: "/" },
    { name: "Blog" }
  ];

  return (
    <>
      <PageHeader
        title={banner?.title || "Industry Insights & News"}
        bgImage={banner?.image || "/images/slide2.jpg"}
        breadcrumb={breadcrumb}
      />

      <section className="blog-page-section my-5">
        <div className="container">
          <div className="row g-4 mb-80">
            {blogData.length === 0 ? (
              <div className="col-12 text-center py-5">
                <p className="text-muted">No blog posts available at the moment.</p>
              </div>
            ) : (
              blogData.map((blog) => (
                <div key={blog.id} className="col-lg-4 col-md-6">
                  <BlogCard blog={blog} />
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
}
