'use client'
import { useState, useEffect } from 'react'
import AIAssistantButton from '../../../components/dashboard/AIAssistantButton'
import Breadcrumb from '../../../components/dashboard/Breadcrumb'
import DataTable from '../../../components/dashboard/DataTable'
import TableToolbar from '../../../components/dashboard/TableToolbar'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../../components/ui/dialog'
import { Button } from '../../../components/ui/button'
import { FloatingInput, FloatingSelect } from '../../../components/ui/floating-input'
import { Switch } from '../../../components/ui/switch'
import { SortInput } from '../../../components/dashboard/SortInput'
import ConfirmDeleteModal from '../../../components/dashboard/ConfirmDeleteModal'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../../lib/utils'
import {
  HelpCircle,
  Edit2,
  Trash2,
  Plus,
  Check,
  RotateCcw,
  Sparkles,
  Link as LinkIcon,
  Search,
  Filter
} from 'lucide-react'

const BASE_URL = ''

const CATEGORY_MAP = {
  general: { label: 'General & Store', badgeClass: 'bg-blue-500/10 text-blue-400 border-blue-400/20' },
  technical: { label: 'Technical & Engineering', badgeClass: 'bg-cyan-500/10 text-cyan-400 border-cyan-400/20' },
  sizing: { label: 'Tonnage & Sizing', badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-400/20' },
  support: { label: 'Service & Commercial Support', badgeClass: 'bg-purple-500/10 text-purple-400 border-purple-400/20' },
}

const CATEGORY_OPTIONS = [
  { value: 'general', label: 'General & Showroom Inquiries' },
  { value: 'technical', label: 'Technical & HVAC Engineering' },
  { value: 'sizing', label: 'Capacity & Tonnage Sizing' },
  { value: 'support', label: 'Service, GeM & Warranty Support' },
]

const EMPTY = {
  question: '',
  answer: '',
  category: 'general',
  isVerified: true,
  relatedLink: { label: '', href: '' },
  sort: 1,
  status: 'active',
}

export default function FaqsDashboardPage() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState({ ...EMPTY })
  const [toasts, setToasts] = useState([])
  const [sortIsAuto, setSortIsAuto] = useState(false)

  // Filters & Selection
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [sort, setSort] = useState('sort-asc')
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
    fetchFaqs()
  }, [])

  async function fetchFaqs() {
    try {
      setLoading(true)
      const res = await fetch(`${BASE_URL}/api/faqs`)
      if (!res.ok) throw new Error('Failed to load FAQs')
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
    setForm({
      ...EMPTY,
      category: activeCategory !== 'all' ? activeCategory : 'general',
      sort: nextSort,
    })
    setSortIsAuto(false)
    setModal('create')
  }

  function openEdit(row) {
    setForm({
      ...row,
      relatedLink: {
        label: row.relatedLink?.label || '',
        href: row.relatedLink?.href || '',
      },
      sort: row.sort || 1,
    })
    setSortIsAuto(false)
    setModal('edit')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.question?.trim()) {
      addToast('Please enter the question', 'error')
      return
    }
    if (!form.answer?.trim()) {
      addToast('Please enter the answer', 'error')
      return
    }

    try {
      setSaving(true)
      const url = modal === 'create' ? `${BASE_URL}/api/faqs` : `${BASE_URL}/api/faqs/${form._id}`
      const method = modal === 'create' ? 'POST' : 'PUT'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Save failed')

      addToast(modal === 'create' ? 'FAQ added successfully!' : 'FAQ updated successfully!')
      setModal(null)
      fetchFaqs()
    } catch (err) {
      addToast(err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  async function toggleStatus(row) {
    const nextStatus = row.status === 'active' ? 'inactive' : 'active'
    try {
      const res = await fetch(`${BASE_URL}/api/faqs/${row._id}`, {
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
      const res = await fetch(`${BASE_URL}/api/faqs/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      addToast('FAQ deleted successfully')
      fetchFaqs()
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
        await fetch(`${BASE_URL}/api/faqs/${id}`, { method: 'DELETE' })
      }
      addToast(`Deleted ${selectedIds.length} FAQs successfully`)
      setSelectedIds([])
      fetchFaqs()
    } catch (err) {
      addToast(err.message, 'error')
    } finally {
      setBulkDeleting(false)
    }
  }

  // Filter & Sort
  const filteredRows = rows
    .filter(r => {
      const matchesCategory = activeCategory === 'all' || r.category === activeCategory
      const q = search.toLowerCase()
      const matchesSearch =
        r.question?.toLowerCase().includes(q) ||
        r.answer?.toLowerCase().includes(q) ||
        r.category?.toLowerCase().includes(q)
      return matchesCategory && matchesSearch
    })
    .sort((a, b) => {
      if (sort === 'sort-asc') return (a.sort || 0) - (b.sort || 0)
      if (sort === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt)
      if (sort === 'a-z') return (a.question || '').localeCompare(b.question || '')
      if (sort === 'z-a') return (b.question || '').localeCompare(a.question || '')
      return new Date(b.createdAt) - new Date(a.createdAt)
    })

  const columns = [
    {
      header: 'Question',
      accessor: 'question',
      render: row => (
        <div className="space-y-1">
          <div className="font-semibold text-foreground text-sm flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <span>{row.question}</span>
          </div>
          <div className="text-xs text-muted-foreground line-clamp-2 pl-6">
            {row.answer}
          </div>
        </div>
      ),
    },
    {
      header: 'Category',
      accessor: 'category',
      render: row => {
        const cat = CATEGORY_MAP[row.category] || { label: row.category, badgeClass: 'bg-muted text-muted-foreground' }
        return (
          <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border', cat.badgeClass)}>
            {cat.label}
          </span>
        )
      },
    },
    {
      header: 'Related Link',
      accessor: 'relatedLink',
      render: row => (
        row.relatedLink?.label ? (
          <span className="text-xs text-primary flex items-center gap-1 font-medium">
            <LinkIcon className="w-3 h-3 shrink-0" />
            <span className="truncate max-w-[140px]">{row.relatedLink.label}</span>
          </span>
        ) : (
          <span className="text-xs text-muted-foreground/50">—</span>
        )
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
          title="FAQ Management"
          crumbs={[{ label: 'Inner Pages' }, { label: 'FAQ Management' }]}
        />
      </div>

      <div className="px-4 sm:px-6 lg:px-8">
        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pb-2">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={cn(
              'px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer',
              activeCategory === 'all'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-muted/40 text-muted-foreground hover:bg-muted/70'
            )}
          >
            All Questions ({rows.length})
          </button>
          {Object.entries(CATEGORY_MAP).map(([key, info]) => {
            const count = rows.filter(r => r.category === key).length
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveCategory(key)}
                className={cn(
                  'px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border',
                  activeCategory === key
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                    : 'bg-background text-muted-foreground border-border hover:bg-muted/40'
                )}
              >
                {info.label} ({count})
              </button>
            )
          })}
        </div>

        <TableToolbar
          searchPlaceholder="Search questions, answers, keywords..."
          searchValue={search}
          onSearchChange={setSearch}
          sortValue={sort}
          onSortChange={setSort}
          sortOptions={[
            { label: 'Sort Order (1-9)', value: 'sort-asc' },
            { label: 'Latest First', value: 'latest' },
            { label: 'Oldest First', value: 'oldest' },
            { label: 'Question (A-Z)', value: 'a-z' },
            { label: 'Question (Z-A)', value: 'z-a' },
          ]}
          actionLabel="Add FAQ"
          onAction={openCreate}
          selectedCount={selectedIds.length}
          onBulkDelete={handleBulkDelete}
        />

        <div className="mt-4">
          <DataTable
            columns={columns}
            data={filteredRows}
            loading={loading}
            emptyMessage="No FAQs found. Click 'Add FAQ' to create a new frequently asked question."
            selectable
            selectedIds={selectedIds}
            onSelectChange={setSelectedIds}
          />
        </div>
      </div>

      {/* FAQ Dialog */}
      <Dialog open={!!modal} onOpenChange={open => !open && setModal(null)}>
        <DialogContent className="sm:max-w-2xl bg-card border border-border/80 text-foreground p-6 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="border-b border-border/40 pb-4">
            <DialogTitle className="text-xl font-bold text-foreground">
              {modal === 'create' ? 'Add New Frequently Asked Question' : 'Edit FAQ'}
            </DialogTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Add or refine answers published on the customer support FAQ page.
            </p>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5 pt-3">
            {/* Category Select */}
            <FloatingSelect
              label="FAQ Category *"
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
              options={CATEGORY_OPTIONS}
            />

            {/* Question */}
            <FloatingInput
              label="Question Headline *"
              required
              value={form.question}
              onChange={e => setForm({ ...form, question: e.target.value })}
              placeholder="e.g. What makes OG Heavy Duty air conditioners suitable for severe heatwaves?"
              rightElement={
                <AIAssistantButton
                  context="HVAC Customer Support FAQ"
                  field="Clear & Frequently Asked Question"
                  onGenerate={val => setForm({ ...form, question: val })}
                />
              }
            />

            {/* Answer */}
            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-sm font-semibold text-foreground/80 block">
                  Detailed Answer *
                </label>
                <AIAssistantButton
                  context={form.question || 'Air conditioning technical inquiry'}
                  field="Authoritative & Helpful Technical Answer"
                  onGenerate={val => setForm({ ...form, answer: val, answerHtml: val })}
                />
              </div>
              <textarea
                rows={5}
                required
                value={form.answer}
                onChange={e => setForm({ ...form, answer: e.target.value, answerHtml: e.target.value })}
                placeholder="Enter clear, comprehensive response for users and MEP clients..."
                className="w-full rounded-xl border border-input/60 bg-background px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 hover:border-input"
              />
            </div>

            {/* Optional CTA Link */}
            <div className="border border-input/60 rounded-xl p-4 bg-muted/10 space-y-3">
              <span className="text-xs font-semibold text-foreground/80 block">
                Related Page Action / Resource Link (Optional)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FloatingInput
                  label="Button / Link Label"
                  value={form.relatedLink?.label || ''}
                  onChange={e =>
                    setForm({
                      ...form,
                      relatedLink: { ...form.relatedLink, label: e.target.value },
                    })
                  }
                  placeholder="e.g. Calculate AC Sizing"
                />
                <FloatingInput
                  label="Target URL"
                  value={form.relatedLink?.href || ''}
                  onChange={e =>
                    setForm({
                      ...form,
                      relatedLink: { ...form.relatedLink, href: e.target.value },
                    })
                  }
                  placeholder="e.g. /ac-sizing or /contact-us"
                  icon={<LinkIcon className="w-4 h-4" />}
                />
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
                {saving ? 'Saving...' : modal === 'create' ? 'Create FAQ' : 'Update FAQ'}
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
        title={confirmModal.type === 'bulk' ? 'Bulk Delete FAQs' : 'Delete FAQ'}
        description={
          confirmModal.type === 'bulk'
            ? `Are you sure you want to delete ${selectedIds.length} selected FAQs?`
            : 'Are you sure you want to delete this FAQ? This action cannot be undone.'
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

