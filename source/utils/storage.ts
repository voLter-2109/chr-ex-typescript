import browser from "webextension-polyfill";
import { defaultStorage, StorageSchema } from "../types/storage";

export async function setStorage(
  items: Record<number, StorageSchema>,
): Promise<void> {
  return await browser.storage.local.set(items);
}

export async function getAllStorage(): Promise<Record<number, StorageSchema>> {
  const result = await browser.storage.local.get(null);

  return {
    ...defaultStorage,
    ...result,
  };
}

export async function clearAllStorage(): Promise<void> {
  await browser.storage.local.clear();
}

export async function handleStorageChanged() {
  const res = await getAllStorage();
  return Object.entries(res).filter(([, value_1]) => {
    return value_1.imageUrls.length > 1;
  });
}
