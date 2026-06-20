import { useState } from 'react';

interface AvatarProps { src: string; alt: string; size?: 'sm' | 'md' | 'lg' | 'xl'; className?: string; }
const SIZE_MAP = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base', xl: 'w-16 h-16 text-lg' };

export default function Avatar({ src, alt, size = 'md', className = '' }: AvatarProps) {
  const [errored, setErrored] = useState(false);
  const initials = alt.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();

  if (errored) {
    return (
      <div className={`${SIZE_MAP[size]} rounded-full bg-accent-deepest flex items-center justify-center
                       font-semibold text-[#f2a0a0] shrink-0 ring-1 ring-accent-deep ${className}`}>
        {initials}
      </div>
    );
  }
  return (
    <img src={src} alt={alt} onError={() => setErrored(true)}
         className={`${SIZE_MAP[size]} rounded-full object-cover bg-surface-elevated shrink-0 ring-1 ring-border ${className}`} />
  );
}
