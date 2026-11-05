'use client'
import { useState, useEffect } from 'react'
import AIAssistantButton from '../../../../components/dashboard/AIAssistantButton'
import Breadcrumb from '../../../../components/dashboard/Breadcrumb'
import DataTable from '../../../../components/dashboard/DataTable'
import TableToolbar from '../../../../components/dashboard/TableToolbar'
import Toast from '../../../../components/dashboard/Toast'
import { Button } from '../../../../components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../../../components/ui/dialog'
import { Switch } from '../../../../components/ui/switch'
import { FloatingInput } from '../../../../components/ui/floating-input'
import { SlugInput } from '../../../../components/dashboard/SlugInput'
import { SortInput } from '../../../../components/dashboard/SortInput'
import { Edit2, Trash2, Plus, Folder } from 'lucide-react'
import ConfirmDeleteModal from '../../../../components/dashboard/ConfirmDeleteModal'

const EMPTY = { 
  name: '', slug: '', sort: '',
  metatag: '', metaDescription: '', metakeywords: '', canonicalUrl: '',
  ogTitle: '', ogDescription: '', twitterCard: 'summary_large_image', robots: 'index, follow',
  schema: ''
}

function SectionModal({ section, nextSort = 1, onClose, onSave }) {
  const [form, setForm] = useState(() => {
    if (!section) return { ...EMPTY, sort: nextSort }
    return {
      ...EMPTY,
      ...section,
    }
  })
  const [saving, setSaving] = useState(false)
  // Slug is "linked" only when creating a new section
  const [slugLinked, setSlugLinked] = useState(!section)
  const [sortIsAuto, setSortIsAuto] = useState(!section)
  
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }))

  function toSlug(str) {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    const formData = new FormData()
    
    Object.keys(form).forEach(k => {
      formData.append(k, form[k])
    })

    // If new, set isActive true
    if (!section) {
      formData.append('isActive', 'true')
    } else {
      formData.append('isActive', section.isActive ? 'true' : 'false')
    }

    try {
      const url = section ? `/api/sections/${section._id}` : '/api/sections'
      const method = section ? 'PUT' : 'POST'
      const res = await fetch(url, { method, body: formData })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      onSave(data)
    } catch (err) {
      alert(err.message || 'Failed to save section')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={(open) => !open && !saving && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold !text-white">{section ? 'Edit Section' : 'Add Section'}</DialogTitle>
          <p className="text-slate-300 text-sm mt-1">Fill out the information below to {section ? 'update' : 'create'} this section.</p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <FloatingInput 
              label="Section Name *" 
              required 
              value={form.name} 
              onChange={e => { 
                f('name', e.target.value)
                if (slugLinked) f('slug', toSlug(e.target.value))
              }} 
              rightElement={<AIAssistantButton context="Website Section/Page Group" field="Section Name" onGenerate={(val) => {
                f('name', val)
                if (slugLinked) f('slug', toSlug(val))
              }} />}
            />
            <SlugInput
              label="URL Slug *"
              required
              value={form.slug}
              isEditing={!!section}
              linked={slugLinked}
              onToggleLink={() => {
                const nextLinked = !slugLinked
                setSlugLinked(nextLinked)
                if (nextLinked) f('slug', toSlug(form.name))
              }}
              onChange={v => {
                setSlugLinked(false)
                f('slug', v)
              }}
            />
            <SortInput
              label="Sort Order"
              value={form.sort}
              isEditing={Boolean(section)}
              isAuto={sortIsAuto}
              onManualEdit={() => setSortIsAuto(false)}
              onChange={v => f('sort', v)}
            />
          </div>

          <DialogFooter className="pt-6 border-t border-border mt-6">
            <Button variant="ghost" type="button" onClick={onClose} disabled={saving} className="rounded-full px-6 text-muted-foreground hover:bg-muted/50 font-medium">Cancel</Button>
            <Button type="submit" disabled={saving} className="rounded-full px-10 py-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[15px] shadow-lg shadow-blue-500/30 transition-transform active:scale-95">
              {saving ? 'Saving...' : 'Save Section'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default function SectionsPage() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  
  // Standardization states
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('latest')
  const [selectedIds, setSelectedIds] = useState([])
  const [bulkDeleting, setBulkDeleting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [togglingId, setTogglingId] = useState(null)
  const [toasts, setToasts] = useState([])
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: 'single', id: null })
  
  const addToast = (msg, type = 'success') => setToasts(t => [...t, { id: Date.now(), message: msg, type }])

  useEffect(() => {
    fetch('/api/sections')
      .then(r => r.json())
      .then(data => {
        setRows(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(e => {
        console.error(e)
        addToast('Failed to load sections', 'danger')
        setLoading(false)
      })
  }, [])

  function handleSave(savedSection) {
    setRows(r => {
      const idx = r.findIndex(x => x._id === savedSection._id)
      if (idx > -1) {
        const nr = [...r]; nr[idx] = savedSection; return nr;
      }
      return [...r, savedSection]
    })
    setModal(null)
    addToast('Section saved successfully!')
    window.dispatchEvent(new Event('sectionsUpdated'))
  }

  async function handleDelete(id) {
    try {
      setConfirmModal({ isOpen: false, type: 'single', id: null })
      setDeletingId(id)
      const res = await fetch(`/api/sections/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      setRows(r => r.filter(x => x._id !== id))
      setSelectedIds(prev => prev.filter(x => x !== id))
      addToast('Section deleted', 'warning')
      window.dispatchEvent(new Event('sectionsUpdated'))
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
      await Promise.all(selectedIds.map(id => fetch(`/api/sections/${id}`, { method: 'DELETE' })))
      setRows(r => r.filter(x => !selectedIds.includes(x._id)))
      setSelectedIds([])
      addToast('Sections deleted', 'warning')
      window.dispatchEvent(new Event('sectionsUpdated'))
    } catch (e) {
      alert('Error deleting some sections: ' + e.message)
    } finally {
      setBulkDeleting(false)
    }
  }

  async function handleToggleStatus(id, currentStatus) {
    try {
      setTogglingId(id)
      const existing = rows.find(x => x._id === id)
      const fd = new FormData()
      fd.append('name', existing?.name || '')
      fd.append('slug', existing?.slug || '')
      fd.append('sort', existing?.sort ?? '')
      fd.append('isActive', (!currentStatus).toString())
      const res = await fetch(`/api/sections/${id}`, { method: 'PUT', body: fd })
      if (!res.ok) throw new Error(await res.text())
      setRows(r => r.map(x => x._id === id ? { ...x, isActive: !currentStatus } : x))
      addToast('Status updated!')
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

  const filteredData = rows
    .filter(row => 
      row.name?.toLowerCase().includes(search.toLowerCase()) || 
      row.slug?.toLowerCase().includes(search.toLowerCase())
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
      key: 'section',
      label: 'Section Details',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500">
            <Folder className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-[14px] text-foreground">{row.name}</span>
            <span className="text-xs text-muted-foreground mt-0.5 font-mono">{row.slug}</span>
          </div>
        </div>
      )
    },
    {
      key: 'sort',
      label: 'Sort',
      render: (row) => <span className="font-medium text-sm text-muted-foreground">{row.sort}</span>
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
              checked={row.isActive}
              onCheckedChange={() => handleToggleStatus(row._id, row.isActive)}
            />
          )}
        </div>
      )
    },
    {
      key: 'actions',
      align: 'right',
      label: 'Action',
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <button onClick={(e) => { e.stopPropagation(); setModal(row); }} className="w-8 h-8 rounded flex items-center justify-center transition-colors bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 dark:bg-blue-500/20 dark:text-blue-400 dark:hover:bg-blue-500/30">
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); setConfirmModal({ isOpen: true, type: 'single', id: row._id }); }} disabled={deletingId === row._id} className="w-8 h-8 rounded flex items-center justify-center transition-colors bg-red-500/10 text-red-600 hover:bg-red-500/20 dark:bg-red-500/20 dark:text-red-400 dark:hover:bg-red-500/30 disabled:opacity-50">
            {deletingId === row._id ? <span className="w-4 h-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" /> : <Trash2 className="w-4 h-4" />}
          </button>
        </div>
      )
    }
  ]

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 bg-background min-h-full">
      <Breadcrumb 
        title="Inner Page Sections" 
        subtitle={`Manage your page categories (${rows.filter(r => r.isActive).length} active)`}
        crumbs={[{ label: 'Inner Pages' }, { label: 'Sections' }]} 
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
        addLabel="Add Section"
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
      
      {modal && <SectionModal section={modal === 'new' ? null : modal} nextSort={rows.reduce((max, r) => Math.max(max, Number(r.sort) || 0), 0) + 1} onClose={() => setModal(null)} onSave={handleSave} />}
      
      <ConfirmDeleteModal
        isOpen={confirmModal.isOpen}
        isDeleting={confirmModal.type === 'single' ? deletingId === confirmModal.id : bulkDeleting}
        onClose={() => setConfirmModal({ isOpen: false, type: 'single', id: null })}
        onConfirm={() => confirmModal.type === 'single' ? handleDelete(confirmModal.id) : handleBulkDelete()}
        title={confirmModal.type === 'single' ? "Delete Section" : "Bulk Delete"}
        message={confirmModal.type === 'single' 
          ? "Are you sure you want to delete this section? This will not delete the associated pages." 
          : `Are you sure you want to delete ${selectedIds.length} sections? This will not delete the associated pages.`}
      />
      
      <Toast toasts={toasts} onRemove={id => setToasts(t => t.filter(x => x.id !== id))} />
    </div>
  )
}
