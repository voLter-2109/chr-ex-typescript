import { TMainSiteName } from "./popup";
import { ExportOptions, StorageSchema } from "./storage";

export interface PageInfo {
  url: string;
  title: string;
  wordCount: number;
  linkCount: number;
  imageCount: number;
}

export interface GrabInfo {
  selector: string;
  siteName: TMainSiteName;
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
  data: {
    result: string;
    tabUuid: string;
    success: boolean;
    checkUnique: boolean;
    data: StorageSchema | null;
  };
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
  total: number;
  finished: boolean;
  completed: number;
  errorUrl: string[];
}

export interface SetOptions {
  type: "SET_OPTIONS";
  data: ExportOptions;
}

export interface GetOptions {
  type: "GET_OPTIONS";
}

export interface Ping {
  type: "PING";
}

export interface Pong {
  type: "PONG";
}

export type ExtensionMessage =
  | GrabImagesResponseMessage
  | PageInfoResponseMessage
  | GrabImagesInfoMessage
  | StartDownloadBatch
  | GetPageInfoMessage
  | DowloadOneImage
  | OpenNewTab
  | SetOptions
  | GetOptions
  | Ping
  | Pong;
