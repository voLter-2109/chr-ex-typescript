import { TMainSiteName } from "./mainButton";
import { StorageSchema } from "./storage";

export interface PageInfo {
  url: string;
  title: string;
  wordCount: number;
  linkCount: number;
  imageCount: number;
}

export interface GrabInfo {
  siteName: TMainSiteName;
  selector: string;
}

export interface GrabInfoMessage
  extends Omit<StorageSchema, "imageUrls">, GrabInfo {}

// Messages
export interface GetPageInfoMessage {
  type: "GET_PAGE_INFO";
}

export interface PageInfoResponseMessage {
  type: "PAGE_INFO_RESPONSE";
  data: PageInfo;
}

export interface GrabImagesInfoMessage {
  type: "GRAB_IMAGES_INFO";
  data: GrabInfoMessage;
}

export interface GrabImagesResponseMessage {
  type: "GRAB_IMAGES_INFO_RESPONSE";
  data: { success: boolean; result: string; tabId: number | null };
}

export interface OpenNewTab {
  type: "OPEN_NEW_TAB";
  data: string;
}

export interface DowloadOneImage {
  type: "DOWNLOAD_ONE_IMAGE";
  url: string;
}

export interface StartDownloadBatch {
  type: "START_DOWNLOAD_BATCH";
  urls: string[];
}

export interface DownloadBatch {
  type: "DOWNLOAD_PROGRESS";
  completed: number;
  total: number;
  finished: boolean;
  errorUrl: string[];
}

export type ExtensionMessage =
  | GetPageInfoMessage
  | PageInfoResponseMessage
  | GrabImagesInfoMessage
  | GrabImagesResponseMessage
  | OpenNewTab
  | DowloadOneImage
  | StartDownloadBatch;
