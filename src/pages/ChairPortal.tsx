import { useState, useRef, useCallback } from 'react';
import type { LectureMaterial, MaterialType, StudentInitiative } from '../types';
import { MOCK_LECTURE_MATERIALS, MOCK_INITIATIVES } from '../data/mockData';
import { formatRelativeTime } from '../utils/time';

// ─── Helpers ───────────────────────────────────────────────────────────────

function generateId() { return `lm_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`; }

const TYPE_META: Record<MaterialType, { label: string; icon: React.ReactNode; color: string }> = {
  slides:    { label: 'Slides',    color: 'text-accent bg-accent-deepest border-accent-deep/40',         icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"/></svg> },
  notes:     { label: 'Notes',     color: 'text-status-success bg-status-success/10 border-status-success/20', icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg> },
  lab:       { label: 'Lab',       color: 'text-status-warn bg-status-warn/10 border-status-warn/20',       icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg> },
  recording: { label: 'Recording', color: 'text-[#f87171] bg-[#f87171]/10 border-[#f87171]/20',            icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg> },
};

const STATUS_META: Record<StudentInitiative['status'], { label: string; cls: string }> = {
  'active':         { label: 'Active',         cls: 'text-status-success bg-status-success/10 border-status-success/20' },
  'completed':      { label: 'Completed',      cls: 'text-text-muted bg-surface-elevated border-border' },
  'pending-review': { label: 'Pending review', cls: 'text-status-warn bg-status-warn/10 border-status-warn/20' },
};

// ─── Drag-and-Drop Upload Zone ─────────────────────────────────────────────

interface UploadZoneProps {
  onUpload: (mat: LectureMaterial) => void;
}

function UploadZone({ onUpload }: UploadZoneProps) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [justUploaded, setJustUploaded] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);

    // Simulate upload delay
    setTimeout(() => {
      Array.from(files).forEach(file => {
        const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
        const type: MaterialType =
          ['mp4', 'mov', 'webm'].includes(ext) ? 'recording' :
          ['pdf', 'pptx', 'ppt', 'key'].includes(ext) ? 'slides' :
          ['docx', 'doc', 'txt', 'md'].includes(ext) ? 'notes' : 'lab';

        const mat: LectureMaterial = {
          id: generateId(),
          authorId: 'u7',
          title: file.name.replace(/\.[^.]+$/, ''),
          course: 'EE401 — Power Electronics',
          type,
          uploadedAt: new Date().toISOString(),
          downloads: 0,
          fileSize: file.size > 1_048_576
            ? `${(file.size / 1_048_576).toFixed(1)} MB`
            : `${(file.size / 1024).toFixed(0)} KB`,
          tags: [],
          published: false,
        };
        onUpload(mat);
        setJustUploaded(mat.title);
        setTimeout(() => setJustUploaded(null), 3000);
      });
      setUploading(false);
    }, 900);
  }, [onUpload]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  return (
    <div>
      {/* Drop zone */}
      <div
        onDragEnter={e => { e.preventDefault(); setDragging(true); }}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={[
          'relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all select-none',
          dragging
            ? 'border-accent bg-accent-deepest/30 scale-[1.01] shadow-lg shadow-accent/20'
            : 'border-border hover:border-accent/50 hover:bg-surface-elevated/50',
        ].join(' ')}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.pptx,.ppt,.key,.docx,.doc,.txt,.md,.mp4,.mov,.webm"
          className="hidden"
          onChange={e => handleFiles(e.target.files)}
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-medium text-text-primary">Uploading…</p>
          </div>
        ) : justUploaded ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-status-success/10 border border-status-success/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-status-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-text-primary">Uploaded as draft</p>
            <p className="text-xs text-text-muted truncate max-w-xs">"{justUploaded}"</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-all ${dragging ? 'border-accent bg-accent-deepest text-[#f2a0a0]' : 'border-border bg-surface-elevated text-text-muted'}`}>
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">
                {dragging ? 'Drop to upload' : 'Drag & drop lecture materials'}
              </p>
              <p className="text-xs text-text-muted mt-0.5">
                PDF, PPTX, DOCX, MP4 · or <span className="text-accent underline">browse files</span>
              </p>
            </div>
            <p className="text-xs text-text-muted bg-surface-base border border-border rounded-lg px-3 py-1.5">
              Files land as <span className="text-status-warn font-semibold">unpublished drafts</span> — you control when students can see them
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Material Row ──────────────────────────────────────────────────────────

function MaterialRow({
  mat,
  onTogglePublish,
  onDelete,
}: {
  mat: LectureMaterial;
  onTogglePublish: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const meta = TYPE_META[mat.type];
  return (
    <div className="flex items-center gap-3 py-3 border-b border-border last:border-0 group">
      {/* Type badge */}
      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md border shrink-0 ${meta.color}`}>
        {meta.icon} {meta.label}
      </span>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-primary truncate">{mat.title}</p>
        <p className="text-xs text-text-muted truncate">{mat.course} · {mat.fileSize}</p>
      </div>

      {/* Stats */}
      <div className="hidden sm:flex items-center gap-3 text-xs text-text-muted shrink-0">
        <span>{formatRelativeTime(mat.uploadedAt)}</span>
        {mat.published && <span className="flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          {mat.downloads}
        </span>}
      </div>

      {/* Publish toggle */}
      <button
        onClick={() => onTogglePublish(mat.id)}
        className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors min-h-[36px] ${
          mat.published
            ? 'border-status-success/30 text-status-success bg-status-success/10 hover:bg-status-success/20'
            : 'border-border text-text-muted bg-surface-elevated hover:border-accent/50 hover:text-text-primary'
        }`}
      >
        {mat.published ? 'Published' : 'Publish'}
      </button>

      {/* Delete stub */}
      <button
        onClick={() => onDelete(mat.id)}
        className="shrink-0 p-1.5 rounded-lg text-text-muted hover:text-status-error hover:bg-status-error/10 transition-colors opacity-0 group-hover:opacity-100"
        title="Remove"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}

// ─── Toggle switch ─────────────────────────────────────────────────────────

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative w-10 h-5 rounded-full transition-colors focus:outline-none shrink-0 ${
        checked ? 'bg-accent' : 'bg-surface-elevated border border-border'
      }`}
    >
      <span className={`absolute top-0.5 w-4 h-4 rounded-full transition-transform ${
        checked ? 'translate-x-5 bg-text-primary' : 'translate-x-0.5 bg-text-muted'
      }`} />
    </button>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function ChairPortal() {
  const [materials, setMaterials] = useState<LectureMaterial[]>(MOCK_LECTURE_MATERIALS);
  const [initiatives, setInitiatives] = useState<StudentInitiative[]>(MOCK_INITIATIVES);
  const [matFilter, setMatFilter] = useState<'all' | MaterialType>('all');
  const [search, setSearch] = useState('');

  const handleUpload = (mat: LectureMaterial) => setMaterials(prev => [mat, ...prev]);

  const handleTogglePublish = (id: string) =>
    setMaterials(prev => prev.map(m => m.id === id ? { ...m, published: !m.published } : m));

  const handleDelete = (id: string) =>
    setMaterials(prev => prev.filter(m => m.id !== id));

  const handleToggleEndorsement = (id: string) =>
    setInitiatives(prev => prev.map(i => i.id === id ? { ...i, endorsed: !i.endorsed } : i));

  const filteredMats = materials.filter(m =>
    (matFilter === 'all' || m.type === matFilter) &&
    (!search || m.title.toLowerCase().includes(search.toLowerCase()) || m.course.toLowerCase().includes(search.toLowerCase()))
  );

  const publishedCount = materials.filter(m => m.published).length;
  const draftCount = materials.filter(m => !m.published).length;
  const endorsedCount = initiatives.filter(i => i.endorsed).length;

  return (
    <div className="space-y-6 pb-20 lg:pb-6">

      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-1 h-8 rounded-full bg-accent shrink-0 mt-0.5" />
        <div>
          <h1 className="text-xl font-bold text-text-primary">University Chair Portal</h1>
          <p className="text-xs text-text-muted mt-0.5">
            EE Chair · Technical University of Munich · 445 participating institutes
          </p>
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Published materials', value: publishedCount },
          { label: 'Unpublished drafts', value: draftCount },
          { label: 'Active student initiatives', value: initiatives.filter(i => i.status === 'active').length },
          { label: 'Endorsed projects', value: `${endorsedCount} / ${initiatives.length}` },
        ].map(s => (
          <div key={s.label} className="bg-surface-card border border-border rounded-xl p-3">
            <p className="text-xl font-bold text-text-primary">{s.value}</p>
            <p className="text-xs text-text-muted mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Lecture Hub ───────────────────────────────────────────────────── */}
      <section className="bg-surface-card border border-border rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h2 className="text-sm font-semibold text-text-primary">Lecture Hub</h2>
            <p className="text-xs text-text-muted mt-0.5">Upload slides, notes, and lab sheets — drafts are invisible to students until published</p>
          </div>
        </div>

        <UploadZone onUpload={handleUpload} />

        {/* Material list controls */}
        <div className="flex items-center gap-2 flex-wrap pt-1">
          {(['all', 'slides', 'notes', 'lab', 'recording'] as const).map(f => (
            <button
              key={f}
              onClick={() => setMatFilter(f)}
              className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors capitalize min-h-[36px] ${
                matFilter === f
                  ? 'bg-accent text-text-primary'
                  : 'bg-surface-elevated border border-border text-text-muted hover:text-text-primary'
              }`}
            >
              {f === 'all' ? 'All' : TYPE_META[f].label}
            </button>
          ))}
          <div className="ml-auto relative">
            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search materials…"
              className="pl-8 pr-3 py-1.5 text-xs bg-surface-base border border-border rounded-lg
                         text-text-primary placeholder-text-muted focus:outline-none focus:border-accent transition-colors"
            />
          </div>
        </div>

        {/* Material list */}
        <div>
          {filteredMats.length === 0 ? (
            <p className="text-center text-sm text-text-muted py-8">No materials match your filter.</p>
          ) : (
            filteredMats.map(mat => (
              <MaterialRow
                key={mat.id}
                mat={mat}
                onTogglePublish={handleTogglePublish}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </section>

      {/* ── Student Initiative Table ───────────────────────────────────────── */}
      <section className="bg-surface-card border border-border rounded-2xl p-5 space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-text-primary">Student Team Initiatives</h2>
          <p className="text-xs text-text-muted mt-0.5">
            Active projects using Würth Elektronik components · Toggle to grant Institutional Endorsement
          </p>
        </div>

        {/* Table — scrolls horizontally on small screens */}
        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="border-b border-border text-xs text-text-muted uppercase tracking-wide">
                <th className="text-left pb-3 font-semibold">Team</th>
                <th className="text-left pb-3 font-semibold">Project</th>
                <th className="text-left pb-3 font-semibold hidden md:table-cell">Parts Used</th>
                <th className="text-left pb-3 font-semibold">Status</th>
                <th className="text-center pb-3 font-semibold">Endorsement</th>
              </tr>
            </thead>
            <tbody>
              {initiatives.map(init => {
                const statusMeta = STATUS_META[init.status];
                return (
                  <tr key={init.id} className="border-b border-border/50 last:border-0 hover:bg-surface-elevated/30 transition-colors">
                    {/* Team */}
                    <td className="py-3.5 pr-3">
                      <p className="font-semibold text-text-primary">{init.teamName}</p>
                      <p className="text-xs text-text-muted mt-0.5">{init.memberNames.slice(0, 2).join(', ')}{init.memberNames.length > 2 ? ` +${init.memberNames.length - 2}` : ''}</p>
                    </td>

                    {/* Project */}
                    <td className="py-3.5 pr-3 max-w-[220px]">
                      <p className="font-medium text-text-primary leading-snug line-clamp-1">{init.projectTitle}</p>
                      <p className="text-xs text-text-muted mt-0.5 line-clamp-1">{init.description}</p>
                    </td>

                    {/* Parts */}
                    <td className="py-3.5 pr-3 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {init.partsUsed.slice(0, 2).map(p => (
                          <span key={p} className="text-xs bg-surface-base border border-border text-text-muted px-1.5 py-0.5 rounded-md truncate max-w-[120px]">
                            {p}
                          </span>
                        ))}
                        {init.partsUsed.length > 2 && (
                          <span className="text-xs text-text-muted">+{init.partsUsed.length - 2}</span>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 pr-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${statusMeta.cls}`}>
                        {statusMeta.label}
                      </span>
                    </td>

                    {/* Endorsement toggle */}
                    <td className="py-3.5 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <Toggle
                          checked={init.endorsed}
                          onChange={() => handleToggleEndorsement(init.id)}
                        />
                        <span className={`text-xs font-medium ${init.endorsed ? 'text-accent' : 'text-text-muted'}`}>
                          {init.endorsed ? 'Endorsed' : 'Pending'}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-text-muted">
          Institutional Endorsement unlocks priority component access and co-authorship credit in Würth's student showcase.
        </p>
      </section>
    </div>
  );
}
