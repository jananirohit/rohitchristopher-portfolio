import { portfolioConfig } from './portfolio.config';

// The published portfolio's original section DOM and wording are preserved.
// This layer enhances that interface; it does not recreate career content.
export function enhancePortfolio(root: HTMLElement, navigate: (path: string) => void) {
  const cleanup: (() => void)[] = [];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const select = <T extends Element = HTMLElement>(selector: string) => root.querySelector<T>(selector);
  const all = <T extends Element = HTMLElement>(selector: string) => [...root.querySelectorAll<T>(selector)];
  const listen = (target: EventTarget, type: string, handler: EventListener, options?: AddEventListenerOptions) => {
    target.addEventListener(type, handler, options);
    cleanup.push(() => target.removeEventListener(type, handler, options));
  };
  const text = (tag: string, className: string, value: string) => {
    const element = document.createElement(tag);
    element.className = className;
    element.textContent = value;
    return element;
  };
  all('section').forEach(section => section.classList.add('portfolio-chapter'));
  select('main')?.setAttribute('id', 'main-content');
  const header = select('header');
  const nav = select<HTMLElement>('header nav');
  const menu = select<HTMLButtonElement>('header button');
  if (header && nav && menu) {
    nav.id = 'portfolio-navigation';
    menu.setAttribute('aria-controls', nav.id);
    const setMenu = (open: boolean) => {
      header.classList.toggle('menu-open', open);
      menu.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    };
    listen(menu, 'click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
    listen(nav, 'click', event => {
      if ((event.target as Element).closest('a')) setMenu(false);
    });
    listen(document, 'keydown', event => {
      if ((event as KeyboardEvent).key === 'Escape' && header.classList.contains('menu-open')) {
        setMenu(false);
        menu.focus();
      }
    });
    listen(document, 'pointerdown', event => {
      if (!header.contains(event.target as Node)) setMenu(false);
    });
  }
  // Delegated navigation retains genuine URLs, new-tab gestures, and back/forward.
  listen(root, 'click', event => {
    const mouse = event as MouseEvent;
    if (mouse.button !== 0 || mouse.metaKey || mouse.ctrlKey || mouse.shiftKey || mouse.altKey) return;
    const anchor = (event.target as Element).closest<HTMLAnchorElement>('a[href]');
    const path = anchor?.getAttribute('href');
    if (!path?.startsWith('/') || anchor?.target === '_blank' || anchor?.hasAttribute('download')) return;
    event.preventDefault();
    navigate(path);
  });

  const hero = select<HTMLElement>('#home');
  if (hero) {
    const footer = text('div', 'hero-footnote', 'People Management / Process Excellence / Quality & Operations');
    const scroll = document.createElement('a');
    scroll.href = '/about';
    scroll.className = 'hero-scroll';
    scroll.textContent = 'A little about me ↗';
    footer.append(scroll);
    hero.append(footer);
  }

  const aboutParagraphs = all<HTMLElement>('#about p');
  aboutParagraphs.forEach(paragraph => {
    if (paragraph.textContent?.startsWith('Today I lead')) {
      paragraph.textContent = 'My experience spans quality, process and assessment operations — bringing the same frontline curiosity to every workflow I touch.';
    }
  });
  const about = select<HTMLElement>('#about .section-inner');
  if (about) {
    const path = text('div', 'about-progression', '');
    ['Operations', 'Quality', 'Process Excellence', 'People Leadership', 'Operational Transformation'].forEach((name, index) => {
      if (index) path.append(text('span', 'progression-arrow', '→'));
      path.append(text('span', 'progression-label', name));
    });
    path.setAttribute('aria-label', 'Career progression');
    about.append(path);
  }

  const journey = select<HTMLElement>('#journey');
  const milestoneButtons = all<HTMLButtonElement>('#journey button');
  const stages = ['Experience', 'Responsibility', 'Leadership', 'Process ownership', 'Transformation'];
  const years = ['2016', '2018', '2020', '2023', '2025'];
  milestoneButtons.forEach((button, index) => {
    button.classList.add('milestone-control');
    button.parentElement?.classList.add('milestone');
    const year = button.querySelector<HTMLElement>('span.font-display');
    year?.classList.add('milestone-year');
    if (year) year.setAttribute('data-stage', stages[index]);
    if (index === 1) button.querySelector('h3')!.textContent = 'Shift Lead – Operations & People Management';
    if (index === 4) button.querySelector('h3')!.textContent = 'Team Lead – Assessments & Proctoring';
  });
  const journeyContainer = journey?.querySelector<HTMLElement>('.relative.mt-20');
  if (journeyContainer) {
    journeyContainer.classList.add('career-timeline');
    const rails = [...journeyContainer.children].filter(child => child.classList.contains('absolute'));
    rails[0]?.classList.add('timeline-rail');
    rails[1]?.classList.add('timeline-fill');
    const continuation = document.createElement('a');
    continuation.href = '/whats-next';
    continuation.className = 'timeline-continuation';
    continuation.append(text('strong', '', '2026 →'), text('span', '', 'The journey continues. Explore what’s next ↗'));
    journeyContainer.append(continuation);
  }

  const setupDisclosure = (button: HTMLButtonElement, panel: HTMLElement, id: string) => {
    button.setAttribute('aria-controls', id);
    panel.id = id;
    panel.classList.add('disclosure-panel');
    const setOpen = (open: boolean) => {
      button.setAttribute('aria-expanded', String(open));
      button.classList.toggle('is-open', open);
      panel.hidden = !open;
      panel.classList.toggle('is-open', open);
    };
    setOpen(button.getAttribute('aria-expanded') === 'true');
    listen(button, 'click', () => setOpen(button.getAttribute('aria-expanded') !== 'true'));
  };
  milestoneButtons.forEach((button, index) => {
    const panel = button.querySelector<HTMLElement>('div.grid');
    if (panel) setupDisclosure(button, panel, `milestone-${years[index]}-detail`);
  });
  all<HTMLButtonElement>('#projects button').forEach((button, index) => {
    const panel = button.nextElementSibling as HTMLElement | null;
    if (panel) setupDisclosure(button, panel, `case-study-${index + 1}`);
  });
  all<HTMLButtonElement>('#experience button').forEach((button, index) => {
    const panel = button.querySelector<HTMLElement>('div.grid');
    if (panel) setupDisclosure(button, panel, `experience-${index + 1}-detail`);
    const date = [...button.querySelectorAll('span')].find(span => span.textContent?.includes('— Now'));
    if (date) date.textContent = '2025';
    const roleDescription = button.querySelector<HTMLElement>('div.grid p');
    if (index === 0 && roleDescription) roleDescription.textContent = 'Led assessment operations — people, process and performance coming together in one role.';
    button.classList.add('experience-control');
  });

  const expertise = all<HTMLElement>('#expertise article');
  const expertiseWrap = expertise[0]?.parentElement?.parentElement;
  expertiseWrap?.classList.add('expertise-grid');
  expertise.forEach((article, index) => {
    article.classList.add(`discipline-${index + 1}`);
    article.setAttribute('tabindex', '0');
    article.setAttribute('aria-label', `${article.querySelector('h3')?.textContent} expertise`);
  });
  const toolsSection = select<HTMLElement>('section[aria-label="Tools and technology"]');
  toolsSection?.setAttribute('id', 'tools');
  const duplicateTools = toolsSection?.querySelectorAll('.animate-marquee > span');
  duplicateTools?.forEach((badge, index) => { if (index >= 8) badge.remove(); });

  const metricTargets = [8, 5, 1];
  const metricLabels = ['8+ years experience', '5 brands', 'Less than 1% rework'];
  const metricContainers = all<HTMLElement>('#impact .font-display');
  const animationIds: number[] = [];
  const completed = new Set<HTMLElement>();
  const animateMetric = (element: HTMLElement, index: number) => {
    if (completed.has(element)) return;
    completed.add(element);
    const prefix = index === 2 ? '<' : '';
    const suffix = index === 0 ? '+' : index === 2 ? '%' : '';
    element.setAttribute('aria-label', metricLabels[index]);
    element.textContent = `${prefix}${metricTargets[index]}${suffix}`;
    if (reduced.matches) return;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / 900, 1);
      element.textContent = `${prefix}${Math.round(metricTargets[index] * (1 - Math.pow(1 - progress, 3)))}${suffix}`;
      if (progress < 1 && !reduced.matches) animationIds.push(requestAnimationFrame(tick));
      else element.textContent = `${prefix}${metricTargets[index]}${suffix}`;
    };
    animationIds.push(requestAnimationFrame(tick));
  };
  // Keep valid, verified values visible even before JS motion runs.
  metricContainers.forEach((element, index) => {
    element.setAttribute('aria-label', metricLabels[index]);
    element.textContent = index === 0 ? '8+' : index === 1 ? '5' : '<1%';
  });
  if ('IntersectionObserver' in window) {
    const reveal = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in-view');
        reveal.unobserve(entry.target);
      });
    }, { threshold: .08 });
    all<HTMLElement>('.reveal').forEach(element => reveal.observe(element));
    const numbers = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) animateMetric(entry.target as HTMLElement, metricContainers.indexOf(entry.target as HTMLElement));
      });
    }, { threshold: .4 });
    metricContainers.forEach(element => numbers.observe(element));
    cleanup.push(() => { reveal.disconnect(); numbers.disconnect(); });
  }
  cleanup.push(() => animationIds.forEach(cancelAnimationFrame));

  const next = portfolioConfig.nextChapter;
  const nextSection = select<HTMLElement>('#next');
  if (nextSection) {
    const period = nextSection.querySelector<HTMLElement>('p.text-xs');
    const title = nextSection.querySelector<HTMLElement>('h1, h2');
    const statement = nextSection.querySelector<HTMLElement>('p.text-xl');
    if (period) period.textContent = next.period;
    if (title) {
      title.replaceChildren(text('span', '', next.headline.slice(0, next.headline.lastIndexOf(' ')) + ' '), text('span', 'text-gradient', next.headline.slice(next.headline.lastIndexOf(' ') + 1)));
    }
    if (statement) statement.textContent = `“${next.statement}”`;
    const status = nextSection.querySelector<HTMLElement>('strong');
    if (status) {
      status.textContent = next.status.replace(/^The story\s*/i, '');
      const label = status.previousElementSibling;
      if (label) label.textContent = /^The story/i.test(next.status) ? 'The story' : 'What’s next';
    }
    nextSection.querySelector('.animate-orbit')?.classList.add('next-horizon');
    const details = text('div', 'next-details', '');
    if (next.company) details.append(text('p', 'next-company', next.company));
    if (next.role) details.append(text('h3', '', next.role));
    if (next.focus) details.append(text('p', '', next.focus));
    const groups = [['Responsibilities', next.responsibilities], ['Projects', next.projects], ['Achievements', next.achievements], ['Skills gained', next.skills]] as const;
    groups.forEach(([label, items]) => {
      if (!items.length) return;
      details.append(text('h4', '', label));
      const list = document.createElement('ul');
      items.forEach(item => list.append(text('li', '', item)));
      details.append(list);
    });
    if (details.childElementCount) nextSection.querySelector('.section-inner')?.append(details);
  }

  const contacts = all<HTMLAnchorElement>('#contact a');
  const contactUrls = [portfolioConfig.linkedin, portfolioConfig.email ? `mailto:${portfolioConfig.email}` : null, portfolioConfig.cv];
  contacts.forEach((anchor, index) => {
    const url = contactUrls[index];
    if (url) {
      anchor.href = url;
      if (index !== 1) { anchor.target = '_blank'; anchor.rel = 'noopener noreferrer'; }
      if (index === 2) anchor.download = 'Rohit-Christopher-John-CV';
    } else {
      anchor.removeAttribute('href');
      anchor.removeAttribute('target');
      anchor.setAttribute('aria-disabled', 'true');
      anchor.setAttribute('tabindex', '0');
      anchor.setAttribute('role', 'link');
      anchor.setAttribute('aria-describedby', 'contact-availability');
      anchor.title = 'Personal link not yet supplied';
    }
  });
  if (contactUrls.some(url => !url)) {
    const note = text('p', 'contact-availability', 'Personal contact links and CV will be available here once supplied.');
    note.id = 'contact-availability';
    select('#contact .section-inner')?.append(note);
  }

  let scheduled = 0;
  const updateScroll = () => {
    scheduled = 0;
    header?.classList.toggle('nav-scrolled', window.scrollY > 20);
    if (journeyContainer) {
      const bounds = journeyContainer.getBoundingClientRect();
      const progress = reduced.matches ? 1 : Math.max(0, Math.min(1, (window.innerHeight * .72 - bounds.top) / bounds.height));
      journeyContainer.style.setProperty('--timeline-progress', String(progress));
    }
  };
  const onScroll = () => { if (!scheduled) scheduled = requestAnimationFrame(updateScroll); };
  listen(window, 'scroll', onScroll, { passive: true });
  listen(window, 'resize', onScroll, { passive: true });
  listen(reduced, 'change', () => {
    root.classList.toggle('reduced-motion', reduced.matches);
    if (reduced.matches) metricContainers.forEach((element, index) => element.textContent = index === 0 ? '8+' : index === 1 ? '5' : '<1%');
    updateScroll();
  });
  root.classList.toggle('reduced-motion', reduced.matches);
  updateScroll();
  cleanup.push(() => cancelAnimationFrame(scheduled));
  return () => cleanup.forEach(fn => fn());
}
