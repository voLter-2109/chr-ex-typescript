import { GrabInfoMessage } from "../types/messages";
import getVipergirlsImages from "./viper";

export default function getGrabImage(props: GrabInfoMessage) {
  const { siteName } = props;
  if (siteName === "viper") {
    return getVipergirlsImages(props);
  }

  return {
    success: false,
    result: "image not found",
    saveData: null,
  };
}
