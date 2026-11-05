'use client'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog'
import { FloatingInput, FloatingSelect, FloatingTextarea } from '../../../components/ui/floating-input'
import { Button } from '../../../components/ui/button'
import { SortInput } from '../../../components/dashboard/SortInput'
import MediaSelector from '../../../components/dashboard/MediaSelector'
import { FileText, UploadCloud, ShieldCheck } from 'lucide-react'

const CATEGORIES = [
  { value: 'catalogues', label: 'Product Catalogues' },
  { value: 'manuals', label: 'User & Installation Manuals' },
  { value: 'error-codes', label: 'Error Code Troubleshooting Guides' },
  { value: 'warranty', label: 'Warranty & Policy Documents' },
  { value: 'general', label: 'General Technical Resources' },
]

export default function ResourceModal({ resource, nextSort = 1, onClose, onSave }) {
  const [form, setForm] = useState(() => {
    if (!resource) {
      return {
        title: '',
        id: '',
        category: 'manuals',
        categoryName: 'User & Installation Manuals',
        description: '',
        applicableProducts: 'All OG Heavy Duty Units',
        applicableCategorySlug: 'all',
        applicableModelsText: 'OG-18S5IN, OG-18W5IN, OGC-24',
        filePath: '',
        fileSize: '1.8 MB',
        pageCount: 16,
        edition: '2026 Edition',
        status: 'published',
        sort: nextSort,
      }
    }

    const modelsText = Array.isArray(resource.applicableModels)
      ? resource.applicableModels.join(', ')
      : (resource.applicableModels || '')

    return {
      ...resource,
      applicableModelsText: modelsText,
      status: resource.status || (resource.isActive ? 'published' : 'draft'),
    }
  })

  const [file, setFile] = useState(null)
  const [saving, setSaving] = useState(false)

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }))

  function toId(str) {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)

    const fd = new FormData()
    fd.append('title', form.title || '')
    fd.append('id', form.id || toId(form.title))
    fd.append('category', form.category || 'manuals')
    const catObj = CATEGORIES.find(c => c.value === form.category)
    fd.append('categoryName', catObj ? catObj.label : form.category)
    fd.append('description', form.description || '')
    fd.append('applicableProducts', form.applicableProducts || '')
    fd.append('applicableCategorySlug', form.applicableCategorySlug || 'all')
    fd.append('fileSize', form.fileSize || '')
    fd.append('pageCount', form.pageCount || '0')
    fd.append('edition', form.edition || '')
    fd.append('status', form.status || 'published')
    fd.append('sort', form.sort || '0')

    const models = (form.applicableModelsText || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
    fd.append('applicableModels', JSON.stringify(models))

    if (file) {
      fd.append('file', file)
    } else {
      fd.append('filePath', form.filePath || '')
    }

    try {
      const url = resource ? `/api/resources/${resource._id || resource.id}` : '/api/resources'
      const method = resource ? 'PUT' : 'POST'
      const res = await fetch(url, { method, body: fd })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Failed to save resource')
      }

      onSave(data)
    } catch (err) {
      alert('Error: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={(open) => !open && !saving && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-md bg-primary/10 text-primary">
              <FileText className="w-5 h-5" />
            </span>
            <DialogTitle className="text-xl font-bold !text-white">
              {resource ? `Edit Resource: ${resource.title}` : 'Add Technical Resource'}
            </DialogTitle>
          </div>
          <p className="text-slate-300 text-xs mt-1">
            Publish verified manuals, catalogues, error code tables, and warranty policies.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FloatingInput
              label="Document Title *"
              required
              value={form.title}
              onChange={e => {
                f('title', e.target.value)
                if (!resource && !form.id) f('id', toId(e.target.value))
              }}
            />
            <FloatingInput
              label="Resource ID / Slug *"
              required
              value={form.id}
              disabled={!!resource}
              onChange={e => f('id', toId(e.target.value))}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FloatingSelect
              label="Resource Category *"
              value={form.category}
              onChange={e => f('category', e.target.value)}
            >
              {CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </FloatingSelect>
            <FloatingSelect
              label="Publication Status *"
              value={form.status}
              onChange={e => f('status', e.target.value)}
            >
              <option value="published">Published (Visible on Resource Center)</option>
              <option value="draft">Draft (Admin Only)</option>
              <option value="archived">Archived (Delisted)</option>
            </FloatingSelect>
          </div>

          <FloatingTextarea
            label="Document Description"
            rows={2}
            value={form.description}
            onChange={e => f('description', e.target.value)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FloatingInput
              label="Applicable Equipment / Series Description"
              value={form.applicableProducts}
              onChange={e => f('applicableProducts', e.target.value)}
            />
            <FloatingInput
              label="Applicable Category (all, window-ac, split-ac, etc.)"
              value={form.applicableCategorySlug}
              onChange={e => f('applicableCategorySlug', e.target.value)}
            />
          </div>

          <FloatingTextarea
            label="Applicable Model Numbers (Comma-separated, e.g. OG-18S5IN, OG-18W5IN)"
            rows={2}
            value={form.applicableModelsText}
            onChange={e => f('applicableModelsText', e.target.value)}
          />

          {/* Document File / URL */}
          <div className="space-y-3">
            <MediaSelector
              label="Technical Document / PDF Attachment"
              value={form.filePath}
              onChange={v => {
                f('filePath', v)
                setFile(null)
              }}
              folder="resources"
              accept=".pdf,application/pdf"
              helperText="Select verified PDF manual/brochure from library or upload directly."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FloatingInput
              label="File Size Label (e.g. 2.4 MB)"
              value={form.fileSize}
              onChange={e => f('fileSize', e.target.value)}
            />
            <FloatingInput
              label="Page Count"
              type="number"
              value={form.pageCount}
              onChange={e => f('pageCount', e.target.value)}
            />
            <SortInput
              label="Sort Order"
              value={form.sort}
              onChange={v => f('sort', v)}
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : resource ? 'Save Resource' : 'Create Resource'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

