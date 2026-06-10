/**
 * Копирует массив ссылок в буфер обмена (по одной на строку)
 */
export async function copyUrlsToClipboard(urls: string[]): Promise<boolean> {
  const text = urls.join("\n");
  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    // сделать элемент невидимым
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const successful = document.execCommand("copy");
    document.body.removeChild(textarea);
    return successful;
  } catch (err) {
    console.error(err);
    return false;
  }
}
