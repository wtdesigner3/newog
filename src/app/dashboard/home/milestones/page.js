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
  ThermometerSnowflake, 
  Layers, 
  Building2, 
  MapPin, 
  ShieldCheck, 
  Zap, 
  Award, 
  Users, 
  Globe2, 
  CheckCircle2, 
  TrendingUp, 
  Compass,
  Edit2, 
  Trash2, 
  Plus, 
  Check 
} from 'lucide-react'

const ICON_MAP = {
  ThermometerSnowflake,
  Layers,
  Building2,
  MapPin,
  ShieldCheck,
  Zap,
  Award,
  Users,
  Globe2,
  CheckCircle2,
  TrendingUp,
  Compass,
}

const ICON_OPTIONS = [
  { value: 'ThermometerSnowflake', label: 'Thermometer (Thermal Standard)' },
  { value: 'Layers', label: 'Layers (Pure Copper / Materials)' },
  { value: 'Building2', label: 'Building (Commercial Scale)' },
  { value: 'MapPin', label: 'Map Pin (National Reach / Distribution)' },
  { value: 'ShieldCheck', label: 'Shield (Heavy Duty Protection)' },
  { value: 'Zap', label: 'Lightning (High Efficiency / Power)' },
  { value: 'Award', label: 'Award (Engineering Excellence)' },
  { value: 'Users', label: 'Users (Clientele & Team)' },
  { value: 'Globe2', label: 'Globe (Pan-India / International)' },
  { value: 'CheckCircle2', label: 'Check Circle (Proven & Tested)' },
  { value: 'TrendingUp', label: 'Trending Up (Growth & Performance)' },
  { value: 'Compass', label: 'Compass (Strategic Foundation)' },
]

const EMPTY = {
  badge: '',
  valueType: 'number',
  target: '',
  suffix: '',
  formatNumber: false,
  textValue: '',
  label: '',
  subtext: '',
  icon: 'ThermometerSnowflake',
  sort: 1,
  status: 'active',
}

