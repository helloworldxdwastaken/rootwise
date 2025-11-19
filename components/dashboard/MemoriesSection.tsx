"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Plus, Edit2, Trash2, X, Check, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Memory = {
  id: string;
  key: string;
  value: unknown;
  importance: "LOW" | "MEDIUM" | "HIGH";
  lastUsedAt?: string | null;
  createdAt: string;
};

export function MemoriesSection() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    key: "",
    value: "",
    importance: "MEDIUM" as "LOW" | "MEDIUM" | "HIGH",
  });

  useEffect(() => {
    loadMemories();
  }, [filter]);

  async function loadMemories() {
    try {
      const url = filter === "all" 
        ? "/api/memory" 
        : `/api/memory?importance=${filter}`;
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setMemories(data.memories);
      }
    } catch (error) {
      console.error("Failed to load memories:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      // Parse value as JSON if possible, otherwise keep as string
      let parsedValue: unknown = formData.value;
      try {
        parsedValue = JSON.parse(formData.value);
      } catch {
        // Keep as string if not valid JSON
      }

      if (editingId) {
        // Update existing
        await fetch(`/api/memory/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            value: parsedValue,
            importance: formData.importance,
          }),
        });
      } else {
        // Create new (upsert)
        await fetch("/api/memory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            key: formData.key,
            value: parsedValue,
            importance: formData.importance,
          }),
        });
      }

      setShowForm(false);
      setEditingId(null);
      setFormData({ key: "", value: "", importance: "MEDIUM" });
      loadMemories();
    } catch (error) {
      console.error("Failed to save memory:", error);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this memory?")) return;
    
    try {
      await fetch(`/api/memory/${id}`, { method: "DELETE" });
      loadMemories();
    } catch (error) {
      console.error("Failed to delete memory:", error);
    }
  }

  function handleEdit(memory: Memory) {
    setEditingId(memory.id);
    setFormData({
      key: memory.key,
      value: typeof memory.value === "string" 
        ? memory.value 
        : JSON.stringify(memory.value, null, 2),
      importance: memory.importance,
    });
    setShowForm(true);
  }

  const importanceColors = {
    HIGH: "bg-[#F26C63]/10 text-[#F26C63]",
    MEDIUM: "bg-[#F4C977]/10 text-[#B8860B]",
    LOW: "bg-[#174D3A]/10 text-[#174D3A]",
  };

  if (loading) {
    return <div className="py-8 text-center text-[#174D3A]">Loading memories...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header with Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-[#174D3A]">Memory Vault</h3>
          <p className="text-sm text-[#222222]/70">
            Long-term facts Rootwise remembers about you
          </p>
        </div>
        
        <div className="flex gap-3">
          <div className="flex items-center gap-2 rounded-2xl border border-white/30 bg-white/40 px-3 py-2">
            <Filter className="h-4 w-4 text-[#174D3A]" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-transparent text-sm font-medium text-[#174D3A] focus:outline-none"
            >
              <option value="all">All</option>
              <option value="HIGH">High Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="LOW">Low Priority</option>
            </select>
          </div>
          
          <Button onClick={() => setShowForm(!showForm)} variant="secondary">
            <Plus className="mr-2 h-4 w-4" />
            Add Memory
          </Button>
        </div>
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="bg-white/40">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-[#174D3A]">
                    {editingId ? "Edit Memory" : "Add New Memory"}
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="text-[#222222]/60 hover:text-[#174D3A]"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className={editingId ? "opacity-50 pointer-events-none" : ""}>
                    <label className="block text-sm font-medium text-[#174D3A] mb-2">
                      Key * {editingId && <span className="text-xs">(cannot edit)</span>}
                    </label>
                    <input
                      type="text"
                      value={formData.key}
                      onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                      placeholder="e.g., preferred_tea, exercise_frequency"
                      required
                      disabled={!!editingId}
                      className="w-full rounded-2xl border border-white/30 bg-white/70 px-4 py-2.5 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#174D3A] mb-2">
                      Importance
                    </label>
                    <select
                      value={formData.importance}
                      onChange={(e) => setFormData({ ...formData, importance: e.target.value as any })}
                      className="w-full rounded-2xl border border-white/30 bg-white/70 px-4 py-2.5 text-sm"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-[#174D3A] mb-2">
                      Value * (text or JSON)
                    </label>
                    <textarea
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                      placeholder='e.g., "chamomile" or ["anemia", "tachycardia"]'
                      rows={3}
                      required
                      className="w-full rounded-2xl border border-white/30 bg-white/70 px-4 py-2.5 text-sm font-mono"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button type="submit" className="flex-1">
                    <Check className="mr-2 h-4 w-4" />
                    {editingId ? "Update" : "Save Memory"}
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Memories List */}
      {memories.length === 0 ? (
        <Card className="bg-white/20 text-center py-12">
          <p className="text-[#222222]/60">No memories stored yet</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {memories.map((memory) => (
            <Card key={memory.id} className="bg-white/40">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-semibold text-[#174D3A]">{memory.key}</code>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${importanceColors[memory.importance]}`}>
                      {memory.importance}
                    </span>
                  </div>
                  <div className="mt-2 rounded-lg bg-white/50 p-3">
                    <pre className="text-xs text-[#222222]/80 whitespace-pre-wrap break-words font-mono">
                      {typeof memory.value === "string" 
                        ? memory.value 
                        : JSON.stringify(memory.value, null, 2)}
                    </pre>
                  </div>
                  {memory.lastUsedAt && (
                    <p className="mt-2 text-xs text-[#222222]/60">
                      Last used: {new Date(memory.lastUsedAt).toLocaleString()}
                    </p>
                  )}
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(memory)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/50 text-[#174D3A] transition-all hover:bg-white/70"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(memory.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/50 text-[#F26C63] transition-all hover:bg-[#F26C63]/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

