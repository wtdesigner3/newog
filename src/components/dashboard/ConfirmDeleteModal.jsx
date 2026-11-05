import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Deletion",
  message = "Are you sure you want to delete this record? This action cannot be undone.",
  isDeleting = false,
  confirmText = "Delete",
  loadingText = "Deleting..."
}) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isDeleting && onClose()}>
      <DialogContent className="max-w-md p-6">
        <DialogHeader className="flex flex-col items-center text-center sm:text-center sm:items-center">
          <div className="w-14 h-14 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center mb-4 shadow-inner">
            <AlertTriangle className="w-7 h-7 text-red-400" />
          </div>
          <DialogTitle className="text-xl font-bold !text-white">{title}</DialogTitle>
          <p className="text-slate-300 text-sm mt-2 leading-relaxed">
            {message}
          </p>
        </DialogHeader>
        <DialogFooter className="flex gap-3 justify-center sm:justify-center w-full mt-6 border-t border-slate-800 pt-5">
          <Button 
            variant="outline" 
            onClick={onClose} 
            disabled={isDeleting}
            className="flex-1 rounded-full font-medium bg-slate-800/80 text-slate-200 border-slate-700 hover:bg-slate-700 hover:text-white transition-colors"
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={onConfirm} 
            disabled={isDeleting}
            className="flex-1 rounded-full font-medium bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20 active:scale-95 transition-transform"
          >
            {isDeleting ? loadingText : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
