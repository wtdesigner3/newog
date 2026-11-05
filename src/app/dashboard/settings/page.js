"use client";
import { useState, useEffect } from "react";
import AIAssistantButton from "../../../components/dashboard/AIAssistantButton";
import Breadcrumb from "../../../components/dashboard/Breadcrumb";
import Toast from "../../../components/dashboard/Toast";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { FloatingInput, FloatingTextarea } from "../../../components/ui/floating-input";
import { Save, Image as ImageIcon, FileText, Phone, Link2, Share2, Globe, MapPin, Mail, Plus, Trash2, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { Switch } from "../../../components/ui/switch";
import Image from "next/image";

export default function GlobalSettingsCMS() {
  const [data, setData] = useState({
    logoImage: "",
    adminLogo: "",
    favicon: "",
    adminTitle: "",
    footerDescription: "",
    primaryEmail: "",
    primaryPhone: "",
    footerPhone: "",
    address: "",
    pdf1Text: "",
    pdf2Url: "",
    socialLinks: []
  });

  const [files, setFiles] = useState({
    logoImage: null,
    adminLogo: null,
    favicon: null,
    pdf1Url: null,
    pdf2Url: null,
  });
  
  const [logoPreview, setLogoPreview] = useState(null);
  const [adminLogoPreview, setAdminLogoPreview] = useState(null);
  const [faviconPreview, setFaviconPreview] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [tab, setTab] = useState("branding");
  
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [socialForm, setSocialForm] = useState({ platform: '', icon: '', url: '' });
  const [editingIndex, setEditingIndex] = useState(null);
  const [togglingSocialIndex, setTogglingSocialIndex] = useState(null);

  const addToast = (msg, type = "success") =>
    setToasts((t) => [...t, { id: Date.now(), message: msg, type }]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const res = await fetch("/api/global-settings");
      const json = await res.json();
      if (json.data) {
        setData(json.data);
        if (json.data.logoImage) {
          setLogoPreview(json.data.logoImage);
        }
        if (json.data.adminLogo) {
          setAdminLogoPreview(json.data.adminLogo);
        }
        if (json.data.favicon) {
          setFaviconPreview(json.data.favicon);
        }
      }
    } catch (error) {
      addToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e, key) => {
    const file = e.target.files[0];
    setFiles({ ...files, [key]: file });
    
    if (key === 'logoImage' && file) {
      setLogoPreview(URL.createObjectURL(file));
    }
    if (key === 'adminLogo' && file) {
      setAdminLogoPreview(URL.createObjectURL(file));
    }
    if (key === 'favicon' && file) {
      setFaviconPreview(URL.createObjectURL(file));
    }
  };

  const openAddSocialModal = () => {
    setSocialForm({ platform: '', icon: '', url: '' });
    setEditingIndex(null);
    setIsSocialModalOpen(true);
  };

  const openEditSocialModal = (index) => {
    setSocialForm({ ...data.socialLinks[index] });
    setEditingIndex(index);
    setIsSocialModalOpen(true);
  };

  const saveSocialForm = () => {
    const newLinks = [...(data.socialLinks || [])];
    if (editingIndex !== null) {
      newLinks[editingIndex] = socialForm;
    } else {
      newLinks.push(socialForm);
    }
    setData({ ...data, socialLinks: newLinks });
    setIsSocialModalOpen(false);
  };

  const removeSocialLink = (index) => {
    const newLinks = [...(data.socialLinks || [])];
    newLinks.splice(index, 1);
    setData({ ...data, socialLinks: newLinks });
  };

  const toggleSocialStatus = async (index) => {
    try {
      setTogglingSocialIndex(index);
      const newLinks = [...(data.socialLinks || [])];
      newLinks[index] = { 
        ...newLinks[index], 
        isActive: newLinks[index].isActive === false ? true : false 
      };
      
      const formData = new FormData();
      formData.append("socialLinks", JSON.stringify(newLinks));
      
      const res = await fetch("/api/global-settings", {
        method: "PUT",
        body: formData,
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      
      setData({ ...data, socialLinks: newLinks });
      addToast("Social status updated!");
    } catch (err) {
      addToast(err.message, "error");
    } finally {
      setTogglingSocialIndex(null);
    }
  };

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (!["logoImage", "adminLogo", "favicon", "pdf1Url", "pdf2Url", "socialLinks"].includes(key)) {
            formData.append(key, data[key]);
        }
      });
      
      formData.append("socialLinks", JSON.stringify(data.socialLinks || []));
      
      if (files.logoImage) formData.append("logoImage", files.logoImage);
      if (files.adminLogo) formData.append("adminLogo", files.adminLogo);
      if (files.favicon) formData.append("favicon", files.favicon);
      if (files.pdf1Url) formData.append("pdf1Url", files.pdf1Url);
      if (files.pdf2Url) formData.append("pdf2Url", files.pdf2Url);

      const res = await fetch("/api/global-settings", {
        method: "PUT",
        body: formData,
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);

      addToast("Global Settings updated successfully!");
      setData(json.data);
      setFiles({ logoImage: null, adminLogo: null, favicon: null, pdf1Url: null, pdf2Url: null });
      // Reset file inputs visually
      document.querySelectorAll("input[type=file]").forEach(el => el.value = "");
    } catch (error) {
      addToast(error.message, "error");
    } finally {
      setSaving(false);
    }
  }

  const TABS = [
    { key: "branding", label: "Public Branding", icon: ImageIcon },
    { key: "admin", label: "Dashboard Icon", icon: ImageIcon },
    { key: "contact", label: "Contact Info", icon: Phone },
    { key: "brochures", label: "Header PDFs", icon: FileText },
    { key: "social", label: "Social Media", icon: Share2 },
  ];

  if (loading) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center">
        <div className="text-muted-foreground animate-pulse">Loading...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8">
        <Breadcrumb
          title="Global Website Settings"
          crumbs={[{ label: "Global Settings CMS" }]}
        />
      </div>

      <div className="p-4 sm:p-6 lg:p-8 w-full">
        <Card className="border-0 shadow-sm shadow-primary/5 bg-background">
          <CardHeader className="border-b border-border/40 pb-5 px-6 py-5 bg-card rounded-t-2xl">
            <CardTitle className="text-2xl font-bold text-foreground">Global Settings</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Manage website logo, contact information, social links, and brochures.</p>
          </CardHeader>

          <div className="flex gap-6 border-b border-border px-6 mt-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
            {TABS.map(t => {
              const Icon = t.icon
              return (
                <button
                  key={t.key} type="button"
                  onClick={() => setTab(t.key)}
                  className={`py-3 text-[14px] font-semibold transition-colors flex items-center gap-2 relative ${
                    tab === t.key ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {t.label}
                  {tab === t.key && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary rounded-t-md" />}
                </button>
              )
            })}
          </div>

          <form onSubmit={handleSave}>
            <CardContent className="p-6 bg-card rounded-b-2xl">
              
              {tab === "branding" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="border border-input/60 rounded-2xl p-6 bg-muted/10">
                    <label className="text-sm font-semibold text-foreground/80 mb-1 block">Main Website Logo</label>
                    <p className="text-[11px] text-muted-foreground mb-4">Recommended size: 200x60px. Must be PNG with transparent background.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "logoImage")}
                        className="flex h-11 w-full rounded-xl border border-input/60 bg-background px-4 py-2 text-sm transition-all file:border-0 file:bg-transparent file:text-sm file:font-semibold file:text-primary cursor-pointer hover:border-input"
                      />
                      
                      <div className="flex flex-col items-center justify-center">
                        <span className="text-xs font-semibold text-muted-foreground mb-2 block w-full">Current Preview</span>
                        <div className="w-full h-24 rounded-xl border border-border bg-[#1a1a1a] flex items-center justify-center shadow-sm p-4 pattern-grid-lg">
                          {logoPreview ? (
                            <img
                              src={logoPreview}
                              alt="Logo preview"
                              className="max-h-full max-w-full object-contain"
                            />
                          ) : (
                            <div className="flex flex-col items-center text-muted-foreground/50">
                              <ImageIcon className="w-6 h-6 mb-1" />
                              <span className="text-[10px] font-medium uppercase tracking-wider">No Logo</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border border-input/60 rounded-2xl p-6 bg-muted/10">
                    <label className="text-sm font-semibold text-foreground/80 mb-1 block">Browser Favicon</label>
                    <p className="text-[11px] text-muted-foreground mb-4">Recommended size: 32x32px or 64x64px. (.ico or .png)</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                      <input
                        type="file"
                        accept="image/png, image/x-icon, image/ico"
                        onChange={(e) => handleFileChange(e, "favicon")}
                        className="flex h-11 w-full rounded-xl border border-input/60 bg-background px-4 py-2 text-sm transition-all file:border-0 file:bg-transparent file:text-sm file:font-semibold file:text-primary cursor-pointer hover:border-input"
                      />
                      
                      <div className="flex flex-col items-center justify-center">
                        <span className="text-xs font-semibold text-muted-foreground mb-2 block w-full">Current Preview</span>
                        <div className="w-16 h-16 rounded-xl border border-border bg-[#1a1a1a] flex items-center justify-center shadow-sm p-2 pattern-grid-lg">
                          {faviconPreview ? (
                            <img
                              src={faviconPreview}
                              alt="Favicon preview"
                              className="max-h-full max-w-full object-contain"
                            />
                          ) : (
                            <div className="flex flex-col items-center text-muted-foreground/50">
                              <ImageIcon className="w-4 h-4 mb-1" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <FloatingTextarea
                      label="Footer Description"
                      name="footerDescription"
                      value={data.footerDescription}
                      onChange={handleChange}
                      rows={4}
                      rightElement={<AIAssistantButton context="Company Website Footer" field="Concise Footer Description" onGenerate={(val) => setData({ ...data, footerDescription: val })} />}
                    />
                  </div>
                </div>
              )}

              {tab === "admin" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="border border-input/60 rounded-2xl p-6 bg-muted/10">
                    <label className="text-sm font-semibold text-foreground/80 mb-1 block">Dashboard Icon (Sidebar)</label>
                    <p className="text-[11px] text-muted-foreground mb-4">Recommended size: 100x100px. Must be PNG/JPG.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "adminLogo")}
                        className="flex h-11 w-full rounded-xl border border-input/60 bg-background px-4 py-2 text-sm transition-all file:border-0 file:bg-transparent file:text-sm file:font-semibold file:text-primary cursor-pointer hover:border-input"
                      />
                      
                      <div className="flex flex-col items-center justify-center">
                        <span className="text-xs font-semibold text-muted-foreground mb-2 block w-full">Current Preview</span>
                        <div className="w-full h-24 rounded-xl border border-border bg-[#1a1a1a] flex items-center justify-center shadow-sm p-4 pattern-grid-lg">
                          {adminLogoPreview ? (
                            <img
                              src={adminLogoPreview}
                              alt="Dashboard Logo preview"
                              className="max-h-full max-w-full object-contain"
                            />
                          ) : (
                            <div className="flex flex-col items-center text-muted-foreground/50">
                              <ImageIcon className="w-6 h-6 mb-1" />
                              <span className="text-[10px] font-medium uppercase tracking-wider">No Logo</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <FloatingInput
                      label="Dashboard Title"
                      name="adminTitle"
                      value={data.adminTitle}
                      onChange={handleChange}
                      rightElement={<AIAssistantButton context="Admin Dashboard" field="Dashboard Branding Title" onGenerate={(val) => setData({ ...data, adminTitle: val })} />}
                    />
                  </div>
                </div>
              )}

              {tab === "contact" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <FloatingInput
                        label="Primary Email (Header & Footer)"
                        name="primaryEmail"
                        value={data.primaryEmail}
                        onChange={handleChange}
                        icon={<Mail className="w-4 h-4" />}
                      />
                      <FloatingInput
                        label="Primary Phone (Header)"
                        name="primaryPhone"
                        value={data.primaryPhone}
                        onChange={handleChange}
                        icon={<Phone className="w-4 h-4" />}
                      />
                      <FloatingInput
                        label="Footer Phone"
                        name="footerPhone"
                        value={data.footerPhone}
                        onChange={handleChange}
                        icon={<Phone className="w-4 h-4" />}
                      />
                    </div>
                    <div className="space-y-6">
                      <FloatingTextarea
                        label="Office Address (Footer)"
                        name="address"
                        value={data.address}
                        onChange={handleChange}
                        rows={6}
                      />
                    </div>
                  </div>
                </div>
              )}

              {tab === "brochures" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="border border-input/60 rounded-2xl p-6 bg-muted/10 space-y-6">
                    <h4 className="font-bold text-foreground flex items-center gap-2 border-b border-border/60 pb-3">
                      <FileText className="w-5 h-5 text-primary" /> Header PDF 1
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                      <FloatingInput
                        label="PDF 1 Button Text"
                        name="pdf1Text"
                        value={data.pdf1Text}
                        onChange={handleChange}
                        rightElement={<AIAssistantButton context="Company Brochure" field="Compelling Button Text" onGenerate={(val) => setData({ ...data, pdf1Text: val })} />}
                      />
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-muted-foreground ml-1">Upload PDF File</label>
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={(e) => handleFileChange(e, "pdf1Url")}
                          className="flex h-11 w-full rounded-xl border border-input/60 bg-background px-4 py-2 text-sm transition-all file:border-0 file:bg-transparent file:text-sm file:font-semibold file:text-primary cursor-pointer hover:border-input"
                        />
                      </div>
                    </div>
                    {data.pdf1Url && !files.pdf1Url && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Current File:</span>
                        <a href={data.pdf1Url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline font-medium flex items-center gap-1">
                          <Link2 className="w-3.5 h-3.5" /> View PDF
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="border border-input/60 rounded-2xl p-6 bg-muted/10 space-y-6">
                    <h4 className="font-bold text-foreground flex items-center gap-2 border-b border-border/60 pb-3">
                      <FileText className="w-5 h-5 text-primary" /> Header PDF 2
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                      <FloatingInput
                        label="PDF 2 Button Text"
                        name="pdf2Text"
                        value={data.pdf2Text}
                        onChange={handleChange}
                        rightElement={<AIAssistantButton context="Company Brochure" field="Compelling Button Text" onGenerate={(val) => setData({ ...data, pdf2Text: val })} />}
                      />
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-muted-foreground ml-1">Upload PDF File</label>
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={(e) => handleFileChange(e, "pdf2Url")}
                          className="flex h-11 w-full rounded-xl border border-input/60 bg-background px-4 py-2 text-sm transition-all file:border-0 file:bg-transparent file:text-sm file:font-semibold file:text-primary cursor-pointer hover:border-input"
                        />
                      </div>
                    </div>
                    {data.pdf2Url && data.pdf2Url !== "#" && !files.pdf2Url && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Current File:</span>
                        <a href={data.pdf2Url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline font-medium flex items-center gap-1">
                          <Link2 className="w-3.5 h-3.5" /> View PDF
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {tab === "social" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex justify-between items-center bg-card border border-border/50 p-4 rounded-xl">
                    <div>
                      <h3 className="text-lg font-bold text-foreground">Social Media Links</h3>
                      <p className="text-sm text-muted-foreground mt-1">Manage dynamic social media links displayed across the site.</p>
                    </div>
                    <button type="button" onClick={openAddSocialModal} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">
                      <Plus className="w-4 h-4" /> Add Link
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {(data.socialLinks || []).map((link, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-border/60 rounded-xl bg-card shadow-sm hover:border-primary/30 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                            <i className={`bi ${link.icon} text-lg text-foreground`}></i>
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-foreground">{link.platform || 'Unnamed Platform'}</h4>
                            <p className="text-xs text-muted-foreground">{link.url || 'No URL specified'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {togglingSocialIndex === index ? (
                            <span className="text-xs text-muted-foreground animate-pulse">Updating...</span>
                          ) : (
                            <Switch 
                              checked={link.isActive !== false}
                              onCheckedChange={() => toggleSocialStatus(index)}
                            />
                          )}
                          <button type="button" onClick={() => openEditSocialModal(index)} className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button type="button" onClick={() => removeSocialLink(index)} className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {(!data.socialLinks || data.socialLinks.length === 0) && (
                      <div className="text-center py-12 text-muted-foreground bg-muted/20 border-2 border-dashed border-border/60 rounded-xl">
                        <div className="bg-background w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-border/50">
                           <Share2 className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <p className="font-medium text-foreground">No social links added</p>
                        <p className="text-sm mt-1">Click 'Add Link' above to get started.</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-muted/30 border border-border/50 rounded-xl p-4 text-sm text-muted-foreground mt-4 flex items-start gap-3">
                    <Globe className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <p>These links will be displayed in the website footer and header where applicable. The icon should be a valid Bootstrap Icon class (e.g. 'bi-facebook', 'bi-twitter-x').</p>
                  </div>
                </div>
              )}

            </CardContent>

            <CardFooter className="p-6 bg-muted/10 border-t border-border/40 flex items-center justify-end rounded-b-xl">
              <Button 
                type="submit" 
                disabled={saving}
                className="rounded-md px-8 py-2 h-10 bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all whitespace-nowrap border-0"
              >
                <Save className="w-4 h-4 mr-1.5" />
                {saving ? "Saving..." : "Save Settings"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>

      <Dialog open={isSocialModalOpen} onOpenChange={setIsSocialModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold !text-white">{editingIndex !== null ? 'Edit Social Link' : 'Add Social Link'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Platform Name</label>
              <input type="text" className="w-full bg-background border border-border/60 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" value={socialForm.platform} onChange={e => setSocialForm({...socialForm, platform: e.target.value})} placeholder="e.g. LinkedIn" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Bootstrap Icon Class</label>
              <input type="text" className="w-full bg-background border border-border/60 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" value={socialForm.icon} onChange={e => setSocialForm({...socialForm, icon: e.target.value})} placeholder="e.g. bi-linkedin" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Profile URL</label>
              <input type="text" className="w-full bg-background border border-border/60 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" value={socialForm.url} onChange={e => setSocialForm({...socialForm, url: e.target.value})} placeholder="https://..." />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-border/40">
            <Button variant="outline" onClick={() => setIsSocialModalOpen(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={saveSocialForm} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl">Save Link</Button>
          </div>
        </DialogContent>
      </Dialog>
      <Toast
        toasts={toasts}
        onRemove={(id) => setToasts((t) => t.filter((x) => x.id !== id))}
      />
    </div>
  );
}
