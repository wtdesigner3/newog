import { revalidatePath } from "next/cache";
export const dynamic = 'force-dynamic';
import { connectDB } from "@/app/lib/config";
import HomeAbout from "@/app/models/HomeAbout";
import { uploadFile, isUploadFile, deleteFile } from "@/lib/upload";
import { requirePermission } from "@/app/lib/auth";

// GET /api/home-about (Public)
export async function GET() {
    try {
        await connectDB();
        let homeAbout = await HomeAbout.findOne().lean();
        if (!homeAbout) {
            homeAbout = await HomeAbout.create({
                badge: "PIONEERING HIGH-AMBIENT HVAC",
                title: "Engineered to Cool Where Ordinary Air Conditioners Fail",
                short_description: "O.G. HEAVY DUTY engineers cooling machines purpose-built for continuous duty in India's most punishing environments, creating a harmonious and comfortable world with over 30 years of manufacturing experience & expertise.",
                description: "The world contains an infinite number of spaces. O.G. HEAVY DUTY believes that the air in each of them should be ideally suited to the environment they support. Thus, we make it possible to manage the air—to control its temperature, humidity, and flow.\n\nO.G. Heavy Duty Air Conditioner is an authoritative Indian manufacturer committed to delivering high-performance, reliable, and energy-efficient climate control systems. Proudly aligned with the Make in India initiative and actively promoting Vocal for Local, we engineer cooling machines purpose-built for continuous duty in India's most punishing environments.\n\nWith over 30 years of specialized manufacturing experience, OG Heavy Duty has become the trusted HVAC partner for major Government Departments, central universities, and large commercial establishments across the country. Where ordinary air conditioning units suffer thermal tripping above 45°C, our tropicalized engineering guarantees continuous pull-down even at peak 52°C ambient temperatures.",
                image: "/images/home1/about-img.jpg",
                alt: "OG Heavy Duty Manufacturing & Precision Engineering",
                experience_years: "30+ Years",
                experience_text: "Severe Tropical Heatwave Resilience (52°C Tested)",
                button_text: "Explore Full Heritage Story",
                button_url: "/about-us",
            });
            homeAbout = homeAbout.toObject();
        }
        return Response.json([homeAbout]);
    } catch (err) {
        return Response.json({ error: err.message }, { status: 500 });
    }
}

// POST /api/home-about (Requires 'home:update' permission)
export async function POST(request) {
    const { user, error } = await requirePermission(request, 'home', 'update');
    if (error) return error;

    try {
        await connectDB();

        const formData = await request.formData();
        const badge = formData.get("badge") || "PIONEERING HIGH-AMBIENT HVAC";
        const title = formData.get("title") || "";
        const short_description = formData.get("short_description") || "";
        const description = formData.get("description") || "";
        const alt = formData.get("alt") || "";
        const experience_years = formData.get("experience_years") || "30+ Years";
        const experience_text = formData.get("experience_text") || "Severe Tropical Heatwave Resilience (52°C Tested)";
        const button_text = formData.get("button_text") || "Explore Full Heritage Story";
        const button_url = formData.get("button_url") || "/about-us";
        const image = formData.get("image");

        let imageUrl = undefined;
        if (isUploadFile(image)) {
            imageUrl = await uploadFile(image, "home-about", "homeabout");
        }

        const updateData = { 
            badge,
            title, 
            short_description, 
            description, 
            alt,
            experience_years,
            experience_text,
            button_text,
            button_url
        };
        if (imageUrl) updateData.image = imageUrl;

        let homeAbout = await HomeAbout.findOne();
        if (homeAbout) {
            if (imageUrl && homeAbout.image && !homeAbout.image.startsWith('/images/')) {
                await deleteFile(homeAbout.image);
            }
            homeAbout = await HomeAbout.findByIdAndUpdate(homeAbout._id, updateData, { new: true });
        } else {
            homeAbout = await HomeAbout.create(updateData);
        }

        revalidatePath('/', 'layout');
        revalidatePath('/about-us', 'page');
        
        return Response.json({
            message: "About Us content saved successfully",
            data: homeAbout,
        });

    } catch (err) {
        return Response.json(
            { message: "Upload failed", error: err.message },
            { status: 500 }
        );
    }
}
