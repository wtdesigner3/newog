export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/config';

// Models
import Product from '@/app/models/Product';
import Category from '@/app/models/Category';
import Resource from '@/app/models/Resource';
import Blog from '@/app/models/Blog';
import Enquiry from '@/app/models/Enquiry';
import CareerApplication from '@/app/models/CareerApplication';
import GalleryImage from '@/app/models/GalleryImage';
import Banner from '@/app/models/Banner';
import WhyChoose from '@/app/models/whyChoose';
import Certification from '@/app/models/Certification';
import User from '@/app/models/User';

import { requireAuth } from '@/app/lib/auth';
import {
  getOGProductFilter,
  getOGCategoryFilter,
  getOGResourceFilter,
  getOGBlogFilter,
} from '@/lib/dbScope';

export async function GET(request) {
    const { user, error } = await requireAuth(request);
    if (error) return error;

    try {
        await connectDB();

        const [
            productCount,
            categoryCount,
            resourceCount,
            blogCount,
            enquiryCount,
            careerCount,
            galleryCount,
            bannerCount,
            whyChooseCount,
            certificationCount,
            userCount,
            recentEnquiries
        ] = await Promise.all([
            Product.countDocuments(getOGProductFilter()),
            Category.countDocuments(getOGCategoryFilter()),
            Resource.countDocuments(getOGResourceFilter()),
            Blog.countDocuments(getOGBlogFilter()),
            Enquiry.countDocuments(),
            CareerApplication.countDocuments(),
            GalleryImage.countDocuments(),
            Banner.countDocuments(),
            WhyChoose.countDocuments(),
            Certification.countDocuments(),
            User.countDocuments(),
            Enquiry.find().sort({ createdAt: -1 }).limit(5).lean()
        ]);

        return NextResponse.json({
            success: true,
            stats: {
                products: productCount,
                categories: categoryCount,
                resources: resourceCount,
                blogs: blogCount,
                enquiries: enquiryCount,
                careers: careerCount,
                gallery: galleryCount,
                banners: bannerCount,
                whyChoose: whyChooseCount,
                certifications: certificationCount,
                users: userCount
            },
            recentEnquiries
        });
    } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
        return NextResponse.json({
            success: false,
            message: "Failed to fetch dashboard stats",
            error: err.message
        }, { status: 500 });
    }
}
