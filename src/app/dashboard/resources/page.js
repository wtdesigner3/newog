'use client'
import { useState, useEffect } from 'react'
import Breadcrumb from '../../../components/dashboard/Breadcrumb'
import DataTable from '../../../components/dashboard/DataTable'
import TableToolbar from '../../../components/dashboard/TableToolbar'
import Toast from '../../../components/dashboard/Toast'
import ResourceModal from './ResourceModal'
import { Badge } from '../../../components/ui/badge'
import { Switch } from '../../../components/ui/switch'
import { Edit2, Trash2, FileText, Download, ExternalLink, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import ConfirmDeleteModal from '../../../components/dashboard/ConfirmDeleteModal'
import BulkActionBar from '../../../components/dashboard/BulkActionBar'

export default function ResourcesPage() {
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [sort, setSort] = useState('latest')
  const [selectedIds, setSelectedIds] = useState([])
  const [deletingId, setDeletingId] = useState(null)
  const [togglingId, setTogglingId] = useState(null)
  const [toasts, setToasts] = useState([])
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: 'single', id: null })

  const addToast = (msg, type = 'success') => setToasts(t => [...t, { id: Date.now(), message: msg, type }])

  const fetchResources = () => {
    fetch(`/api/resources?t=${Date.now()}`, { cache: 'no-store' })
      .then(r => r.json())
      .then(data => {
        setResources(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        addToast('Failed to load technical resources', 'danger')
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchResources()
  }, [])

  function handleSave(savedRes) {
    setResources(r => {
      const idx = r.findIndex(x => x._id === savedRes._id || x.id === savedRes.id)
      if (idx > -1) {
        const nr = [...r]; nr[idx] = savedRes; return nr
      }
      return [savedRes, ...r]
    })
    setModal(null)
    addToast(`Resource "${savedRes.title}" saved successfully!`)
  }

  async function handleDelete(id) {
    try {
      setConfirmModal({ isOpen: false, type: 'single', id: null })
      setDeletingId(id)
      const res = await fetch(`/api/resources/${id}`, { method: 'DELETE' })
      const data = await res.json()

      if (!res.ok) throw new Error(data.message || 'Delete failed')

      setResources(r => r.filter(x => x._id !== id && x.id !== id))
      setSelectedIds(prev => prev.filter(x => x !== id))
      addToast(data.message || 'Resource deleted.', 'warning')
    } catch (e) {
      addToast(e.message, 'danger')
    } finally {
      setDeletingId(null)
    }
  }

  const [bulkProcessing, setBulkProcessing] = useState(false)
  const [activeBulkAction, setActiveBulkAction] = useState('')

  async function handleBulkAction(action) {
    if (action === 'delete') {
      if (!confirm(`Are you sure you want to delete ${selectedIds.length} resource(s)?`)) return
      try {
        setBulkProcessing(true)
        setActiveBulkAction('delete')
        await Promise.all(selectedIds.map(id => fetch(`/api/resources/${id}`, { method: 'DELETE' })))
        setResources(r => r.filter(x => !selectedIds.includes(x._id) && !selectedIds.includes(x.id)))
        setSelectedIds([])
        addToast('Selected resources removed.', 'warning')
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
      const res = await fetch('/api/resources/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ids: selectedIds }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Bulk operation failed')

      const nextStatus = action === 'publish' ? 'published' : (action === 'unpublish' ? 'draft' : 'archived')
      const nextActive = action === 'publish'
      setResources(prev => prev.map(r => (selectedIds.includes(r._id) || selectedIds.includes(r.id)) ? { ...r, status: nextStatus, isActive: nextActive } : r))
      setSelectedIds([])
      addToast(data.message || `Successfully executed ${action} on selected resources.`)
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

      const res = await fetch(`/api/resources/${id}`, {
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

      setResources(r => r.map(x => (x._id === id || x.id === id) ? { ...x, isActive: nextActive, status: nextStatus } : x))
      addToast(`Resource status set to ${nextStatus}.`)
    } catch (e) {
      addToast(e.message, 'danger')
    } finally {
      setTogglingId(null)
    }
  }

  const filteredData = resources
    .filter(r => {
      const q = search.toLowerCase()
      const matchSearch =
        !search ||
        r.title?.toLowerCase().includes(q) ||
        r.id?.toLowerCase().includes(q) ||
        r.applicableProducts?.toLowerCase().includes(q)

      const matchCat =
        selectedCategory === 'all' || r.category === selectedCategory

      const matchStatus =
        selectedStatus === 'all' ||
        (selectedStatus === 'published' && (r.status === 'published' || (r.isActive && !r.status))) ||
        (selectedStatus === 'draft' && (r.status === 'draft' || (!r.isActive && r.status !== 'archived'))) ||
        (selectedStatus === 'archived' && r.status === 'archived')

      return matchSearch && matchCat && matchStatus
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
      key: 'title',
      label: 'Document Title & ID',
      render: (row) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-foreground">{row.title}</span>
            {row.verified && (
              <Badge variant="outline" className="text-[10px] py-0 px-1.5 bg-emerald-500/10 text-emerald-600 border-emerald-300">
                <ShieldCheck className="w-2.5 h-2.5 mr-0.5" /> Verified
              </Badge>
            )}
          </div>
          <span className="text-xs text-muted-foreground font-mono mt-0.5">{row.id}</span>
          <span className="text-[11px] text-muted-foreground mt-0.5">
            {row.applicableProducts || 'All Models'} &bull; {row.edition || '2026 Edition'}
          </span>
        </div>
      )
    },
    {
      key: 'category',
      label: 'Category',
      render: (row) => (
        <Badge variant="outline" className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 text-xs capitalize">
          {row.categoryName || row.category}
        </Badge>
      )
    },
    {
      key: 'file',
      label: 'File / Size',
      render: (row) => (
        <div className="flex flex-col text-xs">
          <span className="font-semibold text-foreground flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-muted-foreground" />
            {row.fileType || 'PDF'}
          </span>
          <span className="text-muted-foreground text-[11px]">
            {row.fileSize || '1.5 MB'} {row.pageCount ? `• ${row.pageCount} pgs` : ''}
          </span>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => {
        const isPub = row.status === 'published' || (row.isActive && !row.status)
        return (
          <div className="flex items-center gap-2">
            {togglingId === (row._id || row.id) ? (
              <span className="text-xs text-muted-foreground animate-pulse">Updating...</span>
            ) : (
              <Switch
                checked={isPub}
                onCheckedChange={() => handleToggleStatus(row._id || row.id, isPub)}
              />
            )}
            <span className="text-[11px] text-muted-foreground capitalize">
              {row.status || (row.isActive ? 'published' : 'draft')}
            </span>
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
          {row.filePath && (
            <a
              href={row.filePath}
              target="_blank"
              rel="noreferrer"
              title="Download / View PDF"
              className="w-8 h-8 rounded flex items-center justify-center transition-colors bg-muted text-muted-foreground hover:text-foreground"
            >
              <Download className="w-3.5 h-3.5" />
            </a>
          )}
          <button
            onClick={() => setModal(row)}
            title="Edit Resource"
            className="w-8 h-8 rounded flex items-center justify-center transition-colors bg-blue-500/10 text-blue-600 hover:bg-blue-500/20"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setConfirmModal({ isOpen: true, type: 'single', id: row._id || row.id })}
            title="Delete / Archive Resource"
            className="w-8 h-8 rounded flex items-center justify-center transition-colors bg-red-500/10 text-red-600 hover:bg-red-500/20"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )
    }
  ]

  const activeCount = resources.filter(r => r.status === 'published' || (r.isActive && !r.status)).length

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 bg-background min-h-full">
      <Breadcrumb
        title="Technical Resources"
        subtitle={`Manage user manuals, error codes, and catalogues (${activeCount} published)`}
        crumbs={[{ label: 'Resources' }]}
      />

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-3 bg-card p-3 rounded-lg border border-border">
        <span className="text-xs font-semibold text-muted-foreground">Filters:</span>

        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="text-xs bg-background border border-border rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="all">All Document Types</option>
          <option value="catalogues">Product Catalogues</option>
          <option value="manuals">User & Installation Manuals</option>
          <option value="error-codes">Error Codes & Troubleshooting</option>
          <option value="warranty">Warranty Terms & Policies</option>
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

        <Link
          href="/resources"
          target="_blank"
          className="ml-auto text-xs text-primary hover:underline flex items-center gap-1"
        >
          <ExternalLink className="w-3.5 h-3.5" /> View Public Resource Center
        </Link>
      </div>

      <TableToolbar
        search={search}
        onSearchChange={setSearch}
        sort={sort}
        onSortChange={setSort}
        selectedCount={selectedIds.length}
        onAdd={() => setModal('new')}
        addLabel="Add Technical Resource"
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
          else setSelectedIds(filteredData.map(x => x._id || x.id))
        }}
        onToggleSelectRow={(id) => {
          setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
        }}
      />

      {modal && (
        <ResourceModal
          resource={modal === 'new' ? null : modal}
          nextSort={resources.reduce((max, r) => Math.max(max, Number(r.sort) || 0), 0) + 1}
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
        isDeleting={deletingId === confirmModal.id}
        onClose={() => setConfirmModal({ isOpen: false, type: 'single', id: null })}
        onConfirm={() => handleDelete(confirmModal.id)}
        title="Remove Technical Resource"
        message="Are you sure you want to remove this resource document? It will be archived and delisted from the public Download Center."
      />

      <Toast toasts={toasts} onRemove={id => setToasts(t => t.filter(x => x.id !== id))} />
    </div>
  )
}

