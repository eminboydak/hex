/**
 * Client-side image resize helper for island components.
 * Resizes images to maxEdge (default 1600px) and converts to WebP.
 */

/**
 * Resize an image file to maxEdge and convert to WebP.
 * @param file - The image file to resize
 * @param maxEdge - Maximum dimension (width or height)
 * @param quality - WebP quality (0-1)
 * @returns Promise resolving to the WebP blob
 */
export async function resizeToWebp(
  file: File,
  maxEdge = 1600,
  quality = 0.82
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }

    img.onload = () => {
      let { width, height } = img;

      // Resize if either dimension exceeds maxEdge
      if (width > maxEdge || height > maxEdge) {
        if (width > height) {
          height = (height / width) * maxEdge;
          width = maxEdge;
        } else {
          width = (width / height) * maxEdge;
          height = maxEdge;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Draw image to canvas
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to WebP blob
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to create blob'));
            return;
          }
          resolve(blob);
        },
        'image/webp',
        quality
      );
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    // Load image from file
    const reader = new FileReader();
    reader.onload = () => {
      img.src = reader.result as string;
    };
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    reader.readAsDataURL(file);
  });
}