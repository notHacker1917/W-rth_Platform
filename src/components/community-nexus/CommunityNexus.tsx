import { useState, useRef, useEffect } from 'react';
import {
  NEXUS_MEMBERS, NEXUS_THREADS, STATUS_CONFIG,
  type NexusMember, type NexusThread, type NexusTab,
} from '../../data/nexusData';

// ─── Types ────────────────────────────────────────────────────────────────────

interface CMsg {
  id: string;
  role: 'nexus' | 'user';
  content: string;
  suggestions?: string[];
  memberRef?: NexusMember;
  threadRef?: NexusThread;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function Bold({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('**') && p.endsWith('**')
          ? <strong key={i} className="font-semibold text-text-primary">{p.slice(2, -2)}</strong>
          : <span key={i}>{p}</span>
      )}
    </>
  );
}

function MsgText({ content }: { content: string }) {
  return (
    <div className="space-y-1.5">
      {content.split('\n').map((line, i) => (
        <p key={i} className={line === '' ? 'h-1' : 'text-xs leading-relaxed'}>
          <Bold text={line} />
        </p>
      ))}
    </div>
  );
}

// ─── Response generator ───────────────────────────────────────────────────────

const WELCOME: CMsg = {
  id: 'welcome',
  role: 'nexus',
  content: "Hey there, Community Manager! 👋 I'm **Community Nexus** — your AI co-pilot for member engagement and community health.\n\nHere's what I can do:\n**🧵 Thread Monitoring** — auto-respond to questions silent for 4+ hours\n**🏆 Milestone Processing** — personalized spotlights and badge unlock challenges\n**📈 Progression Tracking** — member path-to-next-level deep dives\n**📣 Announcement Drafting** — ready-to-post community callouts in seconds\n\nTry asking about **@Prof_Ayesha**, say **\"show threads\"**, or type **\"milestones\"** to get started.",
  suggestions: ['Show unanswered threads', 'Process milestones', '@Prof_Ayesha progression', 'Post announcements'],
};

