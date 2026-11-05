'use client';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, AlertTriangle, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function Toast({ toasts = [], onRemove }) {
  useEffect(() => {
    if (toasts.length === 0) return;
    
    // If a new toast is added while one exists, dismiss the older ones
    if (toasts.length > 1) {
      toasts.slice(0, -1).forEach(t => onRemove(t.id));
      return;
    }

    const t = setTimeout(() => onRemove(toasts[0].id), 3000);
    return () => clearTimeout(t);
  }, [toasts, onRemove]);

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={cn(
              "pointer-events-auto flex items-center justify-between gap-3 w-80 p-4 rounded-lg shadow-lg border",
              t.type === 'success' && "bg-green-600 border-green-700 text-white",
              t.type === 'error' && "bg-destructive border-destructive text-destructive-foreground",
              t.type === 'warning' && "bg-yellow-500 border-yellow-600 text-white",
              (!t.type || t.type === 'default') && "bg-popover border-border text-popover-foreground"
            )}
          >
            <div className="flex items-center gap-3">
              {t.type === 'success' && <CheckCircle2 className="w-5 h-5" />}
              {t.type === 'error' && <XCircle className="w-5 h-5" />}
              {t.type === 'warning' && <AlertTriangle className="w-5 h-5" />}
              <p className="text-sm font-medium">{t.message}</p>
            </div>
            <button
              onClick={() => onRemove(t.id)}
              className="text-current opacity-70 hover:opacity-100 transition-opacity focus:outline-none"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
