'use client'
import { useState, useEffect } from 'react'
import Breadcrumb from '../../../../components/dashboard/Breadcrumb'
import DataTable from '../../../../components/dashboard/DataTable'
import TableToolbar from '../../../../components/dashboard/TableToolbar'
import Toast from '../../../../components/dashboard/Toast'
import { Button } from '../../../../components/ui/button'
import { Badge } from '../../../../components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../../components/ui/dialog'
import { Switch } from '../../../../components/ui/switch'
import { FloatingInput, FloatingTextarea } from '../../../../components/ui/floating-input'
import { SlugInput } from '../../../../components/dashboard/SlugInput'
import { SortInput } from '../../../../components/dashboard/SortInput'
import { Edit2, Trash2, ImageIcon, Layers, ExternalLink, Box } from 'lucide-react'
import Link from 'next/link'
import ConfirmDeleteModal from '../../../../components/dashboard/ConfirmDeleteModal'
import MediaSelector from '../../../../components/dashboard/MediaSelector'

const EMPTY = { 
  name: '', shortName: '', slug: '', series: '', badge: '', tagline: '',
  description: '', breadcrumb: '', sort: '', tonnageRange: '',
  isGif: false, status: 'published',
  metatag: '', metaDescription: '', metakeywords: '', canonicalUrl: '',
  ogTitle: '', ogDescription: '', twitterCard: 'summary_large_image', robots: 'index, follow',
  schema: '', alt: '', image: '', bannerImage: '',
  featuresText: '', subcategoriesText: '',
}