function generateResponse(query: string): CMsg {
  const q = query.toLowerCase().trim();
  const id = Date.now().toString();

  // Member lookups
  const memberMatch = NEXUS_MEMBERS.find(m => q.includes(m.username.toLowerCase()));
  if (memberMatch) {
    const m = memberMatch;
    const gap = m.repTarget - m.repPoints;
    return {
      id, role: 'nexus',
      content: `**@${m.username}** — here's their live snapshot:\n\n**Level:** Lv ${m.level} — ${m.levelTitle}\n**Rep Points:** ${m.repPoints.toLocaleString()} / ${m.repTarget} (${m.nextLevelTitle} threshold)\n**Gap to next level:** ${gap} points\n**Status:** ${STATUS_CONFIG[m.status].label}\n**Milestone:** ${m.milestoneIcon} ${m.milestone}${m.streakDays ? `\n**Active streak:** 🔥 ${m.streakDays} days` : ''}${m.weeklyUpvotes ? `\n**This week:** ${m.weeklyUpvotes}+ upvotes` : ''}\n\nBased on their activity trajectory, I've pre-drafted a personalized DM and a public spotlight callout. Switch to the **🏆 Milestones** tab to post it with one click.`,
      suggestions: ['Show progression path', 'Draft their DM', 'Post spotlight'],
      memberRef: m,
    };
  }

  // Thread monitoring
  if (q.includes('thread') || q.includes('unanswered') || q.includes('question') || q.includes('silent')) {
    const count = NEXUS_THREADS.length;
    return {
      id, role: 'nexus',
      content: `I'm currently monitoring **${count} threads** that have gone without a human response for 4+ hours. Based on what our community solved last month, I've drafted structured responses for each one.\n\nThreads in the queue:\n**1.** @TechLena — I²C sensor lockup (STM32 + BMP280) · 5h silent\n**2.** @CircuitSam — EMI shielding on 4-layer PCB at 400kHz · 6h silent\n**3.** @NewbieNick — Internship vs Working Student · 4.5h silent\n\nSwitch to the **🧵 Threads** tab to review responses and deploy them with one click. Each response ends with a CTA inviting the community to expand on it.`,
      suggestions: ['Open Threads tab', 'Tell me about thread 1', 'Who is NewbieNick?'],
    };
  }

  // Milestones
  if (q.includes('milestone') || q.includes('badge') || q.includes('level') || q.includes('achievement') || q.includes('spotlight')) {
    return {
      id, role: 'nexus',
      content: `I've detected **5 member milestones** since the last digest. Here's the quick summary:\n\n🌱 **@TechLena** — First question posted (Lv 1 Newcomer)\n🎯 **@RohanV** — Hit 500 rep points (Lv 3 Contributor)\n⚡ **@CircuitSam** — First bounty solved · 🏹 Bounty Hunter badge unlocked\n🔥 **@Prof_Ayesha** — 7-day streak · 160 pts from Legend tier\n👋 **@NewbieNick** — Just joined · at-risk of churn if no activity in 48h\n\nEach has a pre-drafted spotlight announcement and personalized DM ready to go. Switch to the **🏆 Milestones** tab to deploy them.`,
      suggestions: ['@Prof_Ayesha deep dive', '@NewbieNick at risk?', 'Open Milestones tab'],
    };
  }

  // Progression
  if (q.includes('progression') || q.includes('path') || q.includes('legend') || q.includes('level up') || q.includes('next level')) {
    return {
      id, role: 'nexus',
      content: `The **📈 Progression** tab gives you a full deep-dive for any member — their exact point gap, a step-by-step action plan with rep values and time estimates, and a ready-to-send DM.\n\nHighlight right now: **@Prof_Ayesha** is 160 points from Legend tier — the top rank in the platform. She can close that gap **this weekend** with her current pace.\n\nHer fastest path:\n**Answer 3 threads** → +60 pts (~90 mins)\n**Maintain streak to Day 14** → +50 pts (keep going!)\n**Nominate a peer** → +25 pts (~2 mins)\n**5 passive upvotes** → +25 pts\n\nTotal: **+160 pts = Legend unlocked ✅**\n\nOpen the **📈 Progression** tab to explore any member's path.`,
      suggestions: ['Open Progression tab', '@RohanV path', '@TechLena path'],
    };
  }

  // Announcements
  if (q.includes('announcement') || q.includes('post') || q.includes('callout') || q.includes('feed')) {
    return {
      id, role: 'nexus',
      content: `Here's the **ready-to-post community spotlight** for this week:\n\n📌 **COMMUNITY SPOTLIGHT — This Week's Rising Stars**\n\n🌱 **@TechLena** posted her very first question — welcome her!\n⚡ **@CircuitSam** just solved his first bounty — 18 days in.\n🔥 **@Prof_Ayesha** is on a 7-day streak with 40+ upvotes.\n🎯 **@RohanV** crossed 500 rep in under 47 days.\n\n*Community Nexus is tracking your contributions. Every reply, every question, every solved thread counts. 💪*\n\nSwitch to the **🏆 Milestones** tab to post individual spotlight cards or send DMs directly.`,
      suggestions: ['Copy to clipboard', 'Open Milestones tab', 'Show individual cards'],
    };
  }

  // Help / capabilities
  if (q.includes('help') || q.includes('what can') || q.includes('capabilit') || q.includes('how') || q.includes('what do')) {
    return {
      id, role: 'nexus',
      content: `Here's everything I can do as your Community Nexus:\n\n**🧵 Thread Monitoring**\nWatch for questions silent 4+ hours and deploy structured AI responses that invite community follow-up.\n\n**🏆 Milestone Processing**\nDetect level-ups, badge unlocks, and firsts — then auto-generate spotlight announcements and personalized DMs.\n\n**📈 Progression Tracking**\nFor any member, I'll map the exact actions, rep values, and time estimates to reach their next level.\n\n**📣 Announcement Drafting**\nReady-to-post community digest in seconds — works as a newsletter blurb, Slack post, or feed announcement.\n\nJust ask me about a specific member (like **@RohanV**), or try one of the tabs above to see it all in action.`,
      suggestions: ['Show unanswered threads', 'Process milestones', '@Prof_Ayesha', 'Post announcements'],
    };
  }

  // Greeting
  if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('start')) {
    return {
      id, role: 'nexus',
      content: "Hey! 👋 Great to see you back. Let's figure out where to focus your community energy today.\n\n**Quick options:**\n📍 3 threads need a response (oldest: 6 hours)\n📍 5 member milestones to spotlight\n📍 @Prof_Ayesha is 160 pts from Legend tier\n📍 @NewbieNick joined today with zero activity — at-risk of churn\n\nWhat would you like to tackle first?",
      suggestions: ['Show threads', 'Process milestones', '@Prof_Ayesha', '@NewbieNick'],
    };
  }

  // Default
  return {
    id, role: 'nexus',
    content: `Based on what our community is doing right now, here's what I'd prioritize:\n\n**🔴 Urgent:** 3 unanswered threads (4–6 hours silent)\n**🟡 Action needed:** @NewbieNick — Day 1, no activity, at-risk of churn\n**🟢 Opportunity:** @Prof_Ayesha is 160 pts from Legend — a personal nudge could push her over\n\nTry asking me about a specific member or say "show threads" to see what needs your attention most.`,
    suggestions: ['Show threads', '@NewbieNick', '@Prof_Ayesha', 'Process milestones'],
  };
}

