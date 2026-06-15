export type ImagePair = { large: string; small: string };

export interface StorageSchema {
  tabId: number;
  title: string;
  tabUrl: string;
  faviconIconUrl: string;
  imageUrls: ImagePair[];
}

export type ExportOptionKey =
  | "downloadFile"
  | "copyToClipboard"
  | "noOpenOptionsPage";

export type ExportOptions = Record<ExportOptionKey, boolean>;

export type TSaveImage = Record<string, StorageSchema>;

export type TSetStorage = {
  saveImage?: TSaveImage;
  options?: ExportOptions;
};
