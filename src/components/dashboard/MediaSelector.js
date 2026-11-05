'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Image as ImageIcon,
  Upload,
  Search,
  X,
  Check,
  FileText,
  ExternalLink,
  Folder,
  Loader2,
  Trash2,
} from 'lucide-react';

export default function MediaSelector({
  value = '',
  onChange = () => {},
  label = 'Select Media',
  helperText = '',
  folder = 'products',
  accept = 'image/*',
  required = false,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [libraryFiles, setLibraryFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [activeTab, setActiveTab] = useState('library'); // 'library' | 'upload'
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (modalOpen) {
      fetchLibrary();
    }
  }, [modalOpen, selectedFolder, selectedType]);

  async function fetchLibrary() {
    try {
      setLoading(true);
      setErrorMsg('');
      const params = new URLSearchParams({
        limit: '60',
        search: search.trim(),
        type: selectedType,
        module: selectedFolder,
      });
      const res = await fetch(`/api/files?${params.toString()}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to load media');
      setLibraryFiles(json.data || []);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDirectUpload(file) {
    if (!file) return;
    try {
      setUploading(true);
      setErrorMsg('');
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', folder);

      const res = await fetch('/api/files/upload', {
        method: 'POST',
        body: fd,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || json.error || 'Upload failed');

      // Auto-select uploaded asset
      onChange(json.url);
      setModalOpen(false);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  const isImageFile = (url) => {
    if (!url || typeof url !== 'string') return false;
    return /\.(jpg|jpeg|png|webp|svg|gif|avif)(\?.*)?$/i.test(url) || url.includes('/image/upload/');
  };

  const isPdfFile = (url) => {
    if (!url || typeof url !== 'string') return false;
    return /\.pdf(\?.*)?$/i.test(url) || url.includes('/raw/upload/');
  };

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-xs font-semibold text-foreground flex items-center justify-between">
          <span>
            {label} {required && <span className="text-destructive">*</span>}
          </span>
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1 font-normal transition-colors"
            >
              <Trash2 className="w-3 h-3" /> Remove
            </button>
          )}
        </label>
      )}

      {/* Selected Value Preview or Trigger */}
      {value ? (
        <div className="flex items-center gap-3 p-3 bg-muted/40 border border-border rounded-xl">
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-background border border-border flex items-center justify-center shrink-0">
            {isImageFile(value) ? (
              <img src={value} alt="Preview" className="w-full h-full object-cover" />
            ) : isPdfFile(value) ? (
              <FileText className="w-8 h-8 text-rose-500" />
            ) : (
              <ImageIcon className="w-8 h-8 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-mono text-foreground truncate">{value}</p>
            <div className="flex items-center gap-2 mt-1">
              <a
                href={value}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                View Asset <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-muted-foreground">•</span>
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="text-xs text-primary font-medium hover:underline"
              >
                Change
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={() => setModalOpen(true)}
          className="border-2 border-dashed border-border hover:border-primary/60 rounded-xl p-4 text-center cursor-pointer transition-colors bg-muted/20 hover:bg-muted/40 flex flex-col items-center justify-center gap-2 group"
        >
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground">Select or Upload Media</p>
            <p className="text-[11px] text-muted-foreground">Click to browse media library or upload new asset</p>
          </div>
        </div>
      )}

      {helperText && <p className="text-[11px] text-muted-foreground">{helperText}</p>}

      {/* ── Media Selector Modal ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-background border border-border rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-primary" /> Media Asset Library
                </h3>
                <p className="text-xs text-muted-foreground">Select an existing asset or upload a new file</p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs & Search Filter Bar */}
            <div className="p-4 border-b border-border bg-muted/20 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={activeTab === 'library' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('library')}
                  className="text-xs h-8"
                >
                  Browse Library
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={activeTab === 'upload' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('upload')}
                  className="text-xs h-8"
                >
                  <Upload className="w-3.5 h-3.5 mr-1" /> Upload New
                </Button>
              </div>

              {activeTab === 'library' && (
                <div className="flex items-center gap-2 flex-1 max-w-md">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search assets..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && fetchLibrary()}
                      className="h-8 pl-8 text-xs"
                    />
                  </div>
                  <select
                    value={selectedFolder}
                    onChange={(e) => setSelectedFolder(e.target.value)}
                    className="h-8 px-2 text-xs border border-border rounded-md bg-background text-foreground"
                  >
                    <option value="all">All Folders</option>
                    <option value="products">Products</option>
                    <option value="categories">Categories</option>
                    <option value="blogs">Blogs</option>
                    <option value="resources">Resources</option>
                    <option value="manager">Manager</option>
                  </select>
                </div>
              )}
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 min-h-[300px]">
              {errorMsg && (
                <div className="mb-4 p-3 bg-destructive/10 text-destructive text-xs rounded-lg border border-destructive/20">
                  {errorMsg}
                </div>
              )}

              {activeTab === 'upload' ? (
                <div className="h-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-xl text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    {uploading ? <Loader2 className="w-8 h-8 animate-spin" /> : <Upload className="w-7 h-7" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Upload into folder: {folder}</h4>
                    <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                      Supports JPEG, PNG, WebP, SVG, and PDF documents up to 50MB. File signatures are strictly validated.
                    </p>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept={accept}
                    disabled={uploading}
                    onChange={(e) => handleDirectUpload(e.target.files?.[0])}
                    className="hidden"
                    id="media-selector-direct-input"
                  />
                  <Button
                    type="button"
                    disabled={uploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs"
                  >
                    {uploading ? 'Validating & Uploading...' : 'Select File from Device'}
                  </Button>
                </div>
              ) : loading ? (
                <div className="h-48 flex items-center justify-center text-muted-foreground text-xs gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" /> Loading media assets...
                </div>
              ) : libraryFiles.length === 0 ? (
                <div className="h-48 flex flex-col items-center justify-center text-muted-foreground text-xs gap-2 text-center">
                  <Folder className="w-8 h-8 opacity-40" />
                  <p>No media assets found matching the search criteria.</p>
                  <Button size="sm" variant="outline" onClick={() => setActiveTab('upload')} className="text-xs mt-2">
                    Upload your first asset
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {libraryFiles.map((file) => {
                    const isSelected = value === file.url;
                    return (
                      <div
                        key={file.id || file.url}
                        onClick={() => {
                          onChange(file.url);
                          setModalOpen(false);
                        }}
                        className={`group relative rounded-xl border p-2 cursor-pointer transition-all hover:shadow-md ${
                          isSelected
                            ? 'border-primary ring-2 ring-primary/20 bg-primary/5'
                            : 'border-border bg-card hover:border-primary/50'
                        }`}
                      >
                        <div className="aspect-square rounded-lg overflow-hidden bg-muted/30 border border-border/50 flex items-center justify-center mb-1.5 relative">
                          {isImageFile(file.url) ? (
                            <img
                              src={file.url}
                              alt={file.filename}
                              loading="lazy"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : isPdfFile(file.url) ? (
                            <div className="flex flex-col items-center justify-center p-2 text-center">
                              <FileText className="w-8 h-8 text-rose-500 mb-1" />
                              <span className="text-[10px] font-bold text-muted-foreground uppercase">{file.format || 'PDF'}</span>
                            </div>
                          ) : (
                            <ImageIcon className="w-8 h-8 text-muted-foreground opacity-60" />
                          )}

                          {isSelected && (
                            <div className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md">
                              <Check className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </div>

                        <p className="text-[11px] font-medium text-foreground truncate" title={file.filename}>
                          {file.filename}
                        </p>
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-0.5">
                          <span className="uppercase">{file.format}</span>
                          <span>{file.sizeBytes ? (file.sizeBytes / 1024).toFixed(0) + ' KB' : ''}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 border-t border-border bg-muted/10 flex items-center justify-between text-xs text-muted-foreground">
              <span>Showing {libraryFiles.length} asset(s)</span>
              <Button type="button" variant="outline" size="sm" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

