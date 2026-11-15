import { BASEAPIURL, USERTOKEN } from "../constant";
import { clearUserData } from "../features/auth/authSlice";
import store from "../store/store";

type ApiOption = {
  url: string;
  data?: unknown;
  headersOption?: {
    isAuthorization?: boolean;
  };
  signal?: AbortSignal;
  timeout?: number;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export type ApiResponse<T> = {
  message: string;
  data: T;
};

async function requestAPI<T>(
  method: string,
  option: ApiOption
): Promise<T> {
  const token = localStorage.getItem(USERTOKEN);

  const headers: Record<string, string> = {};

  if (option.data !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (option.headersOption?.isAuthorization && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(BASEAPIURL + option.url, {
    method,
    headers,
    body: option.data === undefined
      ? undefined
      : JSON.stringify(option.data),
    signal: AbortSignal.any([
      ...(option.signal ? [option.signal] : []),
      AbortSignal.timeout(option.timeout ?? 15000),
    ])
  });

  const body: unknown = await res.json().catch(() => null);

  if (!res.ok) {
    const message =
      typeof body === "object" &&
      body !== null &&
      "message" in body &&
      typeof body.message === "string"
        ? body.message
        : `Request failed (${res.status})`;

    if (res.status === 401 && option.headersOption?.isAuthorization) {
        localStorage.removeItem(USERTOKEN);
        store.dispatch(clearUserData());

        if (window.location.pathname !== "/login") {
          window.location.replace("/login");
        }
    }

    throw new ApiError(message, res.status);
  }

  return body as T;
}

export const getAPI = <T>(option: ApiOption) =>
  requestAPI<T>("GET", option);

export const postAPI = <T>(option: ApiOption) =>
  requestAPI<T>("POST", option);

export const putAPI = <T>(option: ApiOption) =>
  requestAPI<T>("PUT", option);

export const patchAPI = <T>(option: ApiOption) =>
  requestAPI<T>("PATCH", option);

export const deleteAPI = <T>(option: ApiOption) =>
  requestAPI<T>("DELETE", option);