'use client';

import React from 'react';
import { Button } from '../ui/button';
import {
  CheckCircle2,
  FileEdit,
  Archive,
  Trash2,
  X,
  Loader2,
  Layers,
} from 'lucide-react';

export default function BulkActionBar({
  selectedCount = 0,
  onAction = () => {},
  onClearSelection = () => {},
  isProcessing = false,
  activeAction = '',
  extraActions = null,
  showDelete = true,
}) {
  if (selectedCount === 0) return null;

  return (
    <div className="sticky bottom-4 z-40 mx-auto max-w-3xl animate-in slide-in-from-bottom-3 duration-200">
      <div className="bg-slate-900/95 backdrop-blur-md text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700/60 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Count & Deselect */}
        <div className="flex items-center gap-2.5">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white shadow-xs">
            {selectedCount}
          </span>
          <span className="text-xs font-medium text-slate-200">
            {selectedCount === 1 ? '1 item selected' : `${selectedCount} items selected`}
          </span>
          <button
            onClick={onClearSelection}
            disabled={isProcessing}
            className="text-[11px] text-slate-400 hover:text-white underline ml-1"
          >
            Clear
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <Button
            size="sm"
            onClick={() => onAction('publish')}
            disabled={isProcessing}
            className="h-8 px-2.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs"
          >
            {isProcessing && activeAction === 'publish' ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            )}
            Publish
          </Button>

          <Button
            size="sm"
            onClick={() => onAction('unpublish')}
            disabled={isProcessing}
            className="h-8 px-2.5 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-lg shadow-xs"
          >
            {isProcessing && activeAction === 'unpublish' ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
            ) : (
              <FileEdit className="w-3.5 h-3.5 mr-1" />
            )}
            Unpublish
          </Button>

          <Button
            size="sm"
            onClick={() => onAction('archive')}
            disabled={isProcessing}
            className="h-8 px-2.5 text-xs font-semibold bg-slate-700 hover:bg-slate-600 text-white rounded-lg shadow-xs"
          >
            {isProcessing && activeAction === 'archive' ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
            ) : (
              <Archive className="w-3.5 h-3.5 mr-1" />
            )}
            Archive
          </Button>

          {extraActions}

          {showDelete && (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onAction('delete')}
              disabled={isProcessing}
              className="h-8 px-2.5 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs"
            >
              {isProcessing && activeAction === 'delete' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
              ) : (
                <Trash2 className="w-3.5 h-3.5 mr-1" />
              )}
              Delete
            </Button>
          )}

          <button
            onClick={onClearSelection}
            disabled={isProcessing}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-1"
            title="Deselect All"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

