"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Edit, Trash2, Eye, Plus, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/Button";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  featuredImage: string | null;
  category: string;
  date: string;
  readTime: string;
  featured: boolean;
  published: boolean;
}

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/admin/posts");
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/posts/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchPosts();
      } else {
        alert("Failed to delete article");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Error deleting article");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-[#174D3A]">Loading articles...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-[#174D3A] mb-2">Blog Articles</h1>
          <p className="text-[#4A4A4A]">Manage your blog articles and content</p>
        </div>
        <Link href="/admin/posts/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Article
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-2xl border border-white/40 shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            {post.featuredImage && (
              <div className="relative h-48 w-full">
                    <Image
                      src={post.featuredImage}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
            )}
            <div className="p-6">
              <div className="flex items-center gap-2 text-xs text-[#174D3A] mb-3">
                <span className={`px-2 py-1 rounded-full ${post.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                  {post.published ? "Published" : "Draft"}
                </span>
                {post.featured && (
                  <span className="px-2 py-1 rounded-full bg-[#174D3A]/10 text-[#174D3A]">
                    Featured
                  </span>
                )}
                <span className="px-2 py-1 rounded-full bg-[#174D3A]/10 text-[#174D3A]">
                  {post.category}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2 line-clamp-2">
                {post.title}
              </h3>
              <p className="text-sm text-[#4A4A4A] mb-4 line-clamp-2">
                {post.excerpt}
              </p>
              <div className="flex items-center gap-4 text-xs text-[#4A4A4A] mb-4">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(post.date).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {post.readTime}
                </span>
              </div>
              <div className="flex items-center gap-2 pt-4 border-t border-[#174D3A]/10">
                <Link
                  href={`/blog/${post.slug}`}
                  target="_blank"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-[#174D3A]/20 text-sm text-[#174D3A] hover:bg-[#174D3A]/5 transition-colors"
                >
                  <Eye className="h-4 w-4" />
                  View
                </Link>
                <Link
                  href={`/admin/posts/${post.id}`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-[#174D3A]/20 text-sm text-[#174D3A] hover:bg-[#174D3A]/5 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[#4A4A4A] mb-4">No articles yet</p>
          <Link href="/admin/posts/new">
            <Button>Create Your First Article</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

