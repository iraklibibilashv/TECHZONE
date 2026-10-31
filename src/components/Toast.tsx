
import { useEffect } from "react";

export type ToastType = "success" | "error" | "info";

export type ToastData = {
  id: number;
  type: ToastType;
  title: string;
  message: string;
};

type ToastProps = {
  toast: ToastData | null;
  onClose: () => void;
};

export default function Toast({ toast, onClose }: ToastProps) {
  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(onClose, 3000);

    return () => window.clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const styles = {
    success: {
      border: "border-emerald-500/30",
      icon: "✓",
      iconColor: "text-emerald-400",
    },
    error: {
      border: "border-red-500/30",
      icon: "!",
      iconColor: "text-red-400",
    },
    info: {
      border: "border-blue-500/30",
      icon: "i",
      iconColor: "text-blue-400",
    },
  };

  const style = styles[toast.type];

  return (
    <div
      role={toast.type === "error" ? "alert" : "status"}
      className={`fixed right-4 top-20 z-[200] w-[calc(100%-2rem)] max-w-sm
        animate-[slideIn_0.3s_ease-out] rounded-2xl border
        bg-[#101622] p-4 text-white shadow-2xl
        ${style.border}`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`flex h-9 w-9 shrink-0 items-center
            justify-center rounded-full bg-white/5 text-xl
            font-bold ${style.iconColor}`}
        >
          {style.icon}
        </span>

        <div className="min-w-0 flex-1">
          <p className="font-semibold">{toast.title}</p>
          <p className="mt-1 text-sm text-gray-400">
            {toast.message}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close notification"
          className="text-xl text-gray-500 hover:text-white"
        >
          ×
        </button>
      </div>

      <div
        key={toast.id}
        className="absolute bottom-0 left-0 h-1 w-full
          origin-left animate-[shrink_3s_linear_forwards]
          rounded-b-2xl bg-blue-500"
      />
    </div>
  );
}
