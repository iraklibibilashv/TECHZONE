
import type { ButtonHTMLAttributes, ReactNode } from "react";

type LoadingButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  loadingText?: string;
  children: ReactNode;
};

export default function LoadingButton({
  loading = false,
  loadingText = "Loading...",
  disabled,
  children,
  className = "",
  type = "button",
  ...props
}: LoadingButtonProps) {
  return (
    <button
      {...props}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading}
      className={`
        inline-flex items-center justify-center gap-3
        rounded-xl bg-blue-600 px-6 py-3.5
        font-semibold text-white
        transition-all duration-200
        hover:bg-blue-500
        active:scale-[0.98]
        disabled:cursor-not-allowed
        disabled:opacity-60
        ${className}
      `}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"
        />
      )}

      <span>{loading ? loadingText : children}</span>
    </button>
  );
}
