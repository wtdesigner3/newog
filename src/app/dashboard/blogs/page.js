'use client'
import { useState, useEffect } from 'react'
import Breadcrumb from '../../../components/dashboard/Breadcrumb'
import DataTable from '../../../components/dashboard/DataTable'
import TableToolbar from '../../../components/dashboard/TableToolbar'
import Toast from '../../../components/dashboard/Toast'
import RichEditor from '../../../components/dashboard/RichEditor'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog'
import { Switch } from '../../../components/ui/switch'
import { FloatingInput, FloatingTextarea, FloatingSelect } from '../../../components/ui/floating-input'
import { SlugInput } from '../../../components/dashboard/SlugInput'
import { SortInput } from '../../../components/dashboard/SortInput'
import { Edit2, Trash2, ImageIcon, ExternalLink, FileEdit, Eye } from 'lucide-react'
import Link from 'next/link'
import ConfirmDeleteModal from '../../../components/dashboard/ConfirmDeleteModal'
import MediaSelector from '../../../components/dashboard/MediaSelector'
import BulkActionBar from '../../../components/dashboard/BulkActionBar'

const EMPTY = {
  title: '', slug: '', excerpt: '', content: '',
  author: 'OG Heavy Duty Technical Team', category: 'HVAC Engineering',
  status: 'published', isPublished: true, sort: 0,
  tagsText: 'High Ambient, 50°C Cooling, Tropical HVAC',
  metatag: '', metakeywords: '', metaDescription: '', canonicalUrl: '',
  ogTitle: '', ogDescription: '', twitterCard: 'summary_large_image',
  robots: 'index, follow', schema: '', alt: '', coverImage: '', breadImage: '',
}

