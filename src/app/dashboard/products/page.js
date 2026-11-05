'use client'
import { useState, useEffect } from 'react'
import Breadcrumb from '../../../components/dashboard/Breadcrumb'
import DataTable from '../../../components/dashboard/DataTable'
import TableToolbar from '../../../components/dashboard/TableToolbar'
import Toast from '../../../components/dashboard/Toast'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Badge } from '../../../components/ui/badge'
import { Switch } from '../../../components/ui/switch'
import { Edit2, Trash2, Layers, ImageIcon, ExternalLink, Zap, Star } from 'lucide-react'
import ConfirmDeleteModal from '../../../components/dashboard/ConfirmDeleteModal'
import BulkActionBar from '../../../components/dashboard/BulkActionBar'

// Lazy-load ProductModal so CKEditor doesn't crash SSR or other routes
const ProductModal = dynamic(() => import('./ProductModal'), { ssr: false })

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  
  // Filtering & Search
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [sort, setSort] = useState('latest')
  const [selectedIds, setSelectedIds] = useState([])
  const [bulkDeleting, setBulkDeleting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [togglingId, setTogglingId] = useState(null)
  const [toasts, setToasts] = useState([])
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: 'single', id: null })
  
  const addToast = (msg, type = 'success') => setToasts(t => [...t, { id: Date.now(), message: msg, type }])

  useEffect(() => {
    const t = Date.now();
    Promise.all([
      fetch(`/api/products?t=${t}`, { cache: 'no-store' }).then(r => r.json()),
      fetch(`/api/categories?t=${t}`, { cache: 'no-store' }).then(r => r.json())
    ]).then(([prods, cats]) => {
      setProducts(Array.isArray(prods) ? prods : (prods?.data || []))
      setCategories(Array.isArray(cats) ? cats : (cats?.data || []))
      setLoading(false)
    }).catch(e => {
      console.error(e)
      addToast('Failed to load products from server', 'danger')
      setLoading(false)
    })
  }, [])

  function handleSave(savedProd) {
    setProducts(r => {
      const idx = r.findIndex(x => x._id === savedProd._id)
      if (idx > -1) {
        const nr = [...r]; nr[idx] = savedProd; return nr
      }
      return [savedProd, ...r]
    })
    setModal(null)
    addToast(`Product "${savedProd.model || savedProd.name}" saved successfully!`)
  }

  async function handleDelete(id) {
    try {
      setConfirmModal({ isOpen: false, type: 'single', id: null })
      setDeletingId(id)
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to delete')
      
      setProducts(r => r.filter(x => x._id !== id))
      setSelectedIds(prev => prev.filter(x => x !== id))
      addToast(data.message || 'Product removed.', 'warning')
    } catch (e) {
      addToast(e.message, 'danger')
    } finally {
      setDeletingId(null)
    }
  }

  async function handleBulkDelete() {
    try {
      setConfirmModal({ isOpen: false, type: 'bulk', id: null })
      setBulkDeleting(true)
      await Promise.all(selectedIds.map(id => fetch(`/api/products/${id}`, { method: 'DELETE' })))
      setProducts(r => r.filter(x => !selectedIds.includes(x._id)))
      setSelectedIds([])
      addToast('Selected products removed.', 'warning')
    } catch (e) {
      alert('Error deleting products: ' + e.message)
    } finally {
      setBulkDeleting(false)
    }
  }

  const [bulkProcessing, setBulkProcessing] = useState(false)
  const [activeBulkAction, setActiveBulkAction] = useState('')

  async function handleBulkAction(action) {
    if (action === 'delete') {
      setConfirmModal({ isOpen: true, type: 'bulk', id: null })
      return
    }

    try {
      setBulkProcessing(true)
      setActiveBulkAction(action)
      const res = await fetch('/api/products/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ids: selectedIds }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Bulk operation failed')

      const nextStatus = action === 'publish' ? 'published' : (action === 'unpublish' ? 'draft' : 'archived')
      const nextActive = action === 'publish'
      setProducts(prev => prev.map(p => selectedIds.includes(p._id) ? { ...p, status: nextStatus, isActive: nextActive } : p))
      setSelectedIds([])
      addToast(data.message || `Successfully executed ${action} on selected products.`)
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
      const existing = products.find(x => x._id === id)
      const nextActive = !currentStatus
      const nextStatus = nextActive ? 'published' : 'draft'

      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: nextStatus,
          isActive: nextActive,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || 'Failed to update status')
      }

      setProducts(r => r.map(x => x._id === id ? { ...x, isActive: nextActive, status: nextStatus } : x))
      addToast(`Product set to ${nextStatus}.`)
    } catch (e) {
      addToast(e.message, 'danger')
    } finally {
      setTogglingId(null)
    }
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredData.length) setSelectedIds([])
    else setSelectedIds(filteredData.map(x => x._id))
  }

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const filteredData = products
    .filter(p => {
      // Search
      const q = search.toLowerCase()
      const matchSearch =
        !search ||
        p.name?.toLowerCase().includes(q) ||
        p.model?.toLowerCase().includes(q) ||
        p.slug?.toLowerCase().includes(q) ||
        p.series?.toLowerCase().includes(q)

      // Category filter
      const matchCat =
        selectedCategory === 'all' ||
        p.categorySlug === selectedCategory ||
        p.category?._id === selectedCategory ||
        p.category?.slug === selectedCategory

      // Status filter
      const matchStatus =
        selectedStatus === 'all' ||
        (selectedStatus === 'published' && (p.status === 'published' || (p.isActive && !p.status))) ||
        (selectedStatus === 'draft' && (p.status === 'draft' || (!p.isActive && p.status !== 'archived'))) ||
        (selectedStatus === 'archived' && p.status === 'archived')

      return matchSearch && matchCat && matchStatus
    })
    .sort((a, b) => {
      if (sort === 'latest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      if (sort === 'oldest') return new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
      if (sort === 'a-z') return (a.model || a.name || '').localeCompare(b.model || b.name || '')
      if (sort === 'z-a') return (b.model || b.name || '').localeCompare(a.model || a.name || '')
      return (a.sort || 0) - (b.sort || 0)
    })

  const columns = [
    {
      key: 'image',
      label: 'Image',
      render: (row) => (
        <div className="w-11 h-11 rounded-lg bg-muted/40 border border-border flex items-center justify-center overflow-hidden shrink-0">
          {row.image ? (
            <img
              src={row.image.startsWith('http') ? row.image : (row.image.startsWith('/') ? row.image : `/uploads/${row.image}`)}
              alt={row.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <ImageIcon className="w-5 h-5 text-muted-foreground/40" />
          )}
        </div>
      )
    },
    {
      key: 'model',
      label: 'Model & Specifications',
      render: (row) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-sm text-foreground bg-muted/60 px-2 py-0.5 rounded border border-border">
              {row.model || row.name}
            </span>
            {row.isFlagship && (
              <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-300 text-[10px] py-0 h-4">
                <Star className="w-2.5 h-2.5 mr-0.5 fill-amber-500" /> Flagship
              </Badge>
            )}
          </div>
          <span className="text-xs text-foreground font-medium mt-1 truncate max-w-[280px]">
            {row.name}
          </span>
          <span className="text-[11px] text-muted-foreground">
            {row.tonnage || '—'} &bull; {row.starRating || 'Heavy Duty'} &bull; {row.technology || 'Tropical Rotary'}
          </span>
        </div>
      )
    },
    {
      key: 'category',
      label: 'Category',
      render: (row) => (
        <Badge variant="outline" className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 font-medium text-xs">
          {row.category?.shortName || row.category?.name || row.categorySlug || '—'}
        </Badge>
      )
    },
    {
      key: 'cooling',
      label: 'Cooling / Ambient',
      render: (row) => (
        <div className="text-xs">
          <span className="font-semibold text-foreground">
            {row.specs?.coolingCapacity || row.specs?.coolingBtu || '—'}
          </span>
          <div className="text-[11px] text-muted-foreground">
            Max {row.maxAmbient || row.specs?.maxAmbient || '50°C'}
          </div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => {
        const isPub = row.status === 'published' || (row.isActive && !row.status)
        const isArch = row.status === 'archived'
        return (
          <div className="flex items-center gap-2">
            {togglingId === row._id ? (
              <span className="text-xs text-muted-foreground animate-pulse">Updating...</span>
            ) : (
              <Switch 
                checked={isPub}
                disabled={isArch}
                onCheckedChange={() => handleToggleStatus(row._id, isPub)}
              />
            )}
            <Badge
              variant="outline"
              className={`text-[10px] py-0 px-1.5 capitalize ${
                isPub
                  ? 'bg-emerald-500/10 text-emerald-600 border-emerald-300'
                  : isArch
                  ? 'bg-slate-500/10 text-slate-600 border-slate-300'
                  : 'bg-amber-500/10 text-amber-600 border-amber-300'
              }`}
            >
              {row.status || (row.isActive ? 'published' : 'draft')}
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
              href={`/products/${row.categorySlug || 'all'}/${row.slug}`}
              target="_blank"
              title="Preview on Public Website"
              className="w-8 h-8 rounded flex items-center justify-center transition-colors bg-muted text-muted-foreground hover:text-foreground"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); setModal(row); }}
            title="Edit Product"
            className="w-8 h-8 rounded flex items-center justify-center transition-colors bg-blue-500/10 text-blue-600 hover:bg-blue-500/20"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setConfirmModal({ isOpen: true, type: 'single', id: row._id }); }}
            disabled={deletingId === row._id}
            title="Delete / Archive Product"
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

  const customButtons = (
    <Link href="/dashboard/products/categories">
      <div className="inline-flex items-center justify-center rounded-md px-4 h-10 font-medium bg-transparent border border-border hover:bg-muted transition-colors text-sm cursor-pointer">
        <Layers className="w-4 h-4 mr-1.5" /> Categories
      </div>
    </Link>
  )

  const activeCount = products.filter(p => p.status === 'published' || (p.isActive && !p.status)).length
  const draftCount = products.filter(p => p.status === 'draft' || (!p.isActive && p.status !== 'archived')).length

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 bg-background min-h-full">
      <Breadcrumb 
        title="Heavy Duty Products" 
        subtitle={`Manage HVAC product models (${activeCount} published, ${draftCount} draft)`}
        crumbs={[{ label: 'Product Management' }, { label: 'All Products' }]} 
      />

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-3 bg-card p-3 rounded-lg border border-border">
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
          <span>Filters:</span>
        </div>

        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="text-xs bg-background border border-border rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="all">All Categories</option>
          {categories.map(c => (
            <option key={c._id} value={c.slug || c._id}>
              {c.name}
            </option>
          ))}
        </select>

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

        {(selectedCategory !== 'all' || selectedStatus !== 'all' || search) && (
          <button
            onClick={() => {
              setSelectedCategory('all')
              setSelectedStatus('all')
              setSearch('')
            }}
            className="text-xs text-primary hover:underline ml-auto"
          >
            Clear Filters
          </button>
        )}
      </div>
      
      <TableToolbar 
        search={search}
        onSearchChange={setSearch}
        sort={sort}
        onSortChange={setSort}
        selectedCount={selectedIds.length}
        onBulkDelete={() => setConfirmModal({ isOpen: true, type: 'bulk', id: null })}
        bulkDeleting={bulkDeleting}
        onAdd={() => setModal('new')}
        addLabel="Add HVAC Product"
        extraActions={customButtons}
      />

      <DataTable 
        columns={columns}
        data={filteredData}
        loading={loading}
        onRowClick={(row) => setModal(row)}
        actions={false}
        selectedIds={selectedIds}
        onToggleSelectAll={toggleSelectAll}
        onToggleSelectRow={toggleSelect}
      />
      
      {modal && (
        <ProductModal
          product={modal === 'new' ? null : modal}
          categories={categories}
          nextSort={products.reduce((max, r) => Math.max(max, Number(r.sort) || 0), 0) + 1}
          onClose={() => setModal(null)}
          onSave={handleSave}
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
        isDeleting={confirmModal.type === 'single' ? deletingId === confirmModal.id : bulkDeleting}
        onClose={() => setConfirmModal({ isOpen: false, type: 'single', id: null })}
        onConfirm={() => confirmModal.type === 'single' ? handleDelete(confirmModal.id) : handleBulkDelete()}
        title={confirmModal.type === 'single' ? "Remove Product" : "Bulk Remove"}
        message={confirmModal.type === 'single' 
          ? "Are you sure you want to remove this product? It will be archived and delisted from the public website." 
          : `Are you sure you want to remove ${selectedIds.length} products?`}
      />

      <Toast toasts={toasts} onRemove={id => setToasts(t => t.filter(x => x.id !== id))} />
    </div>
  )
}
