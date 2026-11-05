'use client';

import React, { useState, useEffect } from 'react';
import Breadcrumb from '../../../components/dashboard/Breadcrumb';
import TableToolbar from '../../../components/dashboard/TableToolbar';
import DataTable from '../../../components/dashboard/DataTable';
import Toast from '../../../components/dashboard/Toast';
import ConfirmDeleteModal from '../../../components/dashboard/ConfirmDeleteModal';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../../components/ui/dialog';
import {
  Briefcase,
  FileText,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Download,
  Trash2,
  Eye,
  ExternalLink,
  ShieldCheck,
  Building,
} from 'lucide-react';

export default function CareerApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('all');
  const [sort, setSort] = useState('latest');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [toasts, setToasts] = useState([]);

  function addToast(message, type = 'success') {
    setToasts((prev) => [...prev, { id: Date.now(), message, type }]);
  }

  useEffect(() => {
    fetchApplications();
  }, []);

  async function fetchApplications() {
    try {
      setLoading(true);
      const res = await fetch('/api/career/apply');
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to load applications');
      setApplications(json.data || []);
    } catch (err) {
      addToast(err.message, 'danger');
    } finally {
      setLoading(false);
    }
  }

  const positionsList = Array.from(
    new Set(applications.map((a) => a.position).filter(Boolean))
  );

  const filteredData = applications
    .filter((app) => {
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        app.fullName?.toLowerCase().includes(q) ||
        app.email?.toLowerCase().includes(q) ||
        app.phone?.toLowerCase().includes(q) ||
        app.position?.toLowerCase().includes(q);

      const matchPos =
        selectedPosition === 'all' || app.position === selectedPosition;

      return matchSearch && matchPos;
    })
    .sort((a, b) => {
      if (sort === 'latest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      if (sort === 'oldest') return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      if (sort === 'a-z') return (a.fullName || '').localeCompare(b.fullName || '');
      if (sort === 'z-a') return (b.fullName || '').localeCompare(a.fullName || '');
      return 0;
    });

  const columns = [
    {
      key: 'applicant',
      label: 'Candidate Details',
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-sm text-foreground">{row.fullName}</span>
          <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
            <Mail className="w-3 h-3 text-primary" /> {row.email}
          </span>
          <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
            <Phone className="w-3 h-3 text-primary" /> {row.phone}
          </span>
        </div>
      ),
    },
    {
      key: 'position',
      label: 'Position & Experience',
      render: (row) => (
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-xs text-foreground bg-muted/50 px-2 py-0.5 rounded border border-border w-fit">
            {row.position || 'General Application'}
          </span>
          {row.experienceYears && (
            <span className="text-[11px] text-muted-foreground">
              Exp: {row.experienceYears}
            </span>
          )}
          {row.location && (
            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {row.location}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'date',
      label: 'Applied On',
      render: (row) => (
        <div className="flex flex-col text-xs text-muted-foreground">
          <span>{new Date(row.createdAt).toLocaleDateString()}</span>
          <span className="text-[11px]">{new Date(row.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      ),
    },
    {
      key: 'resume',
      label: 'Resume Document',
      render: (row) => (
        <div>
          {row.resumeUrl ? (
            <a
              href={row.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 text-xs font-semibold transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-red-500" />
              Download PDF
            </a>
          ) : (
            <span className="text-xs text-muted-foreground italic">No resume</span>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      align: 'right',
      label: 'Actions',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedApplication(row);
            }}
            className="h-8 px-2.5 text-xs text-blue-600 hover:text-blue-700"
          >
            <Eye className="w-3.5 h-3.5 mr-1" /> View Details
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 bg-background min-h-full">
      <Breadcrumb
        title="Career Applications"
        subtitle={`Review and manage candidate applications and secure private resume downloads.`}
        crumbs={[{ label: 'Dashboard' }, { label: 'Career Applications' }]}
      />

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-3 bg-card p-3 rounded-lg border border-border">
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
          <Briefcase className="w-4 h-4 text-primary" />
          <span>Filter Position:</span>
        </div>

        <select
          value={selectedPosition}
          onChange={(e) => setSelectedPosition(e.target.value)}
          className="text-xs bg-background border border-border rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="all">All Positions ({applications.length})</option>
          {positionsList.map((pos) => (
            <option key={pos} value={pos}>
              {pos}
            </option>
          ))}
        </select>

        {(selectedPosition !== 'all' || search) && (
          <button
            onClick={() => {
              setSelectedPosition('all');
              setSearch('');
            }}
            className="text-xs text-primary hover:underline ml-auto"
          >
            Clear Filters
          </button>
        )}
      </div>

      <TableToolbar
        search={search}
        onSearchChange={setSearch}
        sort={sort}
        onSortChange={setSort}
        selectedCount={0}
      />

      <DataTable
        columns={columns}
        data={filteredData}
        loading={loading}
        onRowClick={(row) => setSelectedApplication(row)}
        actions={false}
      />

      {/* Candidate Details Modal */}
      {selectedApplication && (
        <Dialog open={true} onOpenChange={() => setSelectedApplication(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh]">
            <DialogHeader className="border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-md bg-primary/10 text-primary">
                  <User className="w-5 h-5" />
                </span>
                <DialogTitle className="text-xl font-bold !text-white">
                  {selectedApplication.fullName}
                </DialogTitle>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Applied for <span className="font-semibold text-white">{selectedApplication.position}</span> on{' '}
                {new Date(selectedApplication.createdAt).toLocaleDateString()}
              </p>
            </DialogHeader>

            <div className="py-3 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-muted/30 border border-border">
                <div>
                  <span className="text-muted-foreground block">Email Address:</span>
                  <a href={`mailto:${selectedApplication.email}`} className="font-semibold text-primary underline">
                    {selectedApplication.email}
                  </a>
                </div>
                <div>
                  <span className="text-muted-foreground block">Phone Number:</span>
                  <a href={`tel:${selectedApplication.phone}`} className="font-semibold text-foreground">
                    {selectedApplication.phone}
                  </a>
                </div>
                <div>
                  <span className="text-muted-foreground block">Experience Level:</span>
                  <span className="font-semibold text-foreground">{selectedApplication.experienceYears || 'Not specified'}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Current Location:</span>
                  <span className="font-semibold text-foreground">{selectedApplication.location || 'Not specified'}</span>
                </div>
              </div>

              {selectedApplication.message && (
                <div className="space-y-1">
                  <span className="font-semibold text-foreground">Cover Note / Message:</span>
                  <div className="p-3 bg-muted/40 rounded-lg border border-border leading-relaxed whitespace-pre-wrap">
                    {selectedApplication.message}
                  </div>
                </div>
              )}

              <div className="p-3 bg-primary/5 rounded-lg border border-primary/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="font-bold text-foreground">Protected Candidate Resume</p>
                    <p className="text-[11px] text-muted-foreground">Stored in private protected storage with authenticated access.</p>
                  </div>
                </div>
                {selectedApplication.resumeUrl && (
                  <a
                    href={selectedApplication.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" /> Download PDF
                  </a>
                )}
              </div>
            </div>

            <DialogFooter className="pt-2 border-t border-border">
              <Button variant="outline" size="sm" onClick={() => setSelectedApplication(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <Toast toasts={toasts} onRemove={(id) => setToasts((t) => t.filter((x) => x.id !== id))} />
    </div>
  );
}

