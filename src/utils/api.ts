import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

export const EXPRESS_LOCAL_URL = "http://localhost:3004/";
export const EXPRESS_PROD_URL = "https://api.vencura.xyz/";
export const EXPRESS_BASE_URL =
  publicRuntimeConfig.appEnvironment === "development"
    ? EXPRESS_LOCAL_URL
    : EXPRESS_PROD_URL;

const EXPRESS_DEFAULT_HEADERS = {
  Accept: "application/json",
  "Content-Type": "application/json", // Add this line
};

type RequestOptions = {
  headers?: { [key: string]: string };
  body?: string;
};

const request = async (
  url: string,
  method: "GET" | "POST",
  options?: RequestOptions,
  credentials?: boolean
) => {
  let attempt = 0;
  while (true) {
    try {
      attempt++;

      console.log("REQUEST", {
        env: publicRuntimeConfig.appEnvironment,
        baseUrl: EXPRESS_BASE_URL,
        url,
        method,
        options,
        body: options?.body,
      });

      const response = await fetch(url, {
        mode: "cors",
        headers: options?.headers,
        method: method ?? "GET",
        body: options?.body,
        credentials: credentials ? "include" : "omit",
      } as any);
      if (response.status === 401) {
        console.log("Unauthorized");
        attempt = 4;
        return response;
      }
      const data = await response.json();
      return data;
    } catch (ex) {
      if (attempt > 6) {
        throw ex;
      }
      const size = 1000;
      const backoff = attempt * 2 * size + Math.random() * size * 0.1;
      await new Promise((resolve) => setTimeout(resolve, backoff));
    }
  }
};

const mergeExpressHeaders = (options?: RequestOptions) => ({
  ...EXPRESS_DEFAULT_HEADERS,
  ...options?.headers,
});

const api = {
  get: async <T>(url: string, options?: RequestOptions): Promise<T> =>
    request(
      EXPRESS_BASE_URL + url,
      "GET",
      {
        ...options,
        headers: mergeExpressHeaders(options),
      },
      true
    ),
  post: async <T>(
    url: string,
    options?: RequestOptions,
    noDefaultHeaders?: boolean
  ): Promise<T> =>
    request(
      EXPRESS_BASE_URL + url,
      "POST",
      {
        ...options,
        headers: noDefaultHeaders ? {} : mergeExpressHeaders(options),
      },
      true
    ),
};

export default api;
