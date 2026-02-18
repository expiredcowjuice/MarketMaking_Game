'use client';

interface WarningModalProps {
  message: string;
  onClose: () => void;
}

export default function WarningModal({ message, onClose }: WarningModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
            <span className="text-amber-600 text-xl font-bold">!</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Trade Blocked</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">{message}</p>
        <button
          onClick={onClose}
          className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
        >
          OK
        </button>
      </div>
    </div>
  );
}
