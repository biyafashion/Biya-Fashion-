import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Cloud,
  Plus,
  Trash2,
  ArrowLeft,
  Upload,
  Star,
  Image as ImageIcon,
  Loader2,
  X,
  Link as LinkIcon,
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useToast } from '../context/ToastContext';
import GoogleDrivePickerModal from '../components/GoogleDrivePickerModal';
import { processMultipleImageFiles } from '../utils/imageUtils';

const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];

const AddProduct = () => {
  const { categories, addProduct } = useProducts();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(() => ({
    name: '',
    sku: `BF-${Math.floor(100 + Math.random() * 900)}`,
    category: categories[0]?.name || 'T-Shirts',
    description: '',
    price: '',
    discountPrice: '',
    stock: 25,
    sizes: ['M', 'L', 'XL'],
    colors: 'Black, White',
    featured: false,
    newArrival: true,
    bestSeller: false,
  }));

  // Clean empty state - zero dummy images
  const [images, setImages] = useState([]);
  const [isProcessingImages, setIsProcessingImages] = useState(false);
  const [isDrivePickerOpen, setIsDrivePickerOpen] = useState(false);
  const [showUrlBox, setShowUrlBox] = useState(false);
  const [multiUrlInput, setMultiUrlInput] = useState('');

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

  // Upload multiple images from local device (phone/computer)
  const handleMultipleFilesUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessingImages(true);
    try {
      const processed = await processMultipleImageFiles(files);
      if (processed.length > 0) {
        setImages((prev) => [...prev, ...processed]);
        toast.success(`Added ${processed.length} image(s) successfully!`);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to process image files.');
    } finally {
      setIsProcessingImages(false);
      e.target.value = '';
    }
  };

  // Add multiple URLs at once
  const handleAddMultipleUrls = (e) => {
    e.preventDefault();
    if (!multiUrlInput.trim()) return;

    const urls = multiUrlInput
      .split(/[\n,]+/)
      .map((u) => u.trim())
      .filter((u) => u.startsWith('http://') || u.startsWith('https://') || u.startsWith('data:image/'));

    if (urls.length === 0) {
      toast.error('Please enter valid image URLs (starting with http:// or https://)');
      return;
    }

    setImages((prev) => [...prev, ...urls]);
    toast.success(`Added ${urls.length} image URL(s)!`);
    setMultiUrlInput('');
    setShowUrlBox(false);
  };

  // Set any image as the primary cover photo (Index 0)
  const handleSetMainImage = (index) => {
    if (index === 0) return;
    setImages((prev) => {
      const next = [...prev];
      const [selected] = next.splice(index, 1);
      next.unshift(selected);
      return next;
    });
    toast.success('Set as primary cover image!');
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleDriveImageSelected = (url) => {
    if (url) {
      setImages((prev) => [...prev, url]);
      toast.success('Image added from Google Drive!');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.price) {
      toast.error('Please enter a product name and price.');
      return;
    }

    if (images.length === 0) {
      toast.error('Please add at least one product image.');
      return;
    }

    const payload = {
      ...formData,
      price: Number(formData.price),
      discountPrice: formData.discountPrice ? Number(formData.discountPrice) : null,
      stock: Number(formData.stock) || 0,
      colors: formData.colors.split(',').map((c) => c.trim()).filter(Boolean),
      images,
      rating: 5.0,
      reviewsCount: 0,
    };

    addProduct(payload);
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
              Add New Product
            </h1>
            <p className="text-xs text-[#666666]">
              Create a new fashion item for the BIYA FASHION store catalog.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 cols): Primary Info */}
        <div className="lg:col-span-8 space-y-6">
          {/* Basic Details */}
          <div className="bg-[#F8F8F8] p-6 rounded-3xl border border-[#E5E5E5] space-y-4">
            <h2 className="font-serif font-bold text-base text-[#111111] pb-2 border-b border-[#E5E5E5]">
              Product Identification
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
                placeholder="e.g. Luxury Combed Heavyweight T-Shirt"
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#E5E5E5] text-sm text-[#111111] focus:outline-none focus:border-[#064C32]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                  SKU / Style Code
                </label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  placeholder="BF-TSH-001"
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
                Description & Textile Highlights
              </label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe fabric weave, weight (GSM), neckline style, and fit details..."
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
                  placeholder="1499"
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
                  placeholder="999"
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
                  placeholder="30"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-[#E5E5E5] text-sm text-[#111111] focus:outline-none focus:border-[#064C32]"
                />
              </div>
            </div>
          </div>

          {/* Sizes & Colors */}
          <div className="bg-[#F8F8F8] p-6 rounded-3xl border border-[#E5E5E5] space-y-4">
            <h2 className="font-serif font-bold text-base text-[#111111] pb-2 border-b border-[#E5E5E5]">
              Variants (Sizes & Colors)
            </h2>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-2">
                Available Sizes
              </label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_SIZES.map((size) => {
                  const isSelected = formData.sizes.includes(size);
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
                placeholder="Black, Dark Green, White, Navy Blue"
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#E5E5E5] text-sm text-[#111111] focus:outline-none focus:border-[#064C32]"
              />
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Multiple Images & Visibility */}
        <div className="lg:col-span-4 space-y-6">
          {/* Multiple Images Section */}
          <div className="bg-[#F8F8F8] p-6 rounded-3xl border border-[#E5E5E5] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E5E5E5]">
              <div>
                <h2 className="font-serif font-bold text-base text-[#111111]">Product Images</h2>
                <p className="text-[11px] text-[#666666]">Upload multiple photos</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#064C32]/10 text-[#064C32]">
                  {images.length} {images.length === 1 ? 'image' : 'images'}
                </span>
                {images.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setImages([])}
                    className="text-[11px] text-red-600 hover:underline"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>

            {/* Main Upload Zone for Multiple Files */}
            <div>
              <input
                type="file"
                id="product-multiple-images-upload"
                multiple
                accept="image/*"
                onChange={handleMultipleFilesUpload}
                disabled={isProcessingImages}
                className="hidden"
              />
              <label
                htmlFor="product-multiple-images-upload"
                className={`w-full py-6 px-4 rounded-2xl border-2 border-dashed transition flex flex-col items-center justify-center text-center cursor-pointer ${
                  isProcessingImages
                    ? 'border-gray-300 bg-gray-50 opacity-60 cursor-not-allowed'
                    : 'border-[#064C32]/40 bg-white hover:bg-[#064C32]/5 hover:border-[#064C32]'
                }`}
              >
                {isProcessingImages ? (
                  <div className="flex flex-col items-center gap-2 py-2">
                    <Loader2 className="w-6 h-6 text-[#064C32] animate-spin" />
                    <span className="text-xs font-bold text-[#064C32]">Optimizing & Loading Images...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-2xl bg-[#064C32]/10 text-[#064C32] flex items-center justify-center shadow-xs">
                      <Upload className="w-6 h-6 text-[#064C32]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#111111] uppercase tracking-wider">
                        Upload Multiple Photos
                      </p>
                      <p className="text-[11px] text-[#666666] mt-0.5">
                        Select 1 or more images from device
                      </p>
                    </div>
                  </div>
                )}
              </label>
            </div>

            {/* Quick Action Buttons: URLs & Google Drive */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setShowUrlBox(!showUrlBox)}
                className="py-2.5 px-3 rounded-xl bg-white border border-[#E5E5E5] hover:border-[#064C32] text-[#111111] text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition"
              >
                <LinkIcon className="w-3.5 h-3.5 text-[#064C32]" />
                <span>Paste URLs</span>
              </button>

              <button
                type="button"
                onClick={() => setIsDrivePickerOpen(true)}
                className="py-2.5 px-3 rounded-xl bg-white border border-[#E5E5E5] hover:border-[#064C32] text-[#111111] text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition"
              >
                <Cloud className="w-3.5 h-3.5 text-[#D9A514]" />
                <span>Google Drive</span>
              </button>
            </div>

            {/* URL Paste Drawer */}
            {showUrlBox && (
              <div className="p-3.5 bg-white rounded-2xl border border-[#E5E5E5] space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#111111]">
                    Paste Image URLs (One per line)
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowUrlBox(false)}
                    className="text-gray-400 hover:text-black"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={multiUrlInput}
                  onChange={(e) => setMultiUrlInput(e.target.value)}
                  placeholder="https://example.com/photo1.jpg&#10;https://example.com/photo2.jpg"
                  className="w-full p-2.5 rounded-xl border border-[#E5E5E5] text-xs font-mono focus:outline-none focus:border-[#064C32]"
                />
                <button
                  type="button"
                  onClick={handleAddMultipleUrls}
                  className="w-full py-2 bg-[#064C32] text-white text-xs font-bold uppercase rounded-lg hover:bg-[#033B27] transition"
                >
                  Add URLs
                </button>
              </div>
            )}

            {/* Image Previews Grid */}
            {images.length === 0 ? (
              <div className="text-center py-6 px-4 bg-white rounded-2xl border border-dashed border-[#E5E5E5]">
                <ImageIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-gray-500">No images added yet</p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Uploaded images will appear here with cover selection.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      className={`relative aspect-[3/4] rounded-2xl overflow-hidden border-2 transition-all group ${
                        idx === 0
                          ? 'border-[#064C32] ring-2 ring-[#064C32]/20 shadow-md'
                          : 'border-[#E5E5E5]'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Product image ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />

                      {/* Main / Cover Badge */}
                      {idx === 0 ? (
                        <div className="absolute top-1.5 left-1.5 bg-[#064C32] text-[#F3D477] text-[9px] font-black uppercase px-2 py-0.5 rounded-md shadow-md flex items-center gap-1">
                          <Star className="w-2.5 h-2.5 fill-[#F3D477]" />
                          <span>Cover</span>
                        </div>
                      ) : (
                        <span className="absolute top-1.5 left-1.5 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                          #{idx + 1}
                        </span>
                      )}

                      {/* Actions Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        {idx !== 0 && (
                          <button
                            type="button"
                            onClick={() => handleSetMainImage(idx)}
                            className="p-1.5 rounded-lg bg-white/90 text-[#064C32] hover:bg-white shadow transition"
                            title="Make Cover Image"
                          >
                            <Star className="w-4 h-4 fill-current" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="p-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 shadow transition"
                          title="Remove image"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-[10px] text-gray-500 italic text-center pt-1">
                  💡 Tip: Image #1 is the primary store cover. Hover and click ⭐ to make any photo the cover.
                </p>
              </div>
            )}
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

          {/* Form Actions */}
          <div className="space-y-2 pt-2">
            <button
              type="submit"
              className="w-full py-4 bg-[#064C32] hover:bg-[#033B27] text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg transition active:scale-95"
            >
              SAVE PRODUCT
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

      {/* Google Drive Picker Modal */}
      <GoogleDrivePickerModal
        isOpen={isDrivePickerOpen}
        onClose={() => setIsDrivePickerOpen(false)}
        onSelectImage={handleDriveImageSelected}
      />
    </div>
  );
};

export default AddProduct;
