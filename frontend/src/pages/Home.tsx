import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { Button } from '../ui';
import originalMarkup from '../portfolio.original.html?raw';
import { enhancePortfolio } from '../portfolio.enhance';
import '../portfolio.css';

// Auth-DORMANT, not auth-blind. Two constraints hold at once here:
//
//  1. An app that never asked for accounts must not ship a sign-in entry point.
//     Nothing below renders a "Sign in" link — when there is no user (which is
//     always, until auth is activated) this page is exactly the starter page it
//     was before.
//
//  2. A SIGNED-IN visitor must be able to tell, and get back into the app. The
//     post-login redirect lands on `/` (server.go), and this page renders OUTSIDE
//     <Layout>, so it is the only thing that can show that state — without the
//     `useAuth()` read below, signing in and not signing in look identical and
//     the user is left on a marketing page with no way forward. Measured on app
//     722: sign-in succeeded, a real session was issued, and the user reported it
//     as broken because nothing on screen changed.
//
// Rebuilding this page? Keep the signed-in branch. Point it at whatever this app's
// primary signed-in surface actually is.
export function Home() {
  const { user } = useAuth();
  const surface = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!surface.current) return;
    return enhancePortfolio(surface.current);
  }, []);
  return (
    <>
      <a data-lg-key="863f90939d" className="portfolio-skip" href="#main-content">Skip to content</a>
      <div data-lg-key="4bd72ba001" ref={surface} className="rcj-portfolio" dangerouslySetInnerHTML={{ __html: originalMarkup }} />
      {user && (
        <aside data-lg-key="1db451d150" className="portfolio-session" aria-label="Account session">
          <span data-lg-key="375378220a">Signed in as {user.email}</span>
          <Button asChild variant="outline"><Link to="/dashboard">Open the app</Link></Button>
        </aside>
      )}
    </>
  );
}
