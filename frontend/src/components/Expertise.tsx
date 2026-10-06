import { useRef, useState } from 'react';
import { ArrowUpRight, Check, ChartNoAxesCombined, Cloud, Layers3, Sparkles, UsersRound, Workflow, ShieldCheck, Wrench } from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardFooter, Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui';
import './expertise.css';

export const expertiseAreas = [
  {
    id: 'people', label: 'PEOPLE', title: 'PEOPLE & LEADERSHIP', indicator: 'People-first', icon: UsersRound,
    description: 'Building capable teams, developing people and creating accountability.',
    capabilities: ['People Management', 'Team Leadership', 'Coaching & Mentoring', 'Performance Management', 'Stakeholder Management', 'Team Development'],
  },
  {
    id: 'operations', label: 'OPERATIONS', title: 'OPERATIONS', indicator: 'Delivery-focused', icon: Layers3,
    description: 'Bringing structure, coordination and ownership to everyday service delivery.',
    capabilities: ['Operational Management', 'Service Delivery', 'Workforce Coordination', 'Escalation Management', 'Operational Governance', 'Cross-functional Collaboration'],
  },
  {
    id: 'process', label: 'PROCESS', title: 'PROCESS EXCELLENCE', indicator: 'Better ways of working', icon: Workflow,
    description: 'Making work clearer, simpler and more effective through continuous improvement.',
    capabilities: ['Process Improvement', 'SOP Development', 'Process Optimisation', 'Workflow Design', 'Continuous Improvement', 'Process Transformation'],
  },
  {
    id: 'quality', label: 'QUALITY', title: 'QUALITY & COMPLIANCE', indicator: 'Trust & consistency', icon: ShieldCheck,
    description: 'Strengthening standards, understanding risk and building quality into the process.',
    capabilities: ['Quality Assurance', 'Audit & Compliance', 'Risk Management', 'Root Cause Analysis', 'Quality Frameworks', 'Governance & Controls'],
  },
  {
    id: 'data', label: 'DATA', title: 'DATA & ANALYTICS', indicator: 'Performance-led', icon: ChartNoAxesCombined,
    description: 'Turning operational data into insight, better decisions and a clearer view of performance.',
    capabilities: ['KPI Management', 'Performance Reporting', 'Data Analysis', 'Operational Insights', 'Dashboarding', 'Data-driven Decision Making'],
  },
  {
    id: 'ai', label: 'AI & TRANSFORMATION', title: 'AI, AUTOMATION & DIGITAL TRANSFORMATION', indicator: 'An evolving focus', icon: Sparkles,
    description: 'Exploring practical AI and automation to improve productivity and make work better.',
    capabilities: ['AI-assisted Workflows', 'Generative AI', 'AI for Productivity & Process Improvement', 'Workflow Automation', 'Digital Process Optimisation', 'Automation Opportunity Identification', 'Technology-enabled Process Transformation'],
  },
] as const;

export const technologyTools = [
  { name: 'Power BI', group: 'Insight & reporting', description: 'Operational dashboards and performance reporting that make KPIs and trends easier to understand.' },
  { name: 'SharePoint', group: 'Workflow & collaboration', description: 'Shared information, document management and accessible process guidance in a cloud-based workplace.' },
  { name: 'Power Automate', group: 'Workflow & automation', description: 'Identifying opportunities to connect routine workflow steps and reduce repetitive administrative work.' },
  { name: 'Excel', group: 'Insight & reporting', description: 'Practical operational analysis, reporting and structured information management.' },
  { name: 'Salesforce', group: 'Business applications', description: 'Using a cloud-based business application to support service processes and operational information.' },
  { name: 'Redshift', group: 'Data & reporting environment', description: 'Exposure to a cloud-based data environment in support of operational data and reporting; not database engineering or architecture.' },
  { name: 'Generative AI', group: 'AI-enabled productivity', description: 'Practical adoption of generative AI for drafting, structuring information and exploring process improvements, with human review and attention to sensitive data.' },
  { name: 'AI Productivity Tools', group: 'AI-enabled productivity', description: 'Exploring AI-assisted everyday work to reduce routine effort and support productivity, while keeping judgement and accountability with people.' },
  { name: 'Cloud Platforms', group: 'Cloud-enabled operations', description: 'Practical exposure to cloud technology as an enabler of accessible information, connected workflows and modern operations—not cloud architecture or infrastructure engineering.' },
  { name: 'Cloud-based Business Applications', group: 'Cloud-enabled operations', description: 'Using cloud-based workplace and business applications to support collaboration, service delivery and digital processes.' },
] as const;

