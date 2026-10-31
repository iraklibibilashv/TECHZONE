type ButtonSpinnerProps = {
  size?: "sm" | "md";
};

export default function ButtonSpinner({ size = "sm" }: ButtonSpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block shrink-0 animate-spin rounded-full border-2 border-white/30 border-t-white ${
        size === "sm" ? "h-4 w-4" : "h-5 w-5"
      }`}
    />
  );
}
