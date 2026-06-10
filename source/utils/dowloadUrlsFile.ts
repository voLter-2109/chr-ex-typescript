/**
 * Сохраняет массив ссылок как .txt файл для gallery-dl
 */
export function downloadUrlsFile(
  urls: string[],
  filename = "gallery_urls.txt",
): void {
  const text = urls.join("\n");
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
