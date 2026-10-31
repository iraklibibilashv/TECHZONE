
type ConfirmModalProps = {
  isOpen: boolean;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function ConfirmModal({
  isOpen,
  loading,
  onClose,
  onConfirm,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="w-full max-w-md rounded-3xl border border-white/10 bg-[#101622] p-7 shadow-2xl"
      >
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-3xl text-red-400">
          🗑
        </div>

        <h2
          id="confirm-title"
          className="text-2xl font-bold text-white"
        >
          Delete Review?
        </h2>

        <p className="mt-3 leading-relaxed text-gray-400">
          Are you sure you want to delete your review?
          This action cannot be undone.
        </p>

        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="rounded-xl border border-white/10 px-5 py-3 font-semibold text-gray-300 transition hover:bg-white/5 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-500 disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete Review"}
          </button>
        </div>
      </div>
    </div>
  );
}
