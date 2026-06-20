import { useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { usePosts } from '../hooks/usePosts';
import { getUserById } from '../data/mockData';
import ComposeBox from '../components/feed/ComposeBox';
import PostCard from '../components/feed/PostCard';
import FeedFilter, { type FeedFilterValue } from '../components/feed/FeedFilter';

interface OutletCtx { searchQuery: string; }

export default function Feed() {
  const { searchQuery } = useOutletContext<OutletCtx>();
  const { posts, addPost, toggleLike, addComment, incrementShares } = usePosts();
  const [filter, setFilter] = useState<FeedFilterValue>('all');

  const filteredPosts = useMemo(() => {
    let result = posts;
    if (filter !== 'all') result = result.filter(p => { const a = getUserById(p.authorId); return a?.role === filter; });
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => { const a = getUserById(p.authorId); return p.content.toLowerCase().includes(q) || a?.name.toLowerCase().includes(q) || p.tags?.some(t => t.toLowerCase().includes(q)); });
    }
    return result;
  }, [posts, filter, searchQuery]);

  return (
    <div className="space-y-3 pb-20 lg:pb-6">
      <FeedFilter value={filter} onChange={setFilter} />
      <ComposeBox onPost={addPost} />
      {filteredPosts.length === 0 ? (
        <div className="bg-surface-card border border-border rounded-xl p-12 text-center">
          <p className="text-2xl mb-2">🔍</p>
          <p className="font-medium text-text-primary">No posts found</p>
          <p className="text-sm text-text-muted mt-1">{searchQuery ? `No results for "${searchQuery}"` : 'Be the first to post something.'}</p>
        </div>
      ) : filteredPosts.map(post => (
        <PostCard key={post.id} post={post} onLike={toggleLike} onShare={incrementShares} onAddComment={addComment} />
      ))}
    </div>
  );
}
