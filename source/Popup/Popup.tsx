import type { FC } from "react";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import browser, { Tabs } from "webextension-polyfill";
import "../styles/global.css";
import {
  ExtensionMessage,
  GetPageInfoMessage,
  GrabImagesInfoMessage,
  GrabImagesResponseMessage,
  GrabInfo,
  PageInfo,
  PageInfoResponseMessage,
} from "../types/messages";
import { TabData, TMainDataProps } from "../types/popup";
import { ExportOptionKey, ExportOptions, TSaveImage } from "../types/storage";
import { ensureOnActiveTab } from "../utils/ensureContentScript";
import handleReloadTab from "../utils/handleReloadPage";
import openWebPage from "../utils/openNewTab";
import {
  clearAllStorage,
  getOptions,
  getSaveImageGallery,
} from "../utils/storage";
import { handleCopyUrls, notifyError, notifySuccess } from "../utils/toastify";
import { Button } from "./components/Button/Button";
import { TabInfo } from "./components/TabInfo/TabInfo";
import styles from "./Popup.module.scss";

// Note: browser.tabs.sendMessage() sends to content script in specific tab
// browser.runtime.sendMessage() sends to background script

const exportOptionsList: { key: ExportOptionKey; label: string }[] = [
  { key: "copyToClipboard", label: "Скопировать в буфер обмена" },
  { key: "downloadFile", label: "Скачать файл с ссылками" },
  {
    key: "noOpenOptionsPage",
    label: "Не открывать страницу галереи",
  },
];

const defaultExportOptions: ExportOptions = {
  copyToClipboard: false,
  downloadFile: false,
  noOpenOptionsPage: false,
};

const mainSiteDataFunction: TMainDataProps = {
  reactor: {
    title: "reactor",
    textButtom: "reactor",
    selector: ".post-content .image  img",
    closest: null,
  },
  viper: {
    title: "viper",
    textButtom: "viper",
    selector: "#photos a",
    closest: null,
  },
};

const mainOwerDataFunction: TMainDataProps = {
  selector: {
    title: "selector",
    textButtom: "JS selector",
    selector: "",
    closest: null,
  },
};

function isGrabImagesResponse(x: unknown): x is GrabImagesResponseMessage {
  return (
    !!x &&
    typeof x === "object" &&
    typeof (x as any).type === "string" &&
    typeof (x as any).data === "object"
  );
}

const Popup: FC = () => {
  const [tabInfo, setTabInfo] = useState<TabData | null>(null);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
  const [storage, setStorage] = useState<TSaveImage[] | null>(null);
  const [exportOptions, setExportOptions] =
    useState<ExportOptions>(defaultExportOptions);

  const arraySiteMainData = Object.values(mainSiteDataFunction);
  const arrayOwerMainData = Object.values(mainOwerDataFunction);

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
              console.log("PAGE_INFO_RESPONSE");
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
    getSaveImageGallery().then(setStorage);
    getOptions().then((res) => res && setExportOptions(res));
  }, []);

  function handleGrabImages({ siteName, selector }: GrabInfo) {
    ensureOnActiveTab()
      .then((res) => {
        if (res.ok && res.tab) {
          const { tab } = res;

          if (tab.id) {
            browser.tabs
              .sendMessage<GrabImagesInfoMessage>(tab.id, {
                type: "GRAB_IMAGES_INFO",
                data: {
                  selector,
                  siteName,
                  uuid: "",
                  title: tab.title || "Unknown",
                  tabUrl: tab.url || "Unknown",
                  faviconIconUrl: tab.favIconUrl || "",
                },
              })
              .then(async (response: unknown) => {
                if (!isGrabImagesResponse(response)) {
                  return notifyError(
                    (response as any)?.data?.result || "error",
                  );
                }
                console.log("response");
                console.log(response);
                const { type, data } = response;

                // Ранние выходы на неуспешные/неподходящие ответы
                if (type !== "GRAB_IMAGES_INFO_RESPONSE") {
                  return notifyError(data?.result || "error");
                }
                if (!data?.success || !data?.data?.imageUrls?.length) {
                  return notifyError(data?.result || "error");
                }

                console.log("GRAB_IMAGES_INFO_RESPONSE", response);

                if (exportOptions.copyToClipboard) {
                  handleCopyUrls(data.data.imageUrls.map((i) => i.large));
                }

                const optionsUrl = `/Options/options.html?tabUuid=${data.tabUuid}`;
                // Единая точка решения об открытии страницы
                if (
                  data.checkUnique
                    ? confirm(
                        "A post with such photos has already been saved, open a previously collected gallery?",
                      )
                    : !exportOptions.noOpenOptionsPage
                ) {
                  openWebPage(optionsUrl);
                }

                return true;
              })
              .catch((e) => {
                return console.error(e);
              });
          }

          return console.log("tab.id not found");
        }

        return notifyError("something strange");
      })
      .catch((e) => {
        return console.error(e);
      });

    return notifyError("well this is the end");
  }

  const handleChange =
    (option: ExportOptionKey) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setExportOptions((prev) => {
        const newOptions = {
          ...prev,
          [option]: e.target.checked,
        };
        browser.tabs
          .query({ active: true, currentWindow: true })
          .then((tabs) => {
            const tab = tabs[0];
            if (tab && tab.id) {
              browser.tabs.sendMessage<ExtensionMessage>(tab.id, {
                type: "SET_OPTIONS",
                data: newOptions,
              });
            }
          });

        return newOptions;
      });
    };

  return (
    <section className={styles.popup}>
      <header className={styles.header}>
        <h1 className={styles.title}>🦄 GraBber</h1>
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
      <div className={styles.options}>
        <details>
          <summary>
            <h3>Options</h3>
          </summary>
          {exportOptionsList.map(({ key, label }) => (
            <label key={key} style={{ display: "block", marginBottom: 8 }}>
              <input
                type="checkbox"
                checked={exportOptions[key]}
                onChange={handleChange(key)}
              />
              {label}
            </label>
          ))}
        </details>
      </div>

      {arrayOwerMainData.map((item, index) => {
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

      <details>
        <summary>
          <h3>ower website</h3>
        </summary>
        {arraySiteMainData.map((item, index) => {
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
      </details>
      
      <div className={styles.line} />
      <div className={styles.history}>
        <div>
          <h1 className={styles.title}>History</h1>
          <button
            className={styles.clearBtn}
            onClick={() => {
              clearAllStorage()
                .then(() => setStorage(null))
                .then(() => {
                  notifySuccess("success");
                });
            }}
          >
            <span>clear history</span>
          </button>
        </div>
        {storage &&
          storage.flatMap((recordObj) =>
            Object.entries(recordObj).map(([tabId, item]) => (
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
                    title={"open origin webpage"}
                  >
                    <span>origin</span>
                  </a>
                  <button
                    className={styles.historyBtn}
                    onClick={(): Promise<Tabs.Tab> =>
                      openWebPage(`/Options/options.html?tabUuid=${tabId}`)
                    }
                    title={"open gallery page"}
                  >
                    <span>gallery</span>
                  </button>
                  <button
                    className={styles.historyBtn}
                    onClick={() =>
                      handleCopyUrls(item.imageUrls.map((item) => item.large))
                    }
                    title={"copy urls array"}
                  >
                    <span>copy</span>
                  </button>
                  <button
                    className={styles.historyBtn}
                    onClick={() => {}}
                    title={"download urls file"}
                  >
                    <span>file</span>
                  </button>
                </div>
              </div>
            )),
          )}
      </div>
      <ToastContainer autoClose={3000} />
    </section>
  );
};

export default Popup;
