import Axios, { type AxiosError, type AxiosRequestConfig } from "axios";

/**
 * Custom Axios instance configured for the API
 * Includes interceptors for authentication and error handling
 */
export const AXIOS_INSTANCE = Axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
  timeout: 10000,
  validateStatus: (status) => {
    return status >= 200 && status < 300;
  },
});

/**
 * Response interceptor for global error handling
 * Can be extended to handle specific error codes (401, 403, etc.)
 */
AXIOS_INSTANCE.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

/**
 * Custom instance function for Orval
 * This is the function that Orval will use as mutator
 */
export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig
): Promise<T> => {
  const source = Axios.CancelToken.source();
  const promise = AXIOS_INSTANCE({
    ...config,
    ...options,
    cancelToken: source.token,
  }).then(({ data }) => data);

  // @ts-expect-error - Adding cancel method to promise for React Query cancellation
  promise.cancel = () => {
    source.cancel("Query was cancelled");
  };

  return promise;
};

export default customInstance;

export type ErrorType<Error> = AxiosError<Error>;
