import originalMarkup from './portfolio.original.html?raw';

export const portfolioDestinations = [
  { id: 'home', path: '/', label: 'Home', summary: 'People. Process. Performance.' },
  { id: 'about', path: '/about', label: 'About', summary: 'The person behind the process.' },
  { id: 'journey', path: '/journey', label: 'Journey', summary: 'From frontline experience to leadership.' },
  { id: 'impact', path: '/impact', label: 'Impact', summary: 'Experience and outcomes, measured honestly.' },
  { id: 'expertise', path: '/expertise', label: 'Expertise', summary: 'People, process and performance. Technology as an enabler.' },
  { id: 'projects', path: '/projects', label: 'Projects', summary: 'Explore the challenges, approaches and impact.' },
  { id: 'experience', path: '/experience', label: 'Experience', summary: 'Every role built on the last.' },
  { id: 'next', path: '/whats-next', label: 'What’s next', summary: 'An evolving story. A new chapter.' },
  { id: 'contact', path: '/contact', label: 'Contact', summary: 'Let’s build something better.' },
] as const;
export type DestinationId = typeof portfolioDestinations[number]['id'];

export function portfolioMarkup(destination: DestinationId) {
  // Move the existing markup into destinations. Never rebuild career content.
  const document = new DOMParser().parseFromString(originalMarkup, 'text/html');
  const shell = document.body.firstElementChild as HTMLElement;
  const main = shell.querySelector('main')!;
  const current = main.querySelector<HTMLElement>(`#${destination}`)!;
  main.replaceChildren(current);
  if (destination === 'expertise') {
    current.className = 'section-shell expertise-modern';
    current.innerHTML = '<div class="section-inner"><div id="expertise-react-root"></div></div>';
    const technology = document.createElement('section');
    technology.id = 'tools';
    technology.className = 'technology-modern';
    technology.setAttribute('aria-label', 'Tools and technology');
    technology.innerHTML = '<div class="section-inner"><div id="technology-react-root"></div></div>';
    main.append(technology);
  }
  current.classList.add('destination-content');
  current.setAttribute('data-destination', destination);
  main.setAttribute('id', 'main-content');
  main.setAttribute('tabindex', '-1');

  // The photo area and its surrounding frame/badge are removed, not hidden.
  if (destination === 'home') {
    current.querySelector('.portrait-mask')?.parentElement?.remove();
    current.querySelector('.relative.mx-auto.grid')?.classList.add('home-composition');
    const layout = current.querySelector('.home-composition');
    const chooser = document.createElement('aside');
    chooser.className = 'home-chooser';
    chooser.setAttribute('aria-labelledby', 'home-chooser-title');
    const eyebrow = document.createElement('p');
    eyebrow.className = 'chooser-eyebrow';
    eyebrow.textContent = 'A career. Many perspectives.';
    const title = document.createElement('h2');
    title.id = 'home-chooser-title';
    title.textContent = 'What would you like to explore?';
    chooser.append(eyebrow, title);
    const choices = document.createElement('div');
    choices.className = 'home-choice-links';
    ['journey', 'projects', 'expertise'].forEach(id => {
      const entry = portfolioDestinations.find(item => item.id === id)!;
      const link = document.createElement('a');
      link.href = entry.path;
      link.className = 'home-choice-link';
      const label = document.createElement('strong');
      label.textContent = entry.label;
      const description = document.createElement('span');
      description.textContent = entry.summary;
      const arrow = document.createElement('span');
      arrow.className = 'choice-arrow';
      arrow.setAttribute('aria-hidden', 'true');
      arrow.textContent = '↗';
      link.append(label, description, arrow);
      choices.append(link);
    });
    const experience = document.createElement('p');
    experience.className = 'home-experience';
    const figure = document.createElement('strong');
    figure.textContent = '8+';
    const caption = document.createElement('span');
    caption.textContent = 'Years of experience';
    experience.append(figure, caption);
    chooser.append(choices, experience);
    layout?.append(chooser);

    const discovery = document.createElement('section');
    discovery.className = 'discovery-hub';
    discovery.setAttribute('aria-labelledby', 'discovery-title');
    const discoveryTitle = document.createElement('h2');
    discoveryTitle.id = 'discovery-title';
    discoveryTitle.textContent = 'Choose your chapter.';
    const subtitle = document.createElement('p');
    subtitle.className = 'discovery-intro';
    subtitle.textContent = 'Follow your curiosity. There’s no single way through the story.';
    const grid = document.createElement('div');
    grid.className = 'discovery-grid';
    portfolioDestinations.filter(entry => entry.id !== 'home').forEach(entry => {
      const link = document.createElement('a');
      link.href = entry.path;
      link.className = `discovery-link discovery-${entry.id}`;
      const label = document.createElement('h3');
      label.textContent = entry.label;
      const description = document.createElement('p');
      description.textContent = entry.summary;
      const arrow = document.createElement('span');
      arrow.className = 'discovery-arrow';
      arrow.setAttribute('aria-hidden', 'true');
      arrow.textContent = '↗';
      link.append(label, description, arrow);
      grid.append(link);
    });
    discovery.append(discoveryTitle, subtitle, grid);
    main.append(discovery);
  } else {
    const title = current.querySelector('h2');
    if (title) {
      const heading = document.createElement('h1');
      heading.className = `${title.className} page-heading`;
      heading.innerHTML = title.innerHTML;
      title.replaceWith(heading);
    } else if (destination !== 'expertise') {
      const heading = document.createElement('h1');
      heading.className = 'page-heading impact-heading';
      heading.textContent = 'Experience. Reach. Quality.';
      current.querySelector('.max-w-6xl')?.prepend(heading);
    }
    const help = document.createElement('div');
    help.className = 'destination-wayfinding';
    const home = document.createElement('a');
    home.href = '/';
    home.textContent = '← All chapters';
    const label = document.createElement('span');
    label.textContent = portfolioDestinations.find(entry => entry.id === destination)!.label;
    help.append(home, label);
    current.prepend(help);
  }

  shell.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach(anchor => {
    const id = anchor.getAttribute('href')!.slice(1);
    const entry = portfolioDestinations.find(item => item.id === id);
    if (entry) anchor.href = entry.path;
  });
  shell.querySelectorAll<HTMLAnchorElement>('header nav a').forEach(anchor => {
    const active = anchor.getAttribute('href') === portfolioDestinations.find(item => item.id === destination)!.path;
    anchor.classList.toggle('nav-active', active);
    if (active) anchor.setAttribute('aria-current', 'page');
    else anchor.removeAttribute('aria-current');
  });
  return shell.outerHTML;
}
