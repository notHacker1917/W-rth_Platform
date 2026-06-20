import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Post } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { getUserById } from '../../data/mockData';
import Avatar from '../ui/Avatar';
import RoleBadge from '../ui/RoleBadge';
import LinkPreview from './LinkPreview';
import CommentSection from './CommentSection';
import { formatRelativeTime, formatFullDate } from '../../utils/time';

interface PostCardProps { post: Post; onLike: (id: string) => void; onShare: (id: string) => void; onAddComment: (id: string, c: string) => void; }

function ActionButton({ icon, label, count, active, activeClass, onClick }: { icon: React.ReactNode; label: string; count?: number; active?: boolean; activeClass?: string; onClick: () => void; }) {
  return (
    <button onClick={onClick} aria-label={label}
      className={['flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors min-h-[44px] select-none',
        active ? activeClass ?? 'text-accent bg-accent-deepest' : 'text-text-muted hover:text-text-primary hover:bg-surface-elevated'].join(' ')}>
      {icon}
      {count !== undefined && count > 0 && <span className="tabular-nums">{count >= 1000 ? `${(count/1000).toFixed(1)}k` : count}</span>}
      <span className="sr-only sm:not-sr-only">{label}</span>
    </button>
  );
}

export default function PostCard({ post, onLike, onShare, onAddComment }: PostCardProps) {
  const { currentUser } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [shareFlash, setShareFlash] = useState(false);
  const author = getUserById(post.authorId);
  if (!author) return null;

  const isLiked = currentUser ? post.likedBy.includes(currentUser.id) : false;
  const handleShare = () => { onShare(post.id); setShareFlash(true); setTimeout(() => setShareFlash(false), 1500); };
  const renderContent = (text: string) => text.split('\n').map((line, i) => <span key={i}>{line}{i < text.split('\n').length - 1 && <br />}</span>);

  return (
    <article className="bg-surface-card border border-border rounded-xl overflow-hidden hover:border-surface-elevated transition-all hover:shadow-sm hover:shadow-black/40">
      <div className="flex items-start gap-3 p-4 pb-3">
        <Link to={`/profile/${author.id}`} className="shrink-0"><Avatar src={author.avatarUrl} alt={author.name} size="md" /></Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-x-2 gap-y-0.5">
            <Link to={`/profile/${author.id}`} className="text-sm font-semibold text-text-primary hover:text-accent transition-colors truncate">{author.name}</Link>
            <RoleBadge role={author.role} />
          </div>
          <p className="text-xs text-text-muted truncate mt-0.5">{author.headline}</p>
          <time dateTime={post.createdAt} title={formatFullDate(post.createdAt)} className="text-xs text-text-muted">{formatRelativeTime(post.createdAt)}</time>
        </div>
        <button className="p-2 rounded-full text-text-muted hover:text-text-primary hover:bg-surface-elevated transition-colors shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label="More options">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
        </button>
      </div>

      <div className="px-4 pb-3">
        <p className="text-sm text-text-primary leading-relaxed">{renderContent(post.content)}</p>
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {post.tags.map(tag => <span key={tag} className="text-xs text-accent hover:text-[#f2a0a0] cursor-pointer transition-colors">#{tag}</span>)}
          </div>
        )}
        {post.type === 'image' && post.imageUrl && (
          <div className="mt-3 rounded-xl overflow-hidden border border-border bg-surface-base">
            <img src={post.imageUrl} alt="Post image" className="w-full max-h-80 object-cover" loading="lazy" />
          </div>
        )}
        {post.type === 'link' && post.linkPreview && <LinkPreview data={post.linkPreview} />}
      </div>

      {(post.likes > 0 || post.comments.length > 0 || post.shares > 0) && (
        <div className="px-4 py-1.5 flex items-center gap-3 border-t border-border">
          {post.likes > 0 && <span className="text-xs text-text-muted"><span className="mr-0.5">❤️</span>{post.likes.toLocaleString()}</span>}
          {post.comments.length > 0 && <button onClick={() => setShowComments(v => !v)} className="text-xs text-text-muted hover:text-accent transition-colors ml-auto">{post.comments.length} comment{post.comments.length !== 1 ? 's' : ''}</button>}
          {post.shares > 0 && <span className="text-xs text-text-muted">{post.shares} shares</span>}
        </div>
      )}

      <div className="px-2 py-1 border-t border-border flex items-center justify-around">
        <ActionButton icon={<svg className="w-4 h-4" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>}
          label="Like" count={post.likes} active={isLiked} activeClass="text-accent bg-accent-deepest" onClick={() => onLike(post.id)} />
        <ActionButton icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>}
          label="Comment" count={post.comments.length} active={showComments} onClick={() => setShowComments(v => !v)} />
        <ActionButton icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>}
          label={shareFlash ? 'Shared!' : 'Share'} count={post.shares} active={shareFlash} activeClass="text-status-success bg-surface-elevated" onClick={handleShare} />
      </div>

      {showComments && (
        <div className="px-4 pb-4">
          <CommentSection comments={post.comments} onAddComment={(content) => onAddComment(post.id, content)} />
        </div>
      )}
    </article>
  );
}
