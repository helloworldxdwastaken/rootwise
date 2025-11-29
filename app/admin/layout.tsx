"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { FileText, Plus, LogOut, Settings } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  // Don't apply auth check to login page
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!isLoginPage && status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router, isLoginPage]);

  // If it's the login page, render it without the admin layout
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[#174D3A]">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#fcf9f7]">
      {/* Admin Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-[#174D3A]/10 p-6">
        <div className="mb-8">
          <Link href="/admin" className="flex items-center gap-2 text-lg font-semibold text-[#174D3A]">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#174D3A]/10 text-[#174D3A]">
              <FileText className="h-5 w-5" />
            </span>
            Blog Admin
          </Link>
        </div>

        <nav className="space-y-2">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#4A4A4A] hover:bg-[#174D3A]/5 hover:text-[#174D3A] transition-colors"
          >
            <FileText className="h-5 w-5" />
            All Articles
          </Link>
          <Link
            href="/admin/posts/new"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#4A4A4A] hover:bg-[#174D3A]/5 hover:text-[#174D3A] transition-colors"
          >
            <Plus className="h-5 w-5" />
            New Article
          </Link>
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="mb-4 p-4 rounded-lg bg-[#174D3A]/5">
            <p className="text-sm font-medium text-[#174D3A]">{session.user?.name || session.user?.email}</p>
            <p className="text-xs text-[#4A4A4A]">Admin</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-[#4A4A4A] hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  );
}

