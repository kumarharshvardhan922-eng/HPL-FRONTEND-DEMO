import { ServiceError } from "../../types";

export function simulateLatency(minMs = 400, maxMs = 900): Promise<void> {
  const ms = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 5% simulated random failure switch if enabled
      if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_MOCK_ERRORS === "1") {
        if (Math.random() < 0.05) {
          return reject(new ServiceError("Simulated random network hiccup (NEXT_PUBLIC_MOCK_ERRORS=1)", "SIMULATED_FAILURE", 503));
        }
      }
      resolve();
    }, ms);
  });
}

export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

