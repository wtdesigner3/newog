import { redirect } from "next/navigation";

// The legacy website had no standalone certifications page.
// Quality standards and manufacturing capabilities are consolidated into /about-us.
export default function CertificationsPage() {
  redirect("/about-us");
}
