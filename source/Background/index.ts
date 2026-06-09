import browser from "webextension-polyfill";
import { DownloadBatch, ExtensionMessage } from "../types/messages";
import { delay, isImageUrl } from "../utils/utilsForMassDownload";

browser.runtime.onInstalled.addListener((): void => {
  console.log("Extension installed");
});

// Listen for messages from popup or content scripts
browser.runtime.onMessage.addListener(async (message: unknown) => {
  const msg = message as ExtensionMessage;
  console.log(msg);
  if (msg.type === "OPEN_NEW_TAB" && msg.data) {
    console.log(msg);
    return browser.tabs.create({ url: browser.runtime.getURL(msg.data) });
  }

  if (msg.type === "DOWNLOAD_ONE_IMAGE" && msg.url) {
    try {
      await browser.downloads.download({ url: msg.url, saveAs: false }); // await если ты в async
    } catch (e: any) {
      // Это нормальная “ошибка пользователя”
      if (e && typeof e.message === "string" && e.message === "USER_CANCELED") {
        // Пользователь отменил или выбрал "открыть", "показать в папке"
        // Можно ничего не делать, чтобы не засорять логи
        // console.warn('Пользователь отменил повторную загрузку');
      } else {
        // Все остальные ошибки — логируем или уведомляем пользователя
        console.warn("Ошибка скачивания файла", msg.url, e && e.message);
      }
    }
  }

  if (msg.type === "START_DOWNLOAD_BATCH" && Array.isArray(msg.urls)) {
    let completed = 0;
    const errorUrl: string[] = [];
    const total = msg.urls.length;

    for (const url of msg.urls) {
      try {
        // Ключевой момент: фильтруем только изображения!
        const isImage = await isImageUrl(url);
        if (!isImage) {
          console.warn("Пропущено: не изображение или недоступно —", url);
          errorUrl.push(url);
          continue;
        }

        await browser.downloads.download({
          url,
          conflictAction: "uniquify",
          saveAs: false,
        });
      } catch (e: any) {
        // Нормальная ошибка: пользователь отменил
        if (
          e &&
          typeof e.message === "string" &&
          e.message === "USER_CANCELED"
        ) {
          // Игнорируем
        } else {
          // Прочие ошибки можно залоггировать
          console.warn("Ошибка скачивания файла", url, e && e.message);
        }
      } finally {
        completed++;
        // Сообщаем о прогрессе UI
        browser.runtime.sendMessage<DownloadBatch>({
          type: "DOWNLOAD_PROGRESS",
          completed,
          total,
          errorUrl,
          finished: false,
        });
        // Задержка между скачками
        await delay(850);
      }
    }

    // Сообщаем об окончании пачки
    browser.runtime.sendMessage<DownloadBatch>({
      type: "DOWNLOAD_PROGRESS",
      completed: total,
      total,
      errorUrl,
      finished: true,
    });
  }

  return undefined;
});