export default function MilestonesPage() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState({ ...EMPTY })
  const [toasts, setToasts] = useState([])
  const [deletingId, setDeletingId] = useState(null)
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
    fetchMilestones()
  }, [])

  async function fetchMilestones() {
    try {
      setLoading(true)
      const res = await fetch('/api/milestones')
      if (!res.ok) throw new Error('Failed to fetch milestones')
      const data = await res.json()
      setRows(Array.isArray(data) ? data : [])
    } catch (err) {
      addToast('Could not load milestones: ' + err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  function openCreate() {
    const maxSort = rows.reduce((max, r) => Math.max(max, Number(r.sort) || 0), 0)
    setForm({ ...EMPTY, sort: maxSort + 1 })
    setSortIsAuto(true)
    setModal('new')
  }

  function openEdit(item) {
    setForm({ 
      ...item,
      valueType: item.valueType || (item.textValue ? 'text' : 'number'),
    })
    setSortIsAuto(false)
    setModal(item)
  }

  async function handleSave(e) {
    e.preventDefault()
    try {
      setSaving(true)
      const payload = {
        ...form,
        target: form.valueType === 'number' ? Number(form.target) || 0 : 0,
        textValue: form.valueType === 'text' ? form.textValue : '',
        sort: Number(form.sort) || 0,
      }

      const isEdit = Boolean(form._id)
      const url = isEdit ? `/api/milestones/${form._id}` : `/api/milestones`
      const method = isEdit ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.message || 'Save failed')

      addToast(isEdit ? 'Milestone stat updated successfully!' : 'Milestone stat added successfully!')
      setModal(null)
      fetchMilestones()
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
      const res = await fetch(`/api/milestones/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Delete failed')
      addToast('Milestone deleted.', 'warning')
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
      await Promise.all(selectedIds.map(id => fetch(`/api/milestones/${id}`, { method: 'DELETE' })))
      setRows(r => r.filter(x => !selectedIds.includes(x._id)))
      setSelectedIds([])
      addToast(`Deleted ${selectedIds.length} milestones.`, 'warning')
    } catch (err) {
      addToast(err.message, 'error')
    } finally {
      setBulkDeleting(false)
    }
  }

  async function toggleStatus(item, e) {
    e?.stopPropagation()
    const newStatus = item.status === 'active' ? 'inactive' : 'active'
    try {
      const res = await fetch(`/api/milestones/${item._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...item, status: newStatus }),
      })
      if (!res.ok) throw new Error('Toggle failed')
      setRows(r => r.map(x => (x._id === item._id ? { ...x, status: newStatus } : x)))
      addToast(`Status changed to ${newStatus}.`, 'success')
    } catch (err) {
      addToast(err.message, 'error')
    }
  }

  // Filter & Search
  let filteredData = rows.filter(r => {
    const q = search.toLowerCase()
    return (
      (r.badge || '').toLowerCase().includes(q) ||
      (r.label || '').toLowerCase().includes(q) ||
      (r.subtext || '').toLowerCase().includes(q) ||
      (r.textValue || '').toLowerCase().includes(q)
    )
  })

  if (sort === 'a-z') {
    filteredData.sort((a, b) => (a.label || '').localeCompare(b.label || ''))
  } else if (sort === 'z-a') {
    filteredData.sort((a, b) => (b.label || '').localeCompare(a.label || ''))
  } else if (sort === 'oldest') {
    filteredData.sort((a, b) => Number(a.sort) - Number(b.sort))
  } else {
    filteredData.sort((a, b) => Number(a.sort) - Number(b.sort))
  }

  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredData.map(r => r._id))
    } else {
      setSelectedIds([])
    }
  }

  const toggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const columns = [
    {
      key: 'icon',
      label: 'Icon',
      render: (r) => {
        const IconComponent = ICON_MAP[r.icon] || Award
        return (
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-400/30 text-[#0f7ae0] flex items-center justify-center shadow-xs">
            <IconComponent className="w-5 h-5" />
          </div>
        )
      }
    },
    {
      key: 'badge',
      label: 'Pill Badge',
      render: (r) => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-slate-800 text-slate-200 border border-slate-700">
          {r.badge}
        </span>
      )
    },
    {
      key: 'value',
      label: 'Value Display',
      render: (r) => (
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-black font-heading text-white">
            {r.valueType === 'text' ? r.textValue : (r.formatNumber ? Number(r.target).toLocaleString('en-IN') : r.target)}
          </span>
          {r.valueType !== 'text' && r.suffix && (
            <span className="text-sm font-bold text-sky-400">{r.suffix}</span>
          )}
        </div>
      )
    },
    {
      key: 'label',
      label: 'Milestone Title & Subtext',
      render: (r) => (
        <div className="max-w-md space-y-0.5">
          <p className="font-bold text-white text-sm">{r.label}</p>
          <p className="text-xs text-slate-400 line-clamp-1">{r.subtext}</p>
        </div>
      )
    },
    {
      key: 'sort',
      label: 'Order',
      align: 'right',
      render: (r) => <span className="font-mono text-xs font-semibold text-slate-300">#{r.sort}</span>
    },
    {
      key: 'status',
      label: 'Status',
      render: (r) => (
        <button
          onClick={(e) => toggleStatus(r, e)}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
            r.status === 'active'
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              : 'bg-slate-800 text-slate-400 border border-slate-700'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${r.status === 'active' ? 'bg-emerald-400' : 'bg-slate-500'}`} />
          {r.status === 'active' ? 'Active' : 'Inactive'}
        </button>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      render: (r) => (
        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => openEdit(r)}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Edit Milestone"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setConfirmModal({ isOpen: true, type: 'single', id: r._id })}
            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
            title="Delete Milestone"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ]

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 bg-background min-h-full">
      <Breadcrumb
        title="Milestones & Achievements Strip"
        subtitle="Manage the 4 key engineering benchmark statistics shown on the Homepage and /about-us page."
        crumbs={[{ label: 'Home Management' }, { label: 'Milestones & Stats' }]}
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
        addLabel="Add Milestone Stat"
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

      {/* Edit / Add Modal */}
      <Dialog open={!!modal} onOpenChange={(open) => !open && !saving && setModal(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold !text-white">
              {modal === 'new' ? 'Add Milestone Stat' : 'Edit Milestone Stat'}
            </DialogTitle>
            <p className="text-slate-300 text-sm mt-1">
              Configure the milestone badge, animated number, label, and engineering subtext.
            </p>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-6 mt-4">
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FloatingInput
                  label="Pill Tagline Badge *"
                  required
                  value={form.badge}
                  onChange={e => setForm({ ...form, badge: e.target.value })}
                  placeholder="e.g. Thermal Standard"
                  rightElement={
                    <AIAssistantButton context="HVAC Engineering Milestone Tagline" field="Pill Badge" onGenerate={v => setForm({ ...form, badge: v })} />
                  }
                />

                <FloatingSelect
                  label="Icon Choice"
                  value={form.icon}
                  onChange={e => setForm({ ...form, icon: e.target.value })}
                >
                  {ICON_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </FloatingSelect>
              </div>

              {/* Value Type Selector */}
              <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-semibold text-white block">Value Type</label>
                    <p className="text-[11px] text-slate-400">Choose whether this milestone shows an animated number or a static badge text.</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, valueType: 'number' })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        form.valueType === 'number'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      Animated Number
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, valueType: 'text' })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        form.valueType === 'text'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      Static Text
                    </button>
                  </div>
                </div>

                {form.valueType === 'number' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <FloatingInput
                      label="Target Number *"
                      type="number"
                      required
                      value={form.target}
                      onChange={e => setForm({ ...form, target: e.target.value })}
                      placeholder="e.g. 52 or 50000"
                    />
                    <FloatingInput
                      label="Suffix Symbol"
                      value={form.suffix}
                      onChange={e => setForm({ ...form, suffix: e.target.value })}
                      placeholder="e.g. °C, %, +"
                    />
                    <div className="flex items-center justify-between border border-border rounded-xl px-4 py-2 bg-slate-900/50">
                      <div>
                        <span className="text-xs font-semibold text-white block">Format Number</span>
                        <span className="text-[10px] text-slate-400">e.g. 50,000+</span>
                      </div>
                      <Switch
                        checked={form.formatNumber}
                        onCheckedChange={val => setForm({ ...form, formatNumber: val })}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="pt-2">
                    <FloatingInput
                      label="Static Text Value *"
                      required
                      value={form.textValue}
                      onChange={e => setForm({ ...form, textValue: e.target.value })}
                      placeholder="e.g. Pan-India"
                    />
                  </div>
                )}
              </div>

              {/* Label & Subtext */}
              <FloatingInput
                label="Milestone Label / Title *"
                required
                value={form.label}
                onChange={e => setForm({ ...form, label: e.target.value })}
                placeholder="e.g. Extreme Ambient Ceiling"
                rightElement={
                  <AIAssistantButton context={form.badge || 'HVAC Engineering Benchmark'} field="Catchy Stat Label" onGenerate={v => setForm({ ...form, label: v })} />
                }
              />

              <FloatingInput
                label="Subtext / Engineering Detail *"
                required
                value={form.subtext}
                onChange={e => setForm({ ...form, subtext: e.target.value })}
                placeholder="e.g. Continuous cooling engineered & tested up to 52°C tropical peak"
                rightElement={
                  <AIAssistantButton context={form.label || 'HVAC Milestone'} field="Explanatory Subtext" onGenerate={v => setForm({ ...form, subtext: v })} />
                }
              />

              <div className="grid grid-cols-2 gap-4">
                <SortInput
                  label="Sort Order"
                  value={form.sort}
                  isEditing={Boolean(form._id)}
                  isAuto={sortIsAuto}
                  onManualEdit={() => setSortIsAuto(false)}
                  onChange={v => setForm({ ...form, sort: v })}
                />
                <FloatingSelect
                  label="Status"
                  value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </FloatingSelect>
              </div>
            </div>

            <DialogFooter className="pt-6 border-t border-slate-800 mt-6 flex justify-end gap-3 pb-2">
              <Button
                variant="ghost"
                type="button"
                onClick={() => setModal(null)}
                disabled={saving}
                className="rounded-full px-6 text-slate-300 hover:text-white hover:bg-slate-800 font-medium"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="rounded-full px-8 py-5 bg-[#0f7ae0] hover:bg-[#0d69c2] text-white font-semibold text-[15px] shadow-lg shadow-blue-500/25 transition-transform active:scale-95"
              >
                {saving ? 'Saving...' : modal === 'new' ? 'Save Milestone' : 'Save Changes'}
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
        title={confirmModal.type === 'single' ? 'Delete Milestone' : 'Bulk Delete'}
        message={
          confirmModal.type === 'single'
            ? 'Are you sure you want to delete this milestone? This action cannot be undone.'
            : `Are you sure you want to delete ${selectedIds.length} milestones? This action cannot be undone.`
        }
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
              toast.type === 'success' ? "bg-emerald-600" : "bg-red-600"
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