function CatModal({ cat, nextSort = 1, onClose, onSave }) {
  const [form, setForm] = useState(() => {
    if (!cat) return { ...EMPTY, sort: nextSort }
    const featStr = Array.isArray(cat.features) ? cat.features.join('\n') : (cat.features || '')
    const subStr = Array.isArray(cat.subcategories)
      ? cat.subcategories.map(s => typeof s === 'object' ? `${s.name} (${s.slug})` : s).join('\n')
      : (cat.subcategories || '')

    return {
      ...EMPTY,
      ...cat,
      featuresText: featStr,
      subcategoriesText: subStr,
      status: cat.status || (cat.isActive ? 'published' : 'draft'),
      schema: cat.schemaMarkup ? JSON.stringify(cat.schemaMarkup, null, 2) : '',
      metakeywords: Array.isArray(cat.metakeywords) ? cat.metakeywords.join(', ') : (cat.metakeywords || '')
    }
  })

  const [tab, setTab] = useState('basic')
  const [saving, setSaving] = useState(false)
  const [slugLinked, setSlugLinked] = useState(!cat)
  
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }))

  function toSlug(str) {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    const formData = new FormData()

    formData.append('name', form.name || '')
    formData.append('shortName', form.shortName || form.name || '')
    formData.append('slug', form.slug || '')
    formData.append('series', form.series || '')
    formData.append('badge', form.badge || '')
    formData.append('tagline', form.tagline || '')
    formData.append('description', form.description || '')
    formData.append('breadcrumb', form.breadcrumb || '')
    formData.append('sort', form.sort || '0')
    formData.append('tonnageRange', form.tonnageRange || '')
    formData.append('isGif', form.isGif ? 'true' : 'false')
    formData.append('status', form.status || 'published')
    formData.append('isActive', form.status === 'published' ? 'true' : 'false')
    formData.append('alt', form.alt || '')

    // Features
    const featuresList = (form.featuresText || '')
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean)
    formData.append('features', JSON.stringify(featuresList))

    // Subcategories
    const subcatLines = (form.subcategoriesText || '')
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean)
    const subcats = subcatLines.map(line => {
      const match = line.match(/^(.+?)\s*\((.+?)\)$/)
      if (match) return { name: match[1].trim(), slug: match[2].trim() }
      return { name: line, slug: toSlug(line) }
    })
    formData.append('subcategories', JSON.stringify(subcats))

    // SEO
    formData.append('metatag', form.metatag || '')
    formData.append('metaDescription', form.metaDescription || '')
    formData.append('metakeywords', form.metakeywords || '')
    formData.append('canonicalUrl', form.canonicalUrl || '')
    formData.append('ogTitle', form.ogTitle || '')
    formData.append('ogDescription', form.ogDescription || '')

    if (form.image instanceof File) {
      formData.append('image', form.image)
    } else if (typeof form.image === 'string' && form.image) {
      formData.append('image', form.image)
    }

    if (form.bannerImage instanceof File) {
      formData.append('bannerImage', form.bannerImage)
    } else if (typeof form.bannerImage === 'string' && form.bannerImage) {
      formData.append('bannerImage', form.bannerImage)
    }

    try {
      const url = cat ? `/api/categories/${cat._id}` : '/api/categories'
      const method = cat ? 'PUT' : 'POST'
      const res = await fetch(url, { method, body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Operation failed')
      onSave(data)
    } catch (err) {
      alert('Error: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const tabs = [
    { key: 'basic', label: 'Basic Info' },
    { key: 'hvac', label: 'HVAC Hierarchy' },
    { key: 'media', label: 'Images & Banners' },
    { key: 'seo', label: 'SEO Settings' },
  ]

  return (
    <Dialog open={true} onOpenChange={(open) => !open && !saving && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-md bg-primary/10 text-primary">
              <Layers className="w-5 h-5" />
            </span>
            <DialogTitle className="text-xl font-bold !text-white">
              {cat ? `Edit Category: ${cat.name}` : 'Add HVAC Category'}
            </DialogTitle>
          </div>
          <p className="text-slate-300 text-xs mt-1">
            Configure HVAC equipment categories, series badges, and subcategory hierarchies.
          </p>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          {/* Tabs */}
          <div className="flex gap-2 border-b border-border pb-1">
            {tabs.map(t => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  tab === t.key ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="py-2">
            {tab === 'basic' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FloatingInput 
                    label="Category Name *" 
                    required 
                    value={form.name} 
                    onChange={e => {
                      f('name', e.target.value)
                      if (!form.shortName) f('shortName', e.target.value)
                      if (slugLinked) f('slug', toSlug(e.target.value))
                    }}
                  />
                  <FloatingInput 
                    label="Short Name (e.g. Window AC, Split AC)" 
                    value={form.shortName} 
                    onChange={e => f('shortName', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SlugInput
                    label="URL Slug *"
                    required
                    value={form.slug}
                    isEditing={!!cat}
                    linked={slugLinked}
                    onToggleLink={() => {
                      const next = !slugLinked
                      setSlugLinked(next)
                      if (next) f('slug', toSlug(form.name))
                    }}
                    onChange={v => {
                      setSlugLinked(false)
                      f('slug', v)
                    }}
                  />
                  <SortInput
                    label="Sort Order"
                    value={form.sort}
                    onChange={v => f('sort', v)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FloatingInput 
                    label="Series Label (e.g. Residential Series)" 
                    value={form.series} 
                    onChange={e => f('series', e.target.value)}
                  />
                  <FloatingInput 
                    label="Badge (e.g. Flagship High-Ambient)" 
                    value={form.badge} 
                    onChange={e => f('badge', e.target.value)}
                  />
                </div>

                <FloatingInput 
                  label="Category Tagline" 
                  value={form.tagline} 
                  onChange={e => f('tagline', e.target.value)}
                />

                <FloatingTextarea 
                  label="Category Description" 
                  rows={3} 
                  value={form.description} 
                  onChange={e => f('description', e.target.value)}
                />
              </div>
            )}

            {tab === 'hvac' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <FloatingInput 
                  label="Tonnage Range (e.g. 1.0 Ton • 1.5 Ton • 2.0 Ton)" 
                  value={form.tonnageRange} 
                  onChange={e => f('tonnageRange', e.target.value)}
                />

                <FloatingTextarea 
                  label="Subcategories (One per line: Name (slug))" 
                  rows={4} 
                  value={form.subcategoriesText} 
                  onChange={e => f('subcategoriesText', e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Example: Variable Speed Inverter Series (inverter-split-ac)
                </p>

                <FloatingTextarea 
                  label="Key Engineering Features (One per line)" 
                  rows={5} 
                  value={form.featuresText} 
                  onChange={e => f('featuresText', e.target.value)}
                />
              </div>
            )}

            {tab === 'media' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <MediaSelector
                    label="Category Card Image"
                    value={form.image}
                    onChange={v => f('image', v)}
                    folder="categories"
                    accept="image/*"
                    helperText="Product category card illustration or icon."
                  />

                  <MediaSelector
                    label="Category Banner Image"
                    value={form.bannerImage}
                    onChange={v => f('bannerImage', v)}
                    folder="categories"
                    accept="image/*"
                    helperText="Wide hero banner displayed on category page."
                  />
                </div>

                <div className="flex items-center gap-2 p-3 bg-muted/40 rounded-lg border border-border">
                  <input
                    type="checkbox"
                    id="gif-toggle"
                    checked={form.isGif}
                    onChange={e => f('isGif', e.target.checked)}
                    className="w-4 h-4 text-primary rounded"
                  />
                  <label htmlFor="gif-toggle" className="text-xs font-medium cursor-pointer">
                    Enable Animated GIF Card Badge on Public Website
                  </label>
                </div>

                <FloatingInput 
                  label="Image Alt Text" 
                  value={form.alt} 
                  onChange={e => f('alt', e.target.value)}
                />
              </div>
            )}

            {tab === 'seo' && (
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
                  label="Keywords (Comma-separated)" 
                  value={form.metakeywords} 
                  onChange={e => f('metakeywords', e.target.value)}
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
              {saving ? 'Saving...' : cat ? 'Save Changes' : 'Create Category'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default function CategoriesPage() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('latest')
  const [selectedIds, setSelectedIds] = useState([])
  const [bulkDeleting, setBulkDeleting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [togglingId, setTogglingId] = useState(null)
  const [toasts, setToasts] = useState([])
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: 'single', id: null })

  const addToast = (msg, type = 'success') => setToasts(t => [...t, { id: Date.now(), message: msg, type }])

  const fetchCats = () => {
    fetch(`/api/categories?t=${Date.now()}`, { cache: 'no-store' })
      .then(r => r.json())
      .then(data => {
        setRows(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(e => {
        console.error(e)
        addToast('Failed to load categories', 'danger')
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchCats()
  }, [])

  function handleSave(savedCat) {
    setRows(r => {
      const idx = r.findIndex(x => x._id === savedCat._id)
      if (idx > -1) {
        const nr = [...r]; nr[idx] = savedCat; return nr
      }
      return [savedCat, ...r]
    })
    setModal(null)
    addToast('Category saved successfully!')
  }

  async function handleDelete(id) {
    try {
      setConfirmModal({ isOpen: false, type: 'single', id: null })
      setDeletingId(id)
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Failed to delete category')
      }

      setRows(r => r.filter(x => x._id !== id))
      setSelectedIds(prev => prev.filter(x => x !== id))
      addToast(data.message || 'Category deleted.', 'warning')
    } catch (e) {
      addToast(e.message, 'danger')
    } finally {
      setDeletingId(null)
    }
  }

  async function handleToggleStatus(id, currentStatus) {
    try {
      setTogglingId(id)
      const existing = rows.find(x => x._id === id)
      const nextActive = !currentStatus
      const nextStatus = nextActive ? 'published' : 'draft'

      const res = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: nextStatus,
          isActive: nextActive,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || 'Status update failed')
      }

      setRows(r => r.map(x => x._id === id ? { ...x, isActive: nextActive, status: nextStatus } : x))
      addToast(`Category status updated to ${nextStatus}.`)
    } catch (e) {
      addToast(e.message, 'danger')
    } finally {
      setTogglingId(null)
    }
  }

  const filteredData = rows
    .filter(row => 
      row.name?.toLowerCase().includes(search.toLowerCase()) || 
      row.slug?.toLowerCase().includes(search.toLowerCase()) ||
      row.shortName?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === 'latest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      if (sort === 'oldest') return new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
      if (sort === 'a-z') return (a.name || '').localeCompare(b.name || '')
      if (sort === 'z-a') return (b.name || '').localeCompare(a.name || '')
      return (a.sort || 0) - (b.sort || 0)
    })

  const columns = [
    {
      key: 'image',
      label: 'Image',
      render: (row) => (
        <div className="w-10 h-10 rounded-lg bg-muted/40 border border-border flex items-center justify-center overflow-hidden shrink-0">
          {row.image ? (
            <img
              src={row.image.startsWith('http') ? row.image : (row.image.startsWith('/') ? row.image : `/uploads/${row.image}`)}
              alt={row.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <ImageIcon className="w-4 h-4 text-muted-foreground/40" />
          )}
        </div>
      )
    },
    {
      key: 'category',
      label: 'HVAC Category',
      render: (row) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-foreground">{row.name}</span>
            {row.badge && (
              <Badge variant="outline" className="text-[10px] py-0 px-1.5 bg-blue-500/10 text-blue-600 border-blue-300">
                {row.badge}
              </Badge>
            )}
          </div>
          <span className="text-xs text-muted-foreground font-mono mt-0.5">{row.slug}</span>
          <span className="text-[11px] text-muted-foreground mt-0.5">
            {row.series || 'HVAC Series'} &bull; {row.tonnageRange || 'Heavy Duty Capacity'}
          </span>
        </div>
      )
    },
    {
      key: 'products',
      label: 'Products',
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <Box className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="font-semibold text-xs text-foreground">
            {row.productCount ?? 0}
          </span>
          <span className="text-[11px] text-muted-foreground">assigned</span>
        </div>
      )
    },
    {
      key: 'sort',
      label: 'Sort',
      render: (row) => <span className="font-medium text-xs text-muted-foreground">{row.sort}</span>
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <div className="flex items-center gap-2">
          {togglingId === row._id ? (
            <span className="text-xs text-muted-foreground animate-pulse">Updating...</span>
          ) : (
            <Switch 
              checked={row.isActive !== false && row.status !== 'draft'}
              onCheckedChange={() => handleToggleStatus(row._id, row.isActive !== false && row.status !== 'draft')}
            />
          )}
          <span className="text-[11px] text-muted-foreground capitalize">
            {row.status || (row.isActive ? 'published' : 'draft')}
          </span>
        </div>
      )
    },
    {
      key: 'actions',
      align: 'right',
      label: 'Actions',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          {row.slug && (
            <Link
              href={`/products/${row.slug}`}
              target="_blank"
              title="Preview Category Page"
              className="w-8 h-8 rounded flex items-center justify-center transition-colors bg-muted text-muted-foreground hover:text-foreground"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          )}
          <button 
            onClick={(e) => { e.stopPropagation(); setModal(row); }} 
            title="Edit Category"
            className="w-8 h-8 rounded flex items-center justify-center transition-colors bg-blue-500/10 text-blue-600 hover:bg-blue-500/20"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); setConfirmModal({ isOpen: true, type: 'single', id: row._id }); }} 
            disabled={deletingId === row._id} 
            title="Delete Category"
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

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 bg-background min-h-full">
      <Breadcrumb 
        title="Product Categories" 
        subtitle={`Manage HVAC equipment categories (${rows.filter(r => r.isActive).length} active)`}
        crumbs={[{ label: 'Product Management' }, { label: 'Categories' }]} 
      />
      
      <TableToolbar 
        search={search}
        onSearchChange={setSearch}
        sort={sort}
        onSortChange={setSort}
        selectedCount={selectedIds.length}
        onBulkDelete={() => setConfirmModal({ isOpen: true, type: 'bulk', id: null })}
        bulkDeleting={bulkDeleting}
        onAdd={() => setModal('new')}
        addLabel="Add HVAC Category"
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
        <CatModal 
          cat={modal === 'new' ? null : modal} 
          nextSort={rows.reduce((max, r) => Math.max(max, Number(r.sort) || 0), 0) + 1} 
          onClose={() => setModal(null)} 
          onSave={handleSave} 
        />
      )}

      <ConfirmDeleteModal
        isOpen={confirmModal.isOpen}
        isDeleting={confirmModal.type === 'single' ? deletingId === confirmModal.id : bulkDeleting}
        onClose={() => setConfirmModal({ isOpen: false, type: 'single', id: null })}
        onConfirm={() => handleDelete(confirmModal.id)}
        title="Delete Category"
        message="Are you sure you want to delete this category? If any products are assigned to this category, deletion will be blocked to prevent orphaned products."
      />

      <Toast toasts={toasts} onRemove={id => setToasts(t => t.filter(x => x.id !== id))} />
    </div>
  )
}
