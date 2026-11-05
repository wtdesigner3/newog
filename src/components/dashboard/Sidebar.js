'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import {
  LayoutDashboard,
  Home,
  FileText,
  Package,
  FileEdit,
  MessageSquare,
  Contact,
  Settings,
  Image as ImageIcon,
  Users,
  Award,
  Briefcase,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  Zap,
  Sparkles,
  HelpCircle
} from 'lucide-react';

const NAV = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
    permission: null,
  },
  {
    id: 'home',
    label: 'Home Management',
    icon: Home,
    permission: 'home',
    children: [
      { label: 'Banner Management',          href: '/dashboard/home/banner' },
      { label: 'Milestones & Stats',         href: '/dashboard/home/milestones' },
      { label: 'About Us Management',        href: '/dashboard/home/about' },
      { label: 'Why Choose Us',              href: '/dashboard/home/why-choose' },
      { label: 'Engineering Callout Banner', href: '/dashboard/home/cta-one' },
      { label: 'Our Work (Client Logos)',    href: '/dashboard/home/our-work' },
      { label: 'Client Testimonials',        href: '/dashboard/home/testimonials' },
      { label: 'Turnkey Lead Quotation CTA', href: '/dashboard/home/cta-two' },
      { label: 'Section Headings & Pills',   href: '/dashboard/home/heading-text' },
      { label: 'Homepage SEO',               href: '/dashboard/home/seo' },
      // Hidden legacy/duplicate modules (retained in codebase, hidden from sidebar to eliminate confusion)
      { label: 'Certifications',             href: '/dashboard/home/certifications', hidden: true },
    ],
  },
  {
    id: 'inner-pages',
    label: 'Inner Pages',
    icon: FileText,
    permission: 'inner_pages',
    children: [
      { label: 'All Sections',       href: '/dashboard/inner-pages/sections' },
      { label: 'FAQ Management',     href: '/dashboard/faqs' },
      { label: 'About Us Content',   href: '/dashboard/inner-pages/aboutus', hidden: true },
    ],
  },
  {
    id: 'custom-pages',
    label: 'Custom Pages',
    icon: FileText,
    permission: 'inner_pages',
    href: '/dashboard/custom-pages',
    hidden: true, // Hidden: unused legacy module
  },
  {
    id: 'products',
    label: 'Product Management',
    icon: Package,
    anyPermissions: ['products', 'categories'],
    children: [
      { label: 'Product Categories', href: '/dashboard/products/categories', permission: 'categories' },
      { label: 'All Products',       href: '/dashboard/products', permission: 'products' },
    ],
  },
  {
    id: 'resources',
    label: 'Technical Resources',
    icon: FileText,
    href: '/dashboard/resources',
    permission: 'resources',
  },
  {
    id: 'blogs',
    label: 'Blogs Management',
    icon: FileEdit,
    href: '/dashboard/blogs',
    permission: 'blogs',
  },
  {
    id: 'faqs',
    label: 'FAQ Management',
    icon: HelpCircle,
    href: '/dashboard/faqs',
    permission: 'inner_pages',
  },
  {
    id: 'enquiries',
    label: 'Enquiry Management',
    icon: MessageSquare,
    href: '/dashboard/enquiries',
    permission: 'enquiries',
  },
  {
    id: 'contact-cms',
    label: 'Contact Page CMS',
    icon: Contact,
    href: '/dashboard/contact',
    permission: 'contact_cms',
  },
  {
    id: 'gallery',
    label: 'Gallery Management',
    icon: ImageIcon,
    href: '/dashboard/gallery',
    permission: 'gallery',
    hidden: true, // Hidden: no public gallery page
  },
  {
    id: 'team',
    label: 'Team & Jobs',
    icon: Users,
    href: '/dashboard/team',
    permission: 'team',
    hidden: true, // Hidden: no public team page
  },
  {
    id: 'careers',
    label: 'Career Applications',
    icon: Briefcase,
    href: '/dashboard/careers',
    anyPermissions: ['careers', 'inner_pages'],
  },
  {
    id: 'certifications',
    label: 'Certifications',
    icon: Award,
    href: '/dashboard/certifications',
    permission: 'certifications',
  },
  {
    id: 'email-templates',
    label: 'Email Templates',
    icon: MessageSquare,
    href: '/dashboard/email-templates',
    permission: 'email_templates',
    hidden: true, // Hidden: internal templates not in active use
  },
  {
    id: 'media-library',
    label: 'Media Library',
    icon: ImageIcon,
    href: '/dashboard/media',
    anyPermissions: ['media', 'files', 'file_manager'],
  },
  {
    id: 'global-settings',
    label: 'Global Settings',
    icon: Settings,
    permission: 'global_settings',
    children: [
      { label: 'General Settings', href: '/dashboard/settings' },
      { label: 'Page Banners',     href: '/dashboard/settings/page-banners' },
    ],
  },
  {
    id: 'ai-features',
    label: 'AI Features',
    icon: Sparkles,
    href: '/dashboard/advanced/ai',
    permission: 'ai_features',
    hidden: true, // Hidden: standalone demo feature
  },
];