function BlogModal({ blog, nextSort = 1, onClose, onSave, saving }) {
  const [form, setForm] = useState(() => {
    if (!blog) return { ...EMPTY, sort: nextSort }
    const tagsStr = Array.isArray(blog.tags) 
      ? blog.tags.join(', ') 
      : (Array.isArray(blog.metakeywords) ? blog.metakeywords.join(', ') : (blog.tags || ''))

    return {
      ...EMPTY,
      ...blog,
      tagsText: tagsStr,
      status: blog.status || (blog.isPublished ? 'published' : 'draft'),
      schema: blog.schemaMarkup ? JSON.stringify(blog.schemaMarkup, null, 2) : '',
      metakeywords: Array.isArray(blog.metakeywords) ? blog.metakeywords.join(', ') : (blog.metakeywords || ''),
    }
  })

  const [activeTab, setActiveTab] = useState('general')
  const [slugLinked, setSlugLinked] = useState(!blog)
  const [coverFile, setCoverFile] = useState(null)
  const [breadFile, setBreadFile] = useState(null)
  const [coverPreview, setCoverPreview] = useState(blog?.coverImage || '')

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }))

  function toSlug(str) {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }

  function handleFile(e, setFile, setPreview) {
    const file = e.target.files[0]
    if (!file) return
    setFile(file)
    setPreview(URL.createObjectURL(file))
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSave({ ...form }, { coverFile, breadFile })
  }

  const tabs = [
    { key: 'general', label: 'Article Details' },
    { key: 'content', label: 'Body Content' },
    { key: 'media',   label: 'Featured Media' },
    { key: 'seo',     label: 'SEO Settings' },
  ]

  return (
    <Dialog open={true} onOpenChange={(open) => !open && !saving && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-md bg-primary/10 text-primary">
              <FileEdit className="w-5 h-5" />
            </span>
            <DialogTitle className="text-xl font-bold !text-white">
              {blog ? `Edit Article: ${blog.title}` : 'Compose Technical Article'}
            </DialogTitle>
          </div>
          <p className="text-slate-300 text-xs mt-1">
            Authoritative technical guides, high-ambient comparisons, and industrial HVAC engineering articles.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          {/* Navigation Tabs */}
          <div className="flex gap-2 border-b border-border pb-1">
            {tabs.map(t => (
              <button
                key={t.key}
                type="button"
                onClick={() => setActiveTab(t.key)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  activeTab === t.key ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="py-2">
            {/* ── TAB 1: GENERAL ── */}
            {activeTab === 'general' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <FloatingInput
                  label="Article Title *"
                  required
                  value={form.title}
                  onChange={e => {
                    f('title', e.target.value)
                    if (slugLinked) f('slug', toSlug(e.target.value))
                  }}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SlugInput
                    label="URL Slug *"
                    required
                    value={form.slug}
                    isEditing={!!blog}
                    linked={slugLinked}
                    onToggleLink={() => {
                      const next = !slugLinked
                      setSlugLinked(next)
                      if (next) f('slug', toSlug(form.title))
                    }}
                    onChange={v => {
                      setSlugLinked(false)
                      f('slug', v)
                    }}
                  />
                  <FloatingInput
                    label="Category (e.g. HVAC Engineering, Maintenance)"
                    value={form.category}
                    onChange={e => f('category', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FloatingInput
                    label="Author / Bylaw"
                    value={form.author}
                    onChange={e => f('author', e.target.value)}
                  />
                  <FloatingSelect
                    label="Publication Status *"
                    value={form.status}
                    onChange={e => f('status', e.target.value)}
                  >
                    <option value="published">Published (Visible on /blogs)</option>
                    <option value="draft">Draft (Unpublished)</option>
                    <option value="archived">Archived (Delisted)</option>
                  </FloatingSelect>
                  <SortInput
                    label="Sort Order"
                    value={form.sort}
                    onChange={v => f('sort', v)}
                  />
                </div>

                <FloatingTextarea
                  label="Article Excerpt (Summary for Cards & SEO)"
                  rows={3}
                  value={form.excerpt}
                  onChange={e => f('excerpt', e.target.value)}
                />

                <FloatingInput
                  label="Tags (Comma-separated, e.g. High Ambient, 50°C Cooling, Copper Coils)"
                  value={form.tagsText}
                  onChange={e => f('tagsText', e.target.value)}
                />
              </div>
            )}

            {/* ── TAB 2: CONTENT ── */}
            {activeTab === 'content' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">
                    Article Body Content (Sanitized Rich Text)
                  </label>
                  <RichEditor
                    value={form.content}
                    onChange={v => f('content', v)}
                  />
                </div>
              </div>
            )}

            {/* ── TAB 3: MEDIA ── */}
            {activeTab === 'media' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <MediaSelector
                    label="Cover / Thumbnail Image"
                    value={form.coverImage}
                    onChange={v => {
                      f('coverImage', v)
                      setCoverPreview(v)
                      setCoverFile(null)
                    }}
                    folder="blogs"
                    accept="image/*"
                    helperText="Official article cover displayed in blog listing and post header."
                  />

                  <MediaSelector
                    label="Banner Breadcrumb Image (Optional)"
                    value={form.breadImage}
                    onChange={v => {
                      f('breadImage', v)
                      setBreadFile(null)
                    }}
                    folder="blogs"
                    accept="image/*"
                    helperText="Wide header banner for the article."
                  />
                </div>

                <FloatingInput
                  label="Image Alt Text"
                  value={form.alt}
                  onChange={e => f('alt', e.target.value)}
                />
              </div>
            )}

            {/* ── TAB 4: SEO ── */}
            {activeTab === 'seo' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <FloatingInput
                  label="SEO Meta Title"
                  value={form.metatag}
                  onChange={e => f('metatag', e.target.value)}
                />
                <FloatingTextarea
                  label="SEO Meta Description"
                  rows={3}
                  value={form.metaDescription}
                  onChange={e => f('metaDescription', e.target.value)}
                />
                <FloatingInput
                  label="Canonical URL"
                  value={form.canonicalUrl}
                  onChange={e => f('canonicalUrl', e.target.value)}
                />
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : blog ? 'Save Article' : 'Publish Article'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default function BlogManagementPage() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [modal, setModal] = useState(null)
  const [search, setSearch] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [sort, setSort] = useState('latest')
  const [selectedIds, setSelectedIds] = useState([])
  const [deletingId, setDeletingId] = useState(null)
  const [togglingId, setTogglingId] = useState(null)
  const [toasts, setToasts] = useState([])
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: 'single', id: null })

  function addToast(message, type = 'success') {
    setToasts(t => [...t, { id: Date.now(), message, type }])
  }

  const fetchBlogs = () => {
    setLoading(true)
    fetch(`/api/blog?t=${Date.now()}`)
      .then(res => res.json())
      .then(json => {
        setRows(json.data || (Array.isArray(json) ? json : []))
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        addToast('Failed to load blog articles', 'danger')
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchBlogs()
  }, [])

  async function handleSave(form, { coverFile, breadFile }) {
    try {
      setSaving(true)
      const fd = new FormData()

      fd.append('title', form.title || '')
      fd.append('slug', form.slug || '')
      fd.append('excerpt', form.excerpt || '')
      fd.append('content', form.content || '')
      fd.append('author', form.author || '')
      fd.append('category', form.category || '')
      fd.append('alt', form.alt || '')
      fd.append('status', form.status || 'published')
      fd.append('isPublished', form.status === 'published' ? 'true' : 'false')
      fd.append('sort', form.sort || '0')

      const tags = (form.tagsText || '')
        .split(',')
        .map(t => t.trim())
        .filter(Boolean)
      fd.append('tags', JSON.stringify(tags))

      fd.append('metatag', form.metatag || '')
      fd.append('metaDescription', form.metaDescription || '')
      fd.append('canonicalUrl', form.canonicalUrl || '')

      if (coverFile) {
        fd.append('coverImage', coverFile)
      } else if (form.coverImage && typeof form.coverImage === 'string') {
        fd.append('coverImage', form.coverImage)
      }

      if (breadFile) {
        fd.append('breadImage', breadFile)
      } else if (form.breadImage && typeof form.breadImage === 'string') {
        fd.append('breadImage', form.breadImage)
      }

      const isEdit = Boolean(form._id)
      const url = isEdit ? `/api/blog/${form._id}` : `/api/blog`
      const method = isEdit ? 'PUT' : 'POST'

      const res = await fetch(url, { method, body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Save failed')

      addToast(isEdit ? 'Article updated!' : 'Article published!')
      setModal(null)
      fetchBlogs()
    } catch (err) {
      addToast(err.message, 'danger')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    try {
      setConfirmModal({ isOpen: false, type: 'single', id: null })
      setDeletingId(id)
      const res = await fetch(`/api/blog/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Delete failed')

      addToast(data.message || 'Article deleted.', 'warning')
      setRows(r => r.filter(x => x._id !== id))
      setSelectedIds(prev => prev.filter(x => x !== id))
    } catch (err) {
      addToast(err.message, 'danger')
    } finally {
      setDeletingId(null)
    }
  }

  const [bulkProcessing, setBulkProcessing] = useState(false)
  const [activeBulkAction, setActiveBulkAction] = useState('')

  async function handleBulkAction(action) {
    if (action === 'delete') {
      if (!confirm(`Are you sure you want to delete ${selectedIds.length} article(s)?`)) return
      try {
        setBulkProcessing(true)
        setActiveBulkAction('delete')
        await Promise.all(selectedIds.map(id => fetch(`/api/blog/${id}`, { method: 'DELETE' })))
        setRows(r => r.filter(x => !selectedIds.includes(x._id)))
        setSelectedIds([])
        addToast('Selected articles removed.', 'warning')
      } catch (err) {
        addToast(err.message, 'danger')
      } finally {
        setBulkProcessing(false)
        setActiveBulkAction('')
      }
      return
    }

    try {
      setBulkProcessing(true)
      setActiveBulkAction(action)
      const res = await fetch('/api/blogs/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ids: selectedIds }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Bulk operation failed')

      const nextStatus = action === 'publish' ? 'published' : (action === 'unpublish' ? 'draft' : 'archived')
      const nextActive = action === 'publish'
      setRows(prev => prev.map(b => selectedIds.includes(b._id) ? { ...b, status: nextStatus, isPublished: nextActive } : b))
      setSelectedIds([])
      addToast(data.message || `Successfully executed ${action} on selected articles.`)
    } catch (err) {
      addToast(err.message, 'danger')
    } finally {
      setBulkProcessing(false)
      setActiveBulkAction('')
    }
  }

  async function handleToggleStatus(id, currentStatus) {
    try {
      setTogglingId(id)
      const nextActive = !currentStatus
      const nextStatus = nextActive ? 'published' : 'draft'

      const res = await fetch(`/api/blog/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: nextStatus,
          isPublished: nextActive,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || 'Status update failed')
      }

      setRows(r => r.map(x => x._id === id ? { ...x, isPublished: nextActive, status: nextStatus } : x))
      addToast(`Article set to ${nextStatus}.`)
    } catch (err) {
      addToast(err.message, 'danger')
    } finally {
      setTogglingId(null)
    }
  }

  const filteredData = rows
    .filter(r => {
      const q = search.toLowerCase()
      const matchSearch =
        !search ||
        r.title?.toLowerCase().includes(q) ||
        r.slug?.toLowerCase().includes(q) ||
        r.category?.toLowerCase().includes(q)

      const matchStatus =
        selectedStatus === 'all' ||
        (selectedStatus === 'published' && (r.status === 'published' || (r.isPublished && !r.status))) ||
        (selectedStatus === 'draft' && (r.status === 'draft' || (!r.isPublished && r.status !== 'archived'))) ||
        (selectedStatus === 'archived' && r.status === 'archived')

      return matchSearch && matchStatus
    })
    .sort((a, b) => {
      if (sort === 'latest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      if (sort === 'oldest') return new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
      if (sort === 'a-z') return (a.title || '').localeCompare(b.title || '')
      if (sort === 'z-a') return (b.title || '').localeCompare(a.title || '')
      return (a.sort || 0) - (b.sort || 0)
    })

  const columns = [
    {
      key: 'cover',
      label: 'Cover',
      render: (row) => (
        <div className="w-14 h-11 rounded-md border border-border overflow-hidden bg-muted flex items-center justify-center shrink-0">
          {row.coverImage ? (
            <img src={row.coverImage} className="w-full h-full object-cover" alt={row.alt} />
          ) : (
            <ImageIcon className="w-4 h-4 text-muted-foreground/40" />
          )}
        </div>
      )
    },
    {
      key: 'title',
      label: 'Article Title & Author',
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-sm text-foreground">{row.title}</span>
          <span className="text-xs text-muted-foreground font-mono mt-0.5">{row.slug}</span>
          <span className="text-[11px] text-muted-foreground mt-0.5">
            By {row.author || 'OG Engineering Team'} &bull; {row.category || 'HVAC'}
          </span>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => {
        const isPub = row.status === 'published' || (row.isPublished && !row.status)
        return (
          <div className="flex items-center gap-2">
            {togglingId === row._id ? (
              <span className="text-xs text-muted-foreground animate-pulse">Updating...</span>
            ) : (
              <Switch 
                checked={isPub}
                onCheckedChange={() => handleToggleStatus(row._id, isPub)}
              />
            )}
            <Badge
              variant="outline"
              className={`text-[10px] py-0 px-1.5 capitalize ${
                isPub
                  ? 'bg-emerald-500/10 text-emerald-600 border-emerald-300'
                  : 'bg-amber-500/10 text-amber-600 border-amber-300'
              }`}
            >
              {row.status || (row.isPublished ? 'published' : 'draft')}
            </Badge>
          </div>
        )
      }
    },
    {
      key: 'actions',
      align: 'right',
      label: 'Actions',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          {row.slug && (
            <Link
              href={`/blogs/${row.slug}`}
              target="_blank"
              title="Preview on Public Site"
              className="w-8 h-8 rounded flex items-center justify-center transition-colors bg-muted text-muted-foreground hover:text-foreground"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          )}
          <button
            onClick={() => setModal(row)}
            title="Edit Article"
            className="w-8 h-8 rounded flex items-center justify-center transition-colors bg-blue-500/10 text-blue-600 hover:bg-blue-500/20"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setConfirmModal({ isOpen: true, type: 'single', id: row._id })}
            disabled={deletingId === row._id}
            title="Delete / Archive Article"
            className="w-8 h-8 rounded flex items-center justify-center transition-colors bg-red-500/10 text-red-600 hover:bg-red-500/20 disabled:opacity-50"
          >
            {deletingId === row._id ? (
              <span className="w-3.5 h-3.5 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
            ) : (
              <Trash2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      )
    }
  ]

  const publishedCount = rows.filter(r => r.status === 'published' || (r.isPublished && !r.status)).length

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 bg-background min-h-full">
      <Breadcrumb 
        title="Technical Articles" 
        subtitle={`Manage HVAC engineering articles and guides (${publishedCount} published)`}
        crumbs={[{ label: 'Blog Management' }]} 
      />

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-3 bg-card p-3 rounded-lg border border-border">
        <span className="text-xs font-semibold text-muted-foreground">Filters:</span>

        <select
          value={selectedStatus}
          onChange={e => setSelectedStatus(e.target.value)}
          className="text-xs bg-background border border-border rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="all">All Statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>

        <Link
          href="/blogs"
          target="_blank"
          className="ml-auto text-xs text-primary hover:underline flex items-center gap-1"
        >
          <ExternalLink className="w-3.5 h-3.5" /> View Public Blog Section
        </Link>
      </div>

      <TableToolbar 
        search={search}
        onSearchChange={setSearch}
        sort={sort}
        onSortChange={setSort}
        selectedCount={selectedIds.length}
        onAdd={() => setModal('new')}
        addLabel="Compose Article"
      />

      <DataTable 
        columns={columns}
        data={filteredData}
        loading={loading}
        onRowClick={(row) => setModal(row)}
        actions={false}
        selectedIds={selectedIds}
        onToggleSelectAll={() => {
          if (selectedIds.length === filteredData.length) setSelectedIds([])
          else setSelectedIds(filteredData.map(x => x._id))
        }}
        onToggleSelectRow={(id) => {
          setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
        }}
      />

      {modal && (
        <BlogModal
          blog={modal === 'new' ? null : modal}
          nextSort={rows.reduce((max, r) => Math.max(max, Number(r.sort) || 0), 0) + 1}
          onClose={() => setModal(null)}
          onSave={handleSave}
          saving={saving}
        />
      )}

      <BulkActionBar
        selectedCount={selectedIds.length}
        onAction={handleBulkAction}
        onClearSelection={() => setSelectedIds([])}
        isProcessing={bulkProcessing}
        activeAction={activeBulkAction}
      />

      <ConfirmDeleteModal
        isOpen={confirmModal.isOpen}
        isDeleting={deletingId === confirmModal.id}
        onClose={() => setConfirmModal({ isOpen: false, type: 'single', id: null })}
        onConfirm={() => handleDelete(confirmModal.id)}
        title="Delete Article"
        message="Are you sure you want to delete this technical article? This action cannot be undone."
      />

      <Toast toasts={toasts} onRemove={id => setToasts(t => t.filter(x => x.id !== id))} />
    </div>
  )
}
