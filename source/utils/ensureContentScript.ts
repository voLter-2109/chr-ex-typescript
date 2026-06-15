// src/utils/ensureContentScript.ts
import browser, { Tabs } from "webextension-polyfill";
import { Ping, Pong } from "../types/messages";
import { notifyError } from "./toastify";

export type EnsureOptions = {
  // Путь(и) к собранному контент-скрипту в пакете расширения (от корня сборки)
  files?: string[]; // по умолчанию: ['content/content.js']
  // Таймаут ожидания ответа на пинг
  timeoutMs?: number; // по умолчанию: 1500
  // Какое сообщение слать для пинга
  pingMessage?: Ping; // по умолчанию: { type: 'PING' }
};

// Распознаём типичные ошибки отсутствия получателя
function isNoReceiverError(err: unknown): boolean {
  const msg = String((err as any)?.message ?? err ?? "");
  return (
    msg.includes("Receiving end does not exist") ||
    msg.includes("Could not establish connection") ||
    msg.includes("The message port closed before a response was received")
  );
}

// Пинг контент-скрипта с таймаутом
async function ping(
  tabId: number,
  msg: Ping,
  timeoutMs: number,
): Promise<boolean> {
  try {
    const res = await Promise.race([
      browser.tabs.sendMessage(tabId, msg),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("PING_TIMEOUT")), timeoutMs),
      ),
    ]);
    // Ожидаем { type: 'PONG' }
    return (res as Pong).type === "PONG";
  } catch (e) {
    if (isNoReceiverError(e)) return false;
    // Любую другую ошибку пробрасываем — это помогает не маскировать реальные проблемы
    throw e;
  }
}

/**
 * Проверяет наличие контент-скрипта в табе "пингом".
 * Если не отвечает — инжектит files и повторно пингует.
 * Возвращает true, если получили PONG.
 */
export async function ensureContentScript(
  tabId: number,
  opts: EnsureOptions = {},
): Promise<boolean> {
  const {
    files = ["assets/js/contentScript.bundle.js"],
    timeoutMs = 1500,
    pingMessage = { type: "PING" },
  } = opts;

  // Первый пинг
  const pong = await ping(tabId, pingMessage, timeoutMs);
  if (pong) return true;

  // Инъекция и повторный пинг
  await browser.scripting.executeScript({
    target: { tabId },
    files,
  });

  return ping(tabId, pingMessage, timeoutMs);
}

/**
 * Утилита: гарантирует наличие контент-скрипта и отправляет основное сообщение.
 * Удобно вызывать прямо перед работой.
 */
export async function ensureAndSend<TReq = any, TRes = any>(
  tabId: number,
  message: TReq,
  opts?: EnsureOptions,
): Promise<TRes> {
  const ok = await ensureContentScript(tabId, opts);
  if (!ok) {
    throw new Error("Content script is not available after injection attempt");
  }
  return browser.tabs.sendMessage(tabId, message) as Promise<TRes>;
}

/**
 * Пример: обеспечить контент-скрипт на активной вкладке.
 */
export async function ensureOnActiveTab(
  opts?: EnsureOptions,
): Promise<{ ok: boolean; tab?: Tabs.Tab }> {
  const tab = await browser.tabs.query({ active: true, currentWindow: true });

  if (!tab[0] || !tab[0].id) return { ok: false };

  const url = tab[0].url ?? "";
  if (
    /^(chrome|browser|edge|about|view-source|devtools|chrome-extension):/i.test(
      url,
    ) ||
    /chromewebstore\.google\.com/i.test(url)
  ) {
    notifyError("This page does not allow content scripts to run");
    return { ok: false };
  }

  const ok = await ensureContentScript(tab[0].id, opts);
  return { ok, tab: tab[0] };
}
