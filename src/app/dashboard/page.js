'use client'
import { useState, useEffect, useMemo } from 'react'
import Breadcrumb from '../../components/dashboard/Breadcrumb'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Calendar, LayoutTemplate, Box, Edit3, MessageSquare, Image as ImageIcon, Users, Star, Award, ArrowRight, Settings, Building, Globe, Plus, Search, Bell, Shield, Key, RefreshCw, ArrowDownUp } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

function Clock() {
  const [time, setTime] = useState('')
  useEffect(() => {
    function update() {
      const now = new Date()
      const t = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      const d = now.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
      setTime(`${t} | ${d}`)
    }
    update()
    const iv = setInterval(update, 1000)
    return () => clearInterval(iv)
  }, [])
  return (
    <div className="flex items-center gap-2 text-sm text-slate-500 w-fit">
      <Calendar className="w-4 h-4" />
      <span className="font-medium tracking-wide">{time}</span>
    </div>
  )
}

const STAT_CONFIG = {
  products: { label: 'Products', icon: Box, bg: 'bg-[#E4E7E9]' },
  categories: { label: 'Categories', icon: Box, bg: 'bg-[#EFE3F7]' },
  resources: { label: 'Tech Resources', icon: LayoutTemplate, bg: 'bg-[#C9CBF4]' },
  blogs: { label: 'Blogs', icon: Edit3, bg: 'bg-[#F6D3DB]' },
  enquiries: { label: 'Enquiries', icon: MessageSquare, bg: 'bg-[#D9E8F5]' },
  careers: { label: 'Applications', icon: Users, bg: 'bg-[#D8F1DD]' },
  users: { label: 'System Users', icon: Users, bg: 'bg-[#FDF0D1]' },
  certifications: { label: 'Certifications', icon: Award, bg: 'bg-[#FADEC9]' },
}

// Maps each dashboard page entry to the permission module required to access it.
// Pages with permission: null are always visible (e.g. dashboard overview).
const DASHBOARD_PAGES = [
  { name: 'Dashboard Overview',       href: '/dashboard',                          permission: null },
  { name: 'System Users',             href: '/dashboard/users',                    permission: 'users' },
  { name: 'Products Management',      href: '/dashboard/products',                 permission: 'products' },
  { name: 'Product Categories',       href: '/dashboard/products/categories',      permission: 'categories' },
  { name: 'Technical Resources',      href: '/dashboard/resources',                permission: 'resources' },
  { name: 'Media Library',            href: '/dashboard/media',                    permission: 'media' },
  { name: 'Product SEO',              href: '/dashboard/products/seo',             permission: 'products' },
  { name: 'Gallery',                  href: '/dashboard/gallery',                  permission: 'gallery' },
  { name: 'Blogs',                    href: '/dashboard/blogs',                    permission: 'blogs' },
  { name: 'Enquiries',                href: '/dashboard/enquiries',                permission: 'enquiries' },
  { name: 'Career Applications',      href: '/dashboard/careers',                  permission: 'careers' },
  { name: 'Certifications',           href: '/dashboard/certifications',           permission: 'certifications' },
  { name: 'Team / Board of Directors', href: '/dashboard/team',                   permission: 'team' },
  { name: 'Team Jobs',                href: '/dashboard/team/jobs',                permission: 'team' },
  { name: 'Global Settings',          href: '/dashboard/settings',                 permission: 'global_settings' },
  { name: 'Page Banners',             href: '/dashboard/settings/page-banners',   permission: 'global_settings' },
  { name: 'Home Banner',              href: '/dashboard/home/banner',              permission: 'home' },
  { name: 'Home About',               href: '/dashboard/home/about',               permission: 'home' },
  { name: 'Home Our Work',            href: '/dashboard/home/our-work',            permission: 'home' },
  { name: 'Home Certifications',      href: '/dashboard/home/certifications',      permission: 'home' },
  { name: 'Home Heading Text',        href: '/dashboard/home/heading-text',        permission: 'home' },
  { name: 'Home CTA One',             href: '/dashboard/home/cta-one',             permission: 'home' },
  { name: 'Home CTA Two',             href: '/dashboard/home/cta-two',             permission: 'home' },
  { name: 'Home SEO',                 href: '/dashboard/home/seo',                 permission: 'home' },
  { name: 'Inner Page Sections',      href: '/dashboard/inner-pages/sections',     permission: 'inner_pages' },
  { name: 'Contact Page Management',  href: '/dashboard/contact',                  permission: 'contact_cms' },
]

