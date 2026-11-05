'use client'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog'
import { FloatingInput, FloatingSelect, FloatingTextarea } from '../../../components/ui/floating-input'
import { Button } from '../../../components/ui/button'
import { SlugInput } from '../../../components/dashboard/SlugInput'
import { SortInput } from '../../../components/dashboard/SortInput'
import RichEditor from '../../../components/dashboard/RichEditor'
import MediaSelector from '../../../components/dashboard/MediaSelector'
import { Badge } from '../../../components/ui/badge'
import { Sparkles, Package, Wrench, ListChecks, FileText, Globe } from 'lucide-react'

const EMPTY_SPECS = {
  coolingCapacity: '',
  coolingBtu: '',
  powerInput: '',
  current: '',
  powerSupply: '220-240V, 50Hz, 1-Phase',
  compressorType: 'Heavy Duty Tropical Rotary',
  refrigerant: 'R-32',
  iseer: '',
  maxAmbient: '50°C',
  airflow: '',
  noiseIndoor: '',
  noiseOutdoor: '',
  dimensionsIndoor: '',
  dimensionsOutdoor: '',
  weightIndoor: '',
  weightOutdoor: '',
  pipingSize: '1/4" & 1/2"',
}

export default function ProductModal({ product, categories = [], nextSort = 1, onClose, onSave }) {
  const [form, setForm] = useState(() => {
    if (!product) {
      return {
        name: '',
        model: '',
        slug: '',
        category: categories[0]?._id || '',
        categorySlug: categories[0]?.slug || '',
        subcategorySlug: '',
        series: 'Residential Series',
        tagline: '',
        tonnage: '1.5 Ton',
        starRating: '',
        technology: 'Dual Rotary Inverter',
        compressor: 'Tropical Dual Rotary',
        maxAmbient: '50°C',
        status: 'published',
        isFlagship: false,
        sort: nextSort,
        description: '',
        breadcrumb: '',
        brochureUrl: '',
        image: '',
        detailImage: '',
        alt: '',
        featuresText: '100% Inner-Grooved Copper Coils\nHigh Ambient Cooling up to 50°C\nHydrophilic Blue Fin Anti-Corrosion Coating',
        applicationsText: 'Master Bedroom, Living Room, Executive Office, IT Server Room',
        specs: { ...EMPTY_SPECS },
        metatag: '',
        metaDescription: '',
        metakeywords: 'Heavy duty AC, Tropical compressor, OG air conditioner',
        canonicalUrl: '',
        ogTitle: '',
        ogDescription: '',
        schema: '',
      }
    }

    const initialSpecs = { ...EMPTY_SPECS, ...(product.specs || {}) }
    const featuresStr = Array.isArray(product.features) ? product.features.join('\n') : (product.features || '')
    const appsStr = Array.isArray(product.applications) ? product.applications.join(', ') : (product.applications || '')

    return {
      ...product,
      starRating: product.starRating || '',
      category: product.category?._id || product.category || '',
      categorySlug: product.categorySlug || product.category?.slug || '',
      status: product.status || (product.isActive ? 'published' : 'draft'),
      isFlagship: Boolean(product.isFlagship),
      featuresText: featuresStr,
      applicationsText: appsStr,
      specs: initialSpecs,
      schema: product.schemaMarkup && Object.keys(product.schemaMarkup).length > 0
        ? JSON.stringify(product.schemaMarkup, null, 2)
        : '',
      metakeywords: Array.isArray(product.metakeywords)
        ? product.metakeywords.join(', ')
        : (product.metakeywords || ''),
      breadcrumb: product.breadcrumb || '',
    }
  })

  const [tab, setTab] = useState('basic')
  const [saving, setSaving] = useState(false)
  const [slugLinked, setSlugLinked] = useState(!product)

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }))
  const specField = (k, v) => setForm(p => ({
    ...p,
    specs: { ...(p.specs || {}), [k]: v }
  }))

  function toSlug(str) {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)

    const fd = new FormData()

    fd.append('name', form.name || '')
    fd.append('model', form.model || form.name || '')
    fd.append('slug', form.slug || '')
    fd.append('category', form.category || '')
    fd.append('categorySlug', form.categorySlug || '')
    fd.append('subcategorySlug', form.subcategorySlug || '')
    fd.append('series', form.series || '')
    fd.append('tagline', form.tagline || '')
    fd.append('tonnage', form.tonnage || '')
    fd.append('starRating', form.starRating || '')
    fd.append('technology', form.technology || '')
    fd.append('compressor', form.compressor || '')
    fd.append('maxAmbient', form.maxAmbient || '')
    fd.append('status', form.status || 'published')
    fd.append('isActive', form.status === 'published' ? 'true' : 'false')
    fd.append('isFlagship', form.isFlagship ? 'true' : 'false')
    fd.append('sort', form.sort || '0')
    fd.append('description', form.description || '')
    fd.append('breadcrumb', form.breadcrumb || '')
    fd.append('brochureUrl', form.brochureUrl || '')
    fd.append('alt', form.alt || '')

    // Arrays & Objects
    const featuresList = (form.featuresText || '')
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean)
    fd.append('features', JSON.stringify(featuresList))

    const appsList = (form.applicationsText || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
    fd.append('applications', JSON.stringify(appsList))

    fd.append('specs', JSON.stringify(form.specs || {}))

    // SEO
    fd.append('metatag', form.metatag || '')
    fd.append('metaDescription', form.metaDescription || '')
    fd.append('metakeywords', form.metakeywords || '')
    fd.append('canonicalUrl', form.canonicalUrl || '')
    fd.append('ogTitle', form.ogTitle || '')
    fd.append('ogDescription', form.ogDescription || '')
    fd.append('schema', form.schema || '')

    // Images
    if (form.image instanceof File) {
      fd.append('image', form.image)
    } else {
      fd.append('existingImage', form.image || '')
    }

    if (form.detailImage instanceof File) {
      fd.append('detailImage', form.detailImage)
    } else {
      fd.append('existingDetailImage', form.detailImage || '')
    }

    try {
      const url = product ? `/api/products/${product._id}` : '/api/products'
      const method = product ? 'PUT' : 'POST'
      const res = await fetch(url, { method, body: fd })
      const text = await res.text()
      if (!res.ok) throw new Error(text)
      const data = JSON.parse(text)
      onSave(data)
    } catch (err) {
      alert('Error saving product: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const tabs = [
    { key: 'basic', label: 'Basic Info', icon: Package },
    { key: 'specs', label: 'HVAC Specs', icon: Wrench },
    { key: 'features', label: 'Features & Apps', icon: ListChecks },
    { key: 'media', label: 'Media & Literature', icon: FileText },
    { key: 'seo', label: 'SEO & Meta', icon: Globe },
  ]

  return (
    <Dialog open={true} onOpenChange={(open) => !open && !saving && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-md bg-primary/10 text-primary">
              <Package className="w-5 h-5" />
            </span>
            <DialogTitle className="text-xl font-bold !text-white">
              {product ? `Edit Product: ${product.model || product.name}` : 'Add New Heavy Duty Product'}
            </DialogTitle>
          </div>
          <p className="text-slate-300 text-xs mt-1">
            Maintain authoritative engineering specifications and public website catalog content.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          {/* Navigation Tabs */}
          <div className="flex gap-2 border-b border-border pb-1 overflow-x-auto">
            {tabs.map(t => {
              const Icon = t.icon
              const active = tab === t.key
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTab(t.key)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                    active ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {t.label}
                </button>
              )
            })}
          </div>

          <div className="py-2">
            {/* ── TAB 1: BASIC INFO ── */}
            {tab === 'basic' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FloatingInput
                    label="Product Name *"
                    required
                    value={form.name}
                    onChange={e => {
                      f('name', e.target.value)
                      if (slugLinked) f('slug', toSlug(e.target.value))
                    }}
                  />
                  <FloatingInput
                    label="Model Number * (e.g. OG-18S5IN)"
                    required
                    value={form.model}
                    onChange={e => {
                      f('model', e.target.value)
                      if (!form.name) f('name', `OG Heavy Duty ${e.target.value}`)
                      if (slugLinked && !form.slug) f('slug', toSlug(e.target.value))
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SlugInput
                    label="URL Slug *"
                    required
                    value={form.slug}
                    isEditing={!!product}
                    linked={slugLinked}
                    onToggleLink={() => {
                      const next = !slugLinked
                      setSlugLinked(next)
                      if (next) f('slug', toSlug(form.model || form.name))
                    }}
                    onChange={v => {
                      setSlugLinked(false)
                      f('slug', v)
                    }}
                  />
                  <FloatingSelect
                    label="Product Category *"
                    required
                    value={form.category}
                    onChange={e => {
                      const selCat = categories.find(c => c._id === e.target.value)
                      f('category', e.target.value)
                      f('categorySlug', selCat?.slug || '')
                    }}
                  >
                    <option value="">— Select Category —</option>
                    {categories.map(c => (
                      <option key={c._id} value={c._id}>
                        {c.name} ({c.slug})
                      </option>
                    ))}
                  </FloatingSelect>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FloatingInput
                    label="Tonnage (e.g. 1.5 Ton, 2.0 Ton)"
                    value={form.tonnage}
                    onChange={e => f('tonnage', e.target.value)}
                  />
                  <FloatingSelect
                    label="BEE Energy Star Rating"
                    value={form.starRating}
                    onChange={e => f('starRating', e.target.value)}
                  >
                    <option value="">Not Specified / Commercial</option>
                    <option value="5 Star">5 Star (BEE Certified High Efficiency)</option>
                    <option value="4 Star">4 Star (BEE Certified)</option>
                    <option value="3 Star">3 Star (BEE Certified Standard)</option>
                    <option value="2 Star">2 Star (BEE Certified)</option>
                    <option value="1 Star">1 Star (BEE Certified)</option>
                    <option value="Commercial Grade">Commercial Grade (Non-BEE Domestic)</option>
                    <option value="Industrial Grade">Industrial Grade (Heavy Duty)</option>
                  </FloatingSelect>
                  <FloatingSelect
                    label="Publication Status *"
                    value={form.status}
                    onChange={e => f('status', e.target.value)}
                  >
                    <option value="published">Published (Live on Public Site)</option>
                    <option value="draft">Draft (Admin Only)</option>
                    <option value="archived">Archived (Delisted)</option>
                  </FloatingSelect>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FloatingInput
                    label="Technology (e.g. Dual Rotary Inverter)"
                    value={form.technology}
                    onChange={e => f('technology', e.target.value)}
                  />
                  <FloatingInput
                    label="Series / Badge (e.g. Flagship High-Ambient)"
                    value={form.series}
                    onChange={e => f('series', e.target.value)}
                  />
                  <SortInput
                    label="Display Sort Order"
                    value={form.sort}
                    onChange={v => f('sort', v)}
                  />
                </div>

                <FloatingInput
                  label="Marketing Tagline"
                  value={form.tagline}
                  onChange={e => f('tagline', e.target.value)}
                />

                <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-lg border border-border">
                  <input
                    type="checkbox"
                    id="flagship-toggle"
                    checked={form.isFlagship}
                    onChange={e => f('isFlagship', e.target.checked)}
                    className="w-4 h-4 text-primary rounded"
                  />
                  <label htmlFor="flagship-toggle" className="text-sm font-medium cursor-pointer">
                    Flagship Product (Display prominently in featured homepage sections)
                  </label>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">
                    Product Description (Rich Text)
                  </label>
                  <RichEditor
                    value={form.description}
                    onChange={v => f('description', v)}
                  />
                </div>
              </div>
            )}

            {/* ── TAB 2: HVAC ENGINEERING SPECS ── */}
            {tab === 'specs' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="bg-primary/5 p-3 rounded-lg border border-primary/20 text-xs text-primary mb-2">
                  <strong>Engineering Specifications:</strong> Values entered here populate the official specification matrix on the public product page.
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FloatingInput
                    label="Cooling Capacity Watts (e.g. 5,200 W)"
                    value={form.specs?.coolingCapacity || ''}
                    onChange={e => specField('coolingCapacity', e.target.value)}
                  />
                  <FloatingInput
                    label="Cooling Capacity BTU/hr (e.g. 17,742 Btu/hr)"
                    value={form.specs?.coolingBtu || ''}
                    onChange={e => specField('coolingBtu', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FloatingInput
                    label="Power Input Watts (e.g. 1,450 W)"
                    value={form.specs?.powerInput || ''}
                    onChange={e => specField('powerInput', e.target.value)}
                  />
                  <FloatingInput
                    label="Operating Current (e.g. 6.5 A)"
                    value={form.specs?.current || ''}
                    onChange={e => specField('current', e.target.value)}
                  />
                  <FloatingInput
                    label="Power Supply"
                    value={form.specs?.powerSupply || ''}
                    onChange={e => specField('powerSupply', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FloatingInput
                    label="Compressor Type"
                    value={form.specs?.compressorType || form.compressor || ''}
                    onChange={e => {
                      specField('compressorType', e.target.value)
                      f('compressor', e.target.value)
                    }}
                  />
                  <FloatingInput
                    label="Refrigerant (e.g. R-32, R-410A)"
                    value={form.specs?.refrigerant || ''}
                    onChange={e => specField('refrigerant', e.target.value)}
                  />
                  <FloatingInput
                    label="Max Ambient Temp (e.g. 50°C, 52°C)"
                    value={form.specs?.maxAmbient || form.maxAmbient || ''}
                    onChange={e => {
                      specField('maxAmbient', e.target.value)
                      f('maxAmbient', e.target.value)
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FloatingInput
                    label="ISEER Rating (e.g. 5.10 ISEER)"
                    value={form.specs?.iseer || ''}
                    onChange={e => specField('iseer', e.target.value)}
                  />
                  <FloatingInput
                    label="Indoor Airflow (e.g. 850 CFM / 1445 m³/h)"
                    value={form.specs?.airflow || ''}
                    onChange={e => specField('airflow', e.target.value)}
                  />
                  <FloatingInput
                    label={'Connecting Pipe Size (e.g. 1/4" & 1/2")'}
                    value={form.specs?.pipingSize || ''}
                    onChange={e => specField('pipingSize', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FloatingInput
                    label="Indoor Noise Level (e.g. 44 dB(A))"
                    value={form.specs?.noiseIndoor || ''}
                    onChange={e => specField('noiseIndoor', e.target.value)}
                  />
                  <FloatingInput
                    label="Outdoor Noise Level (e.g. 54 dB(A))"
                    value={form.specs?.noiseOutdoor || ''}
                    onChange={e => specField('noiseOutdoor', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FloatingInput
                    label="Indoor Unit Dimensions (W x H x D mm)"
                    value={form.specs?.dimensionsIndoor || ''}
                    onChange={e => specField('dimensionsIndoor', e.target.value)}
                  />
                  <FloatingInput
                    label="Outdoor Unit Dimensions (W x H x D mm)"
                    value={form.specs?.dimensionsOutdoor || ''}
                    onChange={e => specField('dimensionsOutdoor', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FloatingInput
                    label="Indoor Unit Net Weight (kg)"
                    value={form.specs?.weightIndoor || ''}
                    onChange={e => specField('weightIndoor', e.target.value)}
                  />
                  <FloatingInput
                    label="Outdoor Unit Net Weight (kg)"
                    value={form.specs?.weightOutdoor || ''}
                    onChange={e => specField('weightOutdoor', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* ── TAB 3: FEATURES & APPLICATIONS ── */}
            {tab === 'features' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <FloatingTextarea
                  label="Key Engineering Features (One per line)"
                  rows={6}
                  value={form.featuresText}
                  onChange={e => f('featuresText', e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Each line appears as a checkmarked feature highlight on the public product page.
                </p>

                <FloatingTextarea
                  label="Suitable Applications (Comma-separated, e.g. Server Room, Living Room, Banquets)"
                  rows={3}
                  value={form.applicationsText}
                  onChange={e => f('applicationsText', e.target.value)}
                />
              </div>
            )}

            {/* ── TAB 4: MEDIA & LITERATURE ── */}
            {tab === 'media' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <MediaSelector
                    label="Primary Product Image"
                    value={form.image}
                    onChange={v => f('image', v)}
                    folder="products"
                    accept="image/*"
                    helperText="Official catalog photo displayed on cards and specs."
                  />

                  <MediaSelector
                    label="Detail Banner Image"
                    value={form.detailImage}
                    onChange={v => f('detailImage', v)}
                    folder="products"
                    accept="image/*"
                    helperText="Wide showcase image displayed at top of product detail page."
                  />
                </div>

                <FloatingInput
                  label="Image Alt Text"
                  value={form.alt}
                  onChange={e => f('alt', e.target.value)}
                />

                <MediaSelector
                  label="Associated Technical Brochure / Manual"
                  value={form.brochureUrl}
                  onChange={v => f('brochureUrl', v)}
                  folder="resources"
                  accept=".pdf,application/pdf,image/*"
                  helperText="Select or upload PDF technical manual or product flyer."
                />
              </div>
            )}

            {/* ── TAB 5: SEO & META ── */}
            {tab === 'seo' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <FloatingInput
                  label="Meta Title (SEO)"
                  value={form.metatag}
                  onChange={e => f('metatag', e.target.value)}
                />
                <FloatingTextarea
                  label="Meta Description"
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
                  label="Canonical URL (Optional)"
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
              {saving ? 'Saving...' : product ? 'Save Changes' : 'Create Product'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
