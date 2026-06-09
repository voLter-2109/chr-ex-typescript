export function delay(ms: number): Promise<void> {
  return new Promise((res) => setTimeout(res, ms));
}

// Проверяем, что по урлу реально изображение, а не редирект/ошибка
export async function isImageUrl(url: string): Promise<boolean> {
  try {
    const resp = await fetch(url, { credentials: "include", method: "HEAD" });
    const contentType = resp.headers.get("content-type") || "";
    return contentType.startsWith("image/");
  } catch {
    return false;
  }
}
