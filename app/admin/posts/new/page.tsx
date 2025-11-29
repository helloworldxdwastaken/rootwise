"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, X } from "lucide-react";
import { Button } from "@/components/Button";

export default function NewPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    slug: "",
    title: "",
    excerpt: "",
    content: "",
    featuredImage: "",
    images: [] as string[],
    category: "",
    readTime: "",
    featured: false,
    published: true,
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [newImageUrl, setNewImageUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/admin/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          images: formData.images.length > 0 ? formData.images : null,
        }),
      });

      if (response.ok) {
        router.push("/admin");
      } else {
        const error = await response.json();
        alert(error.error || "Failed to create article");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Error creating article");
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setFormData({ ...formData, slug });
  };

  const addImage = () => {
    if (newImageUrl.trim() && !formData.images.includes(newImageUrl.trim())) {
      const updatedImages = [...formData.images, newImageUrl.trim()];
      setFormData({ ...formData, images: updatedImages });
      // If no featured image, set the first image as featured
      if (!formData.featuredImage) {
        setFormData({ ...formData, images: updatedImages, featuredImage: newImageUrl.trim() });
      } else {
        setFormData({ ...formData, images: updatedImages });
      }
      setNewImageUrl("");
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: updatedImages });
  };

  const setAsFeatured = (url: string) => {
    setFormData({ ...formData, featuredImage: url });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-semibold text-[#174D3A]">New Article</h1>
        <Button
          variant="secondary"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <X className="h-4 w-4" />
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-2xl p-8 shadow-lg">
        {/* Basic Info */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-[#174D3A]">Basic Information</h2>
          
          <div>
            <label className="block text-sm font-medium text-[#174D3A] mb-2">
              Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                if (!formData.slug) generateSlug();
              }}
              className="w-full px-4 py-2 rounded-lg border border-[#174D3A]/20 focus:outline-none focus:ring-2 focus:ring-[#174D3A]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#174D3A] mb-2">
              Slug * (URL-friendly)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="flex-1 px-4 py-2 rounded-lg border border-[#174D3A]/20 focus:outline-none focus:ring-2 focus:ring-[#174D3A]"
                placeholder="article-url-slug"
              />
              <button
                type="button"
                onClick={generateSlug}
                className="px-4 py-2 rounded-lg border border-[#174D3A]/20 text-sm text-[#174D3A] hover:bg-[#174D3A]/5"
              >
                Generate
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#174D3A] mb-2">
              Excerpt *
            </label>
            <textarea
              required
              rows={3}
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-[#174D3A]/20 focus:outline-none focus:ring-2 focus:ring-[#174D3A]"
              placeholder="Brief description of the article..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#174D3A] mb-2">
                Category *
              </label>
              <input
                type="text"
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-[#174D3A]/20 focus:outline-none focus:ring-2 focus:ring-[#174D3A]"
                placeholder="e.g., Platform Overview"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#174D3A] mb-2">
                Read Time *
              </label>
              <input
                type="text"
                required
                value={formData.readTime}
                onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-[#174D3A]/20 focus:outline-none focus:ring-2 focus:ring-[#174D3A]"
                placeholder="e.g., 8 min read"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#174D3A] mb-2">
              Featured Image URL (Preview Image)
            </label>
            <input
              type="url"
              value={formData.featuredImage}
              onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-[#174D3A]/20 focus:outline-none focus:ring-2 focus:ring-[#174D3A]"
              placeholder="https://example.com/image.jpg"
            />
            {formData.featuredImage && (
              <div className="mt-2 relative w-full h-48 rounded-lg overflow-hidden border border-[#174D3A]/20">
                <img
                  src={formData.featuredImage}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
            <p className="mt-2 text-xs text-[#4A4A4A]">
              This image will be used as the preview/thumbnail in blog listings
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#174D3A] mb-2">
              Article Images (Additional images used in content)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addImage();
                  }
                }}
                className="flex-1 px-4 py-2 rounded-lg border border-[#174D3A]/20 focus:outline-none focus:ring-2 focus:ring-[#174D3A]"
                placeholder="https://example.com/image.jpg"
              />
              <button
                type="button"
                onClick={addImage}
                className="px-4 py-2 rounded-lg bg-[#174D3A] text-white hover:bg-[#174D3A]/90 transition-colors"
              >
                Add
              </button>
            </div>
            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {formData.images.map((url, index) => (
                  <div key={index} className="relative group">
                    <div className="relative w-full h-32 rounded-lg overflow-hidden border border-[#174D3A]/20">
                      <img
                        src={url}
                        alt={`Image ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                    <div className="absolute top-2 right-2 flex gap-1">
                      {url !== formData.featuredImage && (
                        <button
                          type="button"
                          onClick={() => setAsFeatured(url)}
                          className="px-2 py-1 text-xs bg-[#174D3A] text-white rounded hover:bg-[#174D3A]/90"
                          title="Set as featured"
                        >
                          Set Featured
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                        title="Remove"
                      >
                        ×
                      </button>
                    </div>
                    {url === formData.featuredImage && (
                      <div className="absolute bottom-2 left-2 px-2 py-1 text-xs bg-green-500 text-white rounded">
                        Featured
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            <p className="mt-2 text-xs text-[#4A4A4A]">
              Add images that will be used in your article content. You can reference them in markdown using their URLs.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#174D3A] mb-2">
              Publish Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-[#174D3A]/20 focus:outline-none focus:ring-2 focus:ring-[#174D3A]"
            />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-[#174D3A]">Article Content</h2>
          <div>
            <label className="block text-sm font-medium text-[#174D3A] mb-2">
              Content * (Markdown supported)
            </label>
            <textarea
              required
              rows={20}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-[#174D3A]/20 focus:outline-none focus:ring-2 focus:ring-[#174D3A] font-mono text-sm"
              placeholder="Write your article content here..."
            />
            <p className="mt-2 text-xs text-[#4A4A4A]">
              Use Markdown for formatting. Headers: ## Heading, **bold**, *italic*
            </p>
          </div>
        </div>

        {/* SEO */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-[#174D3A]">SEO Settings</h2>
          
          <div>
            <label className="block text-sm font-medium text-[#174D3A] mb-2">
              SEO Title
            </label>
            <input
              type="text"
              value={formData.seoTitle}
              onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-[#174D3A]/20 focus:outline-none focus:ring-2 focus:ring-[#174D3A]"
              placeholder="Leave empty to use article title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#174D3A] mb-2">
              SEO Description
            </label>
            <textarea
              rows={3}
              value={formData.seoDescription}
              onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-[#174D3A]/20 focus:outline-none focus:ring-2 focus:ring-[#174D3A]"
              placeholder="Leave empty to use excerpt"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#174D3A] mb-2">
              SEO Keywords (comma-separated)
            </label>
            <input
              type="text"
              value={formData.seoKeywords}
              onChange={(e) => setFormData({ ...formData, seoKeywords: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-[#174D3A]/20 focus:outline-none focus:ring-2 focus:ring-[#174D3A]"
              placeholder="keyword1, keyword2, keyword3"
            />
          </div>
        </div>

        {/* Options */}
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-4 h-4 rounded border-[#174D3A]/20 text-[#174D3A] focus:ring-[#174D3A]"
            />
            <span className="text-sm text-[#4A4A4A]">Featured Article</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="w-4 h-4 rounded border-[#174D3A]/20 text-[#174D3A] focus:ring-[#174D3A]"
            />
            <span className="text-sm text-[#4A4A4A]">Published</span>
          </label>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t border-[#174D3A]/10">
          <Button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {loading ? "Saving..." : "Save Article"}
          </Button>
        </div>
      </form>
    </div>
  );
}

