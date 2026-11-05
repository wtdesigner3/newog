'use client'
import { useState, useEffect } from 'react'
import AIAssistantButton from '../../../../components/dashboard/AIAssistantButton'
import Breadcrumb from '../../../../components/dashboard/Breadcrumb'
import DataTable from '../../../../components/dashboard/DataTable'
import TableToolbar from '../../../../components/dashboard/TableToolbar'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../../../components/ui/dialog'
import { Button } from '../../../../components/ui/button'
import { FloatingInput, FloatingSelect } from '../../../../components/ui/floating-input'
import RichEditor from '../../../../components/dashboard/RichEditor'
import { Plus, Image as ImageIcon, ChevronRight, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../../../lib/utils'
import { Switch } from '../../../../components/ui/switch'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../../../../components/ui/dropdown-menu'
import { Edit2, Trash2, MoreVertical, ShieldCheck } from 'lucide-react'
import ConfirmDeleteModal from '../../../../components/dashboard/ConfirmDeleteModal'

const BASE_URL = ''
const EMPTY = { title: '', content: '', icon: '', status: 'active', sort: '' }

export default function WhyChoosePage() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState({ ...EMPTY })
  const [iconFile, setIconFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [toasts, setToasts] = useState([])
  const [deletingId, setDeletingId] = useState(null)
  const [statusTogglingId, setStatusTogglingId] = useState(null)

  // New States for Standardization
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('latest')
  const [selectedIds, setSelectedIds] = useState([])
  const [bulkDeleting, setBulkDeleting] = useState(false)
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: 'single', id: null })

  function addToast(message, type = 'success') {
    setToasts(t => [...t, { id: Date.now(), message, type }])
    setTimeout(() => {
      setToasts(t => t.filter(x => x.id !== t[t.length - 1]?.id))
    }, 4000)
  }

  useEffect(() => {
    fetchItems()
  }, [])

  async function fetchItems() {
    try {
      setLoading(true)
      const res = await fetch(`${BASE_URL}/api/why-choose`)
      if (!res.ok) throw new Error('Failed to fetch items')
      const data = await res.json()
      setRows(data)
    } catch (err) {
      addToast(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  function openCreate() {
    setForm({ ...EMPTY })
    setIconFile(null)
    setPreview('')
    setModal('new')
  }

  function openEdit(item) {
    setForm({ ...item })
    setIconFile(null)
    setPreview(item.icon || '')
    setModal(item)
  }

  function handleIcon(e) {
    const file = e.target.files[0]
    if (!file) return
    setIconFile(file)
    setPreview(URL.createObjectURL(file))
  }

  async function handleSave(e) {
    e.preventDefault()
    if (!form._id && !iconFile) {
      addToast('Please upload an icon image.', 'error')
      return
    }
    try {
      setSaving(true)

      const fd = new FormData()
      fd.append('title', form.title || '')
      fd.append('content', form.content || '')
      fd.append('status', form.status || 'active')
      fd.append('sort', form.sort || 0)
      if (iconFile) fd.append('icon', iconFile)

      const isEdit = Boolean(form._id)
      const url = isEdit ? `${BASE_URL}/api/why-choose/${form._id}` : `${BASE_URL}/api/why-choose`
      const method = isEdit ? 'PUT' : 'POST'

      const res = await fetch(url, { method, body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Save failed')

      addToast(isEdit ? 'Item updated successfully!' : 'Item added successfully!')
      setModal(null)
      fetchItems()
    } catch (err) {
      addToast(err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    try {
      setConfirmModal({ isOpen: false, type: 'single', id: null })
      setDeletingId(id)
      const res = await fetch(`${BASE_URL}/api/why-choose/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Delete failed')
      addToast('Item deleted.', 'warning')
      setRows(r => r.filter(x => x._id !== id))
      setSelectedIds(s => s.filter(x => x !== id))
    } catch (err) {
      addToast(err.message, 'error')
    } finally {
      setDeletingId(null)
    }
  }

  async function handleBulkDelete() {
    try {
      setConfirmModal({ isOpen: false, type: 'bulk', id: null })
      setBulkDeleting(true)
      await Promise.all(selectedIds.map(id => fetch(`${BASE_URL}/api/why-choose/${id}`, { method: 'DELETE' })))
      setRows(r => r.filter(x => !selectedIds.includes(x._id)))
      setSelectedIds([])
      addToast('Items deleted', 'warning')
    } catch (e) {
      addToast('Error deleting some items: ' + e.message, 'error')
    } finally {
      setBulkDeleting(false)
    }
  }

  async function toggleStatus(row) {
    try {
      setStatusTogglingId(row._id)
      const newStatus = row.status === 'active' ? 'inactive' : 'active'
      
      const fd = new FormData()
      fd.append('title', row.title)
      fd.append('content', row.content || '')
      fd.append('status', newStatus)
      fd.append('sort', row.sort || 0)

      const res = await fetch(`${BASE_URL}/api/why-choose/${row._id}`, { method: 'PUT', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Status update failed')
      
      setRows(r => r.map(x => x._id === row._id ? { ...x, status: newStatus } : x))
      addToast('Status updated.')
    } catch (err) {
      addToast(err.message, 'error')
    } finally {
      setStatusTogglingId(null)
    }
  }

  const stripHtml = html => html?.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() || ''

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredData.length) setSelectedIds([])
    else setSelectedIds(filteredData.map(x => x._id))
  }

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const filteredData = rows
    .filter(row => 
      row.title?.toLowerCase().includes(search.toLowerCase()) || 
      stripHtml(row.content).toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === 'latest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      if (sort === 'oldest') return new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
      if (sort === 'a-z') return (a.title || '').localeCompare(b.title || '')
      if (sort === 'z-a') return (b.title || '').localeCompare(a.title || '')
      return (a.sort || 0) - (b.sort || 0)
    })

  const columns = [
    {
      key: 'icon',
      label: 'Icon',
      render: (row) => (
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex items-center justify-center border border-border shrink-0 p-1">
          {row.icon ? (
             <img src={row.icon} alt={row.title} className="w-full h-full object-contain" style={{ filter: 'brightness(0)' }} />
          ) : (
             <ShieldCheck className="w-5 h-5 text-muted-foreground/50" />
          )}
        </div>
      )
    },
    {
      key: 'details',
      label: 'Details',
      render: (row) => (
        <div className="min-w-[200px] max-w-[350px]">
          <div className="font-bold text-foreground truncate">{row.title}</div>
          <div className="text-xs text-muted-foreground truncate mt-0.5">
            {stripHtml(row.content).substring(0, 100)}
            {stripHtml(row.content).length > 100 ? '…' : ''}
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
          {statusTogglingId === row._id ? (
             <span className="text-xs text-muted-foreground animate-pulse">Updating...</span>
          ) : (
             <Switch 
               checked={row.status === 'active'}
               onCheckedChange={() => toggleStatus(row)}
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
          <button onClick={(e) => { e.stopPropagation(); openEdit(row); }} className="w-8 h-8 rounded flex items-center justify-center transition-colors bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 dark:bg-blue-500/20 dark:text-blue-400 dark:hover:bg-blue-500/30">
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
        title="Why Choose Us Items" 
        subtitle={`Manage the unique selling points shown on the homepage (${rows.filter(r => r.status === 'active').length} active)`}
        crumbs={[{ label: 'Home Management' }, { label: 'Why Choose' }]} 
      />
      
      <TableToolbar 
        search={search}
        onSearchChange={setSearch}
        sort={sort}
        onSortChange={setSort}
        selectedCount={selectedIds.length}
        onBulkDelete={() => setConfirmModal({ isOpen: true, type: 'bulk', id: null })}
        bulkDeleting={bulkDeleting}
        onAdd={openCreate}
        addLabel="Add Item"
      />

      <DataTable 
        columns={columns}
        data={filteredData}
        loading={loading}
        onRowClick={openEdit}
        actions={false}
        selectedIds={selectedIds}
        onToggleSelectAll={toggleSelectAll}
        onToggleSelectRow={toggleSelect}
      />

      <Dialog open={!!modal} onOpenChange={(open) => !open && !saving && setModal(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold !text-white">{modal === 'new' ? "Add USP Item" : "Edit USP Item"}</DialogTitle>
            <p className="text-slate-300 text-sm mt-1">{modal === 'new' ? "Create a new 'Why Choose Us' point" : "Modify existing USP details"}</p>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-6 mt-4">
            <div className="space-y-6">
              <FloatingInput
                label="Title *"
                required
                value={form.title}
                onChange={e => setForm({...form, title: e.target.value})}
                rightElement={<AIAssistantButton context="Why Choose Us Reason" field="Catchy Title" onGenerate={(val) => setForm({...form, title: val})} />}
              />
              
              <div className="border border-input/60 rounded-xl p-4 bg-muted/10 space-y-4">
                <label className="text-sm font-semibold text-slate-200 block">Icon</label>
                <p className="text-[11px] text-slate-400">SVG, PNG or WebP recommended. Transparent background preferred.</p>
                <input
                  type="file"
                  accept="image/*,.svg"
                  onChange={handleIcon}
                  className="flex h-11 w-full rounded-xl border border-border bg-slate-900/60 text-slate-200 px-4 py-2 text-sm transition-all file:border-0 file:bg-blue-600/20 file:text-blue-400 file:rounded-lg file:px-3 file:py-1 file:mr-3 file:text-xs file:font-semibold hover:file:bg-blue-600/30 cursor-pointer hover:border-slate-600"
                />
                {preview && (
                  <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-700 mt-2 bg-[#0a0f1d] p-2 flex items-center justify-center">
                    <img src={preview} alt="preview" className="max-w-full max-h-full object-contain" />
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-sm font-semibold text-slate-200 block">Content Details *</label>
                  <AIAssistantButton context={form.title || 'Why Choose Us'} field="Compelling Reason Description" onGenerate={(val) => setForm({...form, content: val})} />
                </div>
                <div className="border border-slate-700/80 rounded-xl overflow-hidden w-full">
                  <RichEditor
                    value={form.content}
                    onChange={v => setForm({...form, content: v})}
                    placeholder="Describe this point..."
                    minHeight={200}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FloatingInput
                  label="Sort Order"
                  type="number"
                  min="0"
                  value={form.sort}
                  onChange={e => setForm({...form, sort: e.target.value})}
                />
                <FloatingSelect
                  label="Status"
                  value={form.status}
                  onChange={e => setForm({...form, status: e.target.value})}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </FloatingSelect>
              </div>
            </div>

            <DialogFooter className="pt-6 border-t border-slate-800 mt-6 flex justify-end gap-3 pb-2">
              <Button variant="ghost" type="button" onClick={() => setModal(null)} disabled={saving} className="rounded-full px-6 text-slate-300 hover:text-white hover:bg-slate-800 font-medium">Cancel</Button>
              <Button type="submit" disabled={saving} className="rounded-full px-8 py-5 bg-[#0f7ae0] hover:bg-[#0d69c2] text-white font-semibold text-[15px] shadow-lg shadow-blue-500/25 transition-transform active:scale-95">
                {saving ? 'Saving...' : modal === 'new' ? 'Save Item' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <ConfirmDeleteModal
        isOpen={confirmModal.isOpen}
        isDeleting={confirmModal.type === 'single' ? deletingId === confirmModal.id : bulkDeleting}
        onClose={() => setConfirmModal({ isOpen: false, type: 'single', id: null })}
        onConfirm={() => confirmModal.type === 'single' ? handleDelete(confirmModal.id) : handleBulkDelete()}
        title={confirmModal.type === 'single' ? "Delete Item" : "Bulk Delete"}
        message={confirmModal.type === 'single' 
          ? "Are you sure you want to delete this item? This action cannot be undone." 
          : `Are you sure you want to delete ${selectedIds.length} items? This action cannot be undone.`}
      />

      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className={cn(
              "fixed bottom-8 right-8 px-6 py-3 rounded-xl shadow-2xl text-white text-sm font-bold z-50 flex items-center gap-3",
              toast.type === 'success' ? "bg-polaris-primary" : "bg-red-600"
            )}
          >
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
               {toast.type === 'success' ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3 rotate-45" />}
            </div>
            {toast.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}