export function Expertise() {
  const [selected, setSelected] = useState<typeof expertiseAreas[number]>(expertiseAreas[0]);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="expertise-intro">
        <div>
          <p className="expertise-eyebrow">Capabilities, not just tools</p>
          <h1 className="page-heading expertise-heading">EXPERTISE</h1>
          <p className="expertise-support">Where people, process, technology and performance come together.</p>
        </div>
        <div className="expertise-thesis" aria-label="People plus process plus performance, with technology as an enabler">
          <p><strong>PEOPLE</strong><span aria-hidden="true">+</span><strong>PROCESS</strong><span aria-hidden="true">+</span><strong>PERFORMANCE</strong></p>
          <span>Technology is the enabler.</span>
        </div>
      </div>
      <p className="expertise-instruction">Choose an area to explore the capabilities behind it.</p>
      <Dialog open={open} onOpenChange={setOpen}>
      <div className="expertise-capability-grid">
        {expertiseAreas.map(area => {
          const Icon = area.icon;
          return (
            <Card key={area.id} className={`expertise-card expertise-category-${area.id}`}>
              <CardHeader className="expertise-card-header">
                <div className="expertise-card-identity">
                  <div className="expertise-icon"><Icon size={24} strokeWidth={1.7} aria-hidden="true" /></div>
                  <span className="expertise-indicator"><i aria-hidden="true" />{area.indicator}</span>
                </div>
                <CardTitle><h2 className="expertise-card-title">{area.label}</h2></CardTitle>
                <CardDescription className="expertise-card-description">{area.description}</CardDescription>
              </CardHeader>
              <CardFooter className="expertise-card-footer" aria-hidden="true"><span>Explore capabilities</span><ArrowUpRight size={18} /></CardFooter>
              <DialogTrigger asChild><Button variant="ghost" className="expertise-card-trigger" onClick={event => { trigger.current = event.currentTarget; setSelected(area); }}><span className="sr-only">Explore {area.label} capabilities</span></Button></DialogTrigger>
            </Card>
          );
        })}
      </div>
      <p className="expertise-positioning">I lead people, improve processes, manage operations, use data to understand performance, and increasingly leverage AI, automation and cloud technology to make work better.</p>
        <DialogContent onCloseAutoFocus={event => { event.preventDefault(); trigger.current?.focus(); }} className={`expertise-dialog expertise-category-${selected?.id ?? 'people'}`}>
          <DialogHeader>
            <p className="expertise-dialog-eyebrow">{selected?.indicator}</p>
            <DialogTitle className="expertise-dialog-title">{selected?.title}</DialogTitle>
            <DialogDescription className="expertise-dialog-description">{selected?.description}</DialogDescription>
          </DialogHeader>
          <ul className="expertise-capabilities" aria-label="Capabilities">
            {selected?.capabilities.map(capability => <li key={capability}><Check size={16} aria-hidden="true" /><span>{capability}</span></li>)}
          </ul>
          {selected?.id === 'ai' && <p className="expertise-practical-note">An actively developing focus: practical exposure, adoption and application in people, process and operations—not specialist AI engineering.</p>}
          <Button variant="outline" className="expertise-dialog-return" onClick={() => setOpen(false)}>Back to all expertise</Button>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function TechnologyStack() {
  const [selected, setSelected] = useState<typeof technologyTools[number]>(technologyTools[0]);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="technology-intro">
        <div><p className="expertise-eyebrow">The supporting stack</p><h2 className="technology-heading">TOOLS & TECHNOLOGY</h2></div>
        <p>Tools I use and explore to support operations, insight and better ways of working. Select a tool for its practical context.</p>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
      <div className="technology-pills" aria-label="Tools and technology">
        {technologyTools.map(tool => {
          const isAI = tool.group === 'AI-enabled productivity';
          const isCloud = tool.group === 'Cloud-enabled operations';
          const Icon = isAI ? Sparkles : isCloud ? Cloud : Wrench;
          return <DialogTrigger asChild key={tool.name}><Button variant="outline" className={`technology-pill ${isAI || isCloud ? 'technology-enabler' : ''}`} onClick={event => { trigger.current = event.currentTarget; setSelected(tool); }}><Icon size={15} aria-hidden="true" /><span>{tool.name}</span><ArrowUpRight size={13} aria-hidden="true" /></Button></DialogTrigger>;
        })}
      </div>
      <p className="technology-note">Practical technology adoption in an operations and process environment. People, judgement and accountability stay at the centre.</p>
        <DialogContent onCloseAutoFocus={event => { event.preventDefault(); trigger.current?.focus(); }} className="expertise-dialog technology-dialog">
          <DialogHeader>
            <p className="expertise-dialog-eyebrow">{selected?.group}</p>
            <DialogTitle className="expertise-dialog-title">{selected?.name}</DialogTitle>
            <DialogDescription className="expertise-dialog-description">{selected?.description}</DialogDescription>
          </DialogHeader>
          <p className="expertise-practical-note">Technology as an enabler of people, process and performance—not a claim of specialist engineering expertise.</p>
          <Button variant="outline" className="expertise-dialog-return" onClick={() => setOpen(false)}>Back to tools & technology</Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
