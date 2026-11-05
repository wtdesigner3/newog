import { revalidatePath } from "next/cache";
export const dynamic = 'force-dynamic';

export async function POST() {
  const response = Response.json({ success: true, message: "Logged out successfully" });
  
  const isProduction = process.env.NODE_ENV === "production";
  const cookieFlags = `HttpOnly; Path=/; Max-Age=0; SameSite=Lax${isProduction ? "; Secure" : ""}`;

  // Clear the authentication cookie by expiring it immediately
  response.headers.set(
    "Set-Cookie",
    `admin_token=; ${cookieFlags}`
  );
  
  return response;
}
