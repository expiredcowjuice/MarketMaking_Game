'use client';

interface WarningModalProps {
  message: string;
  onClose: () => void;
}

export default function WarningModal({ message, onClose }: WarningModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 vc-backdrop flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl p-7 w-full max-w-sm vc-modal" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-vc-yellow/20 rounded-full flex items-center justify-center shrink-0">
            <span className="text-[#b8a900] text-xl font-black">!</span>
          </div>
          <h3 className="text-lg font-bold text-vc-dark">Trade Blocked</h3>
        </div>
        <p className="text-sm text-gray-500 mb-5 leading-relaxed">{message}</p>
        <button
          onClick={onClose}
          className="w-full py-2.5 bg-vc-dark text-white rounded-xl text-sm font-semibold hover:bg-black transition-colors vc-btn"
        >
          OK
        </button>
      </div>
    </div>
  );
}
