import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "super_admin") {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-cream">
      <AdminSidebar role={profile.role} email={profile.email ?? ""} />
      <div className="lg:pl-64">
        <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-10">
          {children}
        </main>
      </div>
    </div>
  );
}
