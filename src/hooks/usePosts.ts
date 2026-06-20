import { useState, useCallback } from 'react';
import type { Post, Comment } from '../types';
import { MOCK_POSTS } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export function usePosts() {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);

  const addPost = useCallback(
    (partial: Omit<Post, 'id' | 'authorId' | 'likes' | 'likedBy' | 'comments' | 'shares' | 'createdAt'>) => {
      if (!currentUser) return;
      const newPost: Post = {
        id: generateId('p'),
        authorId: currentUser.id,
        likes: 0,
        likedBy: [],
        comments: [],
        shares: 0,
        createdAt: new Date().toISOString(),
        ...partial,
      };
      setPosts(prev => [newPost, ...prev]);
    },
    [currentUser],
  );

  const toggleLike = useCallback(
    (postId: string) => {
      if (!currentUser) return;
      setPosts(prev =>
        prev.map(p => {
          if (p.id !== postId) return p;
          const liked = p.likedBy.includes(currentUser.id);
          return {
            ...p,
            likes: liked ? p.likes - 1 : p.likes + 1,
            likedBy: liked
              ? p.likedBy.filter(id => id !== currentUser.id)
              : [...p.likedBy, currentUser.id],
          };
        }),
      );
    },
    [currentUser],
  );

  const addComment = useCallback(
    (postId: string, content: string) => {
      if (!currentUser) return;
      const newComment: Comment = {
        id: generateId('c'),
        authorId: currentUser.id,
        content,
        createdAt: new Date().toISOString(),
        likes: 0,
      };
      setPosts(prev =>
        prev.map(p =>
          p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p,
        ),
      );
    },
    [currentUser],
  );

  const incrementShares = useCallback((postId: string) => {
    setPosts(prev =>
      prev.map(p => (p.id === postId ? { ...p, shares: p.shares + 1 } : p)),
    );
  }, []);

  return { posts, addPost, toggleLike, addComment, incrementShares };
}
