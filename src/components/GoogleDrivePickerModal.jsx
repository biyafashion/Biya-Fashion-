import React, { useState } from 'react';
import { Cloud, Link as LinkIcon, AlertCircle, X, Image as ImageIcon } from 'lucide-react';
import { GOOGLE_DRIVE_CONFIG, isGoogleDriveConfigured } from '../config/googleDriveConfig';
import { useToast } from '../context/ToastContext';

/**
 * GoogleDrivePickerModal
 * 
 * Allows selecting images from Google Drive if configured,
 * or gracefully falls back to direct Image URL inputs with instant live preview.
 */
const GoogleDrivePickerModal = ({ isOpen, onClose, onSelectImage }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [previewError, setPreviewError] = useState(false);
  const [activeTab, setActiveTab] = useState('url'); // 'drive' or 'url'
  const { toast } = useToast();

  if (!isOpen) return null;

  const isConfigured = isGoogleDriveConfigured();

  const handleSelectUrl = (e) => {
    e.preventDefault();
    if (!imageUrl.trim()) {
      toast.error('Please enter an image URL.');
      return;
    }
    onSelectImage(imageUrl.trim());
    setImageUrl('');
    onClose();
  };

  const handleOpenGooglePicker = () => {
    if (!isConfigured) {
      toast.info('Google Drive API credentials are not set. Please use Image URL instead.');
      return;
    }

    // If Google Drive API script is loaded
    if (window.google && window.google.picker) {
      try {
        const view = new window.google.picker.View(window.google.picker.ViewId.DOCS_IMAGES);
        const picker = new window.google.picker.PickerBuilder()
          .enableFeature(window.google.picker.Feature.NAV_HIDDEN)
          .enableFeature(window.google.picker.Feature.MULTISELECT_ENABLED)
          .setAppId(GOOGLE_DRIVE_CONFIG.GOOGLE_APP_ID)
          .setDeveloperKey(GOOGLE_DRIVE_CONFIG.GOOGLE_API_KEY)
          .addView(view)
          .setCallback((data) => {
            if (data[window.google.picker.Response.ACTION] === window.google.picker.Action.PICKED) {
              const doc = data[window.google.picker.Response.DOCUMENTS][0];
              const driveUrl = doc[window.google.picker.Document.URL] || doc.thumbnails?.[0]?.url;
              if (driveUrl) {
                onSelectImage(driveUrl);
                toast.success('Selected image from Google Drive!');
                onClose();
              }
            }
          })
          .build();
        picker.setVisible(true);
      } catch (err) {
        console.error('Picker error:', err);
        toast.error('Could not open Google Picker. Please verify credentials.');
      }
    } else {
      toast.warning('Google Client libraries are not initialized. Use Image URL fallback.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#E5E5E5] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#064C32]/10 text-[#064C32] flex items-center justify-center">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-[#111111]">Select Product Image</h3>
            <p className="text-xs text-[#666666]">Add images via Google Drive or Direct URL</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#E5E5E5] mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('drive')}
            className={`pb-2.5 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'drive'
                ? 'border-[#064C32] text-[#064C32]'
                : 'border-transparent text-gray-400 hover:text-gray-700'
            }`}
          >
            <Cloud className="w-4 h-4" />
            <span>Google Drive</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`pb-2.5 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'url'
                ? 'border-[#064C32] text-[#064C32]'
                : 'border-transparent text-gray-400 hover:text-gray-700'
            }`}
          >
            <LinkIcon className="w-4 h-4" />
            <span>Direct Image URL</span>
          </button>
        </div>

        {activeTab === 'drive' ? (
          <div className="space-y-4">
            {!isConfigured ? (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Google Drive is not configured</span>
                </div>
                <p className="leading-relaxed">
                  Google Drive API credentials are not set in <code>src/config/googleDriveConfig.js</code>. You can easily use an <strong>Image URL</strong> instead!
                </p>
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab('url')}
                    className="inline-flex items-center gap-1 font-bold text-[#064C32] hover:underline"
                  >
                    <span>Switch to Image URL input →</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 space-y-3">
                <Cloud className="w-12 h-12 text-[#064C32] mx-auto" />
                <p className="text-xs text-[#666666]">
                  Click below to open your Google Drive and pick product photos.
                </p>
                <button
                  type="button"
                  onClick={handleOpenGooglePicker}
                  className="px-6 py-3 rounded-xl bg-[#064C32] hover:bg-[#033B27] text-white text-xs font-bold uppercase tracking-wider transition shadow"
                >
                  Open Google Drive Picker
                </button>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSelectUrl} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                Image Web URL
              </label>
              <input
                type="url"
                required
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setPreviewError(false);
                }}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#F8F8F8] border border-[#E5E5E5] text-xs text-[#111111] focus:outline-none focus:border-[#064C32]"
              />
            </div>

            {/* Instant Preview Box */}
            {imageUrl && !previewError && (
              <div className="p-3 bg-[#F8F8F8] rounded-xl border border-[#E5E5E5] flex items-center gap-3">
                <img
                  src={imageUrl}
                  alt="Preview"
                  onError={() => setPreviewError(true)}
                  className="w-16 h-16 object-cover rounded-lg border border-[#E5E5E5] shrink-0"
                />
                <div className="text-xs">
                  <span className="font-bold text-[#064C32] block">Preview Loaded</span>
                  <span className="text-[#666666] line-clamp-1">{imageUrl}</span>
                </div>
              </div>
            )}

            {previewError && (
              <p className="text-xs text-red-500">
                Could not load image from this URL. Please verify the link.
              </p>
            )}

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#064C32] hover:bg-[#033B27] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow transition"
              >
                Use This Image
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default GoogleDrivePickerModal;
