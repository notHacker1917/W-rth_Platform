import { useState, useRef } from 'react';
import type { Post, PostType } from '../../types';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../ui/Avatar';

interface ComposeBoxProps {
  onPost: (post: Omit<Post, 'id' | 'authorId' | 'likes' | 'likedBy' | 'comments' | 'shares' | 'createdAt'>) => void;
}

export default function ComposeBox({ onPost }: ComposeBoxProps) {
  const { currentUser } = useAuth();
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [mode, setMode] = useState<'text' | 'image' | 'link'>('text');
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  if (!currentUser) return null;

  const handleSubmit = () => {
    const trimmed = content.trim();
    if (!trimmed) return;
    let type: PostType = 'text';
    let extra: Partial<Post> = {};
    if (mode === 'image' && imageUrl.trim()) { type = 'image'; extra = { imageUrl: imageUrl.trim() }; }
    else if (mode === 'link' && linkUrl.trim()) { type = 'link'; extra = { linkPreview: { url: linkUrl.trim(), title: 'Shared Link', description: linkUrl.trim() } }; }
    onPost({ type, content: trimmed, ...extra });
    setContent(''); setImageUrl(''); setLinkUrl(''); setMode('text'); setFocused(false);
  };

  const charCount = content.length;
  const maxChars = 500;
  const isOverLimit = charCount > maxChars;
  const canPost = content.trim().length > 0 && !isOverLimit;

  return (
    <div className={`bg-surface-card border rounded-xl transition-shadow ${focused ? 'border-accent shadow-md shadow-accent/10' : 'border-border'}`}>
      <div className="p-4">
        <div className="flex gap-3">
          <Avatar src={currentUser.avatarUrl} alt={currentUser.name} size="md" />
          <div className="flex-1 min-w-0">
            <textarea ref={textareaRef} value={content} onChange={e => setContent(e.target.value)}
              onFocus={() => setFocused(true)} rows={focused ? 3 : 2}
              placeholder={currentUser.role === 'company' ? "Share an update, announce a role, or start a conversation…" : "Share a project, insight, or what you're working on…"}
              className="w-full resize-none text-sm text-text-primary placeholder-text-muted bg-transparent focus:outline-none leading-relaxed" />
            {focused && mode === 'image' && (
              <input type="url" placeholder="Paste an image URL…" value={imageUrl} onChange={e => setImageUrl(e.target.value)}
                className="mt-2 w-full text-sm border border-border rounded-lg px-3 py-2 bg-surface-base text-text-primary placeholder-text-muted focus:outline-none focus:border-accent" />
            )}
            {focused && mode === 'link' && (
              <input type="url" placeholder="Paste a link URL…" value={linkUrl} onChange={e => setLinkUrl(e.target.value)}
                className="mt-2 w-full text-sm border border-border rounded-lg px-3 py-2 bg-surface-base text-text-primary placeholder-text-muted focus:outline-none focus:border-accent" />
            )}
          </div>
        </div>
      </div>
      {focused && (
        <div className="border-t border-border px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1">
            <button onClick={() => setMode(mode === 'image' ? 'text' : 'image')} title="Add image"
              className={`p-2 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${mode === 'image' ? 'bg-accent-deepest text-[#f2a0a0]' : 'text-text-muted hover:text-text-primary hover:bg-surface-elevated'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </button>
            <button onClick={() => setMode(mode === 'link' ? 'text' : 'link')} title="Add link"
              className={`p-2 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${mode === 'link' ? 'bg-accent-deepest text-[#f2a0a0]' : 'text-text-muted hover:text-text-primary hover:bg-surface-elevated'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
            </button>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-xs tabular-nums ${isOverLimit ? 'text-status-error font-medium' : charCount > maxChars * 0.8 ? 'text-status-warn' : 'text-text-muted'}`}>{charCount}/{maxChars}</span>
            <button onClick={() => { setFocused(false); setContent(''); setMode('text'); }}
              className="text-sm text-text-muted hover:text-text-primary px-3 py-2 rounded-lg hover:bg-surface-elevated transition-colors min-h-[44px]">Cancel</button>
            <button onClick={handleSubmit} disabled={!canPost}
              className="text-sm font-semibold px-4 py-2 rounded-lg transition-colors min-h-[44px] bg-accent text-text-primary hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed">Post</button>
          </div>
        </div>
      )}
    </div>
  );
}
