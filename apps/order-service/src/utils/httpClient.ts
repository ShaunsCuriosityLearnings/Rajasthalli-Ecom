export interface RetryOptions {
  retries?: number;
  delay?: number;
  maxDelay?: number;
}

/**
 * Perform a fetch request with exponential backoff retries.
 */
export async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retryOpts: RetryOptions = {}
): Promise<Response> {
  const retries = retryOpts.retries ?? 5;
  let delay = retryOpts.delay ?? 1000;
  const maxDelay = retryOpts.maxDelay ?? 10000;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) {
        return response;
      }
      // If server returns a 5xx error, retry it. Otherwise (like 4xx client errors), don't retry.
      if (response.status < 500) {
        return response;
      }
      throw new Error(`HTTP Error Status: ${response.status}`);
    } catch (error) {
      if (attempt === retries) {
        console.error(`[HTTP Client] Request failed after ${retries} attempts to ${url}:`, error);
        throw error;
      }
      console.warn(`[HTTP Client] Attempt ${attempt} failed to ${url}. Retrying in ${delay}ms... Error: ${(error as Error).message}`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay = Math.min(delay * 2, maxDelay);
    }
  }
  throw new Error("HTTP Client retry loop exited unexpectedly");
}

/**
 * Execute an HTTP call in the background without blocking the main request thread.
 * Logs any final failures.
 */
export function fireAndForget(
  url: string,
  options: RequestInit,
  retryOpts?: RetryOptions
): void {
  fetchWithRetry(url, options, retryOpts).catch((err) => {
    console.error(`[HTTP Client Background Failure] Permanent failure calling ${url}:`, err);
  });
}