const ADMIN_NAV = [
  {
    id: 'manage-users',
    label: 'Manage Users',
    icon: ShieldCheck,
    href: '/dashboard/users',
  },
  {
    id: 'security-settings',
    label: 'Security Settings',
    icon: ShieldCheck,
    href: '/dashboard/security',
  },
  {
    id: 'advanced',
    label: 'Advanced Features',
    icon: Zap,
    children: [
      { label: 'SEO Health Audit',    href: '/dashboard/advanced/seo-audit' },
      { label: 'Sitemap Manager',     href: '/dashboard/advanced/sitemap' },
      { label: 'Integrations & Code', href: '/dashboard/advanced/integrations' },
      { label: 'Performance Monitor', href: '/dashboard/advanced/performance' },
      { label: 'Error & 404 Monitor', href: '/dashboard/advanced/error-monitor' },
      { label: 'Activity Logs',       href: '/dashboard/logs' },
      { label: 'Cache Management',    href: '/dashboard/advanced/cache' },
      // Hidden advanced features preserved for direct use
      { label: 'Redirect Manager',    href: '/dashboard/advanced/redirects', hidden: true },
      { label: 'Maintenance Mode',    href: '/dashboard/advanced/maintenance', hidden: true },
      { label: 'Backup Management',   href: '/dashboard/advanced/backups', hidden: true },
    ],
  },
];

