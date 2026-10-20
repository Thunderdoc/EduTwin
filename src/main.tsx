// Ensure localStorage works safely even inside strict cross-origin preview iframes
(function ensureSafeLocalStorage() {
  try {
    const testKey = "__edutwin_storage_test__";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
  } catch {
    const store = new Map<string, string>();
    const memoryStorage: Storage = {
      get length() {
        return store.size;
      },
      clear() {
        store.clear();
      },
      getItem(key: string) {
        return store.has(key) ? store.get(key)! : null;
      },
      key(index: number) {
        return Array.from(store.keys())[index] ?? null;
      },
      removeItem(key: string) {
        store.delete(key);
      },
      setItem(key: string, value: string) {
        store.set(key, String(value));
      },
    };
    try {
      Object.defineProperty(window, "localStorage", {
        value: memoryStorage,
        configurable: true,
      });
    } catch {
      // Ignore if non-configurable
    }
  }
})();

import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(<App />);
