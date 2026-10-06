// Add only verified contact details here. The source website supplied no personal
// LinkedIn URL, email, or downloadable CV. Null keeps these controls honest.
export const portfolioConfig = {
  linkedin: null as string | null,
  email: null as string | null,
  cv: null as string | null,
  nextChapter: {
    period: "2026 → Present",
    headline: "A new chapter is underway.",
    statement: "Some things are better revealed when the time is right.",
    status: "The story continues...",
    // Populate when disclosure is appropriate; the same panel handles these fields.
    company: null as string | null,
    role: null as string | null,
    focus: null as string | null,
    responsibilities: [] as string[],
    projects: [] as string[],
    achievements: [] as string[],
    skills: [] as string[],
  },
};
