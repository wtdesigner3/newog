'use client'
import { useState, useEffect } from 'react'
import AIAssistantButton from '../../../../components/dashboard/AIAssistantButton'
import Breadcrumb from '../../../../components/dashboard/Breadcrumb'
import Toast from '../../../../components/dashboard/Toast'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../../../components/ui/card'
import { Button } from '../../../../components/ui/button'
import { FloatingInput } from '../../../../components/ui/floating-input'
import { Save, RotateCcw, Type } from 'lucide-react'

const BASE_URL = ''

const DEFAULT = {
  choose_badge: '', choose_title: '', choose_subtitle: '',
  product_badge: '', product_title: '', product_subtitle: '',
  certified_badge: '', certified_title: '', certified_subtitle: '',
  work_badge: '', work_title: '', work_subtitle: '',
  blog_badge: '', blog_title: '', blog_subtitle: '',
  contact_badge: '', contact_title: '', contact_subtitle: '',
}

const sections = [
  { 
    key: 'product',   
    label: 'Products Range Section', 
    fields: [
      { key: 'product_badge', label: 'Tagline Pill Badge (e.g. HEAVY-DUTY HVAC CLASSIFICATIONS)' },
      { key: 'product_title', label: 'Section Title' },
      { key: 'product_subtitle', label: 'Subtitle / Description' }
    ]
  },
  { 
    key: 'choose',    
    label: 'Why Choose Us / Technical Benchmarks', 
    fields: [
      { key: 'choose_badge', label: 'Tagline Pill Badge (e.g. ENGINEERING BENCHMARK)' },
      { key: 'choose_title', label: 'Section Title' },
      { key: 'choose_subtitle', label: 'Subtitle / Description' }
    ]
  },
  { 
    key: 'work',      
    label: 'Our Work & Institutional Clients Section', 
    fields: [
      { key: 'work_badge', label: 'Tagline Pill Badge (e.g. TRUSTED BY INDUSTRY LEADERS)' },
      { key: 'work_title', label: 'Section Title' },
      { key: 'work_subtitle', label: 'Subtitle / Description' }
    ]
  },
  { 
    key: 'blog',      
    label: 'Blog & Engineering Articles Section', 
    fields: [
      { key: 'blog_badge', label: 'Tagline Pill Badge (e.g. TECHNICAL ARTICLES & GUIDES)' },
      { key: 'blog_title', label: 'Section Title' },
      { key: 'blog_subtitle', label: 'Subtitle / Description' }
    ]
  },
  { 
    key: 'contact',   
    label: 'Commercial Enquiry / Lower CTA Section', 
    fields: [
      { key: 'contact_badge', label: 'Tagline Pill Badge (e.g. GET A QUOTE)' },
      { key: 'contact_title', label: 'Section Title' },
      { key: 'contact_subtitle', label: 'Subtitle / Description' }
    ]
  },
  { 
    key: 'certified', 
    label: 'Milestones & Achievements Strip', 
    fields: [
      { key: 'certified_badge', label: 'Tagline Pill Badge (e.g. PROVEN SCALE)' },
      { key: 'certified_title', label: 'Section Title' },
      { key: 'certified_subtitle', label: 'Subtitle / Description' }
    ]
  },
]

export default function HeadingTextPage() {
  const [form, setForm] = useState(DEFAULT)
  const [recordId, setRecordId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toasts, setToasts] = useState([])

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }))
  const addToast = (message, type = 'success') => {
    setToasts(t => [...t, { id: Date.now(), message, type }])
    setTimeout(() => {
      setToasts(t => t.filter(x => x.id !== t[t.length - 1]?.id))
    }, 4000)
  }

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      setLoading(true)
      const res = await fetch(`${BASE_URL}/api/home-extra`)
      if (!res.ok) throw new Error('Failed to fetch heading texts')
      const data = await res.json()
      const r = Array.isArray(data) ? data[0] : data
      if (r) {
        setRecordId(r._id)
        setForm({
          choose_badge:      r.choose_badge      || '',
          choose_title:      r.choose_title      || '',
          choose_subtitle:   r.choose_subtitle   || '',
          product_badge:     r.product_badge     || '',
          product_title:     r.product_title     || '',
          product_subtitle:  r.product_subtitle  || '',
          certified_badge:   r.certified_badge   || '',
          certified_title:   r.certified_title   || '',
          certified_subtitle:r.certified_subtitle|| '',
          work_badge:        r.work_badge        || '',
          work_title:        r.work_title        || '',
          work_subtitle:     r.work_subtitle     || '',
          blog_badge:        r.blog_badge        || '',
          blog_title:        r.blog_title        || '',
          blog_subtitle:     r.blog_subtitle     || '',
          contact_badge:     r.contact_badge     || '',
          contact_title:     r.contact_title     || '',
          contact_subtitle:  r.contact_subtitle  || '',
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
      const res = await fetch(`${BASE_URL}/api/home-extra`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Save failed')
      addToast('All section tagline pills and heading texts saved!')
      if (data.data && data.data._id) {
        setRecordId(data.data._id)
      }
    } catch (err) {
      addToast(err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground animate-pulse">Loading Headings & Taglines Data...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8">
        <Breadcrumb
          title="Section Headings & Tagline Pills"
          crumbs={[{ label: 'Home Management' }, { label: 'Headings & Taglines' }]}
        />
      </div>
      
      <div className="p-4 sm:p-6 lg:p-8 w-full">
        <Card className="border-0 shadow-sm shadow-primary/5 bg-background">
          <CardHeader className="border-b border-border/40 px-6 py-5 bg-card rounded-t-2xl flex flex-row items-center gap-3">
            <Type className="w-6 h-6 text-primary" />
            <div>
              <CardTitle className="text-xl font-bold text-foreground">Section Tagline Pills &amp; Headings</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Manage the top pill badges, main section titles, and subtitle descriptions across all homepage sections.</p>
            </div>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="p-6 bg-card space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sections.map(sec => (
                  <div key={sec.key} className="border border-input/60 rounded-xl p-5 bg-muted/10 space-y-4">
                    <h3 className="font-bold text-foreground text-sm flex items-center border-b border-border/60 pb-2 mb-4">
                      {sec.label}
                    </h3>
                    <div className="space-y-4">
                      {sec.fields.map(field => (
                        <FloatingInput
                          key={field.key}
                          label={field.label}
                          value={form[field.key] || ''}
                          onChange={e => f(field.key, e.target.value)}
                          rightElement={<AIAssistantButton context={`${sec.label} - ${field.label}`} field="Engaging Text" onGenerate={(val) => f(field.key, val)} />}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

            </CardContent>

            <CardFooter className="p-6 bg-muted/10 border-t border-border/40 flex items-center justify-end gap-4 rounded-b-2xl">
              <Button 
                type="button" 
                variant="outline" 
                onClick={fetchData}
                disabled={saving}
                className="rounded-md px-6 h-10 font-medium bg-background cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 mr-2" /> Reset
              </Button>
              <Button 
                type="submit" 
                disabled={saving}
                className="rounded-md px-8 h-10 bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all whitespace-nowrap border-0 cursor-pointer shadow-md"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save All Taglines & Headings'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>

      <Toast toasts={toasts} onRemove={id => setToasts(t => t.filter(x => x.id !== id))} />
    </div>
  )
}
