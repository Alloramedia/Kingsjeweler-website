import type { Metadata } from "next";
import { isAdminConfigured, isAuthenticated } from "@/lib/admin/auth";
import { getEditableContent, hasDraft } from "@/lib/admin/schema";
import { AdminLogin } from "./AdminLogin";
import { AdminDashboard } from "./AdminDashboard";
import { AdminNotConfigured } from "./AdminNotConfigured";

// Always render fresh — never cache the admin behind the CDN.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Site Admin",
  robots: { index: false, follow: false, nocache: true },
};

export default async function AdminPage() {
  if (!isAdminConfigured()) {
    return <AdminNotConfigured />;
  }

  if (!(await isAuthenticated())) {
    return <AdminLogin />;
  }

  const content = await getEditableContent();
  const unpublished = await hasDraft();
  return <AdminDashboard initialContent={content} unpublished={unpublished} />;
}
