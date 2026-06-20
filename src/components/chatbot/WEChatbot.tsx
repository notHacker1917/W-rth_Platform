import { useState, useRef, useEffect, useCallback } from 'react';
import {
  WE_FAQ, WE_TRENDING_TAGS, WE_FEED_ITEMS, searchFeed,
  WE_NEWS, WE_PRODUCTS, WE_EVENTS,
} from '../../data/weFeed';
import type { WEFeedItem } from '../../data/weFeed';

// ─── Types ─────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: 'user' | 'bot';
  text: string;
  items?: WEFeedItem[];
  suggestions?: string[];
  timestamp: Date;
}

// ─── Feed Item Card (inline preview) ──────────────────────────────────────

function FeedItemPreview({ item }: { item: WEFeedItem }) {
  const CAT_COLOR: Record<string, string> = {
    product:  'bg-accent/10 text-[#f2a0a0] border-accent/20',
    service:  'bg-blue-500/10 text-blue-400 border-blue-400/20',
    news:     'bg-green-500/10 text-green-400 border-green-400/20',
    blog:     'bg-purple-500/10 text-purple-400 border-purple-400/20',
    event:    'bg-orange-500/10 text-orange-400 border-orange-400/20',
    career:   'bg-yellow-500/10 text-yellow-400 border-yellow-400/20',
  };
  const CAT_ICON: Record<string, string> = {
    product: '🔩', service: '🛠', news: '📰', blog: '✍️', event: '📅', career: '💼',
  };

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex gap-3 p-2.5 rounded-lg bg-surface-base border border-border hover:border-accent/30 transition-colors group"
    >
      {item.image && (
        <img
          src={item.image}
          alt={item.title}
          className="w-14 h-14 rounded-md object-cover shrink-0"
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
        />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1">
          <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border ${CAT_COLOR[item.category]}`}>
            {CAT_ICON[item.category]} {item.category}
          </span>
          <span className="text-[10px] text-text-muted ml-auto">▲ {item.upvotes}</span>
        </div>
        <p className="text-xs font-semibold text-text-primary leading-snug group-hover:text-accent transition-colors line-clamp-2">
          {item.title}
        </p>
        <p className="text-[10px] text-text-muted mt-0.5 line-clamp-2">{item.summary}</p>
        <div className="flex gap-1 mt-1 flex-wrap">
          {item.tags.slice(0, 3).map(t => (
            <span key={t} className="text-[9px] px-1 py-0.5 rounded bg-surface-elevated border border-border text-text-muted">{t}</span>
          ))}
        </div>
      </div>
    </a>
  );
}

// ─── Suggestion Chip ───────────────────────────────────────────────────────

function SuggestionChip({ text, onClick }: { text: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-xs px-2.5 py-1.5 rounded-lg border border-accent/30 text-accent bg-accent/5 hover:bg-accent/15 transition-colors text-left leading-snug"
    >
      {text}
    </button>
  );
}

// ─── Trending Bar ──────────────────────────────────────────────────────────

function TrendingBar({ onTagClick }: { onTagClick: (tag: string) => void }) {
  return (
    <div className="px-3 py-2 border-b border-border bg-surface-elevated">
      <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1.5">🔥 Trending</p>
      <div className="flex gap-1.5 flex-wrap">
        {WE_TRENDING_TAGS.slice(0, 8).map(tag => (
          <button
            key={tag}
            onClick={() => onTagClick(tag)}
            className="text-[10px] px-1.5 py-0.5 rounded-md bg-surface-card border border-border text-text-muted hover:text-accent hover:border-accent/30 transition-colors"
          >
            #{tag}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Bot logic ─────────────────────────────────────────────────────────────

function generateBotResponse(query: string): Message {
  const q  = query.trim();
  const id = `bot-${Date.now()}`;

  // Greetings
  if (/^(hi|hello|hey|hiya|good\s*(morning|afternoon|evening))/i.test(q)) {
    return {
      id, role: 'bot', timestamp: new Date(),
      text: "Hi there! 👋 I'm the **Würth Elektronik assistant**. I can help you explore products, news, seminars, events, and more from the WE feed. What would you like to know?",
      suggestions: [
        'What new products are available?',
        'Are there free seminars?',
        'Show me the latest news',
        'What events are coming up?',
      ],
    };
  }

  // Thanks
  if (/^(thanks|thank you|thx|cheers|great)/i.test(q)) {
    return {
      id, role: 'bot', timestamp: new Date(),
      text: "You're welcome! 😊 Let me know if there's anything else you'd like to know about Würth Elektronik.",
      suggestions: [
        'Show me EMC products',
        'Tell me about PCB services',
        'What career opportunities exist?',
      ],
    };
  }

  // Overview / catch-all
  if (/^(what|who|tell me about|overview|explain)/i.test(q) && q.length < 25) {
    const total   = WE_FEED_ITEMS.length;
    const products = WE_PRODUCTS.length;
    const events  = WE_EVENTS.length;
    return {
      id, role: 'bot', timestamp: new Date(),
      text: `Würth Elektronik is a leading manufacturer of electronic and electromechanical components, PCBs, and intelligent systems. I have **${total} items** in the live feed — including **${products} products**, **${events} events**, news, blogs, and services. What would you like to explore?`,
      suggestions: WE_FAQ.slice(0, 4).map(f => f.question),
    };
  }

  // Actual search
  const { items, matchedFaq, confidence } = searchFeed(q);

  if (confidence === 'low' || items.length === 0) {
    // Fall back to showing the FAQ list
    return {
      id, role: 'bot', timestamp: new Date(),
      text: "I didn't find a strong match for that — but here are some things I can help with:",
      suggestions: WE_FAQ.slice(0, 5).map(f => f.question),
    };
  }

  const intro = matchedFaq?.answerIntro ??
    `Here's what I found in the Würth Elektronik feed for "${q}":`;

  const followUps = WE_FAQ
    .filter(f => f !== matchedFaq)
    .slice(0, 3)
    .map(f => f.question);

  return {
    id, role: 'bot', timestamp: new Date(),
    text: intro,
    items,
    suggestions: followUps,
  };
}

// ─── Message Bubble ────────────────────────────────────────────────────────

function parseMarkdown(text: string) {
  // Bold: **text**
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    /^\*\*(.+)\*\*$/.test(part)
      ? <strong key={i} className="text-text-primary">{part.slice(2, -2)}</strong>
      : <span key={i}>{part}</span>
  );
}

function MessageBubble({ msg, onSuggestion }: { msg: Message; onSuggestion: (s: string) => void }) {
  const isBot = msg.role === 'bot';
  return (
    <div className={`flex gap-2 ${isBot ? '' : 'flex-row-reverse'}`}>
      {isBot && (
        <div className="w-7 h-7 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center shrink-0 mt-0.5 text-sm">
          🤖
        </div>
      )}
      <div className={`max-w-[85%] space-y-2 ${isBot ? '' : 'items-end flex flex-col'}`}>
        {/* text bubble */}
        <div className={`px-3 py-2 rounded-2xl text-xs leading-relaxed ${
          isBot
            ? 'bg-surface-elevated border border-border text-text-primary rounded-tl-sm'
            : 'bg-accent text-white rounded-tr-sm'
        }`}>
          {parseMarkdown(msg.text)}
        </div>

        {/* item previews */}
        {isBot && msg.items && msg.items.length > 0 && (
          <div className="space-y-1.5 w-full">
            {msg.items.map(item => (
              <FeedItemPreview key={item.id} item={item} />
            ))}
          </div>
        )}

        {/* suggestion chips */}
        {isBot && msg.suggestions && msg.suggestions.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {msg.suggestions.map(s => (
              <SuggestionChip key={s} text={s} onClick={() => onSuggestion(s)} />
            ))}
          </div>
        )}

        <p className="text-[9px] text-text-muted px-1">{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
      </div>
    </div>
  );
}

// ─── Quick Stats Bar (shown in welcome) ────────────────────────────────────

function StatsBar() {
  return (
    <div className="grid grid-cols-3 gap-1.5 px-3 py-2 border-b border-border">
      {[
        { icon: '🔩', label: 'Products',  value: WE_PRODUCTS.length },
        { icon: '📰', label: 'News',       value: WE_NEWS.length    },
        { icon: '📅', label: 'Events',     value: WE_EVENTS.length  },
      ].map(s => (
        <div key={s.label} className="text-center py-1.5 rounded-lg bg-surface-base border border-border">
          <p className="text-base">{s.icon}</p>
          <p className="text-xs font-bold text-text-primary">{s.value}</p>
          <p className="text-[9px] text-text-muted">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Main Chatbot Component ────────────────────────────────────────────────

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'bot',
  timestamp: new Date(),
  text: "Hello! 👋 I'm your **Würth Elektronik** assistant. Ask me anything about products, news, free seminars, events, or career opportunities — I'll search the live feed and show you exactly what you need.",
  suggestions: [
    'What new products are available?',
    'Are there free seminars I can attend?',
    'What\'s happening at PCIM 2026?',
    'Tell me about EMI shielding products',
    'Show me PCB manufacturing services',
  ],
};

export default function WEChatbot() {
  const [open,     setOpen]     = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input,    setInput]    = useState('');
  const [typing,   setTyping]   = useState(false);
  const [unread,   setUnread]   = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const sendMessage = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setInput('');

    const userMsg: Message = {
      id: `user-${Date.now()}`, role: 'user', timestamp: new Date(), text: trimmed,
    };
    setMessages(prev => [...prev, userMsg]);
    setTyping(true);

    setTimeout(() => {
      const botMsg = generateBotResponse(trimmed);
      setMessages(prev => [...prev, botMsg]);
      setTyping(false);
      if (!open) setUnread(u => u + 1);
    }, 600 + Math.random() * 400);
  }, [open]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const clearChat = () => {
    setMessages([WELCOME_MESSAGE]);
  };

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setOpen(v => !v)}
        className="fixed bottom-20 lg:bottom-6 right-4 lg:right-6 z-50 w-14 h-14 rounded-full bg-accent shadow-lg flex items-center justify-center hover:bg-accent-deep transition-colors group"
        title="Würth Elektronik Assistant"
      >
        <span className="text-2xl">{open ? '✕' : '🤖'}</span>
        {unread > 0 && !open && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-status-error text-white text-[10px] font-bold flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-36 lg:bottom-24 right-0 lg:right-6 z-50 w-full lg:w-[360px] max-w-sm mx-auto lg:mx-0 max-h-[70vh] lg:max-h-[600px] flex flex-col rounded-none lg:rounded-2xl shadow-2xl border-t lg:border border-border bg-surface-card overflow-hidden"
             style={{ left: 'env(safe-area-inset-left)', right: 'env(safe-area-inset-right)' }}>
          {/* header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-surface-elevated border-b border-border">
            <span className="text-xl">🤖</span>
            <div className="flex-1">
              <p className="text-sm font-bold text-text-primary">WE Assistant</p>
              <p className="text-[10px] text-status-success flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-status-success inline-block" />
                Live feed · {WE_FEED_ITEMS.length} items indexed
              </p>
            </div>
            <button
              onClick={clearChat}
              title="Clear chat"
              className="text-xs text-text-muted hover:text-text-primary transition-colors px-1.5"
            >
              ↺
            </button>
            <button onClick={() => setOpen(false)} className="text-text-muted hover:text-text-primary transition-colors">✕</button>
          </div>

          {/* stats */}
          <StatsBar />

          {/* trending */}
          <TrendingBar onTagClick={sendMessage} />

          {/* messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 min-h-0">
            {messages.map(msg => (
              <MessageBubble key={msg.id} msg={msg} onSuggestion={sendMessage} />
            ))}
            {typing && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center shrink-0 text-sm">🤖</div>
                <div className="px-3 py-2 rounded-2xl rounded-tl-sm bg-surface-elevated border border-border">
                  <div className="flex gap-1 items-center h-4">
                    {[0, 1, 2].map(i => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* FAQ shortcuts */}
          <div className="px-3 py-2 border-t border-border bg-surface-elevated">
            <p className="text-[9px] font-semibold text-text-muted uppercase tracking-wider mb-1.5">💬 Most Asked</p>
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {WE_FAQ.slice(0, 5).map(faq => (
                <button
                  key={faq.question}
                  onClick={() => sendMessage(faq.question)}
                  className="text-[10px] px-2 py-1 rounded-lg bg-surface-card border border-border text-text-muted hover:text-accent hover:border-accent/30 transition-colors whitespace-nowrap shrink-0"
                >
                  {faq.question}
                </button>
              ))}
            </div>
          </div>

          {/* input */}
          <div className="px-3 py-2.5 border-t border-border flex gap-2 items-center">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about products, events, news…"
              className="flex-1 bg-surface-elevated border border-border rounded-xl px-3 py-2 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || typing}
              className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white disabled:opacity-40 hover:bg-accent-deep transition-colors shrink-0"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
