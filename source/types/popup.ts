export type TMainSiteName = "reactor" | "viper" | "selector";

export type TMainDataProps = Record<
  TMainSiteName,
  {
    title: TMainSiteName;
    textButtom: string;
    selector: string;
    closest: string[] | null;
  }
>;

export interface TabData {
  title: string;
  url: string;
  favIconUrl?: string;
}
