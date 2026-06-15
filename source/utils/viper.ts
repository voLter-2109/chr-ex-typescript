import { GrabInfoMessage } from "../types/messages";
import { ImagePair, StorageSchema } from "../types/storage";

const excludeExts = ["gif"];

/**
 * Возвращает true, если url оканчивается на запрещённое расширение
 */
function hasExcludedExt(url: string, extensions: string[]): boolean {
  return extensions.some((ext) => url.toLowerCase().endsWith(`.${ext}`));
}

function fixImageUrl(imageSrc: string, index: number): string {
  // ШАГ 2: Остальная логика коррекции
  if (imageSrc.includes("/thumbs/")) {
    return imageSrc
      .replace("/thumbs/", "/images/")
      .replace("t1.", "img1.")
      .replace("t2.", "img2.");
  } else if (imageSrc.includes("/t/")) {
    return imageSrc.replace("/t/", "/i/");
  } else if (imageSrc.includes("/:small/")) {
    return imageSrc.replace("/:small/", "/:large/");
  } else if (imageSrc.includes("/th/")) {
    return `${imageSrc.replace("/th/", "/i/")}/babyblossom-${index < 10 ? "0" + index : index}.jpg`;
  }
  return imageSrc;
}

export default function getVipergirlsImages(props: GrabInfoMessage): {
  result: string;
  success: boolean;
  saveData: StorageSchema | null;
} {
  const { selector } = props;

  let images: HTMLImageElement[] = Array.from(
    document.querySelectorAll<HTMLImageElement>(selector),
  );

  if (!images.length) {
    images = Array.from(
      document.querySelectorAll<HTMLImageElement>("img"),
    ).filter((img) => img.closest('[id^="post_message_"]') !== null);
  }

  if (!images.length) {
    return {
      success: false,
      result: "image not found",
      saveData: null,
    };
  }

  const srcArr = [...new Set(images.map((i) => i.src))];
  const urls = srcArr.reduce<ImagePair[]>((acc, image, index) => {
    if (!hasExcludedExt(image, excludeExts)) {
      const newUrl = fixImageUrl(image, index);
      acc.push({ large: new URL(newUrl).href, small: image });
    }
    return acc;
  }, []);

  const saveData: StorageSchema = {
    ...props,
    imageUrls: urls,
  };

  return { success: true, result: "image save", saveData };
}
