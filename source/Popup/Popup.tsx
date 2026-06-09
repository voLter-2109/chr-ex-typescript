import type { FC } from "react";
import { useEffect, useState } from "react";
import browser, { Tabs } from "webextension-polyfill";
import "../styles/global.css";
import { TMainDataProps } from "../types/mainButton";
import {
  GetPageInfoMessage,
  GrabImagesInfoMessage,
  GrabImagesResponseMessage,
  GrabInfo,
  PageInfo,
  PageInfoResponseMessage,
} from "../types/messages";
import { StorageSchema } from "../types/storage";
import handleReloadTab from "../utils/handleReloadPage";
import openWebPage from "../utils/openNewTab";
import { clearAllStorage, handleStorageChanged } from "../utils/storage";
import { Button } from "./components/Button/Button";
import { TabInfo } from "./components/TabInfo/TabInfo";
import styles from "./Popup.module.scss";

// Note: browser.tabs.sendMessage() sends to content script in specific tab
// browser.runtime.sendMessage() sends to background script

interface TabData {
  title: string;
  url: string;
  favIconUrl?: string;
}

const mainDataFunction: TMainDataProps = {
  reactor: {
    title: "reactor",
    textButtom: "reactor",
    selector: ".post-content .image  img",
    closest: null,
  },
  viper: {
    title: "viper",
    textButtom: "viper",
    selector: "blockquote img",
    closest: ['[id^="post_message_"]'],
  },
  selector: {
    title: "selector",
    textButtom: "JS selector",
    selector: "",
    closest: null,
  },
};

const Popup: FC = () => {
  const [tabInfo, setTabInfo] = useState<TabData | null>(null);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
  const [resultGrab, setResultGrab] = useState<string>("");
  const [storage, setStorage] = useState<[string, StorageSchema][] | null>(
    null,
  );
  const arrayMainData = Object.values(mainDataFunction);

  useEffect(() => {
    // Get current tab info
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      const tab = tabs[0];
      if (tab) {
        setTabInfo({
          title: tab.title || "Unknown",
          url: tab.url || "Unknown",
          favIconUrl: tab.favIconUrl,
        });

        // Request page info from content script
        if (tab.id) {
          browser.tabs
            .sendMessage<GetPageInfoMessage>(tab.id, { type: "GET_PAGE_INFO" })
            .then((response: unknown) => {
              const res = response as PageInfoResponseMessage;
              console.log(res);
              if (res.type === "PAGE_INFO_RESPONSE" && res?.data) {
                setPageInfo(res.data);
              }
            })
            .catch(() => {
              // Content script might not be injected on this page
            });
        }
      }
    });
  }, []);

  useEffect(() => {
    handleStorageChanged().then(setStorage);

    browser.storage.onChanged.addListener(handleStorageChanged);

    // Отписка на размонтирование
    return () => {
      browser.storage.onChanged.removeListener(handleStorageChanged);
    };
  }, []);

  function handleGrabImages({ siteName, selector }: GrabInfo) {
    console.log(siteName);
    browser.tabs
      .query({ active: true, currentWindow: true })
      .then((tabs) => {
        const tab = tabs[0];
        if (tab && tab.id) {
          browser.tabs
            .sendMessage<GrabImagesInfoMessage>(tab.id, {
              type: "GRAB_IMAGES_INFO",
              data: {
                selector,
                siteName,
                tabId: tab.id,
                title: tab.title || "Unknown",
                tabUrl: tab.url || "Unknown",
                faviconIconUrl: tab.favIconUrl || "",
              },
            })
            .then((response: unknown) => {
              const res = response as GrabImagesResponseMessage;
              console.log(res);
              if (res.type === "GRAB_IMAGES_INFO_RESPONSE" && res?.data) {
                setResultGrab(res.data.result);
                handleStorageChanged();
                openWebPage(`/Options/options.html?TabId=${res.data.tabId}`);
              }
            });
        }
      })
      .catch((err) => {
        console.log("sendMessage error:", err);
      });
  }

  return (
    <section className={styles.popup}>
      <header className={styles.header}>
        <h1 className={styles.title}>IMAGE GRAB</h1>
      </header>
      <div className={styles.line} />
      {tabInfo && (
        <div className={styles.tabCard}>
          <TabInfo
            title={tabInfo.title}
            url={tabInfo.url}
            favIconUrl={tabInfo.favIconUrl}
            onReload={handleReloadTab}
          />
        </div>
      )}
      {/* Page Stats from Content Script */}
      {pageInfo && (
        <div className={styles.statsCard}>
          <h3 className={styles.statsTitle}>Page Stats</h3>
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{pageInfo.wordCount}</span>
              <span className={styles.statLabel}>Words</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{pageInfo.linkCount}</span>
              <span className={styles.statLabel}>Links</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{pageInfo.imageCount}</span>
              <span className={styles.statLabel}>Images</span>
            </div>
          </div>
        </div>
      )}
      <span> Result:{resultGrab}</span>
      {arrayMainData.map((item, index) => {
        return (
          <Button
            key={`mainButtom-${index}`}
            onClick={() => {
              handleGrabImages({
                siteName: item.title,
                selector: item.selector,
              });
            }}
            title={item.title}
          >
            {item.textButtom}
          </Button>
        );
      })}
      <div className={styles.line} />
      <div className={styles.history}>
        <div>
          <h1 className={styles.title}>History</h1>
          <button
            className={styles.clearBtn}
            onClick={() => {
              clearAllStorage().then(() => setStorage(null));
            }}
          >
            <span>clear history</span>
          </button>
        </div>
        {storage &&
          storage.map(([tabId, item]) => (
            <div key={tabId} className={styles.main}>
              <div className={styles.infoBlock}>
                <img src={item.faviconIconUrl} alt={item.title} />
                <span>{item.title}</span>
              </div>
              <div className={styles.btnBlock}>
                <a
                  className={styles.historyBtn}
                  href={item.tabUrl}
                  target="_blank"
                >
                  <span>visit page</span>
                </a>
                <button
                  className={styles.historyBtn}
                  onClick={(): Promise<Tabs.Tab> =>
                    openWebPage(`/Options/options.html?TabId=${tabId}`)
                  }
                >
                  <span>open gallary</span>
                </button>
              </div>
            </div>
          ))}
      </div>
    </section>
  );
};

export default Popup;
