"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Trash2, Loader2, Plus } from "lucide-react"; 
import { handle_location } from "@/api/controller/all_reports"; 
import toast from "react-hot-toast";

interface Category {
  id: string | number;
  name: string;
}

interface AddUpdateModalProps {
  open: boolean;
  onClose: () => void;
  active: boolean;
  editItem: any; 
  categories: Category[];
  onSubmit: (payload: any) => Promise<void>;
  refreshCategories: () => void;
}

export default function AddUpdateModal({ 
  open, 
  onClose, 
  active, 
  editItem, 
  categories, 
  onSubmit, 
  refreshCategories 
}: AddUpdateModalProps) {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [areas, setAreas] = useState<string[]>([""]);
  const [submitting, setSubmitting] = useState(false);
  const [newCat, setNewCat] = useState("");
  const [catLoad, setCatLoad] = useState(false);

  useEffect(() => {
    if (open) {
      setName(editItem?.name || "");
      setCategoryId(editItem?.category_id?.toString() || "");
      setNewCat("");
      if (active) {
        const existingAreas = editItem?.areas?.map((a: any) => typeof a === 'string' ? a : a.name) || [""];
        setAreas(existingAreas.length > 0 ? existingAreas : [""]);
      }
    }
  }, [open, editItem, active]);

  const handleMainSubmit = async () => {
    if (!name.trim()) return toast.error("Name is required");
    if (!active && !categoryId) return toast.error("Please select a category");

    setSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        category_id: categoryId,
        areas: active ? areas.filter(a => a.trim() !== "") : undefined
      });
    } catch (error) {
        console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCat.trim()) return toast.error("Category name cannot be empty");
    setCatLoad(true);
    try {
      await handle_location.add_Category(newCat.trim());
      setNewCat("");
      refreshCategories();
    } catch (e) {
      console.error(e);
    } finally {
      setCatLoad(false);
    }
  };

  const handleDeleteCategory = (id: number) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-bold text-gray-900">Delete this category? This cannot be undone.</p>
        <div className="flex gap-2 justify-end">
          <button 
            className="text-xs font-bold text-gray-400 px-3 py-1 hover:text-gray-600"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
          <button 
            className="text-xs font-black text-white bg-red-500 px-4 py-1.5 rounded-xl shadow-lg shadow-red-200 hover:bg-red-600"
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await handle_location.delete_Category(id);
                refreshCategories();
              } catch (e) { console.error(e); }
            }}
          >
            Confirm Delete
          </button>
        </div>
      </div>
    ), { position: 'top-center', duration: 6000, style: { minWidth: '300px', borderRadius: '24px' } });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {editItem ? "Update" : "Add"} {active ? "Place" : "Waste Type"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-4">
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter Name" />
          </div>

          {!active && (
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">Select Waste Category</label>
                <select 
                title="waste_category"
                  className="w-full h-11 border border-gray-300 rounded-lg px-3 text-sm outline-none bg-white"
                  value={categoryId} 
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  <option value="">-- Select Category --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {!editItem && (
                <div className="p-4 bg-gray-50 border border-dashed rounded-xl space-y-4">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Manage Categories</p>
                  <div className="flex gap-2">
                    <Input value={newCat} onChange={(e) => setNewCat(e.target.value)} className="h-10 text-sm" placeholder="New category..." />
                    <Button type="button" size="sm" onClick={handleAddCategory} disabled={catLoad} className="bg-blue-600 hover:bg-blue-700 h-10 px-4">
                      {catLoad ? <Loader2 className="animate-spin" size={14}/> : <Plus size={18} />}
                    </Button>
                  </div>
                  <div className="max-h-36 overflow-y-auto space-y-2 pt-2 border-t">
                    {categories.map((cat) => (
                      <div key={cat.id} className="flex justify-between items-center bg-white p-2.5 rounded-lg border text-sm font-medium">
                        <span className="text-gray-700">{cat.name}</span>
                        <button title="manage_category" type="button" onClick={() => handleDeleteCategory(Number(cat.id))} className="p-1 hover:bg-red-50 rounded">
                          <Trash2 size={14} className="text-red-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {active && (
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center border-t pt-4">
                <label className="text-sm font-bold text-gray-700">Areas / Locations</label>
                <Button type="button" variant="outline" size="sm" onClick={() => setAreas([...areas, ""])} className="h-7 text-xs">+ Add Field</Button>
              </div>
              {areas.map((area, index) => (
                <div key={index} className="flex gap-2">
                  <Input value={area} onChange={(e) => {
                    const newArr = [...areas];
                    newArr[index] = e.target.value;
                    setAreas(newArr);
                  }} placeholder="e.g. Building A" />
                  {areas.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => setAreas(areas.filter((_, i) => i !== index))}>
                      <Trash2 size={18} className="text-red-500" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="gap-3">
          <Button variant="outline" type="button" onClick={onClose} className="flex-1 h-11">Cancel</Button>
          <Button onClick={handleMainSubmit} disabled={submitting} className="flex-1 bg-yellow-700 hover:bg-yellow-800 text-white h-11">
            {submitting ? <Loader2 className="animate-spin" size={18} /> : editItem ? "Update Changes" : "Save Record"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}