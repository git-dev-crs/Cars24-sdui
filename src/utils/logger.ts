/**
 * Tiny tagged logger so perf/renderer logs are greppable in Metro
 * output without pulling in a logging library for a take-home.
 */
const TAG = '[Cars24SDUI]';

export const logger = {
  info: (msg: string, ...rest: unknown[]) => console.log(`${TAG} ${msg}`, ...rest),
  warn: (msg: string, ...rest: unknown[]) => console.log(`${TAG}[WARN] ${msg}`, ...rest),
  perf: (msg: string, ...rest: unknown[]) => console.log(`${TAG}[PERF] ${msg}`, ...rest),
};
