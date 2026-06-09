import { DowloadOne, SelectImage } from "./icons";
import styles from "./imageCard.module.scss";

type Props = {
  error: boolean;
  urlLarge: string;
  urlSmall: string;
  selected?: boolean;
  openZoom: (url: string) => void;
  handleDownload: (url: string) => void;
  handleSelectImage: (url: string) => void;
};

const ImageCard = ({
  error,
  selected,
  urlSmall,
  urlLarge,
  openZoom,
  handleDownload,
  handleSelectImage,
}: Props) => {
  return (
    <div className={styles.cardItem}>
      <img
        className={styles.image}
        src={urlSmall}
        alt={urlSmall}
        onClick={() => openZoom(urlLarge)}
      />
      <div className={styles.btnBlock}>
        <SelectImage
          className={styles.btnDownload}
          title="select image"
          color={selected ? "var(--color-accent-pink)" : "var(--color-black)"}
          onClick={() => handleSelectImage(urlLarge)}
        />
        {error && <h1 className={styles.error}>Error</h1>}
        <DowloadOne
          title="download image"
          className={styles.btnDownload}
          onClick={() => {
            handleDownload(urlLarge);
          }}
        />
      </div>
    </div>
  );
};

export default ImageCard;
