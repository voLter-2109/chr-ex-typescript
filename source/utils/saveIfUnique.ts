import { ImagePair, StorageSchema } from "../types/storage";
import { getSaveImageGallery, setStorage } from "./storage";

// Преобразуем массив пар в отсортированный список токенов для сравнения без учёта порядка
function toSortedTokens(arr: ImagePair[] = []): string[] {
  return arr
    .map(({ large, small }) => `${large}||${small}`)
    .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
}

// Полное равенство наборов изображений (как мультимножества): порядок не важен, длины должны совпадать
function imagesEqual(a: ImagePair[] = [], b: ImagePair[] = []): boolean {
  if (a.length !== b.length) return false;
  const A = toSortedTokens(a);
  const B = toSortedTokens(b);
  for (let i = 0; i < A.length; i++) {
    if (A[i] !== B[i]) return false;
  }
  return true;
}

/**
 * Сохраняет данные в storage, если среди уже сохранённых нет полного совпадения по imageUrls.
 * @param payload объект вида { [tabUuid]: saveData }
 * @returns true — если сохранили; false — если нашли совпадение и не сохраняли.
 */
export async function saveIfUnique(payload: {
  uuid: string;
  saveData: StorageSchema;
}): Promise<boolean> {
  const { saveData, uuid } = payload;
  const incomingImages = saveData.imageUrls;

  // 1) Получаем уже сохранённые данные
  const saved = await getSaveImageGallery();

  // 2) Ищем совпадение по набору imageUrls (без учёта порядка)
  for (const recordObj of saved) {
    for (const value of Object.values(recordObj)) {
      const existingImages = value?.imageUrls ?? [];
      if (imagesEqual(existingImages, incomingImages)) {
        return false; // совпадение найдено — не сохраняем
      }
    }
  }

  // 3) Совпадений нет — сохраняем
  await setStorage({
    saveImage: { [uuid]: saveData },
  });

  return true;
}
