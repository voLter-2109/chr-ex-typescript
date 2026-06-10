import browser from "webextension-polyfill";
import {
  ExtensionMessage,
  GrabImagesResponseMessage,
  PageInfo,
  PageInfoResponseMessage,
} from "../types/messages";
import getGrabImage from "../utils/getGrabImage";
import { setStorage } from "../utils/storage";

// Collect page information (word count, links, images)
function getPageInfo(): PageInfo {
  const bodyText = document.body?.innerText || "";
  const wordCount = bodyText
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
  const linkCount = document.querySelectorAll("a").length;
  const imageCount = document.querySelectorAll("img").length;

  return {
    url: window.location.href,
    title: document.title,
    wordCount,
    linkCount,
    imageCount,
  };
}

// Listen for messages from popup or background
browser.runtime.onMessage.addListener(async (message: unknown) => {
  try {
    const msg = message as ExtensionMessage;

    if (msg.type === "GET_PAGE_INFO") {
      const res: PageInfoResponseMessage = {
        type: "PAGE_INFO_RESPONSE",
        data: getPageInfo(),
      };
      return res;
    }

    if (msg.type === "SET_OPTIONS") {
      await setStorage({ options: msg.data });
    }

    if (msg.type === "GRAB_IMAGES_INFO") {
      const result = getGrabImage(msg.data);
      if (result.success && result.saveData) {
        await setStorage({ saveImage: { [msg.data.tabId]: result.saveData } });
      }

      const res: GrabImagesResponseMessage = {
        type: "GRAB_IMAGES_INFO_RESPONSE",
        data: {
          success: result.success,
          result: result.result,
          tabId: result.saveData?.tabId || null,
          data: result.saveData || null,
        },
      };
      return res;
    }

    // Важно! Возвращайте пустой объект для "чужих" сообщений
    // чтобы polyfill не считал обработчик "молчащий"
    return {};
  } catch (err) {
    // Всегда ЛОГГИРУЙТЕ ошибки
    console.error("runtime.onMessage error in contentScript:", err);
    throw err; // Можно вернуть Promise.reject(err), если нужен специальный ответ
  }
});

// Log when content script loads (if logging is enabled)

console.log(
  "[Web Extension Starter] Content script loaded on:",
  window.location.href,
);
