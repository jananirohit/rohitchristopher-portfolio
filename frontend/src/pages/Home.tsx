import { useLayoutEffect, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { Button } from '../ui';
import { portfolioMarkup, portfolioDestinations, type DestinationId } from '../portfolio.destinations';
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
export function Home({ destination = 'home' }: { destination?: DestinationId }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const surface = useRef<HTMLDivElement>(null);
  const markup = useMemo(() => portfolioMarkup(destination), [destination]);
  const initialDestination = useRef(true);
  useLayoutEffect(() => {
    if (!surface.current) return;
    const cleanup = enhancePortfolio(surface.current, path => navigate(path));
    window.scrollTo({ top: 0, behavior: 'instant' });
    const entry = portfolioDestinations.find(item => item.id === destination)!;
    document.title = `${entry.label} — Rohit Christopher John`;
    if (!initialDestination.current) {
      const heading = surface.current.querySelector<HTMLElement>('main h1');
      heading?.setAttribute('tabindex', '-1');
      heading?.focus({ preventScroll: true });
    }
    initialDestination.current = false;
    return cleanup;
  }, [destination, navigate]);
  return (
    <>
      <a data-lg-key="863f90939d" className="portfolio-skip" href="#main-content">Skip to content</a>
      <div data-lg-key="4bd72ba001" key={destination} ref={surface} className={`rcj-portfolio destination-${destination}`} dangerouslySetInnerHTML={{ __html: markup }} />
      {user && (
        <aside data-lg-key="1db451d150" className="portfolio-session" aria-label="Account session">
          <span data-lg-key="375378220a">Signed in as {user.email}</span>
          <Button asChild variant="outline"><Link to="/dashboard">Open the app</Link></Button>
        </aside>
      )}
    </>
  );
}
