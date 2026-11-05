'use client'
import { useState, useEffect } from 'react'
import AIAssistantButton from '../../../../components/dashboard/AIAssistantButton'
import Breadcrumb from '../../../../components/dashboard/Breadcrumb'
import DataTable from '../../../../components/dashboard/DataTable'
import TableToolbar from '../../../../components/dashboard/TableToolbar'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../../../components/ui/dialog'
import { Button } from '../../../../components/ui/button'
import { FloatingInput, FloatingSelect } from '../../../../components/ui/floating-input'
import { Switch } from '../../../../components/ui/switch'
import { SortInput } from '../../../../components/dashboard/SortInput'
import ConfirmDeleteModal from '../../../../components/dashboard/ConfirmDeleteModal'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../../../lib/utils'
import {
  Star,
  Quote,
  Building2,
  ShieldCheck,
  Edit2,
  Trash2,
  Plus,
  Check,
  User,
  Sparkles,
  RotateCcw,
  Image as ImageIcon
} from 'lucide-react'

const BASE_URL = ''

const EMPTY = {
  name: '',
  role: '',
  company: '',
  equipment: '',
  highlight: '',
  stars: 5,
  quote: '',
  sort: 1,
  status: 'active',
  avatar: '',
}

export default function TestimonialsDashboardPage() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState({ ...EMPTY })
  const [avatarFile, setAvatarFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [toasts, setToasts] = useState([])
  const [sortIsAuto, setSortIsAuto] = useState(false)

  // Toolbar & Selection
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
      const res = await fetch(`${BASE_URL}/api/testimonials`)
      if (!res.ok) throw new Error('Failed to load testimonials')
      const data = await res.json()
      setRows(Array.isArray(data) ? data : [])
    } catch (err) {
      addToast(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  function openCreate() {
    const nextSort = rows.length > 0 ? Math.max(...rows.map(r => r.sort || 0)) + 1 : 1
    setForm({ ...EMPTY, sort: nextSort })
    setAvatarFile(null)
    setPreview('')
    setSortIsAuto(false)
    setModal('create')
  }

  function openEdit(row) {
    setForm({
      ...row,
      stars: Number(row.stars) || 5,
      sort: row.sort || 1,
    })
    setAvatarFile(null)
    setPreview(row.avatar || '')
    setSortIsAuto(false)
    setModal('edit')
  }

  function handleAvatar(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarFile(file)
    setPreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name?.trim()) {
      addToast('Please enter the client / executive name', 'error')
      return
    }
    if (!form.quote?.trim()) {
      addToast('Please enter the review quote', 'error')
      return
    }

    try {
      setSaving(true)
      const url = modal === 'create' ? `${BASE_URL}/api/testimonials` : `${BASE_URL}/api/testimonials/${form._id}`
      const method = modal === 'create' ? 'POST' : 'PUT'

      const fd = new FormData()
      fd.append('name', form.name.trim())
      fd.append('role', form.role?.trim() || '')
      fd.append('company', form.company?.trim() || '')
      fd.append('equipment', form.equipment?.trim() || '')
      fd.append('highlight', form.highlight?.trim() || '')
      fd.append('stars', String(form.stars || 5))
      fd.append('quote', form.quote.trim())
      fd.append('sort', String(form.sort || 1))
      fd.append('status', form.status || 'active')
      if (avatarFile) fd.append('avatar', avatarFile)

      const res = await fetch(url, {
        method,
        body: fd,
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Save failed')

      addToast(modal === 'create' ? 'Testimonial added successfully!' : 'Testimonial updated successfully!')
      setModal(null)
      fetchItems()
    } catch (err) {
      addToast(err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  async function toggleStatus(row) {
    const nextStatus = row.status === 'active' ? 'inactive' : 'active'
    try {
      const res = await fetch(`${BASE_URL}/api/testimonials/${row._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      })
      if (!res.ok) throw new Error('Status update failed')
      setRows(prev => prev.map(r => r._id === row._id ? { ...r, status: nextStatus } : r))
      addToast(`Status changed to ${nextStatus}`)
    } catch (err) {
      addToast(err.message, 'error')
    }
  }

  function handleDelete(id) {
    setConfirmModal({ isOpen: true, type: 'single', id })
  }

  async function executeDelete(id) {
    try {
      const res = await fetch(`${BASE_URL}/api/testimonials/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      addToast('Testimonial deleted successfully')
      fetchItems()
    } catch (err) {
      addToast(err.message, 'error')
    }
  }

  async function handleBulkDelete() {
    if (selectedIds.length === 0) return
    setConfirmModal({ isOpen: true, type: 'bulk', id: null })
  }

  async function executeBulkDelete() {
    try {
      setBulkDeleting(true)
      for (const id of selectedIds) {
        await fetch(`${BASE_URL}/api/testimonials/${id}`, { method: 'DELETE' })
      }
      addToast(`Deleted ${selectedIds.length} testimonials successfully`)
      setSelectedIds([])
      fetchItems()
    } catch (err) {
      addToast(err.message, 'error')
    } finally {
      setBulkDeleting(false)
    }
  }

  // Filter & Sort
  const filteredRows = rows
    .filter(r => {
      const q = search.toLowerCase()
      return (
        r.name?.toLowerCase().includes(q) ||
        r.company?.toLowerCase().includes(q) ||
        r.role?.toLowerCase().includes(q) ||
        r.equipment?.toLowerCase().includes(q) ||
        r.highlight?.toLowerCase().includes(q) ||
        r.quote?.toLowerCase().includes(q)
      )
    })
    .sort((a, b) => {
      if (sort === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt)
      if (sort === 'a-z') return (a.name || '').localeCompare(b.name || '')
      if (sort === 'z-a') return (b.name || '').localeCompare(a.name || '')
      if (sort === 'sort-asc') return (a.sort || 0) - (b.sort || 0)
      return new Date(b.createdAt) - new Date(a.createdAt)
    })

  const columns = [
    {
      header: 'Author & Facility',
      accessor: 'name',
      render: row => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-400/20 text-[#0f7ae0] flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden">
            {row.avatar ? (
              <img src={row.avatar} alt={row.name} className="w-full h-full object-cover" />
            ) : (
              <span>{row.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'OG'}</span>
            )}
          </div>
          <div>
            <div className="font-semibold text-foreground text-sm flex items-center gap-2">
              <span>{row.name}</span>
              {row.role && <span className="text-xs font-normal text-muted-foreground">({row.role})</span>}
            </div>
            {row.company && (
              <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <Building2 className="w-3 h-3 text-primary/70 shrink-0" />
                <span className="truncate max-w-[200px]">{row.company}</span>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      header: 'Equipment & Highlight',
      accessor: 'equipment',
      render: row => (
        <div className="space-y-1">
          {row.equipment && (
            <div className="text-xs font-semibold text-foreground">
              {row.equipment}
            </div>
          )}
          {row.highlight && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-[#0f7ae0] border border-blue-400/20">
              <ShieldCheck className="w-3 h-3" />
              <span>{row.highlight}</span>
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Rating',
      accessor: 'stars',
      render: row => (
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={cn(
                'w-3.5 h-3.5',
                i < (row.stars || 5)
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-muted-foreground/30'
              )}
            />
          ))}
        </div>
      ),
    },
    {
      header: 'Review Quote',
      accessor: 'quote',
      render: row => (
        <p className="text-xs text-muted-foreground max-w-sm line-clamp-2 leading-relaxed italic font-sans">
          "{row.quote}"
        </p>
      ),
    },
    {
      header: 'Sort',
      accessor: 'sort',
      render: row => (
        <span className="font-mono text-xs text-muted-foreground font-semibold">
          {row.sort ?? 1}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: row => (
        <Switch
          checked={row.status === 'active'}
          onCheckedChange={() => toggleStatus(row)}
        />
      ),
    },
    {
      header: 'Actions',
      accessor: '_id',
      render: row => (
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => openEdit(row)}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => handleDelete(row._id)}
            className="h-8 w-8 text-destructive/70 hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8">
        <Breadcrumb
          title="Client Testimonials"
          crumbs={[{ label: 'Home Management' }, { label: 'Client Testimonials' }]}
        />
      </div>

      <div className="px-4 sm:px-6 lg:px-8">
        <TableToolbar
          searchPlaceholder="Search testimonials by client, company, equipment..."
          searchValue={search}
          onSearchChange={setSearch}
          sortValue={sort}
          onSortChange={setSort}
          sortOptions={[
            { label: 'Latest First', value: 'latest' },
            { label: 'Oldest First', value: 'oldest' },
            { label: 'Client Name (A-Z)', value: 'a-z' },
            { label: 'Client Name (Z-A)', value: 'z-a' },
            { label: 'Sort Order (1-9)', value: 'sort-asc' },
          ]}
          actionLabel="Add Testimonial"
          onAction={openCreate}
          selectedCount={selectedIds.length}
          onBulkDelete={handleBulkDelete}
        />

        <div className="mt-4">
          <DataTable
            columns={columns}
            data={filteredRows}
            loading={loading}
            emptyMessage="No testimonials found. Click 'Add Testimonial' to publish facility client reviews."
            selectable
            selectedIds={selectedIds}
            onSelectChange={setSelectedIds}
          />
        </div>
      </div>

      {/* Testimonial Dialog */}
      <Dialog open={!!modal} onOpenChange={open => !open && setModal(null)}>
        <DialogContent className="sm:max-w-2xl bg-card border border-border/80 text-foreground p-6 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="border-b border-border/40 pb-4">
            <DialogTitle className="text-xl font-bold text-foreground">
              {modal === 'create' ? 'Add New Client Testimonial' : 'Edit Client Testimonial'}
            </DialogTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Verified review testimonial displayed in the homepage carousel.
            </p>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5 pt-3">
            {/* Author Name & Designation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FloatingInput
                label="Executive / Client Name *"
                required
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Rajesh Malhotra"
                rightElement={
                  <AIAssistantButton
                    context="Commercial HVAC Testimonial"
                    field="Indian Corporate Executive Name"
                    onGenerate={val => setForm({ ...form, name: val })}
                  />
                }
              />

              <FloatingInput
                label="Designation / Role"
                value={form.role}
                onChange={e => setForm({ ...form, role: e.target.value })}
                placeholder="e.g. Managing Director"
                rightElement={
                  <AIAssistantButton
                    context="HVAC Facility Decision Maker"
                    field="Professional Job Title"
                    onGenerate={val => setForm({ ...form, role: val })}
                  />
                }
              />
            </div>

            {/* Facility / Company Name & Equipment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FloatingInput
                label="Company / Facility Name"
                value={form.company}
                onChange={e => setForm({ ...form, company: e.target.value })}
                placeholder="e.g. Lifeline Super-Speciality Hospital"
                rightElement={
                  <AIAssistantButton
                    context="Commercial Client Organization"
                    field="Enterprise / Institutional Facility Name"
                    onGenerate={val => setForm({ ...form, company: val })}
                  />
                }
              />

              <FloatingInput
                label="Equipment Deployed"
                value={form.equipment}
                onChange={e => setForm({ ...form, equipment: e.target.value })}
                placeholder="e.g. 4.0 Ton Ceiling Cassette Systems"
                rightElement={
                  <AIAssistantButton
                    context="OG Heavy Duty HVAC Equipment"
                    field="Specific AC Model / Capacity"
                    onGenerate={val => setForm({ ...form, equipment: val })}
                  />
                }
              />
            </div>

            {/* Technical Highlight & Star Rating */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <FloatingInput
                label="Key Technical Highlight"
                value={form.highlight}
                onChange={e => setForm({ ...form, highlight: e.target.value })}
                placeholder="e.g. 24/7 Healthcare Duty Cycle"
                rightElement={
                  <AIAssistantButton
                    context="Commercial AC Performance Metric"
                    field="Short Technical Highlight Badge"
                    onGenerate={val => setForm({ ...form, highlight: val })}
                  />
                }
              />

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1.5 ml-1">
                  Star Rating (1 - 5)
                </label>
                <div className="flex items-center gap-1 bg-muted/20 border border-input/60 rounded-xl px-3 py-2">
                  {[1, 2, 3, 4, 5].map(starNum => (
                    <button
                      key={starNum}
                      type="button"
                      onClick={() => setForm({ ...form, stars: starNum })}
                      className="p-1 hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star
                        className={cn(
                          'w-5 h-5',
                          starNum <= form.stars
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-muted-foreground/30'
                        )}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-foreground ml-2 font-mono">
                    {form.stars} / 5 Stars
                  </span>
                </div>
              </div>
            </div>

            {/* Review Quote */}
            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-sm font-semibold text-foreground/80 block">
                  Detailed Testimonial Quote *
                </label>
                <AIAssistantButton
                  context={`${form.name || 'Client'} from ${form.company || 'Enterprise'} regarding ${form.equipment || 'Heavy Duty ACs'}`}
                  field="Authentic In-depth Commercial Review"
                  onGenerate={val => setForm({ ...form, quote: val })}
                />
              </div>
              <textarea
                rows={4}
                required
                value={form.quote}
                onChange={e => setForm({ ...form, quote: e.target.value })}
                placeholder="Enter client's detailed feedback regarding continuous cooling, energy efficiency, or reliability..."
                className="w-full rounded-xl border border-input/60 bg-background px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 hover:border-input"
              />
            </div>

            {/* Avatar / Photo Upload (Optional) */}
            <div className="border border-input/60 rounded-xl p-4 bg-muted/10 space-y-3">
              <label className="text-xs font-semibold text-foreground/80 block">
                Client Photo / Facility Logo (Optional)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatar}
                  className="flex h-10 w-full rounded-lg border border-input/60 bg-background px-3 py-2 text-xs file:border-0 file:bg-transparent file:text-xs file:font-semibold file:text-primary cursor-pointer hover:border-input"
                />
                {preview && (
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-border shrink-0 shadow-xs">
                    <img src={preview} alt="preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            {/* Sort & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <SortInput
                value={form.sort}
                onChange={val => setForm({ ...form, sort: val })}
                isAuto={sortIsAuto}
                onToggleAuto={() => setSortIsAuto(!sortIsAuto)}
              />

              <div className="flex items-center justify-between p-3 border border-input/60 rounded-xl bg-muted/10">
                <span className="text-xs font-semibold text-foreground/80">Active on Website</span>
                <Switch
                  checked={form.status === 'active'}
                  onCheckedChange={checked =>
                    setForm({ ...form, status: checked ? 'active' : 'inactive' })
                  }
                />
              </div>
            </div>

            <DialogFooter className="border-t border-border/40 pt-4 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setModal(null)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                {saving ? 'Saving...' : modal === 'create' ? 'Create Testimonial' : 'Update Testimonial'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, type: 'single', id: null })}
        onConfirm={() => {
          if (confirmModal.type === 'bulk') executeBulkDelete()
          else executeDelete(confirmModal.id)
        }}
        title={confirmModal.type === 'bulk' ? 'Bulk Delete Testimonials' : 'Delete Testimonial'}
        description={
          confirmModal.type === 'bulk'
            ? `Are you sure you want to delete ${selectedIds.length} selected testimonials?`
            : 'Are you sure you want to delete this client testimonial? This action cannot be undone.'
        }
        loading={bulkDeleting}
      />

      {/* Toast Notifications */}
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className={cn(
              'fixed bottom-5 right-5 z-50 rounded-xl px-4 py-3 text-sm font-semibold shadow-lg text-white',
              t.type === 'error' ? 'bg-destructive' : 'bg-emerald-600'
            )}
          >
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

