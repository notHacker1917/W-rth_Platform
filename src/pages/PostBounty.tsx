import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Bounty } from '../types';
import { useAuth } from '../context/AuthContext';

function generateId() {
  return `b_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}

interface FieldProps {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}

function Field({ label, required, hint, children }: FieldProps) {
  return (
    <div>
      <label className="block text-xs font-semibold text-text-muted uppercase tracking-wide mb-1.5">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-text-muted mt-1">{hint}</p>}
    </div>
  );
}

const inputCls =
  'w-full text-sm bg-surface-card border border-border rounded-xl px-3 py-2.5 text-text-primary ' +
  'placeholder-text-muted focus:outline-none focus:border-accent transition-colors';

export default function PostBounty({
  onCreated,
}: {
  onCreated?: (bounty: Bounty) => void;
}) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submissionRequirements, setSubmissionRequirements] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [reward, setReward] = useState('');
  const [duration, setDuration] = useState('');
  const [deadline, setDeadline] = useState('');
  const [reqInput, setReqInput] = useState('');
  const [requirements, setRequirements] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [preview, setPreview] = useState<Bounty | null>(null);

  if (currentUser?.role !== 'company') {
    return (
      <div className="bg-surface-card border border-border rounded-xl p-8 text-center">
        <p className="text-2xl mb-2">🔒</p>
        <p className="font-medium text-text-primary">Companies only</p>
        <p className="text-sm text-text-muted mt-1">Only company accounts can post bounties.</p>
      </div>
    );
  }

  const canPost =
    title.trim() && description.trim() && submissionRequirements.trim() &&
    reward.trim() && duration.trim() && deadline && requirements.length > 0;

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) setTags(prev => [...prev, t]);
    setTagInput('');
  };

  const addRequirement = () => {
    const r = reqInput.trim();
    if (r) setRequirements(prev => [...prev, r]);
    setReqInput('');
  };

  const handlePost = () => {
    if (!canPost || !currentUser) return;
    const newBounty: Bounty = {
      id: generateId(),
      companyId: currentUser.id,
      title: title.trim(),
      description: description.trim(),
      submissionRequirements: submissionRequirements.trim(),
      requirements,
      tags,
      reward: reward.trim(),
      duration: duration.trim(),
      deadline: new Date(deadline).toISOString(),
      postedAt: new Date().toISOString(),
      applicationCount: 0,
      appliedBy: [],
      status: 'open',
    };
    onCreated?.(newBounty);
    setPreview(newBounty);
    setSubmitted(true);
  };

  if (submitted && preview) {
    return (
      <div className="bg-surface-card border border-border rounded-xl p-8 text-center max-w-md mx-auto">
        <div className="w-14 h-14 rounded-full bg-status-success/10 border border-status-success/20
                        flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-status-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-base font-semibold text-text-primary mb-1">Bounty posted!</h2>
        <p className="text-sm text-text-muted mb-1 font-medium">{preview.title}</p>
        <p className="text-xs text-text-muted mb-5">
          Your bounty is now live and visible to all students on the platform.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <button
            onClick={() => navigate('/bounties')}
            className="px-5 py-2 rounded-lg bg-accent hover:bg-accent-hover text-text-primary text-sm font-semibold transition-colors"
          >
            View Bounties
          </button>
          <button
            onClick={() => {
              setSubmitted(false); setPreview(null);
              setTitle(''); setDescription(''); setSubmissionRequirements('');
              setTags([]); setReward(''); setDuration(''); setDeadline(''); setRequirements([]);
            }}
            className="px-5 py-2 rounded-lg border border-border text-text-muted hover:text-text-primary hover:bg-surface-elevated text-sm transition-colors"
          >
            Post Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-4 pb-20 lg:pb-6">
      {/* Header */}
      <div>
        <h1 className="text-lg font-semibold text-text-primary">Post a Bounty</h1>
        <p className="text-xs text-text-muted mt-0.5">
          Offer a short-term paid task to students on the platform.
        </p>
      </div>

      {/* Form card */}
      <div className="bg-surface-card border border-border rounded-xl p-5 space-y-5">

        <Field label="Title" required hint="Clear and specific — e.g. 'Build a React dashboard widget'">
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Build a Carbon Footprint Calculator Component"
            className={inputCls}
          />
        </Field>

        <Field label="Project Brief" required hint="Describe the problem, context, and what success looks like.">
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={6}
            placeholder="What do you need built? Who will use it? What does a great submission look like?"
            className={`${inputCls} resize-none leading-relaxed`}
          />
        </Field>

        <Field label="Submission Requirements" required hint="What specifically should applicants deliver?">
          <textarea
            value={submissionRequirements}
            onChange={e => setSubmissionRequirements(e.target.value)}
            rows={3}
            placeholder="e.g. GitHub repo + README + live demo on Stackblitz"
            className={`${inputCls} resize-none`}
          />
        </Field>

        {/* Skills/Requirements list */}
        <Field label="Skill Requirements" required hint="Add one at a time, press Enter or Add.">
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={reqInput}
                onChange={e => setReqInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addRequirement(); } }}
                placeholder="e.g. Strong React + TypeScript skills"
                className={`${inputCls} flex-1`}
              />
              <button
                onClick={addRequirement}
                className="px-4 py-2 rounded-xl bg-surface-elevated border border-border text-text-muted
                           hover:text-text-primary hover:border-accent transition-colors text-sm shrink-0 min-h-[44px]"
              >
                Add
              </button>
            </div>
            {requirements.length > 0 && (
              <ul className="space-y-1.5">
                {requirements.map((r, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-text-primary bg-surface-base border border-border rounded-lg px-3 py-2">
                    <svg className="w-3.5 h-3.5 text-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="flex-1">{r}</span>
                    <button
                      onClick={() => setRequirements(prev => prev.filter((_, j) => j !== i))}
                      className="text-text-muted hover:text-status-error transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Field>

        {/* Tags */}
        <Field label="Skill Tags" hint="Type a tag and press Enter — used for search and filtering.">
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                placeholder="e.g. TypeScript"
                className={`${inputCls} flex-1`}
              />
              <button
                onClick={addTag}
                className="px-4 py-2 rounded-xl bg-surface-elevated border border-border text-text-muted
                           hover:text-text-primary hover:border-accent transition-colors text-sm shrink-0 min-h-[44px]"
              >
                Add
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1 text-xs bg-surface-elevated border border-border
                                             text-text-muted px-2 py-0.5 rounded-md">
                    {tag}
                    <button
                      onClick={() => setTags(prev => prev.filter(t => t !== tag))}
                      className="hover:text-status-error transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </Field>

        {/* Reward + Duration in a row */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Reward" required hint='e.g. "$750 cash" or "Certificate + $500"'>
            <input
              type="text"
              value={reward}
              onChange={e => setReward(e.target.value)}
              placeholder="$750 cash"
              className={inputCls}
            />
          </Field>
          <Field label="Estimated Duration" required hint='e.g. "2–3 weeks", "1 week sprint"'>
            <input
              type="text"
              value={duration}
              onChange={e => setDuration(e.target.value)}
              placeholder="2–4 weeks"
              className={inputCls}
            />
          </Field>
        </div>

        {/* Deadline */}
        <Field label="Application Deadline" required>
          <input
            type="date"
            value={deadline}
            onChange={e => setDeadline(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className={`${inputCls} [color-scheme:dark]`}
          />
        </Field>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <button
          onClick={() => navigate('/bounties')}
          className="px-4 py-2 rounded-lg text-sm text-text-muted hover:text-text-primary hover:bg-surface-elevated transition-colors min-h-[44px]"
        >
          Cancel
        </button>
        <button
          onClick={handlePost}
          disabled={!canPost}
          className="px-6 py-2 rounded-lg bg-accent hover:bg-accent-hover text-text-primary text-sm
                     font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed min-h-[44px]"
        >
          Post Bounty
        </button>
      </div>
    </div>
  );
}
