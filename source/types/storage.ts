export interface StorageSchema {
  title: string;
  tabUrl: string;
  faviconIconUrl: string;
  imageUrls: { large: string; small: string }[];
  tabId: number;
}

export const defaultStorage: Record<number, StorageSchema> = {
  0: {
    title: "",
    tabUrl: "",
    faviconIconUrl: "",
    imageUrls: [{ large: "", small: "" }],
    tabId: 0,
  },
};
