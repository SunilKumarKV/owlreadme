const isDev = process.env.NODE_ENV === 'development';

export const logger = {
  debug: (message: string, ...args: unknown[]): void => {
    if (isDev) {
      console.log(`[API CLIENT DEBUG] ${message}`, ...args);
    }
  },
  info: (message: string, ...args: unknown[]): void => {
    if (isDev) {
      console.info(`[API CLIENT INFO] ${message}`, ...args);
    }
  },
  warn: (message: string, ...args: unknown[]): void => {
    if (isDev) {
      console.warn(`[API CLIENT WARN] ${message}`, ...args);
    }
  },
  error: (message: string, ...args: unknown[]): void => {
    if (isDev) {
      console.error(`[API CLIENT ERROR] ${message}`, ...args);
    }
  },
};

