/**
 * Clipboard utility functions
 * Provides wrapper for clipboard operations with error handling
 */

/**
 * Copy text to clipboard using the Clipboard API
 * @param text - The text to copy to clipboard
 * @returns Promise that resolves to true if successful, false otherwise
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!text) {
    return false;
  }

  try {
    // Check if Clipboard API is available
    if (!navigator.clipboard) {
      // Fallback for older browsers
      return fallbackCopyToClipboard(text);
    }

    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    // Try fallback method
    return fallbackCopyToClipboard(text);
  }
}

/**
 * Fallback method for copying text to clipboard
 * Uses the older document.execCommand approach
 * @param text - The text to copy to clipboard
 * @returns true if successful, false otherwise
 */
function fallbackCopyToClipboard(text: string): boolean {
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // Make the textarea invisible
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.setAttribute('readonly', '');
    textArea.setAttribute('aria-hidden', 'true');
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    
    return successful;
  } catch (error) {
    console.error('Fallback copy failed:', error);
    return false;
  }
}

/**
 * Check if clipboard copy functionality is supported
 * @returns true if clipboard API or fallback is available
 */
export function isCopySupported(): boolean {
  return !!(
    navigator.clipboard ||
    document.queryCommandSupported?.('copy')
  );
}
