import browser from "webextension-polyfill";
import {
  ExportOptions,
  StorageSchema,
  TSaveImage,
  TSetStorage,
} from "../types/storage";

export async function setStorage({
  options,
  saveImage,
}: TSetStorage): Promise<void> {
  const toSet: {
    options?: ExportOptions;
    saveImage?: TSaveImage[];
  } = {};

  if (options) {
    toSet.options = options;
  }

  if (saveImage) {
    // Получаем текущие saveImage
    const result = await browser.storage.local.get("saveImage");
    const currentArr: TSaveImage[] = Array.isArray(result.saveImage)
      ? result.saveImage
      : [];

    // Добавляем новый объект к массиву
    toSet.saveImage = [...currentArr, saveImage];
  }

  if (Object.keys(toSet).length > 0) {
    await browser.storage.local.set(toSet);
  }
}

/**
 * Получить данные по ключу 'options' или 'saveImage'.
 */
export async function getStorage(
  key: "options",
): Promise<ExportOptions | undefined>;
export async function getStorage(
  key: "saveImage",
): Promise<TSaveImage[] | undefined>;
export async function getStorage(key: "options" | "saveImage") {
  const result = await browser.storage.local.get(key);
  console.log(result[key]);
  return result[key];
}

/**
 * Полная очистка storage.
 */
export async function clearAllStorage(): Promise<void> {
  await browser.storage.local.clear();
}

/**
 * Получить только те изображения, где хотя бы 2 imageUrls (по заданию).
 */
export async function handleStorageChanged() {
  const res = await getStorage("saveImage");
  if (!res) return []; // если хранилище пустое

  return res.filter((recordObj) =>
    Object.values(recordObj).some((value) => value.imageUrls.length > 1),
  );
}

export async function getOptions() {
  const res = await getStorage("options");
  if (!res) return null; // если хранилище пустое

  return res;
}

/**
 * Найти объект по tabId среди сохранённых в saveImage
 * @param tabId - число-ключ поиска
 * @returns StorageSchema или undefined
 */
export async function getSaveImageByTabId(
  tabId: number,
): Promise<StorageSchema | undefined> {
  const arr = await browser.storage.local.get("saveImage");

  // Гарантия, что если поле не найдено или не массив — будет пустой массив.
  const saveImageArr: TSaveImage[] = Array.isArray(arr.saveImage)
    ? arr.saveImage
    : [];

  const tabIdKey = Number(tabId);

  for (const recordObj of saveImageArr) {
    // доступ по строковому ключу!
    if (recordObj.hasOwnProperty(tabIdKey)) {
      return recordObj[tabIdKey];
    }
  }
  return undefined;
}
