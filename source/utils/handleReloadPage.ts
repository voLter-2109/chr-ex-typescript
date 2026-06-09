import browser from "webextension-polyfill";

const handleReloadTab = async (): Promise<void> => {
  const tabs = await browser.tabs.query({
    active: true,
    currentWindow: true,
  });
  const tab = tabs[0];
  if (tab?.id) {
    await browser.tabs.reload(tab.id);
  }
};

export default handleReloadTab;