function NestedNavChild({ child, pathname }) {
  const isActive = child.children.some(c => pathname === c.href);
  const [open, setOpen] = useState(isActive);
  return (
    <div className="space-y-1">
      <div 
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center justify-between px-3 py-2 rounded-md text-[13px] font-medium cursor-pointer transition-colors",
          isActive || open ? "text-white" : "text-slate-400 hover:text-white hover:bg-slate-800/60"
        )}
      >
        <span>{child.label}</span>
        <ChevronRight className={cn("w-3.5 h-3.5 transition-transform", open && "rotate-90")} />
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="pl-3 border-l border-slate-700/50 ml-3 space-y-1 overflow-hidden"
          >
            {child.children.map((sub) => (
              <Link
                key={sub.href}
                href={sub.href}
                className={cn(
                  "block px-3 py-1.5 rounded-md text-[12.5px] font-medium transition-colors",
                  pathname === sub.href
                    ? "text-white bg-blue-600/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                )}
              >
                {sub.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavItem({ item, isActive, isChildActive, hasModuleAccess, isHovered }) {
  const [open, setOpen] = useState(isChildActive);
  const pathname = usePathname();

  useEffect(() => {
    if (!isHovered) {
      setOpen(false);
    } else {
      if (isChildActive) setOpen(true);
    }
  }, [isHovered, isChildActive]);

  if (item.anyPermissions) {
    const hasAny = item.anyPermissions.some(perm => hasModuleAccess(perm));
    if (!hasAny) return null;
  } else if (item.permission && !hasModuleAccess(item.permission)) {
    return null;
  }

  const visibleChildren = (item.children || []).filter(child => {
    if (child.permission && !hasModuleAccess(child.permission)) return false;
    return true;
  });

  if (item.children && visibleChildren.length === 0) return null;

  const hasChildren = visibleChildren.length > 0;

  const isItemActive = isActive || isChildActive;

  const content = (
    <div className={cn(
      "flex items-center gap-3 py-2 rounded-lg text-sm font-medium transition-all group cursor-pointer",
      "group-hover/aside:px-3",
      isItemActive
        ? "group-hover/aside:bg-blue-600 group-hover/aside:shadow-xs text-white"
        : "text-slate-400 group-hover/aside:hover:bg-slate-800/80 group-hover/aside:hover:text-white"
    )}>
      {/* Icon wrapper: in collapsed mode, a centered square; in expanded, just the icon */}
      <div className={cn(
        "shrink-0 flex items-center justify-center rounded-lg transition-all duration-200",
        // collapsed: fixed 36×36 square with active bg
        "w-9 h-9 group-hover/aside:w-5 group-hover/aside:h-5 group-hover/aside:rounded-none group-hover/aside:bg-transparent",
        isItemActive
          ? "bg-blue-600 shadow-sm group-hover/aside:bg-transparent"
          : "bg-transparent hover:bg-slate-800/80 group-hover/aside:hover:bg-transparent"
      )}>
        <item.icon className={cn(
          "w-5 h-5 shrink-0 transition-colors",
          isItemActive ? "text-white" : "text-slate-400 group-hover:text-white"
        )} />
      </div>
      <span className="flex-1 truncate opacity-0 group-hover/aside:opacity-100 max-lg:opacity-100 transition-all duration-300 w-0 group-hover/aside:w-auto max-lg:w-auto overflow-hidden">{item.label}</span>
      {hasChildren && (
        <ChevronRight className={cn(
          "w-4 h-4 shrink-0 transition-all duration-200 opacity-0 group-hover/aside:opacity-100 max-lg:opacity-100 w-0 group-hover/aside:w-auto max-lg:w-auto",
          open && "rotate-90"
        )} />
      )}
    </div>
  );

  return (
    <div className="space-y-1">
      {hasChildren ? (
        <div onClick={() => setOpen(!open)}>{content}</div>
      ) : (
        <Link href={item.href}>{content}</Link>
      )}

      <AnimatePresence initial={false}>
        {hasChildren && open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden pl-7 space-y-1 opacity-0 group-hover/aside:opacity-100 max-lg:opacity-100 transition-opacity duration-300"
          >
            {visibleChildren.map((child) => {
              if (child.children) {
                return <NestedNavChild key={child.label} child={child} pathname={pathname} />;
              }
              return (
                <Link
                  key={child.href}
                  href={child.href}
                  className={cn(
                    "block px-3 py-2 rounded-md text-[13px] font-medium transition-colors",
                    pathname === child.href
                      ? "text-white bg-blue-600/30"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                  )}
                >
                  {child.label}
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Sidebar({ mobileMenuOpen, setMobileMenuOpen }) {
  const pathname = usePathname();
  const { user, hasModuleAccess, isSuperAdmin } = useAuth();
  const [sections, setSections] = useState([]);
  const [globalSettings, setGlobalSettings] = useState({});
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const fetchSections = () => {
      fetch('/api/sections')
        .then(res => res.json())
        .then(json => {
          if (Array.isArray(json)) {
            setSections(json);
          } else if (json.data && Array.isArray(json.data)) {
            setSections(json.data);
          }
        })
        .catch(err => console.error("Failed to fetch sections", err));
    };

    fetchSections();
    window.addEventListener('sectionsUpdated', fetchSections);

    fetch('/api/global-settings')
      .then(res => res.json())
      .then(json => {
        if (json.data) setGlobalSettings(json.data);
      })
      .catch(err => console.error("Failed to fetch global settings", err));

    return () => window.removeEventListener('sectionsUpdated', fetchSections);
  }, []);

  useEffect(() => {
    // Close mobile sidebar automatically on route change
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  }, [pathname]);

  const dynamicNav = NAV.map(item => {
    if (item.id === 'inner-pages') {
      return {
        ...item,
        children: [
          { label: 'Manage Sections', href: '/dashboard/inner-pages/sections' },
          { 
            label: 'Manage Pages', 
            children: sections.map(sec => ({
              label: sec.name || sec.sectionName || 'Unnamed Section',
              href: `/dashboard/inner-pages/${sec.slug}`
            }))
          }
        ]
      };
    }
    return item;
  })
  .filter(item => !item.hidden)
  .map(item => ({
    ...item,
    children: item.children ? item.children.filter(c => !c.hidden) : undefined
  }));

  const visibleAdminNav = ADMIN_NAV
    .filter(item => !item.hidden)
    .map(item => ({
      ...item,
      children: item.children ? item.children.filter(c => !c.hidden) : undefined
    }));

  return (
    <>
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[60] lg:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      
      <aside 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "border-r border-[#1e293b] bg-[#0f172a] shrink-0 flex flex-col h-screen fixed lg:sticky top-0 z-[70] transition-all duration-300 group/aside overflow-x-hidden",
          mobileMenuOpen 
            ? "w-[260px] translate-x-0" 
            : "w-[260px] -translate-x-full lg:w-[84px] lg:translate-x-0 lg:hover:w-[260px]"
        )}
      >
      <div className="p-6 flex-1 overflow-y-auto overflow-x-hidden no-scrollbar">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 shrink-0 bg-white rounded-lg flex items-center justify-center shadow-sm overflow-hidden relative">
            <Image src={globalSettings.adminLogo || "/jindal-logo.jpg"} alt="Logo" fill className="object-contain p-0.5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white opacity-0 group-hover/aside:opacity-100 max-lg:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden w-0 group-hover/aside:w-auto max-lg:w-auto">{globalSettings.adminTitle || "OG Heavy Duty"}</span>
        </div>
        
        <div className="space-y-4">
           <div>
             <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-3 opacity-0 group-hover/aside:opacity-100 max-lg:opacity-100 transition-all duration-300 whitespace-nowrap overflow-hidden w-0 group-hover/aside:w-auto max-lg:w-auto">Main Menu</p>
             <nav className="space-y-1">
                {dynamicNav.map((item) => {
                  const isActive = pathname === item.href;
                  const isChildActive = item.children?.some(c => pathname === c.href);
                  return (
                    <NavItem 
                      key={item.id} 
                      item={item} 
                      isActive={isActive} 
                      isChildActive={isChildActive}
                      hasModuleAccess={hasModuleAccess}
                      isHovered={isHovered}
                    />
                  );
                })}
             </nav>
           </div>

           {isSuperAdmin && isSuperAdmin() && (
             <div>
               <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-3 opacity-0 group-hover/aside:opacity-100 max-lg:opacity-100 transition-all duration-300 whitespace-nowrap overflow-hidden w-0 group-hover/aside:w-auto max-lg:w-auto">Administration</p>
               <nav className="space-y-1">
                  {visibleAdminNav.map((item) => {
                    const isActive = pathname === item.href;
                    const isChildActive = item.children?.some(c => pathname === c.href);
                    return (
                      <NavItem 
                        key={item.id} 
                        item={item} 
                        isActive={isActive} 
                        isChildActive={isChildActive}
                        hasModuleAccess={() => true} // Super admins have access to all admin items
                        isHovered={isHovered}
                      />
                    );
                  })}
               </nav>
             </div>
           )}
        </div>
      </div>
      
      <div className="p-6 border-t border-[#1e293b] bg-[#0b1221]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 border border-slate-700 overflow-hidden shrink-0 shadow-sm flex items-center justify-center text-white font-bold text-sm">
             {user?.avatar
               ? <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
               : (user?.name || 'A').charAt(0).toUpperCase()
             }
          </div>
          <div className="min-w-0 opacity-0 group-hover/aside:opacity-100 max-lg:opacity-100 transition-all duration-300 w-0 group-hover/aside:w-auto max-lg:w-auto overflow-hidden whitespace-nowrap">
            <p className="text-sm font-bold text-white truncate">{user?.name || 'Admin'}</p>
            <p className="text-[11px] font-medium text-slate-400 truncate tracking-wide">
              {user?.role === 'super_admin' ? 'Super Admin' : 'Admin'}
            </p>
          </div>
        </div>
      </div>
    </aside>
    </>
  );
}
