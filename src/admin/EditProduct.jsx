import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
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
import { processMultipleImageFiles, normalizeGoogleDriveUrl, cleanAndNormalizeImageUrl } from '../utils/imageUtils';

const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];

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

  // Individual URL input fields for Image 1, Image 2, etc.
  const [urlInputs, setUrlInputs] = useState(['', '']);
  const [images, setImages] = useState([]);
  const [isProcessingImages, setIsProcessingImages] = useState(false);
  const [showDeviceUpload, setShowDeviceUpload] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      const existingImgs = existing.images && existing.images.length > 0 ? existing.images : [];
      setImages(existingImgs);
      setUrlInputs(existingImgs.length > 0 ? [...existingImgs] : ['', '']);
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

  const handleUrlInputChange = (index, value) => {
    const updated = [...urlInputs];
    updated[index] = value;
    setUrlInputs(updated);

    const valid = updated
      .map(cleanAndNormalizeImageUrl)
      .filter((u) => u && (u.startsWith('http://') || u.startsWith('https://') || u.startsWith('data:image/')));
    setImages(valid);
  };

  const handleAddUrlField = () => {
    setUrlInputs((prev) => [...prev, '']);
  };

  const handleRemoveUrlField = (index) => {
    const updated = urlInputs.filter((_, idx) => idx !== index);
    const fallback = updated.length > 0 ? updated : [''];
    setUrlInputs(fallback);

    const valid = fallback
      .map(cleanAndNormalizeImageUrl)
      .filter((u) => u && (u.startsWith('http://') || u.startsWith('https://') || u.startsWith('data:image/')));
    setImages(valid);
  };

  // Upload multiple images from local device (phone/computer)
  const handleMultipleFilesUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessingImages(true);
    try {
      const processed = await processMultipleImageFiles(files);
      if (processed.length > 0) {
        setUrlInputs((prev) => {
          const nonEmpty = prev.filter((u) => u.trim());
          return [...nonEmpty, ...processed];
        });
        setImages((prev) => [...prev, ...processed]);
        toast.success(`Added ${processed.length} image(s) from device!`);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to process image files.');
    } finally {
      setIsProcessingImages(false);
      e.target.value = '';
    }
  };

  // Set any image as primary cover (Index 0)
  const handleSetMainImage = (index) => {
    if (index === 0) return;
    const nextUrls = [...urlInputs];
    const [selected] = nextUrls.splice(index, 1);
    nextUrls.unshift(selected);
    setUrlInputs(nextUrls);

    const valid = nextUrls
      .map(cleanAndNormalizeImageUrl)
      .filter((u) => u && (u.startsWith('http://') || u.startsWith('https://') || u.startsWith('data:image/')));
    setImages(valid);
    toast.success('Set as Image 1 (Cover Photo)!');
  };

  const handleRemoveImage = (index) => {
    handleRemoveUrlField(index);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.price) {
      toast.error('Please enter a product name and price.');
      return;
    }

    // Collect all valid URLs from urlInputs as well as images
    const allInputUrls = urlInputs
      .map(cleanAndNormalizeImageUrl)
      .filter((u) => u && (u.startsWith('http://') || u.startsWith('https://') || u.startsWith('data:image/')));

    const finalImages = Array.from(new Set([...images, ...allInputUrls])).filter(Boolean);

    if (finalImages.length === 0) {
      toast.error('Please add at least one product image (Paste Image URL or upload).');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : null,
        stock: Number(formData.stock) || 0,
        colors: typeof formData.colors === 'string'
          ? formData.colors.split(',').map((c) => c.trim()).filter(Boolean)
          : (formData.colors || ['Standard']),
        images: finalImages,
      };

      await updateProduct(id, payload);
      navigate('/admin/products');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update product.');
    } finally {
      setIsSubmitting(false);
    }
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
              Update item specifications, price, stock, and photography.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 cols): Primary Info */}
        <div className="lg:col-span-8 space-y-6">
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
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#E5E5E5] text-sm text-[#111111] focus:outline-none focus:border-[#064C32]"
              />
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Multiple Images & Visibility */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#F8F8F8] p-6 rounded-3xl border border-[#E5E5E5] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E5E5E5]">
              <div>
                <h2 className="font-serif font-bold text-base text-[#111111]">Product Images</h2>
                <p className="text-[11px] text-[#666666]">Add Image 1, Image 2, Image 3 URLs</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#064C32]/10 text-[#064C32]">
                  {images.length} {images.length === 1 ? 'image' : 'images'}
                </span>
                {images.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setUrlInputs(['', '']);
                      setImages([]);
                    }}
                    className="text-[11px] text-red-600 hover:underline"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>

            {/* Individual Multiple Image URL Input Rows */}
            <div className="space-y-3">
              {urlInputs.map((url, idx) => {
                const normalized = url.trim() ? normalizeGoogleDriveUrl(url.trim()) : '';
                const isDrive = url.includes('drive.google.com');

                return (
                  <div
                    key={idx}
                    className={`bg-white p-3 rounded-2xl border transition-all ${
                      idx === 0
                        ? 'border-[#064C32]/40 ring-1 ring-[#064C32]/10 shadow-xs'
                        : 'border-[#E5E5E5]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-[#064C32] flex items-center gap-1.5">
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            idx === 0
                              ? 'bg-[#064C32] text-[#F3D477]'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <span>{idx === 0 ? 'Image 1 (Main Front Cover) *' : `Image ${idx + 1} URL`}</span>
                      </span>

                      {urlInputs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveUrlField(idx)}
                          className="text-[11px] text-red-600 hover:text-red-700 font-bold flex items-center gap-1 hover:underline"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={url}
                        onChange={(e) => handleUrlInputChange(idx, e.target.value)}
                        placeholder={
                          idx === 0
                            ? "Paste Image 1 URL or Google Drive link..."
                            : `Paste Image ${idx + 1} URL or Google Drive link...`
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F8F8] border border-[#E5E5E5] text-xs font-mono text-[#111111] focus:outline-none focus:border-[#064C32]"
                      />
                    </div>

                    {isDrive && (
                      <p className="text-[10px] text-emerald-700 mt-1 font-semibold flex items-center gap-1">
                        <span>⚡ Google Drive link detected (auto-converting to direct CDN view)</span>
                      </p>
                    )}

                    {/* Instant Preview Box */}
                    {normalized && (
                      <div className="flex items-center gap-2.5 mt-2 pt-2 border-t border-[#F0F0F0]">
                        <img
                          src={normalized}
                          alt={`Preview ${idx + 1}`}
                          className="w-12 h-14 object-cover rounded-lg border border-[#E5E5E5] bg-gray-50 shrink-0 shadow-xs"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=100';
                          }}
                        />
                        <div className="text-[11px] text-gray-600 truncate flex-1">
                          <span className="font-bold text-[#064C32] block">
                            {idx === 0 ? '★ Primary Cover Image' : `Additional View #${idx + 1}`}
                          </span>
                          <span className="text-[10px] text-gray-400 truncate block">{normalized}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* + Add Another Image URL Button */}
            <button
              type="button"
              onClick={handleAddUrlField}
              className="w-full py-2.5 px-4 rounded-xl border-2 border-dashed border-[#064C32]/40 bg-[#064C32]/5 hover:bg-[#064C32]/10 text-[#064C32] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition active:scale-98"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Image {urlInputs.length + 1} URL</span>
            </button>

            {/* Device / Mobile Photos Upload Alternative */}
            <div className="pt-2 border-t border-[#E5E5E5]">
              <button
                type="button"
                onClick={() => setShowDeviceUpload(!showDeviceUpload)}
                className="w-full py-2 px-3 rounded-xl bg-white border border-[#E5E5E5] hover:border-[#064C32] text-[#111111] text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition"
              >
                <Upload className="w-3.5 h-3.5 text-[#064C32]" />
                <span>{showDeviceUpload ? 'Hide Device Upload' : 'Or Upload Photos Directly From Device / Mobile'}</span>
              </button>

              {showDeviceUpload && (
                <div className="mt-3">
                  <input
                    type="file"
                    id="edit-multiple-images-upload"
                    multiple
                    accept="image/*"
                    onChange={handleMultipleFilesUpload}
                    disabled={isProcessingImages}
                    className="hidden"
                  />
                  <label
                    htmlFor="edit-multiple-images-upload"
                    className={`w-full py-5 px-4 rounded-2xl border-2 border-dashed transition flex flex-col items-center justify-center text-center cursor-pointer ${
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
                      <div className="flex flex-col items-center gap-1.5">
                        <Upload className="w-5 h-5 text-[#064C32]" />
                        <p className="text-xs font-bold text-[#111111] uppercase tracking-wider">
                          Select Photos from Mobile/Gallery
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              )}
            </div>

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

          <div className="space-y-2 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#064C32] hover:bg-[#033B27] disabled:opacity-60 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>UPDATING PRODUCT...</span>
                </>
              ) : (
                'UPDATE PRODUCT'
              )}
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
    </div>
  );
};

export default EditProduct;
