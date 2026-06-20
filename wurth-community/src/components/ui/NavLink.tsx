import Link from 'next/link';
import { useRouter } from 'next/router';
import type { ReactNode } from 'react';

type ActiveState = { isActive: boolean };

interface NavLinkProps {
  href: string;
  /** Match exactly (react-router's `end`). Use for the "/" home link. */
  end?: boolean;
  className?: string | ((state: ActiveState) => string);
  children?: ReactNode | ((state: ActiveState) => ReactNode);
  title?: string;
}

/**
 * Drop-in replacement for react-router-dom's <NavLink>, backed by next/link.
 * Differences vs react-router:
 *   - prop is `href` (not `to`)
 * Everything else (function className, function children, `end`) is the same,
 * so your SideNav / MobileNav only need the import + `to`->`href` swap.
 */
export default function NavLink({
  href,
  end = false,
  className,
  children,
  title,
}: NavLinkProps) {
  const router = useRouter();
  const path = router.asPath.split('?')[0].split('#')[0];

  const isActive = end
    ? path === href
    : path === href || path.startsWith(href.endsWith('/') ? href : href + '/');

  const cls = typeof className === 'function' ? className({ isActive }) : className;
  const content = typeof children === 'function' ? children({ isActive }) : children;

  return (
    <Link href={href} className={cls} title={title}>
      {content}
    </Link>
  );
}
