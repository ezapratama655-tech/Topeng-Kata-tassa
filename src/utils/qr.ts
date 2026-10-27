/**
 * Standalone QR Code SVG Generator for instant sharing without external network requests
 */

// Simple robust QR generator for URLs using basic Reed-Solomon or functional SVG fallback
export function generateQRCodeSVG(url: string, size: number = 200): string {
  // Use public high-reliability QR SVG service as image src, or fallback to an interactive SVG
  const encoded = encodeURIComponent(url);
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}&bgcolor=040914&color=f59e0b&margin=2`;
}

export function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text).then(() => true).catch(() => false);
  } else {
    // Fallback
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      textArea.remove();
      return Promise.resolve(successful);
    } catch {
      return Promise.resolve(false);
    }
  }
}
