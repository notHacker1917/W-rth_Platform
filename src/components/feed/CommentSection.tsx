import { useState } from 'react';
import type { Comment } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { getUserById } from '../../data/mockData';
import Avatar from '../ui/Avatar';
import { formatRelativeTime } from '../../utils/time';

interface CommentSectionProps { comments: Comment[]; onAddComment: (content: string) => void; }

function CommentItem({ comment }: { comment: Comment }) {
  const author = getUserById(comment.authorId);
  if (!author) return null;
  return (
    <div className="flex gap-2.5">
      <Avatar src={author.avatarUrl} alt={author.name} size="sm" />
      <div className="flex-1 min-w-0">
        <div className="bg-surface-base rounded-xl px-3 py-2 border border-border">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-xs font-semibold text-text-primary">{author.name}</span>
            <span className="text-xs text-text-muted">{formatRelativeTime(comment.createdAt)}</span>
          </div>
          <p className="text-sm text-text-primary mt-0.5 leading-relaxed">{comment.content}</p>
        </div>
        {comment.likes > 0 && <p className="text-xs text-text-muted mt-1 ml-3">{comment.likes} likes</p>}
      </div>
    </div>
  );
}

export default function CommentSection({ comments, onAddComment }: CommentSectionProps) {
  const { currentUser } = useAuth();
  const [draft, setDraft] = useState('');

  const handleSubmit = () => {
    const t = draft.trim();
    if (!t) return;
    onAddComment(t);
    setDraft('');
  };

  return (
    <div className="space-y-3 pt-3 border-t border-border">
      {comments.map(c => <CommentItem key={c.id} comment={c} />)}
      {currentUser && (
        <div className="flex gap-2.5">
          <Avatar src={currentUser.avatarUrl} alt={currentUser.name} size="sm" />
          <div className="flex-1 flex items-center gap-2 bg-surface-base rounded-full px-3 pr-1 py-1
                          border border-border focus-within:border-accent transition-colors">
            <input type="text" value={draft} onChange={e => setDraft(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
              placeholder="Write a comment…"
              className="flex-1 text-sm bg-transparent focus:outline-none text-text-primary placeholder-text-muted min-h-[36px]" />
            {draft.trim() && (
              <button onClick={handleSubmit}
                className="shrink-0 p-1.5 rounded-full bg-accent text-text-primary hover:bg-accent-hover transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
