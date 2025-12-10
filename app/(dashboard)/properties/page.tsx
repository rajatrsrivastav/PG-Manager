"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, MapPin, Users, Edit2, Trash2, X, Filter } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface PG { id: number; name: string; address: string; image: string | null; _count: { students: number }; }

const fetchPGs = async () => {
  const res = await fetch("/api/pgs");
  if (!res.ok) throw new Error("Failed to fetch PGs");
  return res.json();
};

export default function Properties() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editingPg, setEditingPg] = useState<PG | null>(null);
  const [form, setForm] = useState({ name: "", address: "", image: "" });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [filter, setFilter] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["pgs"],
    queryFn: fetchPGs,
    enabled: !!user,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => fetch(`/api/pgs/${id}`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["pgs"] }),
  });

  useEffect(() => {
    if (!loading && !user) router.push("/signin");
  }, [user, loading, router]);

  const openCreate = () => {
    setEditingPg(null);
    setForm({ name: "", address: "", image: "" });
    setShowModal(true);
  };

  const openEdit = (pg: PG) => {
    setEditingPg(pg);
    setForm({ name: pg.name, address: pg.address, image: pg.image || "" });
    setShowModal(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "pg_manager_preset");
    formData.append("cloud_name", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "demo");

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "demo"}/image/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) {
        setForm(prev => ({ ...prev, image: data.secure_url }));
      } else {
        alert("Upload failed. Please check Cloudinary configuration.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed");
    }
    setUploading(false);
  };

  const handleSave = async () => {
    if (!form.name || !form.address) return;
    setSaving(true);
    if (editingPg) {
      await fetch(`/api/pgs/${editingPg.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("/api/pgs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setShowModal(false);
    setSaving(false);
    queryClient.invalidateQueries({ queryKey: ["pgs"] });
  };

  const handleDelete = async (pg: PG) => {
    if (!confirm(`Delete "${pg.name}" and all its students?`)) return;
    deleteMutation.mutate(pg.id);
  };

  const pgs = data?.success ? data.pgs : [];
  const filteredPgs = pgs.filter((pg: PG) =>
    pg.name.toLowerCase().includes(filter.toLowerCase()) ||
    pg.address.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading || isLoading) return <div className="flex h-64 items-center justify-center">Loading...</div>;
  if (!user) return null;
  if (error) return <div className="flex h-64 items-center justify-center text-red-500">Error loading properties</div>;

  return (
    <div>
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
          <p className="text-gray-500 mt-1">Manage your PG buildings and rooms.</p>
        </div>
        <Button onClick={openCreate} className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
          <Plus className="h-4 w-4 mr-2" /> Add Property
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative w-full">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Filter properties..." 
            value={filter} 
            onChange={e => setFilter(e.target.value)} 
            className="pl-10 bg-white border-gray-200 w-full max-w-md" 
          />
        </div>
      </div>

      {filteredPgs.length === 0 ? (
        <Card className="text-center py-16 bg-white border-gray-200 shadow-sm">
          <p className="text-gray-500 mb-4">No properties found</p>
          <Button onClick={openCreate} className="bg-blue-600 hover:bg-blue-700 text-white"><Plus className="h-4 w-4 mr-2" /> Add Your First Property</Button>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPgs.map((pg: PG) => (
            <Card key={pg.id} className="overflow-hidden hover:shadow-md transition-all group border border-gray-200 bg-white rounded-xl shadow-sm">
              <div className="h-48 relative bg-gray-100">
                {pg.image ? (
                  <img src={pg.image} alt={pg.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center border border-gray-200 shadow-sm">
                      <span className="text-2xl font-bold text-gray-400">{pg.name.charAt(0)}</span>
                    </div>
                  </div>
                )}
                <div className="absolute top-3 right-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-medium rounded-full shadow-sm">Active</div>
              </div>
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{pg.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                      <MapPin className="h-3.5 w-3.5" />
                      <span className="truncate max-w-[200px]">{pg.address}</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                   <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 uppercase font-medium mb-1">Occupancy</p>
                      <div className="flex items-center gap-2">
                         <Users className="h-4 w-4 text-blue-500" />
                         <span className="text-sm font-semibold text-gray-900">{pg._count.students}/40</span>
                      </div>
                   </div>
                   <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 uppercase font-medium mb-1">Type</p>
                      <span className="text-sm font-semibold text-gray-900">Unisex</span>
                   </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                  <div>
                     <p className="text-xs text-gray-500">Starts from</p>
                     <p className="text-sm font-bold text-blue-600">₹8,000 - ₹12,000</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-400 hover:text-blue-600" onClick={() => openEdit(pg)}><Edit2 className="h-4 w-4" /></Button>
                    <Button size="sm" variant="outline" className="ml-2 border-gray-300 text-gray-700 hover:bg-gray-50" onClick={() => router.push(`/properties/${pg.id}`)}>Manage</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-gray-200 rounded-xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">{editingPg ? "Edit Property" : "Add Property"}</h3>
              <button onClick={() => setShowModal(false)}><X className="h-5 w-5 text-gray-400 hover:text-gray-600" /></button>
            </div>
            <div className="space-y-4">
              <div><Label className="text-gray-700">Property Name *</Label><Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g., Sunshine Residency" className="mt-1 bg-white border-gray-300 text-gray-900" /></div>
              <div><Label className="text-gray-700">Address *</Label><Input value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="Full address" className="mt-1 bg-white border-gray-300 text-gray-900" /></div>
              <div>
                <Label className="text-gray-700">Property Image</Label>
                <div className="mt-1 flex gap-2">
                  <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="file:text-gray-700 bg-white border-gray-300" />
                </div>
                {uploading && <p className="text-xs text-gray-500 mt-1">Uploading...</p>}
                {form.image && <p className="text-xs text-green-600 mt-1">Image uploaded successfully</p>}
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50">Cancel</Button>
                <Button onClick={handleSave} disabled={saving || uploading} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">{saving ? "Saving..." : editingPg ? "Update" : "Create"}</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
