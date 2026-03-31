'use client';

import css from './Header.module.css';
import Link from 'next/link';
import AuthNavigation from '../AuthNavigation/AuthNavigation';
import { useAuthStore } from '@/lib/store/authStore';

export default function Header() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  return (
    <header className={css.header}>
      <Link className={css.headerLink} href="/" aria-label="Home">
        NoteHub
      </Link>
      <nav aria-label="Main Navigation">
        <ul className={css.navigation}>
          <li className={css.navigationItem}>
                <Link className={css.navigationLink} href="/">Home</Link>
              </li>
          {isAuthenticated && (
            <>
              
              <li className={css.navigationItem}>
                <Link className={css.navigationLink} href="/notes/filter/all">Notes</Link>
              </li>
            </>
          )}

          <AuthNavigation />
        </ul>
      </nav>
    </header>
  );
}
