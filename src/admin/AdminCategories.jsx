import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  X,
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import ConfirmModal from '../components/ConfirmModal';

const AdminCategories = () => {
  const { categories, addCategory, updateCategory, deleteCategory, products } = useProducts();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800',
    description: '',
    status: 'Active',
  });

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800',
      description: '',
      status: 'Active',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      image: cat.image,
      description: cat.description || '',
      status: cat.status || 'Active',
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingCategory) {
      await updateCategory(editingCategory.id, formData);
    } else {
      await addCategory(formData);
    }
    setIsModalOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (categoryToDelete) {
      await deleteCategory(categoryToDelete.id);
      setCategoryToDelete(null);
    }
  };

  return (
    <div className="space-y-6 bg-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E5E5]">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#111111]">
            Category Management
          </h1>
          <p className="text-xs sm:text-sm text-[#666666] mt-1">
            Organize fashion departments, featured imagery, and department descriptions.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#064C32] hover:bg-[#033B27] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#F3D477]" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const count = products.filter(
            (p) => p.category?.toLowerCase() === cat.name?.toLowerCase()
          ).length;

          return (
            <div
              key={cat.id || cat.name}
              className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition"
            >
              <div className="relative aspect-[16/9] bg-[#F8F8F8] overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-[#064C32] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {cat.status || 'Active'}
                </span>
                <span className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md text-[#111111] text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                  {count} Products
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#111111]">{cat.name}</h3>
                  <p className="text-xs text-[#666666] mt-1 line-clamp-2 leading-relaxed">
                    {cat.description || 'No description provided.'}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-[#E5E5E5] flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(cat)}
                    className="p-2 rounded-xl text-gray-600 hover:text-[#064C32] hover:bg-gray-100 transition"
                    title="Edit Category"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategoryToDelete(cat)}
                    className="p-2 rounded-xl text-gray-600 hover:text-red-600 hover:bg-red-50 transition"
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div
            className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#E5E5E5] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-serif font-bold text-xl text-[#111111] mb-1">
              {editingCategory ? 'Edit Category' : 'Create Category'}
            </h2>
            <p className="text-xs text-[#666666] mb-6">
              Configure department name, banner image, and visibility status.
            </p>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Polo T-Shirts"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F8F8F8] border border-[#E5E5E5] text-xs text-[#111111] focus:outline-none focus:border-[#064C32]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                  Image Web URL *
                </label>
                <input
                  type="url"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F8F8F8] border border-[#E5E5E5] text-xs text-[#111111] focus:outline-none focus:border-[#064C32]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Short tagline or summary for this category..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F8F8F8] border border-[#E5E5E5] text-xs text-[#111111] focus:outline-none focus:border-[#064C32]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F8F8F8] border border-[#E5E5E5] text-xs text-[#111111] focus:outline-none focus:border-[#064C32]"
                >
                  <option value="Active">Active</option>
                  <option value="Hidden">Hidden</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#064C32] hover:bg-[#033B27] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow transition"
                >
                  {editingCategory ? 'Update Category' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(categoryToDelete)}
        title={`Delete Category "${categoryToDelete?.name}"?`}
        message="Are you sure you want to delete this category? Any associated products may become uncategorized."
        confirmText="Yes, Delete Category"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setCategoryToDelete(null)}
      />
    </div>
  );
};

export default AdminCategories;
