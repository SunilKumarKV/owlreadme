const IS_DEV = typeof process !== 'undefined' && process.env.NODE_ENV !== 'production';

export const githubLogger = {
  info: (message: string, ...args: unknown[]) => {
    if (IS_DEV) {
      console.info(`[GitHub API Info] ${message}`, ...args);
    }
  },
  warn: (message: string, ...args: unknown[]) => {
    if (IS_DEV) {
      console.warn(`[GitHub API Warning] ${message}`, ...args);
    }
  },
  error: (message: string, ...args: unknown[]) => {
    if (IS_DEV) {
      console.error(`[GitHub API Error] ${message}`, ...args);
    }
  },
};
