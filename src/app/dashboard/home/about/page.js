'use client'
import { useEffect, useState } from 'react'
import AIAssistantButton from '../../../../components/dashboard/AIAssistantButton'
import Breadcrumb from '../../../../components/dashboard/Breadcrumb'
import Toast from '../../../../components/dashboard/Toast'
import RichEditor from '../../../../components/dashboard/RichEditor'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../../../components/ui/card'
import { Button } from '../../../../components/ui/button'
import { FloatingInput, FloatingTextarea } from '../../../../components/ui/floating-input'
import { Save, RotateCcw, Image as ImageIcon, Sparkles, BookOpen, Layers, Award, Link as LinkIcon, Info } from 'lucide-react'

const API_URL = ''

export default function HomeAboutPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [aboutId, setAboutId] = useState(null)
  const [form, setForm] = useState({
    badge: 'PIONEERING HIGH-AMBIENT HVAC',
    title: '',
    short_description: '',
    description: '',
    image: '',
    imageFile: null,
    alt: '',
    experience_years: '30+ Years',
    experience_text: 'Severe Tropical Heatwave Resilience (52°C Tested)',
    button_text: 'Explore Full Heritage Story',
    button_url: '/about-us',
  })
  const [toasts, setToasts] = useState([])

  const addToast = (message, type = 'success') => {
    setToasts(prev => [...prev, { id: Date.now(), message, type }])
  }

  const updateField = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  useEffect(() => {
    fetchHomeAbout()
  }, [])

  const fetchHomeAbout = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/home-about`, { cache: 'no-store' })
      const data = await response.json()

      if (data && data.length > 0) {
        const about = data[0]
        setAboutId(about._id)
        setForm({
          badge: about.badge || 'PIONEERING HIGH-AMBIENT HVAC',
          title: about.title || '',
          short_description: about.short_description || '',
          description: about.description || '',
          image: about.image || '',
          imageFile: null,
          alt: about.alt || '',
          experience_years: about.experience_years || '30+ Years',
          experience_text: about.experience_text || 'Severe Tropical Heatwave Resilience (52°C Tested)',
          button_text: about.button_text || 'Explore Full Heritage Story',
          button_url: about.button_url || '/about-us',
        })
      }
    } catch (error) {
      console.error(error)
      addToast('Failed to load about section', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async e => {
    e.preventDefault()
    try {
      setSaving(true)
      const formData = new FormData()

      formData.append('badge', form.badge)
      formData.append('title', form.title)
      formData.append('short_description', form.short_description)
      formData.append('description', form.description)
      formData.append('alt', form.alt)
      formData.append('experience_years', form.experience_years)
      formData.append('experience_text', form.experience_text)
      formData.append('button_text', form.button_text)
      formData.append('button_url', form.button_url)

      if (form.imageFile) {
        formData.append('image', form.imageFile)
      }

      const response = await fetch(`/api/home-about`, {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.message || 'Update failed')
      }

      addToast('About Us content updated successfully!', 'success')
      fetchHomeAbout()
    } catch (error) {
      console.error(error)
      addToast(error.message || 'Update failed', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center min-h-[60vh]">
        <div className="text-slate-400 animate-pulse font-medium">Loading About Us content...</div>
      </div>
    )
  }

  return (
    <div className="min-h-full pb-16">
      <div className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8">
        <Breadcrumb 
          title="About Us Management" 
          subtitle="Unified management for both the Homepage About section and the complete /about-us page." 
          crumbs={[{ label: 'Content Management' }, { label: 'About Us' }]} 
        />
      </div>

      <div className="p-4 sm:px-6 lg:px-8 space-y-6 w-full">
        {/* Strategy Insight Banner */}
        <div className="p-5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-slate-200 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between shadow-xs">
          <div className="flex gap-3 items-start">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 shrink-0 mt-0.5">
              <Info className="w-5 h-5" />
            </div>
            <div className="space-y-1 text-xs sm:text-sm">
              <h4 className="font-bold text-white text-[15px]">Single Source of Truth for About Us</h4>
              <p className="text-slate-300 leading-relaxed">
                <strong>Short Description:</strong> Displays on the Homepage About section. If left blank, the homepage will automatically show an excerpt from the Full Description.
              </p>
              <p className="text-slate-300 leading-relaxed">
                <strong>Full Description:</strong> Displays on the <code>/about-us</code> page. When both Short and Full descriptions are provided, the <code>/about-us</code> page showcases the Short Description as an opening summary highlight, followed by the complete Full Story below it.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Card 1: Core Headings & Descriptions */}
          <Card className="border border-slate-700/80 shadow-md bg-card rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-border/40 px-6 py-5 bg-muted/20">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                <CardTitle className="text-xl font-bold !text-white">Narrative & Editorial Content</CardTitle>
              </div>
              <p className="text-xs text-slate-300 mt-1">Configure section pill badge, headline, and both short/full storytelling descriptions.</p>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                <div className="md:col-span-5">
                  <FloatingInput
                    label="Pill Tagline Badge *"
                    value={form.badge}
                    onChange={e => updateField('badge', e.target.value)}
                    placeholder="e.g. PIONEERING HIGH-AMBIENT HVAC"
                    rightElement={<AIAssistantButton context="About Us Section Pill Badge" field="Tagline Pill" onGenerate={(val) => updateField('badge', val)} />}
                  />
                </div>
                <div className="md:col-span-7">
                  <FloatingInput
                    label="Main Section Title *"
                    value={form.title}
                    onChange={e => updateField('title', e.target.value)}
                    required
                    placeholder="e.g. Engineered to Cool Where Ordinary Air Conditioners Fail"
                    rightElement={<AIAssistantButton context="OG Heavy Duty About Section Title" field="Catchy Title" onGenerate={(val) => updateField('title', val)} />}
                  />
                </div>
              </div>

              {/* Short Description (Homepage Intro) */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-[13px] font-semibold text-white block">
                      Short Description (Homepage Intro)
                    </label>
                    <p className="text-[11px] text-slate-400">
                      Shown on the homepage About section. If left blank, the homepage will automatically show an excerpt from Full Description.
                    </p>
                  </div>
                  <AIAssistantButton 
                    context={form.title || 'OG Heavy Duty Air Conditioners'} 
                    field="Concise 2-Sentence Homepage Introduction" 
                    onGenerate={(val) => updateField('short_description', val)} 
                  />
                </div>
                <textarea
                  rows={3}
                  value={form.short_description}
                  onChange={e => updateField('short_description', e.target.value)}
                  placeholder="Enter a concise intro (1-2 paragraphs) for the homepage..."
                  className="w-full text-sm p-3.5 bg-muted/40 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-y transition-colors leading-relaxed"
                />
              </div>

              {/* Full Description (Complete Heritage Story) */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-[13px] font-semibold text-white block">
                      Full Description (Complete Heritage Story) *
                    </label>
                    <p className="text-[11px] text-slate-400">
                      Shown on the <code>/about-us</code> page. Supports rich text formatting, paragraphs, lists, and deep technical details.
                    </p>
                  </div>
                  <AIAssistantButton 
                    context={form.title || 'OG Heavy Duty Manufacturing & Engineering Heritage'} 
                    field="Comprehensive Company Heritage Narrative" 
                    onGenerate={(val) => updateField('description', val)} 
                  />
                </div>
                <div className="border border-slate-700/80 rounded-xl overflow-hidden shadow-sm">
                  <RichEditor
                    value={form.description}
                    onChange={value => updateField('description', value)}
                    placeholder="Enter full heritage and manufacturing story..."
                    minHeight={280}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Section Image & Floating Experience Badge */}
          <Card className="border border-slate-700/80 shadow-md bg-card rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-border/40 px-6 py-5 bg-muted/20">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-primary" />
                <CardTitle className="text-xl font-bold !text-white">Section Image & Floating Experience Badge</CardTitle>
              </div>
              <p className="text-xs text-slate-300 mt-1">Manage the hero visual and the floating 30+ Years milestone card displayed over the image.</p>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div className="space-y-4">
                  <div className="space-y-1.5 border border-border/60 rounded-xl p-4 bg-muted/10">
                    <label className="text-[13px] font-semibold text-white block">Upload Image</label>
                    <p className="text-[11px] text-slate-400">Recommended size: 600×450px JPG/PNG/WebP</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => {
                        const file = e.target.files?.[0]
                        if (file) {
                          setForm(prev => ({
                            ...prev,
                            imageFile: file,
                            image: URL.createObjectURL(file),
                          }))
                        }
                      }}
                      className="flex h-11 w-full rounded-xl border border-border bg-slate-900/60 text-slate-200 px-4 py-2 text-sm transition-all file:border-0 file:bg-blue-600/20 file:text-blue-400 file:rounded-lg file:px-3 file:py-1 file:mr-3 file:text-xs file:font-semibold hover:file:bg-blue-600/30 cursor-pointer hover:border-slate-600"
                    />
                  </div>

                  <FloatingInput
                    label="Image ALT Text (SEO)"
                    value={form.alt}
                    onChange={e => updateField('alt', e.target.value)}
                    placeholder="Descriptive alt text for SEO"
                    rightElement={<AIAssistantButton context={form.title || 'About OG Heavy Duty'} field="SEO Image Alt Text" onGenerate={(val) => updateField('alt', val)} />}
                  />
                </div>
                
                <div className="space-y-2">
                  <span className="text-[13px] font-semibold text-white block">Image Preview</span>
                  <div className="w-full aspect-[4/3] rounded-2xl border border-slate-700 bg-slate-950 overflow-hidden flex items-center justify-center shadow-inner relative group">
                    {form.image ? (
                      <img
                        src={form.image.startsWith('/uploads') ? `${API_URL}${form.image}` : form.image}
                        alt={form.alt || 'About Image'}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex flex-col items-center text-slate-500">
                        <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
                        <span className="text-xs font-medium">No image uploaded</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Floating Badge Settings */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-primary" />
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">Floating Experience Card Badge</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FloatingInput
                    label="Milestone Stat (e.g. 30+ Years)"
                    value={form.experience_years}
                    onChange={e => updateField('experience_years', e.target.value)}
                  />
                  <FloatingInput
                    label="Milestone Subtitle (e.g. Severe Tropical 52°C Resilience)"
                    value={form.experience_text}
                    onChange={e => updateField('experience_text', e.target.value)}
                  />
                </div>
              </div>

              {/* Button Customization */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-primary" />
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">Action Button Settings</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FloatingInput
                    label="Button Text"
                    value={form.button_text}
                    onChange={e => updateField('button_text', e.target.value)}
                  />
                  <FloatingInput
                    label="Button URL / Destination"
                    value={form.button_url}
                    onChange={e => updateField('button_url', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="p-6 bg-muted/10 border-t border-slate-800 flex items-center justify-end gap-3 rounded-b-2xl">
              <Button 
                type="button" 
                variant="outline" 
                onClick={fetchHomeAbout}
                disabled={saving}
                className="rounded-full px-6 h-11 font-medium bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white"
              >
                <RotateCcw className="w-4 h-4 mr-2" /> Reset
              </Button>
              <Button 
                type="submit" 
                disabled={saving}
                className="rounded-full px-9 h-11 bg-[#0f7ae0] hover:bg-[#0d69c2] text-white font-semibold shadow-lg shadow-blue-500/25 transition-transform active:scale-95"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>

      <Toast toasts={toasts} onRemove={id => setToasts(prev => prev.filter(toast => toast.id !== id))} />
    </div>
  )
}
