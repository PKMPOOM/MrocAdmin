import merge from "lodash/merge";
import { isObject } from "lodash";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { axiosInstance } from "./axiosInstance";
import useSWR from "swr";

export class appAPI {
  baseURL: `/${string}`;
  constructor(baseURL: `/${string}`) {
    this.baseURL = baseURL;
  }

  get = <T = any | undefined>(
    url?: `/${string}` | null,
    shouldFetch: boolean = true
  ) => {
    if (url === undefined) {
      return useSWR<T>(() => (shouldFetch ? this.baseURL : null));
    }
    return useSWR<T>(() => (shouldFetch ? this.baseURL + url : null));
  };

  basicFetch = <T = any>(url?: `/${string}` | null): Promise<T> => {
    if (url === undefined) {
      return fetchGET(this.baseURL);
    }
    return fetchGET(this.baseURL + url);
  };

  post = <T = any>(
    url: `/${string}` | null,
    body: any,
    queryString?: `?${string}`,
    httpOptions?: AxiosRequestConfig
  ): Promise<T> => {
    let newUrl = this.baseURL;
    if (url !== null) {
      newUrl += url;
    }

    return fetchPOST(newUrl, body, queryString, httpOptions);
  };

  put = <T = any>(
    url: `/${string}` | null,
    body: any,
    queryString?: `?${string}`,
    httpOptions?: AxiosRequestConfig<any> | undefined,
    otherOptions?: any
  ): Promise<T> => {
    let newUrl = this.baseURL;
    if (url !== null) {
      newUrl += url;
    }
    return fetchPUT(newUrl, body, queryString, httpOptions, otherOptions);
  };

  delete = <T = any>(
    url: `/${string}` | null,
    body?: any,
    queryString?: `?${string}`,
    httpOptions?: AxiosRequestConfig<any> | undefined,
    otherOptions?: any
  ): Promise<T> => {
    let newUrl = this.baseURL;
    if (url !== null) {
      newUrl += url;
    }

    return fetchDELETE(newUrl, body, queryString, httpOptions, otherOptions);
  };
}

let BaseUrl =
  location.hostname === "localhost" || location.hostname === "127.0.0.1"
    ? import.meta.env.VITE_API_URL // base url from env file
    : "";

axios.defaults.withCredentials = true;

export function setBaseUrl(baseUrl: string) {
  BaseUrl = baseUrl;
}

const jsonDefaultOptions = {
  contentType: "application/json; charset=utf-8",
  dataType: "json",
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
};

const getPromises: { [key: string]: any } = {};

export async function fetchGET(
  url: string,
  queryString?: `?${string}`,
  httpOptions?: AxiosRequestConfig<any>,
  otherOptions?: any
) {
  url = buildUrl(url, queryString);

  const useCache = otherOptions?.useCache || false;

  if (useCache) {
    if (getPromises[url]) {
      return await getPromises[url];
    }
  }

  const promise = wrappedFetch("get", url, null, httpOptions, otherOptions);

  if (useCache) {
    getPromises[url] = promise;
  }

  const result = await promise;
  return result;
}

export function buildUrl(url: string, queryString?: string) {
  if (queryString !== null && queryString !== undefined) {
    if (typeof queryString === "object") {
      queryString = new URLSearchParams(queryString).toString();
    }

    if (!queryString.startsWith("?")) {
      queryString = "?" + queryString;
    }
  } else {
    queryString = "";
  }

  return url + queryString;
}

export async function fetchPOST(
  url: string,
  body: any,
  queryString?: `?${string}`,
  httpOptions?: AxiosRequestConfig<any>,
  otherOptions?: any
) {
  url = buildUrl(url, queryString);

  const res = await wrappedFetch("post", url, body, httpOptions, otherOptions);
  return res;
}

export async function fetchPUT(
  url: string,
  body: any,
  queryString?: `?${string}`,
  httpOptions?: AxiosRequestConfig<any> | undefined,
  otherOptions?: any
) {
  url = buildUrl(url, queryString);

  const res = await wrappedFetch("put", url, body, httpOptions, otherOptions);
  return res;
}

export async function fetchDELETE(
  url: string,
  body?: any,
  queryString?: `?${string}`,
  httpOptions?: AxiosRequestConfig<any> | undefined,
  otherOptions?: any
) {
  url = buildUrl(url, queryString);

  const res = wrappedFetch("delete", url, body, httpOptions, otherOptions);

  return res;
}

type fetchMethod = "get" | "post" | "put" | "delete";

export async function wrappedFetch<T>(
  method: fetchMethod,
  url: string,
  body: any,
  httpOptions: AxiosRequestConfig<any> | undefined,
  otherOptions: any
): Promise<AxiosResponse<T, any> | T | any> {
  let moreHttpOptions;
  if (
    body !== undefined &&
    body !== null &&
    !(body instanceof FormData) &&
    isObject(body)
  ) {
    moreHttpOptions = jsonDefaultOptions;
  }

  httpOptions = merge(
    {
      body,
    },
    moreHttpOptions,
    httpOptions
  );

  if (BaseUrl && !url.startsWith("/")) {
    url = "/" + url;
  }

  // ! Wrapfetch is edited to use axiosInstance that have Bearer Token auth header
  const response = await axiosInstance[method]<T>(
    BaseUrl + url,
    body,
    httpOptions
  );

  if (response.status >= 400) {
    throw new Error(
      `could not fetch URL '${url}' [${response.status}] - ${response.statusText}\n\n${response.data}`
    );
  }

  if (otherOptions?.raw) {
    return response;
  } else {
    return response.data;
  }
}
