export interface CustomData {}

export type ResponseData = {
  header: ResponseHeaderData;
  navigation: ResponseNavigationData;
  data?: CustomData;
};

export type ResponseHeaderData = {
  username?: string;
  role?: number;
  strategy: string;
};

export type ResponseNavigationData = {
  path?: string;
  pathArguments?: string[];
};
