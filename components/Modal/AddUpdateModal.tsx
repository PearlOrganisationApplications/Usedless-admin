"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

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
  refreshCategories,
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
        const existingAreas =
          editItem?.areas?.map((a: any) =>
            typeof a === "string" ? a : a.name
          ) || [""];

        setAreas(existingAreas.length > 0 ? existingAreas : [""]);
      } else {
        setAreas([""]);
      }
    }
  }, [open, editItem, active]);

  const handleMainSubmit = async () => {
    if (!name.trim()) {
      return toast.error("Name is required");
    }

    if (!active && !categoryId) {
      return toast.error("Please select a category");
    }

    setSubmitting(true);

    try {
      await onSubmit({
        name: name.trim(),
        category_id: categoryId,
        areas: active
          ? areas.filter((area) => area.trim() !== "")
          : undefined,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCat.trim()) {
      return toast.error("Category name cannot be empty");
    }

    setCatLoad(true);

    try {
      await handle_location.add_Category(newCat.trim());
      setNewCat("");
      refreshCategories();

      toast.success("Category added successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add category");
    } finally {
      setCatLoad(false);
    }
  };

  const handleDeleteCategory = (id: number) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-4 min-w-[300px]">
          <div>
            <p className="text-sm font-bold text-slate-900">
              Delete this category?
            </p>

            <p className="text-xs text-slate-500 mt-1">
              This action cannot be undone.
            </p>
          </div>

          <div className="flex gap-2 justify-end">
            <button
              className="text-xs font-semibold text-slate-500 px-3 py-2 rounded-lg hover:bg-slate-100 transition"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>

            <button
              className="text-xs font-bold text-white bg-red-500 px-4 py-2 rounded-lg shadow-md shadow-red-200 hover:bg-red-600 transition"
              onClick={async () => {
                toast.dismiss(t.id);

                try {
                  await handle_location.delete_Category(id);
                  refreshCategories();
                  toast.success("Category deleted successfully");
                } catch (error) {
                  console.error(error);
                  toast.error("Failed to delete category");
                }
              }}
            >
              Confirm Delete
            </button>
          </div>
        </div>
      ),
      {
        position: "top-center",
        duration: 6000,
        style: {
          minWidth: "320px",
          borderRadius: "18px",
          padding: "18px",
          boxShadow: "0 20px 50px rgba(15, 23, 42, 0.18)",
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
   <DialogContent
  className="
max-w-[600px]
    max-h-[90vh]
    overflow-y-auto
    overflow-x-hidden
    p-0
    rounded-3xl
    border border-gray/200
    bg-white/85
    backdrop-blur-2xl
  "
>
        {/* TOP BLUE GLOW */}
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-blue-400/20 blur-3xl pointer-events-none" />

        <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-sky-400/20 blur-3xl pointer-events-none" />

        {/* HEADER */}
        <DialogHeader
          className="
            relative
            px-6
            py-5
            border-b
            border-blue-100/80
            bg-gradient-to-r
            from-blue-50/90
            via-white/80
            to-sky-50/80
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                w-11
                h-11
                rounded-2xl
                flex
                items-center
                justify-center
                bg-gradient-to-br
                from-blue-700
                to-blue-500
                shadow-lg
                shadow-blue-200
              "
            >
              {editItem ? (
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              ) : (
                <Plus className="w-5 h-5 text-white" />
              )}
            </div>

            <div>
              <DialogTitle className="text-xl font-bold text-slate-900">
                {editItem ? "Update" : "Add"}{" "}
                {active ? "Place" : "Waste Type"}
              </DialogTitle>

              <p className="text-xs text-slate-500 mt-0.5">
                {editItem
                  ? "Update the existing record details"
                  : "Create a new record"}
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* CONTENT */}
        <div className="relative px-6 py-6 space-y-6">
          {/* NAME */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">
              Name
            </label>

            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Name"
              className="
                h-11
                rounded-xl
                border-slate-200
                bg-white/80
                shadow-sm
                transition
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-100
                placeholder:text-slate-400
              "
            />
          </div>

          {/* WASTE CATEGORY */}
          {!active && (
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">
                  Select Waste Category
                </label>

                <select
                  title="waste_category"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="
                    w-full
                    h-11
                    border
                    border-slate-200
                    rounded-xl
                    px-3
                    text-sm
                    outline-none
                    bg-white/80
                    text-slate-700
                    shadow-sm
                    transition
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-100
                  "
                >
                  <option value="">-- Select Category --</option>

                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* CATEGORY MANAGEMENT */}
              {!editItem && (
                <div
                  className="
                    p-4
                    rounded-2xl
                    border
                    border-blue-100
                    bg-gradient-to-br
                    from-blue-50/80
                    to-white/80
                    shadow-[0_8px_25px_rgba(37,99,235,0.08)]
                    space-y-4
                  "
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-blue-700 uppercase tracking-widest">
                        Manage Categories
                      </p>

                      <p className="text-xs text-slate-400 mt-1">
                        Add or remove waste categories
                      </p>
                    </div>

                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Plus className="w-4 h-4 text-blue-700" />
                    </div>
                  </div>

                  {/* ADD CATEGORY */}
                  <div className="flex gap-2">
                    <Input
                      value={newCat}
                      onChange={(e) => setNewCat(e.target.value)}
                      className="
                        h-10
                        text-sm
                        rounded-xl
                        border-slate-200
                        bg-white
                        focus:border-blue-500
                        focus:ring-2
                        focus:ring-blue-100
                      "
                      placeholder="New category..."
                    />

                    <Button
                      type="button"
                      size="sm"
                      onClick={handleAddCategory}
                      disabled={catLoad}
                      className="
                        h-10
                        px-4
                        rounded-xl
                        bg-gradient-to-r
                        from-blue-800
                        to-blue-600
                        hover:from-blue-900
                        hover:to-blue-700
                        shadow-lg
                        shadow-blue-200
                      "
                    >
                      {catLoad ? (
                        <Loader2
                          className="animate-spin"
                          size={15}
                        />
                      ) : (
                        <Plus size={18} />
                      )}
                    </Button>
                  </div>

                  {/* CATEGORY LIST */}
                  <div
                    className="
                      max-h-36
                      overflow-y-auto
                      space-y-2
                      pt-3
                      border-t
                      border-blue-100
                    "
                  >
                    {categories.length > 0 ? (
                      categories.map((cat) => (
                        <div
                          key={cat.id}
                          className="
                            flex
                            justify-between
                            items-center
                            bg-white/90
                            p-2.5
                            rounded-xl
                            border
                            border-slate-100
                            text-sm
                            font-medium
                            shadow-sm
                            hover:shadow-md
                            hover:border-blue-100
                            transition
                          "
                        >
                          <span className="text-slate-700">
                            {cat.name}
                          </span>

                          <button
                            title="manage_category"
                            type="button"
                            onClick={() =>
                              handleDeleteCategory(Number(cat.id))
                            }
                            className="
                              p-2
                              rounded-lg
                              hover:bg-red-50
                              transition
                              group
                            "
                          >
                            <Trash2
                              size={14}
                              className="
                                text-red-400
                                group-hover:text-red-500
                                transition
                              "
                            />
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-center text-slate-400 py-3">
                        No categories available
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* AREAS */}
          {active && (
            <div className="space-y-3 pt-2">
              <div
                className="
                  flex
                  justify-between
                  items-center
                  border-t
                  border-blue-100
                  pt-5
                "
              >
                <div>
                  <label className="text-sm font-bold text-slate-700">
                    Areas / Locations
                  </label>

                  <p className="text-xs text-slate-400 mt-0.5">
                    Add locations associated with this place
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setAreas([...areas, ""])}
                  className="
                    h-8
                    text-xs
                    rounded-lg
                    border-blue-200
                    text-blue-700
                    hover:bg-blue-50
                    hover:text-blue-800
                  "
                >
                  <Plus size={14} className="mr-1" />
                  Add Field
                </Button>
              </div>

              {areas.map((area, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={area}
                    onChange={(e) => {
                      const newArr = [...areas];
                      newArr[index] = e.target.value;
                      setAreas(newArr);
                    }}
                    placeholder="e.g. Building A"
                    className="
                      h-11
                      rounded-xl
                      border-slate-200
                      bg-white/80
                      shadow-sm
                      focus:border-blue-500
                      focus:ring-2
                      focus:ring-blue-100
                    "
                  />

                  {areas.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setAreas(
                          areas.filter(
                            (_, i) => i !== index
                          )
                        )
                      }
                      className="
                        h-11
                        w-11
                        rounded-xl
                        hover:bg-red-50
                      "
                    >
                      <Trash2
                        size={18}
                        className="text-red-400"
                      />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <DialogFooter
          className="
            relative
            px-6
            py-5
            border-t
            border-blue-100/80
            bg-gradient-to-r
            from-white/90
            via-blue-50/40
            to-white/90
            gap-3
          "
        >
          <Button
            variant="outline"
            type="button"
            onClick={onClose}
            className="
              flex-1
              h-11
              rounded-xl
              border-slate-200
              bg-white
              text-slate-600
              font-semibold
              hover:bg-slate-50
              shadow-sm
            "
          >
            Cancel
          </Button>

          <Button
            onClick={handleMainSubmit}
            disabled={submitting}
            className="
              flex-1
              h-11
              rounded-xl
              text-white
              font-bold
              bg-gradient-to-r
              from-blue-900
              via-blue-800
              to-blue-700
              hover:from-blue-950
              hover:via-blue-900
              hover:to-blue-800
              shadow-lg
              shadow-blue-200/70
              transition-all
              duration-200
              hover:shadow-blue-300
              hover:-translate-y-0.5
            "
          >
            {submitting ? (
              <Loader2
                className="animate-spin"
                size={18}
              />
            ) : editItem ? (
              "Update Changes"
            ) : (
              "Save Record"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}