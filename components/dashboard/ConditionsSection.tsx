"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Plus, Edit2, Trash2, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Condition = {
  id: string;
  name: string;
  category: string;
  notes?: string | null;
  diagnosedAt?: string | null;
  isActive: boolean;
  createdAt: string;
};

export function ConditionsSection() {
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "SYMPTOM",
    notes: "",
    diagnosedAt: "",
  });

  useEffect(() => {
    loadConditions();
  }, []);

  async function loadConditions() {
    try {
      const response = await fetch("/api/me/conditions");
      if (response.ok) {
        const data = await response.json();
        setConditions(data.conditions);
      }
    } catch (error) {
      console.error("Failed to load conditions:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      const url = editingId
        ? `/api/me/conditions/${editingId}`
        : "/api/me/conditions";
      
      const method = editingId ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowForm(false);
        setEditingId(null);
        setFormData({ name: "", category: "SYMPTOM", notes: "", diagnosedAt: "" });
        loadConditions();
      }
    } catch (error) {
      console.error("Failed to save condition:", error);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Archive this condition?")) return;
    
    try {
      const response = await fetch(`/api/me/conditions/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        loadConditions();
      }
    } catch (error) {
      console.error("Failed to delete condition:", error);
    }
  }

  function handleEdit(condition: Condition) {
    setEditingId(condition.id);
    setFormData({
      name: condition.name,
      category: condition.category,
      notes: condition.notes || "",
      diagnosedAt: condition.diagnosedAt?.split("T")[0] || "",
    });
    setShowForm(true);
  }

  if (loading) {
    return <div className="py-8 text-center text-[#174D3A]">Loading conditions...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[#174D3A]">Health Conditions</h3>
          <p className="text-sm text-[#222222]/70">
            Track conditions, symptoms, and diagnoses
          </p>
        </div>
        <Button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({ name: "", category: "SYMPTOM", notes: "", diagnosedAt: "" });
          }}
          variant="secondary"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Condition
        </Button>
      </div>

      {/* Add/Edit Form */}
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
                    {editingId ? "Edit Condition" : "Add New Condition"}
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
                  <div>
                    <label className="block text-sm font-medium text-[#174D3A] mb-2">
                      Condition Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Anemia, Migraine"
                      required
                      className="w-full rounded-2xl border border-white/30 bg-white/70 px-4 py-2.5 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#174D3A] mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full rounded-2xl border border-white/30 bg-white/70 px-4 py-2.5 text-sm"
                    >
                      <option value="SYMPTOM">Symptom</option>
                      <option value="DIAGNOSIS">Diagnosis</option>
                      <option value="CHRONIC">Chronic</option>
                      <option value="ACUTE">Acute</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#174D3A] mb-2">
                      Diagnosed Date
                    </label>
                    <input
                      type="date"
                      value={formData.diagnosedAt}
                      onChange={(e) => setFormData({ ...formData, diagnosedAt: e.target.value })}
                      className="w-full rounded-2xl border border-white/30 bg-white/70 px-4 py-2.5 text-sm"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-[#174D3A] mb-2">
                      Notes
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Additional details..."
                      rows={2}
                      className="w-full rounded-2xl border border-white/30 bg-white/70 px-4 py-2.5 text-sm"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button type="submit" className="flex-1">
                    <Check className="mr-2 h-4 w-4" />
                    {editingId ? "Update" : "Add Condition"}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Conditions List */}
      {conditions.length === 0 ? (
        <Card className="bg-white/20 text-center py-12">
          <p className="text-[#222222]/60">No conditions tracked yet</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {conditions.map((condition) => (
            <Card key={condition.id} className="bg-white/40">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-[#174D3A]">{condition.name}</h4>
                    <span className="rounded-full bg-[#174D3A]/10 px-2.5 py-0.5 text-xs font-medium text-[#174D3A]">
                      {condition.category}
                    </span>
                  </div>
                  {condition.notes && (
                    <p className="mt-2 text-sm text-[#222222]/80">{condition.notes}</p>
                  )}
                  {condition.diagnosedAt && (
                    <p className="mt-1 text-xs text-[#222222]/60">
                      Diagnosed: {new Date(condition.diagnosedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(condition)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/50 text-[#174D3A] transition-all hover:bg-white/70"
                    aria-label="Edit condition"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(condition.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/50 text-[#F26C63] transition-all hover:bg-[#F26C63]/10"
                    aria-label="Archive condition"
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

