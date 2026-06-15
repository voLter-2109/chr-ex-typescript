export type TMainSiteName = "reactor" | "viper" | "selector";

export type TMainDataProps = Partial<
  Record<
    TMainSiteName,
    {
      selector: string;
      textButtom: string;
      title: TMainSiteName;
      closest: string[] | null;
    }
  >
>;

export interface TabData {
  url: string;
  title: string;
  favIconUrl?: string;
}
