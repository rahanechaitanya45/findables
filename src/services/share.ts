import { Product } from '../types';

export interface ShareResult {
  success: boolean;
  method: 'native' | 'clipboard' | 'fallback' | 'aborted' | 'error';
  message: string;
}

/**
 * Triggers toast notification across the app
 */
export function triggerToast(message: string, duration = 3000): void {
  if (typeof window === 'undefined') return;
  const event = new CustomEvent('findables-toast', {
    detail: { message, duration },
  });
  window.dispatchEvent(event);
}

/**
 * Shares an affiliate product via Web Share API or Clipboard fallback.
 * Formats a clean deal description and deep link.
 */
export async function shareProduct(
  product: Product,
  pageLocation = 'share'
): Promise<ShareResult> {
  if (typeof window === 'undefined') {
    return { success: false, method: 'error', message: 'Window not defined' };
  }

  // Construct canonical direct product URL on Findables
  const baseUrl = window.location.origin;
  const productUrl = `${baseUrl}/product/${product.id}`;
  
  // Format engaging share text
  const discountText = product.discountPercent ? ` (${product.discountPercent}% OFF)` : '';
  const priceText = `₹${product.currentPrice.toLocaleString('en-IN')}`;
  const shareText = `Check out this deal on ${product.title} for ${priceText}${discountText} on Findables!`;

  const shareData = {
    title: `${product.title} | Findables`,
    text: shareText,
    url: productUrl,
  };

  // 1. Try Native Web Share API (mobile phones, tablets, modern browsers)
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share(shareData);
      triggerToast('Shared deal successfully! 🎉');
      return { success: true, method: 'native', message: 'Shared via device share menu' };
    } catch (err: any) {
      if (err.name === 'AbortError') {
        // User closed share dialog intentionally, don't show copy fallback
        return { success: false, method: 'aborted', message: 'Share cancelled' };
      }
      // If native share failed for another reason, fallback to clipboard
    }
  }

  // 2. Clipboard API Fallback
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(productUrl);
      triggerToast('Deal link copied to clipboard! Share with friends 📋');
      return { success: true, method: 'clipboard', message: 'Link copied to clipboard' };
    }
  } catch {
    // Continue to legacy fallback
  }

  // 3. Legacy Textarea Copy Fallback
  try {
    const textArea = document.createElement('textarea');
    textArea.value = productUrl;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);

    if (successful) {
      triggerToast('Deal link copied to clipboard! Share with friends 📋');
      return { success: true, method: 'fallback', message: 'Link copied to clipboard' };
    }
  } catch (err) {
    console.error('Copy fallback failed:', err);
  }

  triggerToast(`Share URL: ${productUrl}`, 4000);
  return { success: false, method: 'error', message: 'Unable to copy link automatically' };
}
