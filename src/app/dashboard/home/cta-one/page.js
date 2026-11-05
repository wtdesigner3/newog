'use client'
import { useState, useEffect } from 'react'
import AIAssistantButton from '../../../../components/dashboard/AIAssistantButton'
import Breadcrumb from '../../../../components/dashboard/Breadcrumb'
import Toast from '../../../../components/dashboard/Toast'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../../../components/ui/card'
import { Button } from '../../../../components/ui/button'
import { FloatingInput } from '../../../../components/ui/floating-input'
import { Save, RotateCcw, Fan, ArrowRight, Sparkles, Link as LinkIcon } from 'lucide-react'

const BASE_URL = ''

const DEFAULT_STATE = {
  badge: 'MEP & HVAC ENGINEERING SUPPORT',
  title: 'Require custom institutional HVAC specifications?',
  content: 'Our engineering desk assists MEP consultants, architects, and facilities managers with heat load calculations, static pressure sizing, and duct equipment layouts.',
  buttonText: 'Consult Engineering Desk',
  buttonUrl: '/contact-us',
}

export default function CtaOnePage() {
  const [form, setForm] = useState({ ...DEFAULT_STATE })
  const [recordId, setRecordId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toasts, setToasts] = useState([])

  const addToast = (message, type = 'success') => {
    setToasts(t => [...t, { id: Date.now(), message, type }])
    setTimeout(() => {
      setToasts(t => t.filter(x => x.id !== t[t.length - 1]?.id))
    }, 4000)
  }

  useEffect(() => {
    fetchCta()
  }, [])

  async function fetchCta() {
    try {
      setLoading(true)
      const res = await fetch(`${BASE_URL}/api/cta`)
      if (!res.ok) throw new Error('Failed to fetch Engineering Callout')
      const data = await res.json()
      if (Array.isArray(data) && data.length > 0) {
        const record = data[0]
        setRecordId(record._id)
        setForm({
          badge: record.badge || DEFAULT_STATE.badge,
          title: record.title || DEFAULT_STATE.title,
          content: record.content || DEFAULT_STATE.content,
          buttonText: record.buttonText || DEFAULT_STATE.buttonText,
          buttonUrl: record.buttonUrl || DEFAULT_STATE.buttonUrl,
        })
      }
    } catch (err) {
      addToast(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      setSaving(true)
      const fd = new FormData()
      fd.append('badge', form.badge || '')
      fd.append('title', form.title || '')
      fd.append('content', form.content || '')
      fd.append('buttonText', form.buttonText || '')
      fd.append('buttonUrl', form.buttonUrl || '')

      const res = await fetch(`${BASE_URL}/api/cta`, { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Save failed')
      addToast('Engineering Callout Banner saved successfully!')
    } catch (err) {
      addToast(err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground animate-pulse">Loading Callout Banner Data...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8">
        <Breadcrumb
          title="Engineering Callout Banner"
          crumbs={[{ label: 'Home Management' }, { label: 'Engineering Callout Banner' }]}
        />
      </div>

      <div className="p-4 sm:p-6 lg:p-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Card */}
        <div className="lg:col-span-7">
          <Card className="border-0 shadow-sm shadow-primary/5 bg-background">
            <CardHeader className="border-b border-border/40 px-6 py-5 bg-card rounded-t-2xl">
              <CardTitle className="text-xl font-bold text-foreground">
                Engineering Support Callout Banner
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Manage the technical support callout strip displayed beneath the Why Choose Us / Engineering Differentiators section.
              </p>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <CardContent className="p-6 space-y-6 bg-card">
                {/* Pill / Kicker Badge */}
                <FloatingInput
                  label="Badge / Pill Tagline *"
                  required
                  value={form.badge}
                  onChange={e => setForm({ ...form, badge: e.target.value })}
                  placeholder="e.g. MEP & HVAC ENGINEERING SUPPORT"
                  rightElement={
                    <AIAssistantButton
                      context="Technical HVAC Consultation Banner"
                      field="Badge Pill Tagline"
                      onGenerate={val => setForm({ ...form, badge: val })}
                    />
                  }
                />

                {/* Title */}
                <FloatingInput
                  label="Headline Title *"
                  required
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Require custom institutional HVAC specifications?"
                  rightElement={
                    <AIAssistantButton
                      context="Technical HVAC Consultation Banner"
                      field="Direct Actionable Headline"
                      onGenerate={val => setForm({ ...form, title: val })}
                    />
                  }
                />

                {/* Content / Subtext */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-sm font-semibold text-foreground/80 block">
                      Description Subtext
                    </label>
                    <AIAssistantButton
                      context={form.title || 'Technical HVAC Consultation'}
                      field="Persuasive Subtext for Engineers"
                      onGenerate={val => setForm({ ...form, content: val })}
                    />
                  </div>
                  <textarea
                    rows={4}
                    value={form.content}
                    onChange={e => setForm({ ...form, content: e.target.value })}
                    placeholder="Enter descriptive technical support assistance..."
                    className="w-full rounded-xl border border-input/60 bg-background px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 hover:border-input"
                  />
                </div>

                {/* Button Details */}
                <div className="border border-input/60 rounded-xl p-5 bg-muted/10 space-y-4">
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Call-to-Action Button
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FloatingInput
                      label="Button Label"
                      value={form.buttonText}
                      onChange={e => setForm({ ...form, buttonText: e.target.value })}
                      placeholder="e.g. Consult Engineering Desk"
                      rightElement={
                        <AIAssistantButton
                          context={form.title || 'Engineering Desk'}
                          field="Button Action Text"
                          onGenerate={val => setForm({ ...form, buttonText: val })}
                        />
                      }
                    />
                    <FloatingInput
                      label="Button URL"
                      value={form.buttonUrl}
                      onChange={e => setForm({ ...form, buttonUrl: e.target.value })}
                      placeholder="/contact-us"
                      icon={<LinkIcon className="w-4 h-4" />}
                    />
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-6 bg-muted/10 border-t border-border/40 flex items-center justify-end gap-4 rounded-b-2xl">
                <Button
                  type="button"
                  variant="outline"
                  onClick={fetchCta}
                  disabled={saving}
                  className="rounded-md px-6 h-10 font-medium bg-background"
                >
                  <RotateCcw className="w-4 h-4 mr-2" /> Reset
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="rounded-md px-8 h-10 bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all whitespace-nowrap border-0"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>

        {/* Live Preview Card (Matches Homepage Exact UI) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="text-sm font-bold text-foreground flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Live Section Preview</span>
          </div>

          <div className="rounded-2xl bg-[#0B132B] p-6 text-white border border-slate-800 relative overflow-hidden shadow-2xl">
            {/* Ambient glows */}
            <div className="absolute -top-12 -right-12 w-36 h-36 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-3">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-blue-400">
                <Fan className="w-3.5 h-3.5 text-blue-400" />
                <span>{form.badge || 'MEP & HVAC ENGINEERING SUPPORT'}</span>
              </div>

              <h4 className="text-lg font-bold tracking-tight text-white">
                {form.title || 'Require custom institutional HVAC specifications?'}
              </h4>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {form.content ||
                  'Our engineering desk assists MEP consultants, architects, and facilities managers with heat load calculations, static pressure sizing, and duct equipment layouts.'}
              </p>

              <div className="pt-2">
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0f7ae0] text-white text-xs font-bold tracking-wide shadow-md">
                  <span>{form.buttonText || 'Consult Engineering Desk'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Toast toasts={toasts} onRemove={id => setToasts(t => t.filter(x => x.id !== id))} />
    </div>
  )
}
