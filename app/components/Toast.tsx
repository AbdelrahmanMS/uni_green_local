import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { Icon } from "./Icon";

type ToastType = "success" | "error";
interface ToastItem {
  id: number;
  msg: string;
  type: ToastType;
}

interface ToastApi {
  success: (msg: string) => void;
  error: (msg: string) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const push = useCallback((msg: string, type: ToastType) => {
    const id = Date.now() + Math.random();
    setItems((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const api: ToastApi = {
    success: (msg) => push(msg, "success"),
    error: (msg) => push(msg, "error"),
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="fixed bottom-6 left-6 z-[9999] flex flex-col gap-2">
        {items.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm font-semibold shadow-lg ${
              t.type === "success"
                ? "border-green-300 bg-green-100 text-green-700"
                : "border-red-300 bg-red-100 text-red-600"
            }`}
          >
            <Icon name={t.type === "success" ? "check" : "close"} size={16} />
            {t.msg}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
