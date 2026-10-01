/**
 * BIYA FASHION - Image Processing Utility
 * 
 * Handles client-side multi-image reading, auto-resizing, and compression.
 * Allows merchants to upload multiple high-res phone/camera photos directly
 * into the catalog without exceeding browser localStorage limits.
 */

export const compressImageFile = (file, maxWidth = 1200, maxHeight = 1200, quality = 0.85) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      return reject(new Error('Selected file is not an image.'));
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;

        // Proportional resize if larger than maximum bounds
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        // Clean white background for transparent PNGs converted to JPEG
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Compress to efficient JPEG data URL
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.onerror = () => reject(new Error(`Failed to load image: ${file.name}`));
      img.src = event.target.result;
    };
    reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));
    reader.readAsDataURL(file);
  });
};

/**
 * Process multiple files simultaneously
 */
export const processMultipleImageFiles = async (fileList) => {
  const files = Array.from(fileList || []).filter((f) => f.type.startsWith('image/'));
  if (files.length === 0) return [];

  const results = [];
  for (const file of files) {
    try {
      const compressed = await compressImageFile(file);
      results.push(compressed);
    } catch (err) {
      console.error('Failed to compress image:', file.name, err);
    }
  }
  return results;
};

/**
 * Converts Google Drive share links into direct viewable image URLs
 * Examples:
 * https://drive.google.com/file/d/1XyZ12345/view?usp=sharing -> https://lh3.googleusercontent.com/d/1XyZ12345
 * https://drive.google.com/open?id=1XyZ12345 -> https://lh3.googleusercontent.com/d/1XyZ12345
 */
export const normalizeGoogleDriveUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();

  // Pattern 1: /file/d/FILE_ID
  const matchFileD = trimmed.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i);
  if (matchFileD && matchFileD[1]) {
    return `https://drive.google.com/thumbnail?id=${matchFileD[1]}&sz=w1200`;
  }

  // Pattern 2: id=FILE_ID
  const matchId = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/i);
  if (matchId && matchId[1] && (trimmed.includes('drive.google.com') || trimmed.includes('googleusercontent.com'))) {
    return `https://drive.google.com/thumbnail?id=${matchId[1]}&sz=w1200`;
  }

  // Pattern 3: lh3.googleusercontent.com/d/FILE_ID
  const matchLh3 = trimmed.match(/lh3\.googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/i);
  if (matchLh3 && matchLh3[1]) {
    return `https://drive.google.com/thumbnail?id=${matchLh3[1]}&sz=w1200`;
  }

  return trimmed;
};