export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [analytics, setAnalytics] = useState(null)
  const [recentEnquiries, setRecentEnquiries] = useState([])
  const [health, setHealth] = useState(null)
  const [loading, setLoading] = useState(true)
  const { user, hasModuleAccess } = useAuth()
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)

  // Filter pages by permission — mirrors the sidebar's hasModuleAccess check.
  // Pages with permission: null (e.g. dashboard root) are always shown.
  const accessiblePages = useMemo(() => {
    return DASHBOARD_PAGES.filter(p => p.permission === null || hasModuleAccess(p.permission))
  }, [user])

  const filteredPages = accessiblePages.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))

  async function fetchData() {
    setLoading(true)
    try {
      const minDelay = new Promise(resolve => setTimeout(resolve, 600))
      const [statsRes, healthRes, analyticsRes] = await Promise.all([
        fetch('/api/dashboard/stats'),
        fetch('/api/system/health'),
        fetch('/api/analytics/stats'),
        minDelay
      ])
      
      const statsData = await statsRes.json()
      if (statsData.success) {
        setStats(statsData.stats)
        setRecentEnquiries(statsData.recentEnquiries || [])
      }

      if (healthRes.ok) {
        const healthData = await healthRes.json()
        setHealth(healthData)
      }

      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json()
        setAnalytics(analyticsData)
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const currentMonthYear = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  // Determine permission count or super admin status
  const isSuperAdmin = user?.role === 'super_admin';
  const permissionCount = user?.permissions 
    ? Object.values(user.permissions).filter(actions => Array.isArray(actions) && actions.length > 0).length 
    : 0;

  return (
    <div className="min-h-full flex flex-col bg-background">
      
      <div className="p-4 sm:p-6 lg:p-8 flex-1 max-w-[1600px] w-full mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">Hello, {user?.name ? user.name.split(' ')[0] : 'Admin'}</h1>
                <Clock />
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Search pages..." 
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setShowSearch(true); }}
                  onFocus={() => setShowSearch(true)}
                  onBlur={() => setTimeout(() => setShowSearch(false), 200)}
                  className="pl-9 pr-4 py-2 bg-muted/50 text-foreground border border-transparent focus:border-border rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 w-64 transition-all"
                />
                {showSearch && searchQuery && (
                  <div className="absolute top-full mt-2 w-full bg-popover/90 backdrop-blur-2xl border border-border/50 rounded-xl shadow-2xl z-50 overflow-hidden max-h-64 overflow-y-auto">
                    {filteredPages.length > 0 ? filteredPages.map(p => (
                      <Link href={p.href} key={p.href} className="block px-4 py-3 hover:bg-foreground/5 text-sm text-popover-foreground border-b border-border/50 last:border-0 font-medium transition-colors">
                        {p.name}
                      </Link>
                    )) : (
                      <div className="px-4 py-4 text-sm text-muted-foreground text-center">No matching pages found</div>
                    )}
                  </div>
                )}
              </div>
              <Button onClick={fetchData} variant="ghost" size="icon" className="rounded-xl bg-muted/50 hover:bg-muted text-foreground" title="Refresh Dashboard">
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-8">
          
          {/* Main Left Column */}
          <div className="flex-1 space-y-8 overflow-hidden">
            
            {/* Real-time Analytics Section */}
            <div className="mb-8">
               <h2 className="text-xl font-bold text-foreground mb-4">Real-time Analytics</h2>
               <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {/* Visitors Today */}
                  <Card className="border-0 shadow-sm rounded-2xl bg-[#E3F2FD] overflow-hidden relative">
                     <CardContent className="p-5 flex flex-col justify-center">
                        <div className="flex items-center gap-2 text-blue-700 mb-1">
                           <Users className="w-4 h-4" />
                           <p className="text-sm font-semibold">Visitors Today</p>
                        </div>
                        {loading ? <div className="h-8 w-16 bg-black/10 rounded animate-pulse mt-2" /> : (
                           <h4 className="text-3xl font-bold text-blue-900 mt-1">{analytics?.visitorsToday?.toLocaleString() || 0}</h4>
                        )}
                     </CardContent>
                  </Card>
                  
                  {/* Active Users */}
                  <Card className="border-0 shadow-sm rounded-2xl bg-[#E8F5E9] overflow-hidden relative">
                     <CardContent className="p-5 flex flex-col justify-center">
                        <div className="flex items-center gap-2 text-green-700 mb-1">
                           <span className="relative flex h-3 w-3">
                             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                             <span className="relative inline-flex rounded-full h-3 w-3 bg-green-600"></span>
                           </span>
                           <p className="text-sm font-semibold">Active Users (5m)</p>
                        </div>
                        {loading ? <div className="h-8 w-16 bg-black/10 rounded animate-pulse mt-2" /> : (
                           <h4 className="text-3xl font-bold text-green-900 mt-1">{analytics?.activeUsers?.toLocaleString() || 0}</h4>
                        )}
                     </CardContent>
                  </Card>

                  {/* Page Views */}
                  <Card className="border-0 shadow-sm rounded-2xl bg-[#FFF3E0] overflow-hidden relative">
                     <CardContent className="p-5 flex flex-col justify-center">
                        <div className="flex items-center gap-2 text-orange-700 mb-1">
                           <Globe className="w-4 h-4" />
                           <p className="text-sm font-semibold">Page Views</p>
                        </div>
                        {loading ? <div className="h-8 w-16 bg-black/10 rounded animate-pulse mt-2" /> : (
                           <h4 className="text-3xl font-bold text-orange-900 mt-1">{analytics?.pageViews?.toLocaleString() || 0}</h4>
                        )}
                     </CardContent>
                  </Card>

                  {/* Bounce Rate */}
                  <Card className="border-0 shadow-sm rounded-2xl bg-[#FCE4EC] overflow-hidden relative">
                     <CardContent className="p-5 flex flex-col justify-center">
                        <div className="flex items-center gap-2 text-pink-700 mb-1">
                           <ArrowDownUp className="w-4 h-4" />
                           <p className="text-sm font-semibold">Bounce Rate</p>
                        </div>
                        {loading ? <div className="h-8 w-16 bg-black/10 rounded animate-pulse mt-2" /> : (
                           <h4 className="text-3xl font-bold text-pink-900 mt-1">{analytics?.bounceRate || 0}%</h4>
                        )}
                     </CardContent>
                  </Card>
               </div>
            </div>

            {/* Quick Actions Title */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">Quick actions</h2>
              <Button variant="outline" size="icon" className="rounded-xl h-8 w-8 bg-card border-border shadow-sm"><Plus className="w-4 h-4" /></Button>
            </div>

            {/* Quick Action Users (Mocking the "Latest Transaction" avatars) */}
            {/* Only show quick-action cards for modules the user can access */}
            {(hasModuleAccess('global_settings') || hasModuleAccess('home') || hasModuleAccess('inner_pages')) && (
            <div className="flex gap-4 overflow-x-auto mb-8 pb-2">
               {[
                 hasModuleAccess('global_settings') && { name: 'Website Details', email: 'Manage SEO & Info', icon: Settings, link: '/dashboard/settings' },
                 hasModuleAccess('home') && { name: 'Home Content', email: 'Banners & CTAs', icon: LayoutTemplate, link: '/dashboard/home/banner' },
                 hasModuleAccess('inner_pages') && { name: 'Inner Pages', email: 'Corporate & Vision', icon: Building, link: '/dashboard/inner-pages/sections' },
               ].filter(Boolean).map((item, i) => (
                 <Link href={item.link} key={i}>
                   <div className="flex items-center gap-3 bg-card border border-border px-4 py-3 rounded-2xl hover:bg-muted transition-colors min-w-[220px]">
                     <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                       <item.icon className="w-5 h-5" />
                     </div>
                     <div>
                       <p className="text-sm font-bold text-foreground">{item.name}</p>
                       <p className="text-[11px] text-muted-foreground">{item.email}</p>
                     </div>
                   </div>
                 </Link>
               ))}
            </div>
            )}

            {/* System Content Metrics Section */}
            <div className="mb-8">
               <h2 className="text-xl font-bold text-foreground mb-4">Content Metrics</h2>
               <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                 {Object.keys(STAT_CONFIG).map((key, i) => {
                   const config = STAT_CONFIG[key]
                   const Icon = config.icon
                   const value = stats ? stats[key] : 0
                   
                   return (
                       <Card key={i} className={`h-full border-0 shadow-none rounded-2xl ${config.bg} cursor-pointer hover:opacity-90 transition-opacity group`}>
                         <CardContent className="p-5 flex flex-col items-start gap-4">
                           <div className={`w-10 h-10 rounded-full border border-black/10 flex items-center justify-center shrink-0 text-slate-900 group-hover:scale-110 transition-transform duration-300`}>
                             <Icon className="w-4 h-4" />
                           </div>
                           <div className="flex-1 mt-2">
                             <p className="text-sm font-semibold text-slate-900 mb-0.5">{config.label}</p>
                             {loading ? (
                                 <div className="h-8 w-16 bg-black/10 rounded animate-pulse mt-2" />
                             ) : (
                                 <h4 className="text-2xl font-bold text-slate-900">{value.toLocaleString()}</h4>
                             )}
                           </div>
                         </CardContent>
                       </Card>
                   )
                 })}
               </div>
            </div>

            {/* Charts Section */}
            {!loading && analytics && (
               <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                 <Card className="border border-border shadow-sm rounded-2xl">
                    <CardHeader className="pb-2 border-b border-border/50">
                       <CardTitle className="text-sm font-bold">Device Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 h-64 flex flex-col items-center justify-center">
                       {analytics.devices?.length > 0 ? (
                         <ResponsiveContainer width="100%" height="100%">
                           <PieChart>
                             <Pie data={analytics.devices} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" nameKey="name" stroke="none">
                               {analytics.devices.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                             </Pie>
                             <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                           </PieChart>
                         </ResponsiveContainer>
                       ) : <p className="text-muted-foreground text-sm">No data yet</p>}
                    </CardContent>
                 </Card>

                 <Card className="border border-border shadow-sm rounded-2xl">
                    <CardHeader className="pb-2 border-b border-border/50">
                       <CardTitle className="text-sm font-bold">Top Browsers</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 h-64">
                       {analytics.browsers?.length > 0 ? (
                         <ResponsiveContainer width="100%" height="100%">
                           <BarChart data={analytics.browsers} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                             <XAxis type="number" hide />
                             <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} fontSize={12} width={70} />
                             <RechartsTooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                             <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                           </BarChart>
                         </ResponsiveContainer>
                       ) : <p className="text-muted-foreground text-sm flex h-full items-center justify-center">No data yet</p>}
                    </CardContent>
                 </Card>

                 <Card className="border border-border shadow-sm rounded-2xl xl:col-span-1 lg:col-span-2">
                    <CardHeader className="pb-2 border-b border-border/50">
                       <CardTitle className="text-sm font-bold">Top Countries</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 h-64">
                       {analytics.countries?.length > 0 ? (
                         <ResponsiveContainer width="100%" height="100%">
                           <BarChart data={analytics.countries}>
                             <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} />
                             <YAxis hide />
                             <RechartsTooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                             <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} />
                           </BarChart>
                         </ResponsiveContainer>
                       ) : <p className="text-muted-foreground text-sm flex h-full items-center justify-center">No data yet</p>}
                    </CardContent>
                 </Card>
               </div>
            )}

            {/* Top Pages & Recent Enquiries split */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               {/* Quick Navigation Links — filtered by user permissions */}
               <div>
                 <h2 className="text-xl font-bold text-foreground mb-4">Navigation</h2>
                 <div className="flex flex-col space-y-1">
                   {[
                     hasModuleAccess('products')       && { label: 'Add New Product',       href: '/dashboard/products' },
                     hasModuleAccess('blogs')          && { label: 'Write Blog Post',        href: '/dashboard/blogs' },
                     hasModuleAccess('gallery')        && { label: 'Upload to Gallery',      href: '/dashboard/gallery' },
                     hasModuleAccess('home')           && { label: 'Edit Home Banner',       href: '/dashboard/home/banner' },
                     hasModuleAccess('certifications') && { label: 'Manage Certifications',  href: '/dashboard/certifications' },
                   ].filter(Boolean).map((link, i) => (
                     <Link key={i} href={link.href}>
                       <div className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-muted/50 group cursor-pointer transition-colors border border-transparent hover:border-border">
                         <div className="flex items-center gap-3">
                             <div className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0`}>
                                 <Globe className="w-4 h-4 text-muted-foreground" />
                             </div>
                             <span className="font-bold text-sm text-foreground">{link.label}</span>
                         </div>
                         <ArrowRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-foreground transition-colors" />
                       </div>
                     </Link>
                   ))}
                   {/* Show a friendly message if no navigation items are accessible */}
                   {!hasModuleAccess('products') && !hasModuleAccess('blogs') && !hasModuleAccess('gallery') && !hasModuleAccess('home') && !hasModuleAccess('certifications') && (
                     <div className="text-center py-6 text-muted-foreground text-sm bg-muted/20 rounded-2xl border border-border">
                       No quick actions available for your access level.
                     </div>
                   )}
                 </div>
               </div>

               {/* Recent Enquiries */}
               <div>
                 <div className="flex items-center justify-between mb-4">
                   <h2 className="text-xl font-bold text-foreground">Recent Enquiries</h2>
                   <Link href="/dashboard/enquiries">
                     <span className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer">View All</span>
                   </Link>
                 </div>
                 
                 <div className="flex flex-col space-y-1">
                     {loading ? (
                         [...Array(5)].map((_, i) => (
                             <div key={i} className="flex items-center gap-4 py-3 border-b border-border">
                                 <div className="w-10 h-10 bg-muted rounded-full animate-pulse" />
                                 <div className="flex-1">
                                   <div className="h-4 w-32 bg-muted rounded animate-pulse mb-1" />
                                   <div className="h-3 w-24 bg-muted rounded animate-pulse" />
                                 </div>
                             </div>
                         ))
                     ) : recentEnquiries.length === 0 ? (
                         <div className="text-center py-10 text-muted-foreground bg-muted/20 rounded-2xl border border-border">No recent enquiries found.</div>
                     ) : (
                         recentEnquiries.map(enq => {
                           const initial = enq.contactPerson ? enq.contactPerson.charAt(0).toUpperCase() : 'U';
                           return (
                             <div key={enq._id} className="flex items-center justify-between py-4 border-b border-border hover:bg-muted/50 px-2 -mx-2 rounded-xl transition-colors cursor-pointer" onClick={() => window.location.href = '/dashboard/enquiries'}>
                               <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground shrink-0">
                                   {initial}
                                 </div>
                                 <div>
                                   <h4 className="text-sm font-bold text-foreground">{enq.contactPerson}</h4>
                                   <p className="text-[11px] text-muted-foreground mt-0.5">{new Date(enq.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
                                 </div>
                               </div>
                               <Badge 
                                 variant="outline"
                                 className={`capitalize px-2 py-0.5 border-none font-bold text-[10px] ${
                                     enq.status === 'new' ? 'bg-orange-500/20 text-orange-600' :
                                     enq.status === 'replied' ? 'bg-green-500/20 text-green-600' :
                                     'bg-muted text-muted-foreground'
                                 }`}
                               >
                                 {enq.status || 'new'}
                               </Badge>
                             </div>
                           )
                         })
                     )}
                 </div>
               </div>
            </div>



          </div>

          {/* Right Sidebar */}
          <div className="w-full xl:w-[380px] space-y-8 flex-shrink-0">
             
             {/* Admin Status / Profile Card */}
             <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
               <div className="flex items-center justify-between mb-6">
                 <h3 className="text-lg font-bold text-foreground">Admin Profile</h3>
                 <Link href="/dashboard/settings">
                   <Button variant="outline" size="icon" className="rounded-xl h-8 w-8 bg-background border-border shadow-sm"><Settings className="w-4 h-4 text-muted-foreground" /></Button>
                 </Link>
               </div>
               
               {/* Dark Card */}
               <div className="bg-[#0a0a0a] rounded-2xl p-6 text-white shadow-xl relative overflow-hidden border border-border/50">
                 <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-gradient-to-br from-purple-400 to-green-300 rounded-full opacity-20 blur-2xl" />
                 
                 <div className="flex justify-between items-center mb-8 relative z-10">
                   <div className="flex items-center gap-2">
                     <Shield className="w-5 h-5 text-purple-300" />
                     <span className="font-medium text-slate-300 tracking-wide capitalize">{user?.role?.replace('_', ' ') || 'Admin'}</span>
                   </div>
                   <div className="flex gap-1">
                     <div className="w-5 h-5 rounded-full bg-white/80" />
                     <div className="w-5 h-5 rounded-full bg-white/40 -ml-2" />
                   </div>
                 </div>
                 
                 <div className="mb-8 relative z-10">
                   <h2 className="text-2xl font-bold tracking-tight mb-1 truncate">{user?.name || 'Administrator'}</h2>
                   <p className="text-xs text-slate-400 truncate">{user?.email || 'admin@jindalstainless.com'}</p>
                 </div>
                 
                 <div className="flex items-end justify-between relative z-10">
                    <div className="flex flex-col gap-1 text-xs text-slate-400 font-medium">
                        <span className="flex items-center gap-1.5"><Key className="w-3.5 h-3.5" /> Access Level</span>
                        <span className="text-white text-sm font-semibold">
                            {isSuperAdmin ? 'Full System Access' : `${permissionCount} Module${permissionCount !== 1 ? 's' : ''} Authorized`}
                        </span>
                    </div>
                 </div>
               </div>
             </div>

             {/* System Health Card */}
             <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-foreground">System Health</h3>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${health?.status === 'OK' ? 'bg-green-400' : 'bg-red-400'}`}></span>
                      <span className={`relative inline-flex rounded-full h-3 w-3 ${health?.status === 'OK' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    </span>
                    <span className="text-xs font-semibold text-muted-foreground">{health?.status || 'Loading...'}</span>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Database Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <Globe className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground mb-0.5">Database</p>
                        <p className="text-[11px] text-muted-foreground font-medium">{health?.database?.latencyMs || 0}ms latency</p>
                      </div>
                    </div>
                    <Badge variant="outline" className={`border-none font-bold ${health?.database?.status === 'Connected' ? 'bg-green-500/20 text-green-600' : 'bg-red-500/20 text-red-600'}`}>
                      {health?.database?.status || 'Check'}
                    </Badge>
                  </div>

                  {/* Memory Usage */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                        <Box className="w-5 h-5 text-purple-500" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground mb-0.5">Memory</p>
                        <p className="text-[11px] text-muted-foreground font-medium">Resident Set Size</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-foreground bg-muted px-3 py-1 rounded-full">{health?.memory?.rss || '0 MB'}</span>
                  </div>

                  {/* Uptime */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                        <RefreshCw className="w-5 h-5 text-orange-500" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground mb-0.5">Uptime</p>
                        <p className="text-[11px] text-muted-foreground font-medium">Server Process</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-foreground bg-muted px-3 py-1 rounded-full">
                      {health?.uptimeSeconds ? (health.uptimeSeconds / 3600).toFixed(1) + 'h' : '0h'}
                    </span>
                  </div>
                </div>
             </div>

             {/* Top Pages */}
             <div className="pt-2">
               <h3 className="text-lg font-bold text-foreground mb-4 px-2">Top Visited Pages</h3>
               <div className="flex flex-col space-y-1">
                  {loading ? (
                      [...Array(5)].map((_, i) => (
                          <div key={i} className="flex items-center justify-between px-4 py-3">
                              <div className="h-4 w-48 bg-muted rounded animate-pulse" />
                              <div className="h-4 w-10 bg-muted rounded animate-pulse" />
                          </div>
                      ))
                  ) : analytics?.topPages?.length === 0 ? (
                      <div className="text-center py-10 text-muted-foreground bg-muted/20 rounded-2xl border border-border mx-2">No page visits recorded yet.</div>
                  ) : (
                      analytics?.topPages?.map((page, i) => (
                          <div key={i} className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-muted/50 group transition-colors border border-transparent hover:border-border">
                             <div className="flex items-center gap-3">
                                <span className="text-xs font-bold text-muted-foreground w-4">{i + 1}.</span>
                                <span className="text-sm font-medium text-foreground truncate max-w-[160px]">{page.path}</span>
                             </div>
                             <Badge variant="secondary" className="font-mono bg-blue-50 text-blue-700 hover:bg-blue-100">{page.views.toLocaleString()}</Badge>
                          </div>
                      ))
                  )}
               </div>
             </div>

          </div>
        </div>
        
      </div>
    </div>
  )
}

