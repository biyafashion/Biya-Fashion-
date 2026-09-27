import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Cloud,
  Plus,
  Trash2,
  ArrowLeft,
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useToast } from '../context/ToastContext';
import GoogleDrivePickerModal from '../components/GoogleDrivePickerModal';

const AVAILABLE_SIZES = ['S', 'M', 'L', 'XL', 'XXL', '30', '32', '34', '36'];

const EditProduct = () => {
  const { id } = useParams();
  const { products, categories, updateProduct } = useProducts();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    description: '',
    price: '',
    discountPrice: '',
    stock: 0,
    sizes: [],
    colors: '',
    featured: false,
    newArrival: false,
    bestSeller: false,
  });

  const [images, setImages] = useState([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isDrivePickerOpen, setIsDrivePickerOpen] = useState(false);

  useEffect(() => {
    const existing = products.find((p) => String(p.id) === String(id));
    if (existing) {
      setFormData({
        name: existing.name || '',
        sku: existing.sku || '',
        category: existing.category || categories[0]?.name || 'T-Shirts',
        description: existing.description || '',
        price: existing.price || '',
        discountPrice: existing.discountPrice || '',
        stock: existing.stock || 0,
        sizes: existing.sizes || ['M', 'L'],
        colors: Array.isArray(existing.colors) ? existing.colors.join(', ') : existing.colors || '',
        featured: Boolean(existing.featured),
        newArrival: Boolean(existing.newArrival),
        bestSeller: Boolean(existing.bestSeller),
      });
      setImages(existing.images || []);
    }
  }, [id, products, categories]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleToggleSize = (size) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const handleAddImageFromUrl = (e) => {
    e.preventDefault();
    if (newImageUrl.trim()) {
      setImages((prev) => [...prev, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleDriveImageSelected = (url) => {
    if (url) {
      setImages((prev) => [...prev, url]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.price) {
      toast.error('Please enter a product name and price.');
      return;
    }

    const payload = {
      ...formData,
      price: Number(formData.price),
      discountPrice: formData.discountPrice ? Number(formData.discountPrice) : null,
      stock: Number(formData.stock) || 0,
      colors: formData.colors.split(',').map((c) => c.trim()).filter(Boolean),
      images,
    };

    updateProduct(id, payload);
    navigate('/admin/products');
  };

  return (
    <div className="space-y-6 bg-white max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-[#E5E5E5]">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="p-2 rounded-xl border border-[#E5E5E5] text-gray-600 hover:text-black hover:bg-gray-100 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#111111]">
              Edit Product
            </h1>
            <p className="text-xs text-[#666666]">
              Update garment specifications, inventory, and imagery.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 cols): Primary Info */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-[#F8F8F8] p-6 rounded-3xl border border-[#E5E5E5] space-y-4">
            <h2 className="font-serif font-bold text-base text-[#111111] pb-2 border-b border-[#E5E5E5]">
              Product Details
            </h2>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#E5E5E5] text-sm text-[#111111] focus:outline-none focus:border-[#064C32]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                  SKU
                </label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-[#E5E5E5] text-sm font-mono text-[#111111] focus:outline-none focus:border-[#064C32]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-[#E5E5E5] text-sm text-[#111111] focus:outline-none focus:border-[#064C32]"
                >
                  {categories.map((c) => (
                    <option key={c.id || c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                Description
              </label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#E5E5E5] text-sm text-[#111111] focus:outline-none focus:border-[#064C32]"
              />
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="bg-[#F8F8F8] p-6 rounded-3xl border border-[#E5E5E5] space-y-4">
            <h2 className="font-serif font-bold text-base text-[#111111] pb-2 border-b border-[#E5E5E5]">
              Pricing & Inventory
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                  Regular Price (₹) *
                </label>
                <input
                  type="number"
                  name="price"
                  required
                  min={0}
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-[#E5E5E5] text-sm text-[#111111] focus:outline-none focus:border-[#064C32]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                  Discount Price (₹)
                </label>
                <input
                  type="number"
                  name="discountPrice"
                  min={0}
                  value={formData.discountPrice}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-[#E5E5E5] text-sm text-[#111111] focus:outline-none focus:border-[#064C32]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                  Stock Units *
                </label>
                <input
                  type="number"
                  name="stock"
                  required
                  min={0}
                  value={formData.stock}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-[#E5E5E5] text-sm text-[#111111] focus:outline-none focus:border-[#064C32]"
                />
              </div>
            </div>
          </div>

          {/* Sizes & Colors */}
          <div className="bg-[#F8F8F8] p-6 rounded-3xl border border-[#E5E5E5] space-y-4">
            <h2 className="font-serif font-bold text-base text-[#111111] pb-2 border-b border-[#E5E5E5]">
              Sizes & Colors
            </h2>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-2">
                Available Sizes
              </label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_SIZES.map((size) => {
                  const isSelected = formData.sizes?.includes(size);
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleToggleSize(size)}
                      className={`px-3.5 py-2 text-xs font-bold rounded-xl border transition ${
                        isSelected
                          ? 'bg-[#064C32] text-[#F3D477] border-[#064C32]'
                          : 'bg-white text-gray-700 border-[#E5E5E5] hover:bg-gray-50'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                Colors (Comma-separated)
              </label>
              <input
                type="text"
                name="colors"
                value={formData.colors}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#E5E5E5] text-sm text-[#111111] focus:outline-none focus:border-[#064C32]"
              />
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Images & Badges */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#F8F8F8] p-6 rounded-3xl border border-[#E5E5E5] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E5E5E5]">
              <h2 className="font-serif font-bold text-base text-[#111111]">Product Images</h2>
              <span className="text-xs text-[#064C32] font-semibold">{images.length} images</span>
            </div>

            <button
              type="button"
              onClick={() => setIsDrivePickerOpen(true)}
              className="w-full py-3 px-4 rounded-xl bg-white hover:bg-gray-50 border-2 border-dashed border-[#064C32]/40 text-[#064C32] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition"
            >
              <Cloud className="w-4 h-4 text-[#D9A514]" />
              <span>SELECT IMAGE FROM GOOGLE DRIVE</span>
            </button>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#111111]">
                Or Add Image URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="flex-1 px-3 py-2 rounded-xl bg-white border border-[#E5E5E5] text-xs focus:outline-none focus:border-[#064C32]"
                />
                <button
                  type="button"
                  onClick={handleAddImageFromUrl}
                  className="p-2 bg-[#064C32] text-white rounded-xl hover:bg-[#033B27] transition"
                  title="Add URL"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-2">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-[3/4] rounded-xl overflow-hidden border border-[#E5E5E5] group">
                  <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1.5 right-1.5 p-1 rounded-md bg-black/60 text-white hover:bg-red-600 transition opacity-0 group-hover:opacity-100"
                    title="Remove"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  {idx === 0 && (
                    <span className="absolute bottom-1 left-1 bg-[#064C32] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      Main
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Visibility Badges */}
          <div className="bg-[#F8F8F8] p-6 rounded-3xl border border-[#E5E5E5] space-y-3">
            <h2 className="font-serif font-bold text-base text-[#111111] pb-2 border-b border-[#E5E5E5]">
              Promotional Badges
            </h2>

            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleInputChange}
                className="w-4 h-4 rounded text-[#064C32] accent-[#064C32]"
              />
              <span className="text-xs font-semibold text-[#111111]">Featured on Homepage</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                name="newArrival"
                checked={formData.newArrival}
                onChange={handleInputChange}
                className="w-4 h-4 rounded text-[#064C32] accent-[#064C32]"
              />
              <span className="text-xs font-semibold text-[#111111]">New Arrival Collection</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                name="bestSeller"
                checked={formData.bestSeller}
                onChange={handleInputChange}
                className="w-4 h-4 rounded text-[#064C32] accent-[#064C32]"
              />
              <span className="text-xs font-semibold text-[#111111]">Best Seller Badge</span>
            </label>
          </div>

          <div className="space-y-2 pt-2">
            <button
              type="submit"
              className="w-full py-4 bg-[#064C32] hover:bg-[#033B27] text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg transition active:scale-95"
            >
              UPDATE PRODUCT
            </button>
            <Link
              to="/admin/products"
              className="block w-full py-3 bg-white hover:bg-gray-100 text-[#111111] border border-[#E5E5E5] font-semibold text-xs uppercase tracking-wider rounded-xl transition text-center"
            >
              CANCEL
            </Link>
          </div>
        </div>
      </form>

      <GoogleDrivePickerModal
        isOpen={isDrivePickerOpen}
        onClose={() => setIsDrivePickerOpen(false)}
        onSelectImage={handleDriveImageSelected}
      />
    </div>
  );
};

export default EditProduct;