// ─── Chat Tab ─────────────────────────────────────────────────────────────────

function ChatTab() {
  const [messages, setMessages] = useState<CMsg[]>([WELCOME]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: CMsg = { id: Date.now().toString(), role: 'user', content: text };
    setMessages(m => [...m, userMsg]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(m => [...m, generateResponse(text)]);
    }, 800 + Math.random() * 500);
  };

  return (
    <div className="flex flex-col h-full">
      {/* messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'nexus' && (
              <div className="w-6 h-6 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center shrink-0 mt-0.5 text-[10px]">🏛</div>
            )}
            <div className={`max-w-[85%] rounded-xl px-3 py-2.5 ${msg.role === 'user' ? 'bg-accent/15 text-text-primary rounded-br-sm' : 'bg-surface-elevated border border-border text-text-muted rounded-bl-sm'}`}>
              <MsgText content={msg.content} />
              {msg.memberRef && (
                <div className="mt-2 p-2 rounded-lg bg-surface-card border border-border flex items-center gap-2">
                  <img src={msg.memberRef.avatar} alt={msg.memberRef.username} className="w-7 h-7 rounded-full bg-surface-elevated" />
                  <div>
                    <p className="text-xs font-semibold text-text-primary">@{msg.memberRef.username}</p>
                    <p className="text-[10px] text-text-muted">Lv {msg.memberRef.level} · {msg.memberRef.repPoints} rep</p>
                  </div>
                  <span className={`ml-auto text-[9px] font-semibold px-1.5 py-0.5 rounded border ${STATUS_CONFIG[msg.memberRef.status].color}`}>
                    {STATUS_CONFIG[msg.memberRef.status].label}
                  </span>
                </div>
              )}
              {msg.suggestions && msg.suggestions.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {msg.suggestions.map(s => (
                    <button key={s} onClick={() => send(s)}
                      className="text-[10px] px-2 py-1 rounded-lg bg-surface-card border border-border text-text-muted hover:text-accent hover:border-accent/30 transition-colors">
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex gap-2 justify-start">
            <div className="w-6 h-6 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center shrink-0 text-[10px]">🏛</div>
            <div className="bg-surface-elevated border border-border rounded-xl rounded-bl-sm px-4 py-3 flex gap-1 items-center">
              {[0, 1, 2].map(i => (
                <span key={i} className="w-1.5 h-1.5 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* input */}
      <div className="p-3 border-t border-border">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send(input)}
            placeholder="Ask Community Nexus anything…"
            className="flex-1 bg-surface-elevated border border-border rounded-lg px-3 py-2 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50"
          />
          <button onClick={() => send(input)} disabled={!input.trim()}
            className="px-3 py-2 bg-accent text-white rounded-lg text-xs font-semibold hover:bg-accent/90 transition disabled:opacity-40">
            ↑
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Threads Tab ──────────────────────────────────────────────────────────────

