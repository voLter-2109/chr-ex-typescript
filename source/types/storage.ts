export interface StorageSchema {
  title: string;
  tabUrl: string;
  faviconIconUrl: string;
  imageUrls: { large: string; small: string }[];
  tabId: number;
}

export type ExportOptionKey =
  | "copyToClipboard"
  | "downloadFile"
  | "noOpenOptionsPage";

export type ExportOptions = Record<ExportOptionKey, boolean>;

export type TSaveImage = Record<number, StorageSchema>;

export type TSetStorage = {
  options?: ExportOptions;
  saveImage?: TSaveImage ;
};
