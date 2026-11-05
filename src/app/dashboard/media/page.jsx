'use client';

import React, { useState, useEffect, useRef } from 'react';
import Breadcrumb from '../../../components/dashboard/Breadcrumb';
import Toast from '../../../components/dashboard/Toast';
import ConfirmDeleteModal from '../../../components/dashboard/ConfirmDeleteModal';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../../components/ui/dialog';
import {
  Search,
  UploadCloud,
  Copy,
  Trash2,
  Image as ImageIcon,
  FileText,
  CheckCircle2,
  Grid,
  List,
  Upload,
  Folder,
  Video,
  Filter,
  Eye,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  RefreshCw,
  Info,
  Loader2,
  X,
} from 'lucide-react';

export default function MediaLibraryPage() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [storageSource, setStorageSource] = useState('local');
  const [toasts, setToasts] = useState([]);
  const [copiedUrl, setCopiedUrl] = useState(null);

  // Upload modal state
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadTargetFolder, setUploadTargetFolder] = useState('products');
  const [selectedUploadFile, setSelectedUploadFile] = useState(null);
  const fileInputRef = useRef(null);

  // Preview modal state
  const [previewFile, setPreviewFile] = useState(null);

  // Reference / Usage inspection state
  const [inspectUsageModal, setInspectUsageModal] = useState({ isOpen: false, file: null, usage: null, loading: false });

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, file: null, isDeleting: false, conflictInfo: null });

  function addToast(message, type = 'success') {
    setToasts((prev) => [...prev, { id: Date.now(), message, type }]);
  }

  useEffect(() => {
    fetchMedia();
  }, [selectedType, selectedFolder]);

  async function fetchMedia() {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        limit: '150',
        search: search.trim(),
        type: selectedType,
        module: selectedFolder,
      });

      const res = await fetch(`/api/files?${params.toString()}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to fetch media assets');

      setFiles(json.data || []);
      setStorageSource(json.source || 'local');
    } catch (err) {
      addToast(err.message, 'danger');
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(e) {
    e.preventDefault();
    if (!selectedUploadFile) {
      addToast('Please select a file to upload', 'danger');
      return;
    }

    try {
      setUploading(true);
      const fd = new FormData();
      fd.append('file', selectedUploadFile);
      fd.append('folder', uploadTargetFolder);

      const res = await fetch('/api/files/upload', {
        method: 'POST',
        body: fd,
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || json.error || 'Upload failed');

      addToast('File uploaded successfully to media repository!');
      setUploadModalOpen(false);
      setSelectedUploadFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      fetchMedia();
    } catch (err) {
      addToast(err.message, 'danger');
    } finally {
      setUploading(false);
    }
  }

  async function inspectUsage(file) {
    try {
      setInspectUsageModal({ isOpen: true, file, usage: null, loading: true });
      const res = await fetch(`/api/files/usage?url=${encodeURIComponent(file.url)}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to inspect usage');

      setInspectUsageModal({ isOpen: true, file, usage: json.usage, loading: false });
    } catch (err) {
      addToast(err.message, 'danger');
      setInspectUsageModal({ isOpen: false, file: null, usage: null, loading: false });
    }
  }

  async function handleDeleteFile(file) {
    try {
      setDeleteModal((prev) => ({ ...prev, isDeleting: true, conflictInfo: null }));
      const res = await fetch(`/api/files?url=${encodeURIComponent(file.url)}`, {
        method: 'DELETE',
      });
      const json = await res.json();

      if (res.status === 409) {
        // Safe deletion prevented deletion due to active references
        setDeleteModal((prev) => ({
          ...prev,
          isDeleting: false,
          conflictInfo: json,
        }));
        return;
      }

      if (!res.ok) {
        throw new Error(json.message || 'Failed to delete asset');
      }

      addToast('Asset permanently deleted from media storage', 'warning');
      setDeleteModal({ isOpen: false, file: null, isDeleting: false, conflictInfo: null });
      setFiles((prev) => prev.filter((f) => f.url !== file.url));
    } catch (err) {
      addToast(err.message, 'danger');
      setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
    }
  }

  function copyToClipboard(url) {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    addToast('Asset URL copied to clipboard!');
    setTimeout(() => setCopiedUrl(null), 2500);
  }

  const isImageFile = (url) => {
    if (!url || typeof url !== 'string') return false;
    return /\.(jpg|jpeg|png|webp|svg|gif|avif)(\?.*)?$/i.test(url) || url.includes('/image/upload/');
  };

  const isPdfFile = (url) => {
    if (!url || typeof url !== 'string') return false;
    return /\.pdf(\?.*)?$/i.test(url) || url.includes('/raw/upload/');
  };

  const filteredFiles = files.filter((f) => {
    const q = search.toLowerCase();
    const matchSearch = !search || f.name?.toLowerCase().includes(q) || f.url?.toLowerCase().includes(q);
    return matchSearch;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 bg-background min-h-full">
      <Breadcrumb
        title="Central Media Library"
        subtitle={`Authoritative repository for commercial HVAC catalogs, equipment photography, and technical literature.`}
        crumbs={[{ label: 'Dashboard' }, { label: 'Media Library' }]}
      />

      {/* Top Controls & Filter Bar */}
      <div className="bg-card p-4 rounded-xl border border-border shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search media by filename or path..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-background h-10 rounded-lg text-sm"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <div className="flex items-center border border-border rounded-lg p-0.5 bg-muted/40">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md text-xs font-medium transition-all ${
                  viewMode === 'grid' ? 'bg-background shadow-xs text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md text-xs font-medium transition-all ${
                  viewMode === 'list' ? 'bg-background shadow-xs text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={fetchMedia}
              disabled={loading}
              className="h-10 text-xs gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>

            <Button
              onClick={() => setUploadModalOpen(true)}
              className="h-10 text-xs font-semibold gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
            >
              <UploadCloud className="w-4 h-4" />
              Upload Asset
            </Button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-border/60 text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
            <Filter className="w-3.5 h-3.5" />
            <span>Folder:</span>
          </div>
          {['all', 'products', 'categories', 'blogs', 'resources', 'manager'].map((f) => (
            <button
              key={f}
              onClick={() => setSelectedFolder(f)}
              className={`px-2.5 py-1 rounded-full font-medium transition-colors capitalize ${
                selectedFolder === f
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {f}
            </button>
          ))}

          <div className="h-4 w-[1px] bg-border mx-1" />

          <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
            <span>Type:</span>
          </div>
          {['all', 'image', 'document', 'video'].map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-2.5 py-1 rounded-full font-medium transition-colors capitalize ${
                selectedType === t
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {t}
            </button>
          ))}

          <div className="ml-auto flex items-center gap-2">
            <Badge variant="outline" className="text-[11px] font-mono py-0.5">
              Storage: <span className="font-semibold text-primary ml-1 uppercase">{storageSource}</span>
            </Badge>
            <span className="text-muted-foreground text-[11px]">
              Showing {filteredFiles.length} {filteredFiles.length === 1 ? 'asset' : 'assets'}
            </span>
          </div>
        </div>
      </div>

      {/* Media Grid / List Content */}
      {loading ? (
        <div className="p-16 flex flex-col items-center justify-center text-muted-foreground space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm">Loading media assets from authoritative storage...</p>
        </div>
      ) : filteredFiles.length === 0 ? (
        <Card className="p-12 text-center space-y-3 bg-muted/10 border-dashed">
          <Folder className="w-12 h-12 text-muted-foreground/40 mx-auto" />
          <h3 className="font-semibold text-base">No media assets found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            {search
              ? `No assets match your search query "${search}". Try adjusting your filters.`
              : `No files uploaded in this folder yet. Use the Upload Asset button to add imagery and PDFs.`}
          </p>
          <Button
            size="sm"
            onClick={() => setUploadModalOpen(true)}
            className="mt-2 text-xs"
          >
            <UploadCloud className="w-3.5 h-3.5 mr-1.5" />
            Upload First Asset
          </Button>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 animate-in fade-in duration-200">
          {filteredFiles.map((file, idx) => {
            const isImg = isImageFile(file.url);
            const isPdf = isPdfFile(file.url);
            return (
              <div
                key={file.url || idx}
                className="group relative bg-card border border-border rounded-xl overflow-hidden shadow-xs hover:shadow-md hover:border-primary/50 transition-all flex flex-col"
              >
                {/* Media Thumbnail */}
                <div
                  className="aspect-square bg-muted/40 relative flex items-center justify-center overflow-hidden cursor-pointer"
                  onClick={() => setPreviewFile(file)}
                >
                  {isImg ? (
                    <img
                      src={file.url}
                      alt={file.name || 'Media'}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : isPdf ? (
                    <div className="flex flex-col items-center justify-center p-4 text-center">
                      <FileText className="w-10 h-10 text-red-500 mb-1" />
                      <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">PDF</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-4 text-center">
                      <FileText className="w-10 h-10 text-muted-foreground/60 mb-1" />
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">{file.type || 'FILE'}</span>
                    </div>
                  )}

                  {/* Quick Action Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewFile(file);
                      }}
                      className="p-1.5 rounded-full bg-white/90 text-slate-800 hover:bg-white hover:scale-110 transition-all"
                      title="Preview Asset"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(file.url);
                      }}
                      className="p-1.5 rounded-full bg-white/90 text-slate-800 hover:bg-white hover:scale-110 transition-all"
                      title="Copy URL"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        inspectUsage(file);
                      }}
                      className="p-1.5 rounded-full bg-white/90 text-blue-600 hover:bg-white hover:scale-110 transition-all"
                      title="Inspect CMS References"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Card Meta & Bottom Toolbar */}
                <div className="p-2.5 flex-1 flex flex-col justify-between bg-card text-xs">
                  <div>
                    <p className="font-medium text-foreground truncate" title={file.name}>
                      {file.name || 'unnamed-asset'}
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-1">
                      <span>{file.size ? `${(file.size / 1024).toFixed(0)} KB` : ''}</span>
                      <span className="font-mono text-[10px] uppercase bg-muted px-1 rounded">{file.module || 'media'}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 mt-2 border-t border-border/60">
                    <button
                      onClick={() => inspectUsage(file)}
                      className="text-[11px] font-medium text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <Info className="w-3 h-3" />
                      Usage
                    </button>

                    <button
                      onClick={() => setDeleteModal({ isOpen: true, file, isDeleting: false, conflictInfo: null })}
                      className="p-1 rounded text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors"
                      title="Safe Delete Asset"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-card rounded-xl border border-border overflow-hidden shadow-xs">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted/50 border-b border-border font-semibold text-muted-foreground">
              <tr>
                <th className="p-3 w-12">Preview</th>
                <th className="p-3">Filename</th>
                <th className="p-3">Folder</th>
                <th className="p-3">Size</th>
                <th className="p-3">Updated</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredFiles.map((file, idx) => (
                <tr key={file.url || idx} className="hover:bg-muted/20 transition-colors">
                  <td className="p-3">
                    <div className="w-8 h-8 rounded bg-muted/60 border border-border flex items-center justify-center overflow-hidden">
                      {isImageFile(file.url) ? (
                        <img src={file.url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <FileText className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  </td>
                  <td className="p-3">
                    <p className="font-semibold text-foreground truncate max-w-xs">{file.name}</p>
                    <p className="text-[11px] text-muted-foreground font-mono truncate max-w-md">{file.url}</p>
                  </td>
                  <td className="p-3">
                    <span className="font-mono text-[10px] uppercase bg-muted px-1.5 py-0.5 rounded border border-border">
                      {file.module || 'media'}
                    </span>
                  </td>
                  <td className="p-3 text-muted-foreground font-mono">
                    {file.size ? `${(file.size / 1024).toFixed(1)} KB` : '—'}
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {file.updatedAt ? new Date(file.updatedAt).toLocaleDateString() : '—'}
                  </td>
                  <td className="p-3 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(file.url)}
                        className="h-7 px-2 text-xs"
                        title="Copy URL"
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Copy
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => inspectUsage(file)}
                        className="h-7 px-2 text-xs text-blue-600 hover:text-blue-700"
                        title="Inspect References"
                      >
                        <Info className="w-3 h-3 mr-1" />
                        References
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteModal({ isOpen: true, file, isDeleting: false, conflictInfo: null })}
                        className="h-7 px-2 text-xs text-red-500 hover:bg-red-50 hover:text-red-700"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── MODAL 1: UPLOAD ASSET ── */}
      <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-md bg-primary/10 text-primary">
                <UploadCloud className="w-5 h-5" />
              </span>
              <DialogTitle className="text-lg font-bold">Upload Media Asset</DialogTitle>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Store equipment images, banners, or technical PDF documentation in the dedicated repository.
            </p>
          </DialogHeader>

          <form onSubmit={handleUpload} className="space-y-4 mt-2">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Target Media Folder</label>
              <select
                value={uploadTargetFolder}
                onChange={(e) => setUploadTargetFolder(e.target.value)}
                className="w-full text-xs bg-background border border-border rounded-lg p-2.5 font-medium focus:ring-1 focus:ring-primary"
              >
                <option value="products">Products (/uploads/products)</option>
                <option value="categories">Categories (/uploads/categories)</option>
                <option value="blogs">Blogs (/uploads/blogs)</option>
                <option value="resources">Technical Resources (/uploads/resources)</option>
                <option value="general">General Media (/uploads/manager)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Select File</label>
              <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors bg-muted/20">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => setSelectedUploadFile(e.target.files?.[0] || null)}
                  accept="image/*,.pdf,application/pdf"
                  className="hidden"
                  id="library-upload-input"
                />
                <label
                  htmlFor="library-upload-input"
                  className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                >
                  <Upload className="w-8 h-8 text-primary/60" />
                  <span className="text-xs font-semibold text-foreground">
                    {selectedUploadFile ? selectedUploadFile.name : 'Click to choose file or drag & drop'}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    Supports JPG, PNG, WEBP, SVG, and PDF documents (Max 50MB)
                  </span>
                </label>
              </div>
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setUploadModalOpen(false)}
                disabled={uploading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={uploading || !selectedUploadFile}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                    Uploading...
                  </>
                ) : (
                  'Confirm Upload'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── MODAL 2: PREVIEW ASSET ── */}
      <Dialog open={Boolean(previewFile)} onOpenChange={(open) => !open && setPreviewFile(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold truncate">
              {previewFile?.name || 'Media Preview'}
            </DialogTitle>
          </DialogHeader>

          <div className="my-2 max-h-[60vh] overflow-auto flex items-center justify-center bg-muted/30 rounded-xl p-4 border border-border">
            {previewFile && isImageFile(previewFile.url) ? (
              <img src={previewFile.url} alt={previewFile.name} className="max-h-[50vh] object-contain rounded-lg" />
            ) : previewFile && isPdfFile(previewFile.url) ? (
              <div className="text-center p-6 space-y-3">
                <FileText className="w-16 h-16 text-red-500 mx-auto" />
                <p className="font-semibold text-sm">PDF Document</p>
                <a
                  href={previewFile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-primary underline"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Open Document in New Tab
                </a>
              </div>
            ) : (
              <div className="text-center p-6 space-y-2">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto" />
                <p className="text-xs text-muted-foreground font-mono">{previewFile?.url}</p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border text-xs">
            <span className="font-mono text-muted-foreground truncate max-w-xs">{previewFile?.url}</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => previewFile && copyToClipboard(previewFile.url)}
              >
                <Copy className="w-3 h-3 mr-1" />
                Copy URL
              </Button>
              <Button
                size="sm"
                onClick={() => setPreviewFile(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── MODAL 3: INSPECT CMS REFERENCES ── */}
      <Dialog
        open={inspectUsageModal.isOpen}
        onOpenChange={(open) => !open && setInspectUsageModal({ isOpen: false, file: null, usage: null, loading: false })}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-md bg-blue-500/10 text-blue-600">
                <Info className="w-5 h-5" />
              </span>
              <DialogTitle className="text-base font-bold">CMS Reference Tracking</DialogTitle>
            </div>
            <p className="text-xs text-muted-foreground mt-1 truncate">
              Inspecting asset: <span className="font-mono font-medium">{inspectUsageModal.file?.name}</span>
            </p>
          </DialogHeader>

          <div className="py-2">
            {inspectUsageModal.loading ? (
              <div className="py-8 flex flex-col items-center justify-center space-y-2 text-muted-foreground">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span className="text-xs">Scanning Products, Categories, Blogs, and Resources...</span>
              </div>
            ) : inspectUsageModal.usage ? (
              <div className="space-y-4">
                <div
                  className={`p-3 rounded-lg border flex items-center gap-3 ${
                    inspectUsageModal.usage.isReferenced
                      ? 'bg-amber-500/10 border-amber-300 text-amber-900'
                      : 'bg-emerald-500/10 border-emerald-300 text-emerald-900'
                  }`}
                >
                  {inspectUsageModal.usage.isReferenced ? (
                    <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
                  ) : (
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  <div>
                    <p className="text-xs font-bold">
                      {inspectUsageModal.usage.isReferenced
                        ? `Referenced in ${inspectUsageModal.usage.count} CMS Record(s)`
                        : 'Unused — Safe to delete or modify'}
                    </p>
                    <p className="text-[11px] opacity-80">
                      {inspectUsageModal.usage.isReferenced
                        ? 'Safe deletion protection blocks removing this asset until unlinked from all records.'
                        : 'No active OG Heavy Duty products, categories, blogs, or resources reference this file.'}
                    </p>
                  </div>
                </div>

                {inspectUsageModal.usage.isReferenced && (
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground">Active References:</label>
                    <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                      {inspectUsageModal.usage.references.map((ref, i) => (
                        <div
                          key={i}
                          className="p-2 rounded-md bg-muted/40 border border-border text-xs flex items-center justify-between"
                        >
                          <div>
                            <span className="font-semibold text-foreground mr-1.5">{ref.title}</span>
                            <span className="text-[10px] uppercase font-mono px-1 py-0.5 rounded bg-muted text-muted-foreground">
                              {ref.field}
                            </span>
                          </div>
                          <Badge variant="outline" className="text-[10px] capitalize">
                            {ref.type}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>

          <DialogFooter>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setInspectUsageModal({ isOpen: false, file: null, usage: null, loading: false })}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── MODAL 4: SAFE DELETE CONFIRMATION & 409 CONFLICT WARNING ── */}
      <Dialog
        open={deleteModal.isOpen}
        onOpenChange={(open) => !open && setDeleteModal({ isOpen: false, file: null, isDeleting: false, conflictInfo: null })}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <span className={`p-1.5 rounded-md ${deleteModal.conflictInfo ? 'bg-red-500/10 text-red-600' : 'bg-amber-500/10 text-amber-600'}`}>
                {deleteModal.conflictInfo ? <ShieldAlert className="w-5 h-5" /> : <Trash2 className="w-5 h-5" />}
              </span>
              <DialogTitle className="text-base font-bold">
                {deleteModal.conflictInfo ? 'Deletion Blocked: Active References' : 'Confirm Media Deletion'}
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="py-2 text-xs space-y-3">
            {deleteModal.conflictInfo ? (
              <div className="space-y-3">
                <div className="p-3 bg-red-500/10 border border-red-300 rounded-lg text-red-900 space-y-1">
                  <p className="font-bold text-xs">Cannot delete referenced asset!</p>
                  <p className="text-[11px]">
                    This asset is currently in use by <strong>{deleteModal.conflictInfo.referenceCount}</strong> CMS record(s).
                    To protect site integrity, unassign this file before deleting.
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="font-semibold text-muted-foreground">Referencing Records:</span>
                  <div className="max-h-36 overflow-y-auto space-y-1 pr-1">
                    {deleteModal.conflictInfo.references?.map((ref, idx) => (
                      <div key={idx} className="p-1.5 rounded bg-muted/60 border border-border text-[11px] flex justify-between">
                        <span className="font-medium text-foreground">{ref.title}</span>
                        <span className="font-mono text-[10px] text-muted-foreground uppercase">{ref.type} ({ref.field})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">
                Are you sure you want to delete <span className="font-semibold font-mono text-foreground">{deleteModal.file?.name}</span>?
                This action is irreversible. The asset will be verified for active references before deletion.
              </p>
            )}
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setDeleteModal({ isOpen: false, file: null, isDeleting: false, conflictInfo: null })}
              disabled={deleteModal.isDeleting}
            >
              {deleteModal.conflictInfo ? 'Dismiss' : 'Cancel'}
            </Button>
            {!deleteModal.conflictInfo && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteFile(deleteModal.file)}
                disabled={deleteModal.isDeleting}
              >
                {deleteModal.isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                    Checking & Deleting...
                  </>
                ) : (
                  'Confirm Delete'
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toast toasts={toasts} onRemove={(id) => setToasts((t) => t.filter((x) => x.id !== id))} />
    </div>
  );
}

