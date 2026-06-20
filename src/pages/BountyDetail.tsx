import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import type { Bounty } from '../types';
import { MOCK_BOUNTIES, getUserById } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/ui/Avatar';
import { formatRelativeTime } from '../utils/time';

// ─── Apply Modal ───────────────────────────────────────────────────────────

interface ApplyModalProps {
  bounty: Bounty;
  onClose: () => void;
  onSubmit: (pitch: string) => void;
}

function ApplyModal({ bounty, onClose, onSubmit }: ApplyModalProps) {
  const { currentUser } = useAuth();
  const [pitch, setPitch] = useState('');
  const [deliverableLink, setDeliverableLink] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = pitch.trim().length >= 50;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit(pitch.trim());
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6"
         onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full max-w-lg bg-surface-elevated border border-border rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 p-5 border-b border-border">
          <div>
            <p className="text-xs text-text-muted mb-0.5">Applying for</p>
            <h2 className="text-sm font-semibold text-text-primary leading-snug line-clamp-2">{bounty.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-card transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {submitted ? (
          /* Success state */
          <div className="p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-status-success/10 border border-status-success/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-status-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-text-primary mb-1">Application submitted!</h3>
            <p className="text-sm text-text-muted mb-5">
              {getUserById(bounty.companyId)?.name} will review your pitch and follow up within 5–7 days.
            </p>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-accent hover:bg-accent-hover text-text-primary text-sm font-semibold transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          /* Form */
          <div className="p-5 space-y-4">
            {/* Applicant identity */}
            {currentUser && (
              <div className="flex items-center gap-3 p-3 bg-surface-card rounded-xl border border-border">
                <Avatar src={currentUser.avatarUrl} alt={currentUser.name} size="sm" />
                <div>
                  <p className="text-sm font-medium text-text-primary">{currentUser.name}</p>
                  <p className="text-xs text-text-muted">{currentUser.headline}</p>
                </div>
              </div>
            )}

            {/* Pitch */}
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wide mb-1.5">
                Your pitch <span className="text-accent">*</span>
              </label>
              <textarea
                value={pitch}
                onChange={e => setPitch(e.target.value)}
                rows={5}
                placeholder="Tell them why you're the right person for this bounty — your relevant experience, approach, and what makes your submission stand out. Min. 50 characters."
                className="w-full text-sm bg-surface-card border border-border rounded-xl px-3 py-2.5
                           text-text-primary placeholder-text-muted focus:outline-none focus:border-accent
                           transition-colors resize-none leading-relaxed"
              />
              <p className={`text-xs mt-1 text-right ${pitch.length < 50 ? 'text-text-muted' : 'text-status-success'}`}>
                {pitch.length} / 50 min chars
              </p>
            </div>

            {/* Deliverable link (optional) */}
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wide mb-1.5">
                Portfolio / relevant link <span className="text-text-muted font-normal">(optional)</span>
              </label>
              <input
                type="url"
                value={deliverableLink}
                onChange={e => setDeliverableLink(e.target.value)}
                placeholder="https://github.com/you/relevant-project"
                className="w-full text-sm bg-surface-card border border-border rounded-xl px-3 py-2.5
                           text-text-primary placeholder-text-muted focus:outline-none focus:border-accent transition-colors"
              />
            </div>

            {/* Submission requirements reminder */}
            <div className="p-3 bg-surface-base border border-border rounded-xl">
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">Submission requirements</p>
              <p className="text-xs text-text-muted leading-relaxed">{bounty.submissionRequirements}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-1">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-sm text-text-muted hover:text-text-primary hover:bg-surface-card transition-colors min-h-[44px]"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="px-5 py-2 rounded-lg bg-accent hover:bg-accent-hover text-text-primary text-sm
                           font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed min-h-[44px]"
              >
                Submit Application
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Detail Page ───────────────────────────────────────────────────────────

export default function BountyDetail() {
  const { bountyId } = useParams<{ bountyId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [bounties, setBounties] = useState(MOCK_BOUNTIES);
  const [showApply, setShowApply] = useState(false);

  const bounty = bounties.find(b => b.id === bountyId);
  if (!bounty) {
    return (
      <div className="bg-surface-card border border-border rounded-xl p-12 text-center">
        <p className="text-2xl mb-2">🔍</p>
        <p className="font-medium text-text-primary">Bounty not found</p>
        <Link to="/bounties" className="text-sm text-accent hover:text-accent-hover mt-3 inline-block">
          ← Back to Bounties
        </Link>
      </div>
    );
  }

  const company = getUserById(bounty.companyId);
  const hasApplied = currentUser ? bounty.appliedBy.includes(currentUser.id) : false;

  const deadline = new Date(bounty.deadline);
  const daysLeft = Math.max(0, Math.ceil((deadline.getTime() - Date.now()) / 86_400_000));
  const isUrgent = daysLeft <= 7 && bounty.status === 'open';

  const handleApply = (pitch: string) => {
    if (!currentUser) return;
    setBounties(prev =>
      prev.map(b =>
        b.id === bountyId
          ? { ...b, appliedBy: [...b.appliedBy, currentUser.id], applicationCount: b.applicationCount + 1 }
          : b,
      ),
    );
  };

  return (
    <>
      <div className="space-y-4 pb-20 lg:pb-6 max-w-3xl">
        {/* Back nav */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Bounties
        </button>

        {/* Header card */}
        <div className="bg-surface-card border border-border rounded-xl p-5">
          {/* Company + status */}
          <div className="flex items-center justify-between gap-3 mb-4">
            {company && (
              <div className="flex items-center gap-2.5">
                <Avatar src={company.avatarUrl} alt={company.name} size="sm" />
                <span className="text-sm text-text-muted">{company.name}</span>
              </div>
            )}
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
              bounty.status === 'open'
                ? 'bg-status-success/10 text-status-success border-status-success/20'
                : bounty.status === 'reviewing'
                ? 'bg-status-warn/10 text-status-warn border-status-warn/20'
                : 'bg-surface-elevated text-text-muted border-border'
            }`}>
              {bounty.status.charAt(0).toUpperCase() + bounty.status.slice(1)}
            </span>
          </div>

          <h1 className="text-xl font-bold text-text-primary leading-snug mb-4">{bounty.title}</h1>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-surface-base border border-border rounded-xl p-3">
              <p className="text-xs text-text-muted mb-0.5">Reward</p>
              <p className="text-sm font-bold text-accent">{bounty.reward}</p>
            </div>
            <div className="bg-surface-base border border-border rounded-xl p-3">
              <p className="text-xs text-text-muted mb-0.5">Duration</p>
              <p className="text-sm font-semibold text-text-primary">{bounty.duration}</p>
            </div>
            <div className="bg-surface-base border border-border rounded-xl p-3">
              <p className="text-xs text-text-muted mb-0.5">Deadline</p>
              <p className={`text-sm font-semibold ${isUrgent ? 'text-status-warn' : 'text-text-primary'}`}>
                {daysLeft === 0 ? 'Due today' : `${daysLeft} days left`}
              </p>
            </div>
            <div className="bg-surface-base border border-border rounded-xl p-3">
              <p className="text-xs text-text-muted mb-0.5">Applicants</p>
              <p className="text-sm font-semibold text-text-primary">{bounty.applicationCount}</p>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-4">
            {bounty.tags.map(tag => (
              <span key={tag} className="text-xs bg-surface-elevated text-text-muted px-2.5 py-1 rounded-md border border-border">
                {tag}
              </span>
            ))}
          </div>

          {/* Apply button */}
          {currentUser?.role === 'student' && (
            <div className="mt-4 pt-4 border-t border-border">
              {hasApplied ? (
                <div className="flex items-center gap-2 text-status-success">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium">Application submitted</span>
                </div>
              ) : bounty.status !== 'open' ? (
                <p className="text-sm text-text-muted">Applications are currently {bounty.status === 'reviewing' ? 'under review' : 'closed'}.</p>
              ) : (
                <button
                  onClick={() => setShowApply(true)}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-accent hover:bg-accent-hover
                             text-text-primary text-sm font-semibold transition-colors min-h-[44px]"
                >
                  Apply for this Bounty
                </button>
              )}
            </div>
          )}
        </div>

        {/* Brief */}
        <div className="bg-surface-card border border-border rounded-xl p-5">
          <h2 className="text-sm font-semibold text-text-primary mb-3">Project Brief</h2>
          <p className="text-sm text-text-primary leading-relaxed whitespace-pre-line">{bounty.description}</p>
        </div>

        {/* Requirements */}
        <div className="bg-surface-card border border-border rounded-xl p-5">
          <h2 className="text-sm font-semibold text-text-primary mb-3">Requirements</h2>
          <ul className="space-y-2">
            {bounty.requirements.map((req, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-text-primary">
                <svg className="w-4 h-4 text-accent mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {req}
              </li>
            ))}
          </ul>
        </div>

        {/* Submission requirements */}
        <div className="bg-surface-card border border-border rounded-xl p-5">
          <h2 className="text-sm font-semibold text-text-primary mb-3">What to Submit</h2>
          <p className="text-sm text-text-primary leading-relaxed">{bounty.submissionRequirements}</p>
        </div>

        {/* Posted by */}
        {company && (
          <div className="bg-surface-card border border-border rounded-xl p-5">
            <h2 className="text-sm font-semibold text-text-primary mb-3">Posted by</h2>
            <div className="flex items-center gap-3">
              <Avatar src={company.avatarUrl} alt={company.name} size="md" />
              <div>
                <p className="text-sm font-semibold text-text-primary">{company.name}</p>
                <p className="text-xs text-text-muted">{company.headline}</p>
              </div>
              <Link
                to={`/profile/${company.id}`}
                className="ml-auto text-xs text-accent hover:text-accent-hover transition-colors font-medium"
              >
                View profile →
              </Link>
            </div>
          </div>
        )}

        {/* Posted time */}
        <p className="text-xs text-text-muted text-center">
          Posted {formatRelativeTime(bounty.postedAt)}
        </p>
      </div>

      {/* Apply modal */}
      {showApply && (
        <ApplyModal
          bounty={bounty}
          onClose={() => setShowApply(false)}
          onSubmit={(pitch) => {
            handleApply(pitch);
            setShowApply(false);
          }}
        />
      )}
    </>
  );
}
