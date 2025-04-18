'use client';

interface DeleteEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  eventName: string;
  loading: boolean;
}

export function DeleteEventDialog({
  isOpen,
  onClose,
  onConfirm,
  eventName,
  loading
}: DeleteEventDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#262b36] rounded-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-4">Delete Event</h2>
        <p className="text-gray-300 mb-6">
          Are you sure you want to delete &quot;{eventName}&quot;? This action cannot be undone.
        </p>
        
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-gray-300 hover:text-white transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Deleting...' : 'Delete Event'}
          </button>
        </div>
      </div>
    </div>
  );
}