export async function copyTextToClipboard(text: string): Promise<void> {
  let clipboardError: unknown;
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch (error) {
      clipboardError = error;
    }
  }

  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.setAttribute('readonly', '');
  textArea.style.position = 'fixed';
  textArea.style.opacity = '0';
  document.body.appendChild(textArea);

  try {
    textArea.focus();
    textArea.select();
    textArea.setSelectionRange(0, textArea.value.length);
    if (typeof document.execCommand !== 'function' || !document.execCommand('copy')) {
      const reason = clipboardError instanceof Error ? ` ${clipboardError.message}` : '';
      throw new Error(`Clipboard access is unavailable.${reason}`);
    }
  } finally {
    textArea.remove();
  }
}
