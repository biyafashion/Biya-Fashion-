import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  PlusCircle,
  Search,
  Filter,
  Edit2,
  Copy,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import ConfirmModal from '../components/ConfirmModal';

const AdminProducts = () => {
  const { products, categories, deleteProduct, duplicateProduct, clearAllProducts } = useProducts();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [productToDelete, setProductToDelete] = useState(null);
  const [isClearAllOpen, setIsClearAllOpen] = useState(false);
  const navigate = useNavigate();

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory !== 'all' && p.category?.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesSku = p.sku?.toLowerCase().includes(q);
        const matchesCategory = p.category?.toLowerCase().includes(q);
        return matchesName || matchesSku || matchesCategory;
      }
      return true;
    });
  }, [products, selectedCategory, search]);

  const handleDeleteConfirm = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id);
      setProductToDelete(null);
    }
  };

  return (
    <div className="space-y-6 bg-white">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E5E5]">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#111111]">
            Product Catalog
          </h1>
          <p className="text-xs sm:text-sm text-[#666666] mt-1">
            Manage your store's inventory, pricing, stock levels, and promotional badges.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {products.length > 0 && (
            <button
              type="button"
              onClick={() => setIsClearAllOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold uppercase tracking-wider transition cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear All Products</span>
            </button>
          )}

          <Link
            to="/admin/products/add"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#064C32] hover:bg-[#033B27] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition active:scale-95 self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4 text-[#F3D477]" />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#F8F8F8] p-4 rounded-2xl border border-[#E5E5E5]">
        {/* Search Input */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, SKU..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[#E5E5E5] text-xs text-[#111111] focus:outline-none focus:border-[#064C32]"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#064C32]" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs font-semibold bg-white border border-[#E5E5E5] rounded-xl px-3 py-2 text-[#111111] focus:outline-none focus:border-[#064C32] cursor-pointer"
            >
              <option value="all">All Categories ({products.length})</option>
              {categories.map((c) => (
                <option key={c.id || c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F8F8] text-[#111111] uppercase tracking-wider font-bold border-b border-[#E5E5E5]">
              <tr>
                <th className="p-4">Image</th>
                <th className="p-4">Product Name</th>
                <th className="p-4">SKU</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Status</th>
                <th className="p-4">Badges</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-gray-500">
                    No products found matching your search.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-gray-50/80 transition">
                    {/* Image */}
                    <td className="p-4">
                      <img
                        src={prod.images?.[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=80'}
                        alt={prod.name}
                        className="w-12 h-14 object-cover rounded-xl border border-[#E5E5E5] bg-gray-50"
                      />
                    </td>

                    {/* Product Name */}
                    <td className="p-4 max-w-[200px]">
                      <Link
                        to={`/product/${prod.id}`}
                        target="_blank"
                        className="font-bold text-[#111111] hover:text-[#064C32] transition flex items-center gap-1.5"
                      >
                        <span className="truncate">{prod.name}</span>
                        <ExternalLink className="w-3 h-3 text-gray-400 shrink-0" />
                      </Link>
                      <span className="text-[10px] text-[#666666]">
                        {prod.sizes?.join(', ') || 'One size'}
                      </span>
                    </td>

                    {/* SKU */}
                    <td className="p-4 font-mono font-medium text-gray-600">{prod.sku || 'N/A'}</td>

                    {/* Category */}
                    <td className="p-4">
                      <span className="inline-block bg-[#064C32]/10 text-[#064C32] px-2.5 py-1 rounded-md text-[11px] font-bold">
                        {prod.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="p-4 font-bold text-[#111111]">
                      ₹{prod.discountPrice || prod.price}
                      {prod.discountPrice && (
                        <span className="block text-[10px] text-[#666666] line-through font-normal">
                          ₹{prod.price}
                        </span>
                      )}
                    </td>

                    {/* Stock */}
                    <td className="p-4">
                      <span
                        className={`font-semibold ${
                          prod.stock <= 10 ? 'text-amber-600 font-bold' : 'text-gray-700'
                        }`}
                      >
                        {prod.stock} units
                      </span>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          prod.stock > 0
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {prod.stock > 0 ? 'Active' : 'Out of Stock'}
                      </span>
                    </td>

                    {/* Badges */}
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {prod.featured && (
                          <span className="bg-[#D9A514]/20 text-[#111111] text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded">
                            Featured
                          </span>
                        )}
                        {prod.bestSeller && (
                          <span className="bg-[#064C32] text-white text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded">
                            Bestseller
                          </span>
                        )}
                        {prod.newArrival && (
                          <span className="bg-blue-100 text-blue-800 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded">
                            New
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Edit */}
                        <button
                          type="button"
                          onClick={() => navigate(`/admin/products/edit/${prod.id}`)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-[#064C32] hover:bg-gray-100 transition"
                          title="Edit product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {/* Duplicate */}
                        <button
                          type="button"
                          onClick={() => duplicateProduct(prod.id)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-[#D9A514] hover:bg-gray-100 transition"
                          title="Duplicate product"
                        >
                          <Copy className="w-4 h-4" />
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => setProductToDelete(prod)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(productToDelete)}
        title={`Delete "${productToDelete?.name}"?`}
        message="Are you sure you want to delete this product? This action cannot be undone and will remove it from the catalog."
        confirmText="Yes, Delete Product"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setProductToDelete(null)}
      />

      {/* Clear All Confirmation Modal */}
      <ConfirmModal
        isOpen={isClearAllOpen}
        title="Clear All Products?"
        message="Are you sure you want to completely remove all products from your catalog? This cannot be undone."
        confirmText="Yes, Clear All Products"
        cancelText="Cancel"
        onConfirm={() => {
          clearAllProducts();
          setIsClearAllOpen(false);
        }}
        onCancel={() => setIsClearAllOpen(false)}
      />
    </div>
  );
};

export default AdminProducts;
