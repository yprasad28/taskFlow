import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

const inFlightRequests = new Map<string, Promise<unknown>>();

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

    if (config.method === "get") {
    const key = `${config.method}:${config.url}:${JSON.stringify(config.params || {})}`;
    if (inFlightRequests.has(key)) {
      config.signal = AbortSignal.timeout(0);
      const cfg = config as unknown as Record<string, unknown>;
      cfg._deduped = true;
      cfg._dedupKey = key;
    } else {
      inFlightRequests.set(key, Promise.resolve());
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    const config = response.config as unknown as Record<string, unknown>;
    if (config._dedupKey) {
      inFlightRequests.delete(config._dedupKey as string);
    } else if (response.config.method === "get") {
      const key = `${response.config.method}:${response.config.url}:${JSON.stringify(response.config.params || {})}`;
      inFlightRequests.delete(key);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (originalRequest?._deduped) {
      const key = originalRequest._dedupKey as string;
      inFlightRequests.delete(key);
      return Promise.reject(error);
    }

    if (originalRequest?.method === "get") {
      const key = `${originalRequest.method}:${originalRequest.url}:${JSON.stringify(originalRequest.params || {})}`;
      inFlightRequests.delete(key);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = document.cookie
          .split("; ")
          .find((row) => row.startsWith("refreshToken="))
          ?.split("=")[1];

        if (refreshToken) {
          const { data } = await axios.post(
            `${api.defaults.baseURL}/auth/refresh`,
            { refreshToken }
          );

          const newToken = data.data.token;
          setAccessToken(newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;

          return api(originalRequest);
        }
      } catch {
        setAccessToken(null);
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
