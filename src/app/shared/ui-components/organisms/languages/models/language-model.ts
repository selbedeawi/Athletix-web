export interface AccountLanguages {
  languageIds: number[];
  otherLanguages: string;
  languages?: {
    id: number;
    name: string;
  }[];
}
