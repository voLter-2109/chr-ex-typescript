import { v4 as uuidv4 } from "uuid";
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
export async function saveIfUnique(
  saveData: StorageSchema,
): Promise<{ saveData: StorageSchema; checkUnique: boolean }> {
  const incomingImages = saveData.imageUrls;

  // 1) Получаем уже сохранённые данные
  const saved = await getSaveImageGallery();

  // 2) Ищем совпадение по набору imageUrls (без учёта порядка)
  for (const recordObj of saved) {
    for (const value of Object.values(recordObj)) {
      const existingImages = value?.imageUrls ?? [];
      if (imagesEqual(existingImages, incomingImages)) {
        return { saveData: value, checkUnique: true }; // совпадение найдено — не сохраняем
      }
    }
  }

  const uuid = uuidv4();

  // 3) Совпадений нет — сохраняем 1
  await setStorage({
    saveImage: { [uuid]: { ...saveData, uuid: uuid } },
  });

  return { saveData: saveData, checkUnique: false };
}
