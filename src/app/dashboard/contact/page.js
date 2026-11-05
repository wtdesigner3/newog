"use client";
import { useState, useEffect } from "react";
import AIAssistantButton from "../../../components/dashboard/AIAssistantButton";
import Breadcrumb from "../../../components/dashboard/Breadcrumb";
import Toast from "../../../components/dashboard/Toast";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { FloatingInput, FloatingTextarea } from "../../../components/ui/floating-input";
import { Save, Plus, Trash2, MapPin, Search, Share2, FileText, ImageIcon, Edit2 } from "lucide-react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../components/ui/dialog";
import { Switch } from "../../../components/ui/switch";
import ConfirmDeleteModal from "../../../components/dashboard/ConfirmDeleteModal";

function LocationModal({ location, onSave, onClose }) {
  const [form, setForm] = useState(location ? location : { title: "", address: "", phone: "", email: "", isActive: true });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{location ? 'Edit Location' : 'Add Location'}</DialogTitle>
          <p className="text-muted-foreground text-sm">Fill out the information below to {location ? 'update' : 'create'} this location.</p>
        </DialogHeader>
        <form onSubmit={e => { e.preventDefault(); onSave(form); }} className="space-y-6 mt-4">
          <div className="space-y-6">
             <FloatingInput label="Office Name / Title" name="title" value={form.title} onChange={handleChange} required />
             <FloatingTextarea label="Address" name="address" value={form.address} onChange={handleChange} rows={2} required />
             <FloatingInput label="Phone Number(s)" name="phone" value={form.phone} onChange={handleChange} required />
             <FloatingInput label="Email(s)" name="email" value={form.email} onChange={handleChange} required />
          </div>
          <DialogFooter className="pt-6 border-t border-border mt-6">
            <Button variant="ghost" type="button" onClick={onClose} className="rounded-full px-6 text-muted-foreground hover:bg-muted/50 font-medium">Cancel</Button>
            <Button type="submit" className="rounded-full px-10 py-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[15px] shadow-lg shadow-blue-500/30 transition-transform active:scale-95">Save Location</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function ContactPageCMS() {
  const [data, setData] = useState({
    headerTitle: "",
    headerImage: "",
    contactSubTitle: "",
    contactTitle: "",
    contactDescription: "",
    mapIframeUrl: "",
    locations: [],
    metatag: "",
    metaDescription: "",
    metakeywords: "[]",
    canonicalUrl: "",
    ogTitle: "",
    ogDescription: "",
    twitterCard: "summary_large_image",
    robots: "index, follow",
    schemaMarkup: "{}",
  });

  const [headerFile, setHeaderFile] = useState(null);
  const [headerPreview, setHeaderPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [tab, setTab] = useState("content");
  const [locationModal, setLocationModal] = useState(null);
  
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, index: null });
  const [isRemoving, setIsRemoving] = useState(false);

  const addToast = (msg, type = "success") =>
    setToasts((t) => [...t, { id: Date.now(), message: msg, type }]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [contactRes, bannerRes] = await Promise.all([
        fetch("/api/contact-page"),
        fetch("/api/page-banners?pageKey=contact")
      ]);
      const json = await contactRes.json();
      const bannerJson = await bannerRes.json();
      const banner = bannerJson && bannerJson.length > 0 ? bannerJson[0] : null;

      if (json.data) {
        setData({
          headerTitle: banner ? banner.title : json.data.headerTitle || "",
          headerImage: banner ? banner.image : json.data.headerImage || "",
          contactSubTitle: json.data.contactSubTitle || "",
          contactTitle: json.data.contactTitle || "",
          contactDescription: json.data.contactDescription || "",
          mapIframeUrl: json.data.mapIframeUrl || "",
          locations: json.data.locations || [],
          metatag: json.data.metatag || "",
          metaDescription: json.data.metaDescription || "",
          metakeywords: Array.isArray(json.data.metakeywords)
            ? JSON.stringify(json.data.metakeywords)
            : "[]",
          canonicalUrl: json.data.canonicalUrl || "",
          ogTitle: json.data.ogTitle || "",
          ogDescription: json.data.ogDescription || "",
          twitterCard: json.data.twitterCard || "summary_large_image",
          robots: json.data.robots || "index, follow",
          schemaMarkup: json.data.schemaMarkup
            ? JSON.stringify(json.data.schemaMarkup, null, 2)
            : "{}",
        });
        if (banner && banner.image) {
          setHeaderPreview(banner.image);
        } else if (json.data.headerImage) {
          setHeaderPreview(json.data.headerImage);
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

  const openAddLocation = () => {
    setLocationModal({ data: null });
  };

  const openEditLocation = (index) => {
    setLocationModal({ index, data: data.locations[index] });
  };

  const handleSaveLocation = async (loc) => {
    let newLocations = [...data.locations];
    if (locationModal.index !== undefined) {
      newLocations[locationModal.index] = loc;
    } else {
      newLocations.push(loc);
    }
    
    // Auto-save to API
    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (key === "locations") {
          formData.append(key, JSON.stringify(newLocations));
        } else {
          formData.append(key, data[key]);
        }
      });

      const res = await fetch("/api/contact-page", {
        method: "PUT",
        body: formData,
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);

      setData({ ...data, locations: newLocations });
      setLocationModal(null);
      addToast("Location saved successfully!");
    } catch (error) {
      addToast(error.message, "error");
    }
  };

  const confirmRemoveLocation = (index) => {
    setConfirmModal({ isOpen: true, index });
  };

  const handleConfirmRemove = async () => {
    const index = confirmModal.index;
    if (index === null) return;
    
    setConfirmModal({ isOpen: false, index: null });
    setIsRemoving(true);
    
    const newLocations = data.locations.filter((_, i) => i !== index);
    
    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (key === "locations") {
          formData.append(key, JSON.stringify(newLocations));
        } else {
          formData.append(key, data[key]);
        }
      });

      const res = await fetch("/api/contact-page", {
        method: "PUT",
        body: formData,
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);

      setData({ ...data, locations: newLocations });
      addToast("Location removed successfully!");
    } catch (error) {
      addToast(error.message, "error");
    } finally {
      setIsRemoving(false);
    }
  };

  const handleToggleLocationStatus = async (index, currentStatus) => {
    try {
      const newLocations = [...data.locations];
      newLocations[index].isActive = !currentStatus;
      
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (key === "locations") {
          formData.append(key, JSON.stringify(newLocations));
        } else {
          formData.append(key, data[key]);
        }
      });

      const res = await fetch("/api/contact-page", {
        method: "PUT",
        body: formData,
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);

      setData({ ...data, locations: newLocations });
      addToast("Location status updated!");
    } catch (error) {
      addToast(error.message, "error");
    }
  };

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      // Save page banner first
      const bannerFd = new FormData();
      bannerFd.append("pageKey", "contact");
      bannerFd.append("title", data.headerTitle);
      if (headerFile) bannerFd.append("image", headerFile);

      const bannerRes = await fetch("/api/page-banners", {
        method: "POST",
        body: bannerFd,
      });
      const bannerJson = await bannerRes.json();

      // Save contact page
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (key === "locations") {
          formData.append(key, JSON.stringify(data[key]));
        } else {
          formData.append(key, data[key]);
        }
      });

      const res = await fetch("/api/contact-page", {
        method: "PUT",
        body: formData,
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);

      addToast("Contact Page updated successfully!");
      if (bannerJson?.image) {
        setData((prev) => ({ ...prev, headerImage: bannerJson.image }));
        setHeaderFile(null);
      } else if (json.data?.headerImage) {
        setData((prev) => ({ ...prev, headerImage: json.data.headerImage }));
      }
    } catch (error) {
      addToast(error.message, "error");
    } finally {
      setSaving(false);
    }
  }

  const TABS = [
    { key: "content", label: "Page Content", icon: FileText },
    { key: "locations", label: "Office Locations", icon: MapPin },
    { key: "seo", label: "SEO Settings", icon: Search },
  ]

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
          title="Contact Page Management"
          crumbs={[{ label: "Contact Page CMS" }]}
        />
      </div>

      <div className="p-4 sm:p-6 lg:p-8 w-full">
        <Card className="border-0 shadow-sm shadow-primary/5 bg-background">
          <CardHeader className="border-b border-border/40 pb-5 px-6 py-5 bg-card rounded-t-2xl">
            <CardTitle className="text-2xl font-bold text-foreground">Manage Contact Page</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Update the content, locations, and SEO settings for the contact page.</p>
          </CardHeader>

          <div className="flex gap-6 border-b border-border px-6 mt-2">
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
              {tab === "content" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <FloatingInput
                        label="Top Banner Title"
                        name="headerTitle"
                        value={data.headerTitle}
                        onChange={handleChange}
                        rightElement={<AIAssistantButton context="Contact Page Banner" field="Banner Title" onGenerate={(val) => setData({ ...data, headerTitle: val })} />}
                      />
                    </div>
                    
                    <div className="space-y-6">
                      <FloatingInput
                        label="Google Map Iframe URL (src only)"
                        name="mapIframeUrl"
                        value={data.mapIframeUrl}
                        onChange={handleChange}
                        placeholder="https://www.google.com/maps/embed?..."
                      />
                      <p className="text-[11px] text-muted-foreground -mt-4 px-1">Extract only the src link from the Google Maps iframe embed code.</p>
                      
                      {data.mapIframeUrl && (
                        <div className="mt-2 p-2 border border-border rounded-xl bg-muted/10 shadow-sm">
                          <iframe 
                            src={data.mapIframeUrl} 
                            width="100%" 
                            height="200" 
                            style={{border: 0, borderRadius: '8px'}} 
                            loading="lazy"
                          ></iframe>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-border/40 space-y-6">
                    <h4 className="font-bold text-lg">Contact Form Section</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FloatingInput
                        label="Section Sub-title (Orange text)"
                        name="contactSubTitle"
                        value={data.contactSubTitle}
                        onChange={handleChange}
                        rightElement={<AIAssistantButton context="Contact Form Section" field="Sub-title" onGenerate={(val) => setData({ ...data, contactSubTitle: val })} />}
                      />
                      <FloatingInput
                        label="Section Title"
                        name="contactTitle"
                        value={data.contactTitle}
                        onChange={handleChange}
                        rightElement={<AIAssistantButton context="Contact Form Section" field="Main Title" onGenerate={(val) => setData({ ...data, contactTitle: val })} />}
                      />
                    </div>
                    <FloatingTextarea
                      label="Section Description"
                      name="contactDescription"
                      value={data.contactDescription}
                      onChange={handleChange}
                      rows={3}
                      rightElement={<AIAssistantButton context="Contact Form Section" field="Description Text" onGenerate={(val) => setData({ ...data, contactDescription: val })} />}
                    />
                  </div>
                </div>
              )}

              {tab === "locations" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex justify-between items-center bg-muted/30 p-4 rounded-xl border border-border/50">
                    <h4 className="font-semibold text-foreground">Manage Office Locations</h4>
                    <Button type="button" onClick={openAddLocation} className="rounded-md px-5 h-9 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all whitespace-nowrap border-0">
                      <Plus className="w-4 h-4 mr-1.5" /> Add New Location
                    </Button>
                  </div>
                  
                  {data.locations.length === 0 && (
                    <div className="text-center py-10 border border-dashed border-border rounded-xl">
                      <p className="text-muted-foreground">No locations added yet.</p>
                    </div>
                  )}

                  <div className="space-y-4">
                    {data.locations.map((loc, index) => (
                      <div key={index} className="border border-border/80 bg-background rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-muted/30 px-5 py-4 gap-4">
                          <div>
                            <h5 className="font-semibold text-foreground flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-primary" /> {loc.title || `Location #${index + 1}`}
                            </h5>
                            <p className="text-sm text-muted-foreground mt-1 ml-6">{loc.address}</p>
                          </div>
                          <div className="flex items-center gap-4 sm:ml-auto ml-6">
                            <Switch 
                              checked={loc.isActive !== false}
                              onCheckedChange={() => handleToggleLocationStatus(index, loc.isActive !== false)}
                            />
                            <div className="flex items-center gap-2">
                              <Button type="button" variant="ghost" size="sm" onClick={() => openEditLocation(index)} className="text-blue-500 hover:bg-blue-50 hover:text-blue-600 rounded-md h-8 px-3">
                                <Edit2 className="w-4 h-4 mr-1.5" /> Edit
                              </Button>
                              <Button type="button" variant="ghost" size="sm" onClick={() => confirmRemoveLocation(index)} className="text-red-500 hover:bg-red-50 hover:text-red-600 rounded-md h-8 px-3">
                                <Trash2 className="w-4 h-4 mr-1.5" /> Remove
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tab === "seo" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <FloatingInput
                        label="Title Tag"
                        name="metatag"
                        value={data.metatag}
                        onChange={handleChange}
                        rightElement={<AIAssistantButton context="Contact Page" field="SEO Meta Title" onGenerate={(val) => setData({ ...data, metatag: val })} />}
                      />
                      <FloatingTextarea
                        label="Meta Description"
                        name="metaDescription"
                        value={data.metaDescription}
                        onChange={handleChange}
                        rows={3}
                        rightElement={<AIAssistantButton context="Contact Page" field="SEO Meta Description" onGenerate={(val) => setData({ ...data, metaDescription: val })} />}
                      />
                      <FloatingInput
                        label="Meta Keywords (JSON Array)"
                        name="metakeywords"
                        value={data.metakeywords}
                        onChange={handleChange}
                        placeholder='["metal", "contact"]'
                        rightElement={<AIAssistantButton context="Contact Page" field="SEO Meta Keywords JSON Array" onGenerate={(val) => setData({ ...data, metakeywords: val })} />}
                      />
                      <FloatingInput
                        label="Canonical URL"
                        name="canonicalUrl"
                        value={data.canonicalUrl}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-6">
                      <FloatingInput
                        label="OG Title"
                        name="ogTitle"
                        value={data.ogTitle}
                        onChange={handleChange}
                        rightElement={<AIAssistantButton context="Contact Page" field="OpenGraph Title" onGenerate={(val) => setData({ ...data, ogTitle: val })} />}
                      />
                      <FloatingTextarea
                        label="OG Description"
                        name="ogDescription"
                        value={data.ogDescription}
                        onChange={handleChange}
                        rows={3}
                        rightElement={<AIAssistantButton context="Contact Page" field="OpenGraph Description" onGenerate={(val) => setData({ ...data, ogDescription: val })} />}
                      />
                      <FloatingTextarea
                        label="Schema Markup (JSON Object)"
                        name="schemaMarkup"
                        value={data.schemaMarkup}
                        onChange={handleChange}
                        rows={5}
                        className="font-mono text-xs"
                        rightElement={<AIAssistantButton context="Contact Page" field="ContactPage Schema JSON" isSchema={true} onGenerate={(val) => setData({ ...data, schemaMarkup: val })} />}
                      />
                    </div>
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
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
      <Toast
        toasts={toasts}
        onRemove={(id) => setToasts((t) => t.filter((x) => x.id !== id))}
      />

      {locationModal && (
        <LocationModal
          location={locationModal.data}
          onSave={handleSaveLocation}
          onClose={() => setLocationModal(null)}
        />
      )}
      
      <ConfirmDeleteModal
        isOpen={confirmModal.isOpen}
        isDeleting={isRemoving}
        onClose={() => setConfirmModal({ isOpen: false, index: null })}
        onConfirm={handleConfirmRemove}
        title="Remove Location"
        message="Are you sure you want to remove this office location? This action cannot be undone."
      />
    </div>
  );
}
