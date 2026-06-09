import browser, { Tabs } from "webextension-polyfill";

export default function openWebPage(url: string): Promise<Tabs.Tab> {
  return browser.tabs.create({ url });
}
