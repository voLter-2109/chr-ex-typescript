import { toast } from "react-toastify";
import { copyUrlsToClipboard } from "./copyUrlsClipboard";

export const notifySuccess = (str: string) => toast.success(`🦄${str}`);
export const notifyError = (str: string) => toast.error(`😲${str}`);

export const handleCopyUrls = (arrayUrls: string[]) => {
  copyUrlsToClipboard(arrayUrls).then((res) => {
    return res ? notifySuccess("success") : notifyError("Something went wrong");
  });
};