function ThreadsTab() {
  const [deployed, setDeployed] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-border bg-surface-elevated/50">
        <p className="text-xs text-text-muted">
          <span className="font-semibold text-text-primary">{NEXUS_THREADS.length} threads</span> silent for 4+ hours · AI responses ready to deploy
        </p>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
        {NEXUS_THREADS.map(t => {
          const isDeployed = deployed.has(t.id);
          const isExpanded = expanded === t.id;
          return (
            <div key={t.id} className={`rounded-xl border transition-colors ${isDeployed ? 'border-green-500/30 bg-green-500/5' : 'border-border bg-surface-card'}`}>
              {/* header */}
              <div className="p-3">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded border bg-orange-500/10 text-orange-400 border-orange-400/20">
                    ⏱ {t.hoursUnanswered}h silent
                  </span>
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded border bg-blue-500/10 text-blue-400 border-blue-400/20">
                    {t.topic}
                  </span>
                  <span className="text-[10px] text-text-muted">@{t.authorUsername} · Lv {t.authorLevel}</span>
                </div>
                <p className="text-xs font-medium text-text-primary leading-snug mb-2">"{t.question}"</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {t.tags.map(tag => (
                    <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded bg-surface-elevated border border-border text-text-muted">{tag}</span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button onClick={() => setExpanded(isExpanded ? null : t.id)}
                    className="flex-1 text-[10px] font-medium px-2 py-1.5 rounded-lg border border-border text-text-muted hover:text-text-primary hover:bg-surface-elevated transition-colors">
                    {isExpanded ? '▲ Hide' : '▼ Preview'} Response
                  </button>
                  {!isDeployed ? (
                    <button onClick={() => { setDeployed(d => new Set([...d, t.id])); setExpanded(null); }}
                      className="flex-1 text-[10px] font-semibold px-2 py-1.5 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 transition-colors">
                      ✓ Deploy Response
                    </button>
                  ) : (
                    <span className="flex-1 text-center text-[10px] font-semibold px-2 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400">
                      ✓ Deployed
                    </span>
                  )}
                </div>
              </div>

              {/* expanded response preview */}
              {isExpanded && (
                <div className="border-t border-border p-3 bg-surface-elevated/40">
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-[10px] text-accent">🏛 Community Nexus Response Preview</span>
                  </div>
                  <div className="text-[10px] text-text-muted leading-relaxed space-y-1 max-h-40 overflow-y-auto">
                    {t.nexusResponse.split('\n').map((line, i) => (
                      <p key={i} className={line === '' ? 'h-0.5' : ''}><Bold text={line} /></p>
                    ))}
                  </div>
                  {t.ctaForAuthor && (
                    <div className="mt-2 p-2 rounded-lg bg-accent/5 border border-accent/20">
                      <p className="text-[9px] text-accent font-semibold mb-0.5">📣 Author CTA</p>
                      <p className="text-[10px] text-text-muted">{t.ctaForAuthor}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Milestones Tab ───────────────────────────────────────────────────────────

function MilestonesTab() {
  const [posted, setPosted]   = useState<Set<string>>(new Set());
  const [dmSent, setDmSent]   = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-border bg-surface-elevated/50">
        <p className="text-xs text-text-muted">
          <span className="font-semibold text-text-primary">{NEXUS_MEMBERS.length} milestones</span> detected · spotlights and DMs pre-drafted
        </p>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
        {NEXUS_MEMBERS.map(m => {
          const cfg = STATUS_CONFIG[m.status];
          const isPosted  = posted.has(m.id);
          const isDmSent  = dmSent.has(m.id);
          const isExpanded = expanded === m.id;
          const pct = Math.min(100, Math.round((m.repPoints / m.repTarget) * 100));

          return (
            <div key={m.id} className="bg-surface-card border border-border rounded-xl overflow-hidden">
              {/* member row */}
              <div className="p-3">
                <div className="flex items-center gap-2.5 mb-2">
                  <img src={m.avatar} alt={m.username} className="w-8 h-8 rounded-full bg-surface-elevated shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-semibold text-text-primary">@{m.username}</span>
                      <span className="text-[9px] text-text-muted">Lv {m.level} · {m.repPoints} rep</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-xs">{m.milestoneIcon}</span>
                      <span className="text-[10px] text-text-muted">{m.milestone}</span>
                    </div>
                  </div>
                  <span className={`shrink-0 text-[9px] font-semibold px-1.5 py-0.5 rounded border ${cfg.color}`}>
                    {cfg.label}
                  </span>
                </div>

                {/* rep bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-[9px] text-text-muted mb-1">
                    <span>{m.levelTitle}</span>
                    <span>{m.repPoints} / {m.repTarget} → {m.nextLevelTitle}</span>
                  </div>
                  <div className="w-full h-1 rounded-full bg-surface-elevated overflow-hidden">
                    <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>

                {m.badgeUnlocked && (
                  <div className="mb-2 inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-accent">
                    🏅 Badge unlocked: {m.badgeUnlocked}
                  </div>
                )}

                <p className="text-[10px] text-text-muted mb-3 leading-relaxed">{m.nextChallenge}</p>

                {/* actions */}
                <div className="flex gap-2">
                  <button onClick={() => setExpanded(isExpanded ? null : m.id)}
                    className="flex-1 text-[10px] px-2 py-1.5 rounded-lg border border-border text-text-muted hover:text-text-primary hover:bg-surface-elevated transition-colors font-medium">
                    {isExpanded ? '▲ Hide' : '▼ View'} Drafts
                  </button>
                  <button onClick={() => setPosted(s => new Set([...s, m.id]))}
                    className={`flex-1 text-[10px] font-semibold px-2 py-1.5 rounded-lg border transition-colors ${isPosted ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-accent/10 border-accent/30 text-accent hover:bg-accent/20'}`}>
                    {isPosted ? '✓ Posted' : '📣 Post Spotlight'}
                  </button>
                  <button onClick={() => setDmSent(s => new Set([...s, m.id]))}
                    className={`flex-1 text-[10px] font-semibold px-2 py-1.5 rounded-lg border transition-colors ${isDmSent ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'border-border text-text-muted hover:border-accent/30 hover:text-text-primary'}`}>
                    {isDmSent ? '✓ DM Sent' : '✉ Send DM'}
                  </button>
                </div>
              </div>

              {/* expanded drafts */}
              {isExpanded && (
                <div className="border-t border-border bg-surface-elevated/40 p-3 space-y-3">
                  <div>
                    <p className="text-[9px] font-semibold text-accent mb-1">📣 Spotlight Announcement</p>
                    <div className="text-[10px] text-text-muted leading-relaxed">
                      {m.announcement.split('**').map((part, i) =>
                        i % 2 === 1
                          ? <strong key={i} className="font-semibold text-text-primary">{part}</strong>
                          : <span key={i}>{part}</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-[9px] font-semibold text-accent mb-1">✉ DM Draft</p>
                    <p className="text-[10px] text-text-muted leading-relaxed">{m.dmDraft}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Progression Tab ──────────────────────────────────────────────────────────

function ProgressionTab() {
  const [selected, setSelected] = useState<NexusMember>(NEXUS_MEMBERS[3]); // Prof_Ayesha

  const m = selected;
  const cfg = STATUS_CONFIG[m.status];
  const pct = Math.min(100, Math.round((m.repPoints / m.repTarget) * 100));
  const totalPoints = m.progressPath.reduce((s, p) => s + p.points, 0);

  return (
    <div className="flex flex-col h-full">
      {/* member selector */}
      <div className="p-3 border-b border-border">
        <label className="block text-[10px] font-semibold text-text-muted mb-1.5">Select Member</label>
        <select
          value={m.id}
          onChange={e => setSelected(NEXUS_MEMBERS.find(x => x.id === e.target.value)!)}
          className="w-full bg-surface-elevated border border-border rounded-lg px-2 py-1.5 text-xs text-text-primary focus:outline-none focus:border-accent/50"
        >
          {NEXUS_MEMBERS.map(mem => (
            <option key={mem.id} value={mem.id}>@{mem.username} · Lv {mem.level} · {mem.repPoints} rep</option>
          ))}
        </select>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
        {/* member card */}
        <div className="bg-surface-card border border-border rounded-xl p-3">
          <div className="flex items-center gap-3 mb-3">
            <img src={m.avatar} alt={m.username} className="w-10 h-10 rounded-full bg-surface-elevated" />
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-bold text-text-primary">@{m.username}</p>
                <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded border ${cfg.color}`}>{cfg.label}</span>
              </div>
              <p className="text-xs text-text-muted">Lv {m.level} — {m.levelTitle} · {m.daysActive} days active</p>
            </div>
          </div>

          {/* XP bar */}
          <div className="mb-1">
            <div className="flex justify-between text-[10px] text-text-muted mb-1">
              <span>{m.levelTitle}</span>
              <span className="font-semibold text-text-primary">{m.repPoints.toLocaleString()} / {m.repTarget} pts</span>
            </div>
            <div className="w-full h-2 rounded-full bg-surface-elevated overflow-hidden">
              <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
            </div>
            <p className="text-[9px] text-text-muted mt-1">{m.repTarget - m.repPoints} pts to {m.nextLevelTitle}</p>
          </div>
        </div>

        {/* progress path */}
        <div className="bg-surface-card border border-border rounded-xl overflow-hidden">
          <div className="px-3 py-2 border-b border-border flex items-center justify-between">
            <p className="text-xs font-semibold text-text-primary">🗺 Fastest Path to {m.nextLevelTitle}</p>
            <span className="text-[10px] text-accent font-semibold">+{totalPoints} pts total</span>
          </div>
          <div className="divide-y divide-border">
            {m.progressPath.map((step, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2.5">
                <span className="w-5 h-5 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] flex items-center justify-center font-bold shrink-0">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-text-primary font-medium">{step.action}</p>
                  <p className="text-[10px] text-text-muted">⏱ {step.time}</p>
                </div>
                <span className="text-xs font-bold text-accent shrink-0">+{step.points}</span>
              </div>
            ))}
          </div>
          <div className="px-3 py-2 bg-accent/5 border-t border-accent/20">
            <p className="text-[10px] text-accent font-semibold">
              ✅ Complete all steps → {m.nextLevelTitle} unlocked (+{totalPoints} pts)
            </p>
          </div>
        </div>

        {/* DM draft */}
        <div className="bg-surface-card border border-border rounded-xl p-3">
          <p className="text-[10px] font-semibold text-accent mb-2">✉ Personalized DM Draft</p>
          <p className="text-[10px] text-text-muted leading-relaxed mb-3">{m.dmDraft}</p>
          <button className="w-full text-[10px] font-semibold px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/30 text-accent hover:bg-accent/20 transition-colors">
            Send This DM →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const TABS: { key: NexusTab; label: string; icon: string }[] = [
  { key: 'chat',        label: 'Chat',        icon: '💬' },
  { key: 'threads',     label: 'Threads',     icon: '🧵' },
  { key: 'milestones',  label: 'Milestones',  icon: '🏆' },
  { key: 'progression', label: 'Progression', icon: '📈' },
];

export default function CommunityNexus() {
  const [open, setOpen]   = useState(false);
  const [tab, setTab]     = useState<NexusTab>('chat');
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setPulse(false), 4000);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {/* floating button */}
      <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-3">
        {/* tooltip (first-load) */}
        {pulse && !open && (
          <div className="bg-surface-card border border-accent/30 rounded-xl px-3 py-2 shadow-lg text-xs text-text-muted whitespace-nowrap animate-bounce">
            🏛 Community Nexus — 3 threads need attention
          </div>
        )}

        <button
          onClick={() => { setOpen(v => !v); setPulse(false); }}
          className="relative w-12 h-12 rounded-2xl bg-surface-card border border-accent/30 shadow-lg hover:shadow-accent/20 flex items-center justify-center transition-all hover:scale-105 hover:border-accent/50"
          title="Community Nexus"
        >
          <span className="text-xl">🏛</span>
          {!open && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent text-white text-[9px] font-bold flex items-center justify-center">3</span>
          )}
        </button>
      </div>

      {/* panel */}
      {open && (
        <div className="fixed bottom-24 left-6 z-50 w-[380px] max-h-[620px] bg-surface-base border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-surface-card shrink-0">
            <span className="text-lg">🏛</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-text-primary">Community Nexus</p>
              <p className="text-[10px] text-accent">AI Community Co-pilot · 3 threads · 5 milestones</p>
            </div>
            <button onClick={() => setOpen(false)} className="text-text-muted hover:text-text-primary transition-colors text-lg leading-none">×</button>
          </div>

          {/* tab bar */}
          <div className="flex border-b border-border shrink-0">
            {TABS.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex-1 flex flex-col items-center py-2 gap-0.5 text-[9px] font-semibold transition-colors border-b-2 ${
                  tab === t.key
                    ? 'text-accent border-accent'
                    : 'text-text-muted border-transparent hover:text-text-primary'
                }`}
              >
                <span className="text-sm">{t.icon}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </div>

          {/* tab content */}
          <div className="flex-1 min-h-0 overflow-hidden">
            {tab === 'chat'        && <ChatTab />}
            {tab === 'threads'     && <ThreadsTab />}
            {tab === 'milestones'  && <MilestonesTab />}
            {tab === 'progression' && <ProgressionTab />}
          </div>
        </div>
      )}
    </>
  );
}
