import { AxiosRequestConfig, Method } from "axios";
import mustache from "mustache";

export const templateString = function (
  s: string | undefined,
  context: { [k: string]: any }
): string {
  return mustache.render(s || "", context);
};

export const templateRequest = function (
  c: AxiosRequestConfig,
  context: { [k: string]: any }
): AxiosRequestConfig {
  const options: AxiosRequestConfig = {
    method: templateString(c.method as string, context) as Method,
    headers: c.headers,
    url: templateString(c.url!, context),
    data: templateString(c.data, context),
  };
  return { ...c, ...options } as AxiosRequestConfig;
};
