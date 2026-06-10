import { useEffect, useState, type FC } from "react";
import browser from "webextension-polyfill";
import {
  CloseIcon,
  DowloadMore,
  DowloadOne,
  FilterError,
  ToggleSelect,
} from "../components/ImageCard/icons";
import ImageCard from "../components/ImageCard/ImageCard";
import "../styles/global.css";
import {
  DowloadOneImage,
  DownloadBatch,
  StartDownloadBatch,
} from "../types/messages";
import { StorageSchema } from "../types/storage";
import { getSaveImageByTabId } from "../utils/storage";
import styles from "./Options.module.scss";

const Options: FC = () => {
  const params = new URLSearchParams(window.location.search);
  const tabId = params.get("TabId");

  const [errorUrls, setErrorUrls] = useState<string[] | null>(null);
  const [filterErrorUrls, setFilterErrorUrls] = useState<boolean>(false);
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);
  const [openImage, setOpenImage] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<StorageSchema | undefined>(
    undefined,
  );

  const [downloadCount, setDownloadCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleBatchDownload = (urls: string[]) => {
    browser.runtime.sendMessage<StartDownloadBatch>({
      type: "START_DOWNLOAD_BATCH",
      urls: urls,
    });
  };

  const toogleFilterErrorUrls = () => {
    setFilterErrorUrls((prev) => !prev);
  };

  const handleCloseImage = () => {
    setOpenImage(null);
  };

  const handleOpenImage = (url: string) => {
    setOpenImage(url);
  };

  const handleDownload = (url: string) => {
    browser.runtime.sendMessage<DowloadOneImage>({
      type: "DOWNLOAD_ONE_IMAGE",
      url,
    });
  };

  const toggleSelect = (url: string) => {
    setSelectedUrls(
      (prev) =>
        prev.includes(url)
          ? prev.filter((u) => u !== url) // убрать если уже был
          : [...prev, url], // добавить, если не был
    );
  };

  const toggleSelectAll = () => {
    if (!imageUrl?.imageUrls) return;

    if (selectedUrls.length === imageUrl.imageUrls.length) {
      // ВСЕ выбраны — снимаем всё выделение
      setSelectedUrls([]);
    } else {
      // Не все выбраны — выделяем все (уникальные)
      setSelectedUrls([...imageUrl.imageUrls.map((item) => item.large)]);
    }
  };

  const isErrorUrl = (
    errorUrls: string[] | null,
    urlLarge: string,
  ): boolean => {
    if (!errorUrls) return false;
    return errorUrls.includes(urlLarge);
  };

  useEffect(() => {
    if (!tabId) return;
    getSaveImageByTabId(Number(tabId)).then((res) => {
      if (res) setImageUrl(res);
    });
  }, [tabId]);

  useEffect(() => {
    function onMsg(onMsg: unknown) {
      const mes = onMsg as DownloadBatch;

      if (mes.type === "DOWNLOAD_PROGRESS") {
        console.log(mes);
        setDownloadCount(mes.completed);
        setTotalCount(mes.total);
        setIsDownloading(!mes.finished);

        if (!mes.finished) {
          setErrorUrls(mes.errorUrl);
          setSelectedUrls([]);
        }
      }
    }

    browser.runtime.onMessage.addListener(onMsg);
    return () => browser.runtime.onMessage.removeListener(onMsg);
  }, []);

  if (!imageUrl) return <p>изображений не найдено</p>;

  const getFilteredImages = (
    all: StorageSchema | undefined,
    errorUrls: string[] | null,
    filter: boolean,
  ) => {
    if (!all || !all.imageUrls) return [];
    if (filter && errorUrls?.length) {
      const errorSet = new Set(errorUrls);
      return all.imageUrls.filter((img) => errorSet.has(img.large));
    }
    return all.imageUrls;
  };

  const filteredImages = getFilteredImages(
    imageUrl,
    errorUrls,
    filterErrorUrls,
  );

  return (
    <div className={styles.options}>
      <header className={styles.header}>
        <ul className={styles.selectInformation}>
          <li>Select image:</li>
          <li>{selectedUrls.length}</li>
          <li>/</li>
          <li>{imageUrl.imageUrls.length}</li>
        </ul>
        {errorUrls && !isDownloading && (
          <div className={styles.errorBlock}>
            <div>
              <span>Error:</span>
              {errorUrls.length}
            </div>
            <FilterError
              className={styles.filterError}
              title={filterErrorUrls ? "hide" : "show"}
              color={
                filterErrorUrls
                  ? "var(--color-accent-pink)"
                  : "var(--color-black)"
              }
              onClick={toogleFilterErrorUrls}
            >
              show Error
            </FilterError>
          </div>
        )}
        {isDownloading && (
          <>
            {downloadCount} \ {totalCount}
          </>
        )}
        <a
          href={imageUrl.tabUrl}
          className={styles.originSite}
          title="open origin site"
        >
          <img src={imageUrl.faviconIconUrl} />
        </a>
        <div className={styles.btnBlock}>
          <ToggleSelect
            title="select all"
            className={styles.btnAllDownload}
            onClick={toggleSelectAll}
          />
          <DowloadMore
            title="download image"
            className={styles.btnAllDownload}
            onClick={() => {
              handleBatchDownload(selectedUrls);
            }}
          />
        </div>
      </header>
      <div className={styles.main}>
        {filteredImages.map((item) => {
          const { large, small } = item;
          return (
            <ImageCard
              selected={selectedUrls.includes(large)}
              handleDownload={handleDownload}
              key={small}
              urlSmall={small}
              urlLarge={large}
              error={isErrorUrl(errorUrls, large)}
              openZoom={handleOpenImage}
              handleSelectImage={toggleSelect}
            />
          );
        })}
      </div>
      {openImage && (
        <div
          className={styles.override}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCloseImage();
            }
          }}
        >
          <CloseIcon
            className={styles.close}
            title="close"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                handleCloseImage();
              }
            }}
          />
          <img src={openImage} />

          <DowloadOne
            title="download image"
            className={styles.btnDownload}
            onClick={() => {
              handleDownload(openImage);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Options;
