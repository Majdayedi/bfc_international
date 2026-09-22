import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { API_URL } from '../utils/constants';
import {
  BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  LineChart as ReLineChart, Line,
  PieChart as RePieChart, Pie, Cell,
  AreaChart, Area,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import './ArticleBuilder.css';
import './ArticleDetailPage.css';

/* ================================================================
   TYPE DEFINITIONS
   ================================================================ */

export type BlockType =
  | 'heading' | 'text' | 'quote' | 'callout' | 'image'
  | 'video' | 'stats' | 'focus-area' | 'divider' | 'chart'
  | 'row' | 'accordion' | 'timeline' | 'cta' | 'list' | 'team-member';

export type ChartType = 'bar' | 'line' | 'pie' | 'area' | 'radar';
export type ImageStyle = 'rounded' | 'leaf' | 'skewed' | 'asymmetric';
export type ImageAspectRatio = 'landscape' | 'portrait' | 'square' | 'banner';
export type CtaStyle = 'navy' | 'mint' | 'slate';
export type ListStyle = 'bullet' | 'numbered' | 'checklist';
export type VideoSourceType = 'youtube' | 'local';

export interface ChartDataItem { name: string; value: number; }
export interface AccordionItem { question: string; answer: string; }
export interface TimelineNode { date: string; title: string; description: string; }
export interface StatItem { value: string; label: string; }
export interface ListItem { text: string; checked?: boolean; }
export interface TeamMember { name: string; role: string; bio: string; avatar: string; }

export interface Block {
  id: string; type: BlockType; content: string;
  stats?: StatItem[];
  chartData?: ChartDataItem[]; chartType?: ChartType; chartDataTitle?: string;
  videoSourceType?: VideoSourceType; videoUrl?: string;
  imageStyle?: ImageStyle; imageAspectRatio?: ImageAspectRatio; imageCaption?: string;
  accordionItems?: AccordionItem[];
  timelineNodes?: TimelineNode[];
  ctaButtonText?: string; ctaLink?: string; ctaStyle?: CtaStyle;
  listItems?: ListItem[]; listStyle?: ListStyle;
  teamMembers?: TeamMember[];
  focusTitle?: string;
}
export interface RowBlock { id: string; type: 'row'; columns: Block[][]; }
export interface Section { id: string; title: string; blocks: (Block | RowBlock)[]; }
export interface ArticleState {
  title: string; subtitle: string; date: string; author: string;
  category: string; readingTime: string; summary: string; heroImage: string;
  takeaways: string[]; references: string[]; sections: Section[];
}
type Mode = 'edit' | 'preview';

/* ================================================================
   CONSTANTS
   ================================================================ */

const CHART_COLORS = ['#204383', '#99cdb3', '#4a7db5', '#7dbba3', '#1a3566', '#b8dac8', '#1f6f5c', '#1694a6'];

const TOOLBOX_ITEMS: { type: BlockType; label: string; icon: React.ReactNode; desc: string }[] = [
  { type: 'heading',    label: 'Heading',     icon: <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10" /></svg>, desc: 'Section titles' },
  { type: 'text',       label: 'Rich Text',   icon: <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h10M4 18h7" /></svg>, desc: 'Paragraph with markdown' },
  { type: 'image',      label: 'Image',       icon: <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>, desc: 'Photo with styles & captions' },
  { type: 'video',      label: 'Video',       icon: <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21" /></svg>, desc: 'YouTube or local MP4' },
  { type: 'quote',      label: 'Blockquote',  icon: <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 8c-1.1 0-2 .9-2 2v4h4v-4H8c0-1.1.9-2 2-2V6c-2.2 0-4 1.8-4 4v8h8v-8c0-1.1-.9-2-2-2z" /></svg>,  desc: 'Pull-quote statement' },
  { type: 'callout',    label: 'Callout',     icon: <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,  desc: 'Info note or alert' },
  { type: 'focus-area', label: 'Focus Area',  icon: <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>, desc: 'Key highlight card' },
  { type: 'stats',      label: 'Stats',       icon: <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="12" width="4" height="9" /><rect x="10" y="7" width="4" height="14" /><rect x="17" y="3" width="4" height="18" /></svg>, desc: 'Key metrics grid' },
  { type: 'chart',      label: 'Chart',       icon: <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polyline points="22,12 18,12 15,21 9,3 6,12 2,12" /></svg>, desc: '5 chart types' },
  { type: 'list',       label: 'List',        icon: <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>, desc: 'Bullet / Numbered / Checklist' },
  { type: 'accordion',  label: 'Accordion',   icon: <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>, desc: 'Expandable Q&A' },
  { type: 'timeline',   label: 'Timeline',    icon: <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>, desc: 'Chronological milestones' },
  { type: 'cta',        label: 'CTA Button',  icon: <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>, desc: 'Call-to-action' },
  { type: 'team-member',label: 'Team',        icon: <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>, desc: 'Member profiles' },
  { type: 'divider',    label: 'Divider',     icon: <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><line x1="2" y1="12" x2="22" y2="12" strokeWidth={2} /></svg>,  desc: 'Visual break' },
];

/* ================================================================
   HELPERS
   ================================================================ */

let _blockCounter = 0;
function genId(prefix = 'b') { return `${prefix}${Date.now()}_${++_blockCounter}`; }

function defaultChartData(): ChartDataItem[] {
  return [{ name: 'Q1', value: 40 }, { name: 'Q2', value: 65 }, { name: 'Q3', value: 50 }, { name: 'Q4', value: 80 }];
}

function createBlock(type: BlockType): Block {
  const id = genId();
  switch (type) {
    case 'heading':    return { id, type, content: '' };
    case 'text':       return { id, type, content: '' };
    case 'image':      return { id, type, content: '', imageStyle: 'leaf', imageAspectRatio: 'landscape', imageCaption: '' };
    case 'video':      return { id, type, content: '', videoSourceType: 'youtube', videoUrl: '' };
    case 'quote':      return { id, type, content: '' };
    case 'callout':    return { id, type, content: '' };
    case 'focus-area': return { id, type, content: '', focusTitle: 'Focus Area' };
    case 'stats':      return { id, type, content: '', stats: [{ value: '—', label: 'Metric 1' }, { value: '—', label: 'Metric 2' }, { value: '—', label: 'Metric 3' }] };
    case 'chart':      return { id, type, content: '', chartType: 'bar', chartData: defaultChartData(), chartDataTitle: 'Performance Data' };
    case 'list':       return { id, type, content: '', listStyle: 'bullet', listItems: [{ text: 'New item', checked: false }] };
    case 'accordion':  return { id, type, content: '', accordionItems: [{ question: 'What is your question?', answer: 'Answer goes here...' }] };
    case 'timeline':   return { id, type, content: '', timelineNodes: [{ date: '2024', title: 'Milestone', description: 'Description...' }] };
    case 'cta':        return { id, type, content: '', ctaButtonText: 'Learn More', ctaLink: 'https://', ctaStyle: 'navy' };
    case 'team-member':return { id, type, content: '', teamMembers: [{ name: 'Full Name', role: 'Title', bio: 'Short bio...', avatar: '' }] };
    case 'divider':    return { id, type, content: '' };
    default:           return { id, type, content: '' };
  }
}

function parseMarkdown(text: string): React.ReactNode[] {
  if (!text) return [];
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*(.+?)\*\*)|((\*(.+?)\*))|(\[([^\]]+)\]\(([^)]+)\))/g;
  let lastIdx = 0; let match; let key = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIdx) parts.push(text.slice(lastIdx, match.index));
    if (match[2]) parts.push(<strong key={key++} style={{ color: '#204383' }}>{match[2]}</strong>);
    else if (match[5]) parts.push(<em key={key++}>{match[5]}</em>);
    else if (match[7] && match[8]) parts.push(
      <a key={key++} href={match[8]} target="_blank" rel="noopener noreferrer" style={{ color: '#204383', textDecoration: 'underline', fontWeight: 600 }}>{match[7]}</a>
    );
    lastIdx = regex.lastIndex;
  }
  if (lastIdx < text.length) parts.push(text.slice(lastIdx));
  return parts.length ? parts : [text];
}
const MD: React.FC<{ text: string }> = ({ text }) => <>{parseMarkdown(text)}</>;

function extractYoutubeId(url: string): string | null {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/) || url.match(/^([a-zA-Z0-9_-]{11})$/);
  return m ? m[1] : null;
}

/* ================================================================
   EXPORT FUNCTIONS
   ================================================================ */

function exportMd(state: ArticleState): string {
  let md = `# ${state.title || 'Untitled'}\n\n`;
  if (state.subtitle) md += `*${state.subtitle}*\n\n`;
  if (state.author)   md += `**Author:** ${state.author}  \n`;
  if (state.date)     md += `**Date:** ${state.date}  \n\n`;
  if (state.summary)  md += `> ${state.summary}\n\n`;
  for (const sec of state.sections) {
    md += `## ${sec.title}\n\n`;
    for (const b of sec.blocks) {
      if (b.type === 'row') { (b as RowBlock).columns.flat().forEach(cb => { md += blockToMd(cb); }); continue; }
      md += blockToMd(b as Block);
    }
    md += '\n---\n\n';
  }
  return md;
}
function blockToMd(b: Block): string {
  switch (b.type) {
    case 'heading': return `### ${b.content}\n\n`;
    case 'text':    return `${b.content}\n\n`;
    case 'quote':   return `> ${b.content}\n\n`;
    case 'callout': return `> ⚠ **Note:** ${b.content}\n\n`;
    case 'image':   return b.content ? `![${b.imageCaption || ''}](${b.content})\n\n` : '';
    case 'stats':   return (b.stats || []).map(s => `- **${s.value}** ${s.label}`).join('\n') + '\n\n';
    case 'divider': return '---\n\n';
    default:        return `${b.content}\n\n`;
  }
}

function exportHtml(state: ArticleState): string {
  const css = `
    *{margin:0;padding:0;box-sizing:border-box}
    :root {
      --med-cream: #F9F7F3;
      --med-dark: #14352D;
      --med-sage: #8BA89D;
      --med-sage-bg: #E2EFE9;
      --med-shadow: 0 30px 60px rgba(20, 53, 45, 0.06);
      --med-radius: 20px;
    }
    body{font-family:'Inter',sans-serif;color:var(--med-dark);background:var(--med-cream);max-width:800px;margin:0 auto;padding:40px 20px;line-height:1.7}
    h1{font-size:2.5rem;color:var(--med-dark);font-weight:900;letter-spacing:-0.02em;margin-bottom:8px}
    h2{font-family:"Spectral",Georgia,serif;font-size:2.25rem;color:var(--med-dark);margin:3rem 0 1.5rem;line-height:1.2;letter-spacing:-0.01em}
    h3{font-size:1.5rem;color:var(--med-dark);margin:2.5rem 0 1rem}
    p{margin-bottom:16px;color:rgba(20,53,45,0.85);font-size:1.125rem;line-height:1.8}
    blockquote{position:relative;margin:3rem 0;padding:3rem;background:var(--med-sage-bg);border-radius:var(--med-radius);font-family:"Spectral",Georgia,serif;font-size:1.75rem;line-height:1.4;color:var(--med-dark);text-align:center;font-style:italic}
    blockquote::before{content:'""';position:absolute;top:-1.5rem;left:50%;transform:translateX(-50%);font-size:6rem;color:var(--med-sage);opacity:0.2;font-family:"Spectral",Georgia,serif;line-height:1}
    img{width:100%;border-radius:var(--med-radius);box-shadow:var(--med-shadow);margin:3rem 0}
    .stats{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(20,53,45,0.08);border-radius:var(--med-radius);overflow:hidden;margin-bottom:16px}
    .stat{text-align:center;padding:24px 16px;background:var(--med-cream)}
    .sv{font-size:2rem;font-weight:900;color:var(--med-dark)}.sl{font-size:11px;font-weight:700;color:var(--med-sage);text-transform:uppercase}
    hr{border:none;height:2px;background:var(--med-sage);width:80px;margin:32px auto}
    .summary{background:var(--med-sage-bg);padding:20px;border-radius:var(--med-radius);margin-bottom:24px;border-left:4px solid var(--med-sage)}
  `;
  let html = '';
  for (const sec of state.sections) {
    let blocks = '';
    for (const b of sec.blocks) {
      if (b.type === 'row') { blocks += `<div style="display:flex;gap:16px">${(b as RowBlock).columns.map(col => `<div style="flex:1">${col.map(blockToHtml).join('')}</div>`).join('')}</div>`; continue; }
      blocks += blockToHtml(b as Block);
    }
    html += `<h2>${sec.title}</h2>${blocks}`;
  }
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${state.title || 'Article'}</title><style>${css}</style></head>
<body>
  ${state.heroImage ? `<img src="${state.heroImage}" alt="Hero" style="width:100%;max-height:400px;object-fit:cover;border-radius:48px 12px 48px 12px;margin-bottom:24px">` : ''}
  <h1>${state.title || 'Untitled'}</h1>
  ${state.subtitle ? `<p style="color:#6b7280;font-size:1.1rem;margin-bottom:16px">${state.subtitle}</p>` : ''}
  ${state.summary ? `<div class="summary">${state.summary}</div>` : ''}
  ${html}
  <p style="text-align:center;font-size:11px;color:#9ca3af;margin-top:48px">Built with BFC Creative Studio</p>
</body></html>`;
}
function blockToHtml(b: Block): string {
  switch (b.type) {
    case 'heading': return `<h3>${b.content}</h3>`;
    case 'text':    return `<p>${b.content.replace(/\*\*(.+?)\*\*/g,'<strong style="color:#204383">$1</strong>').replace(/\*(.+?)\*/g,'<em>$1</em>')}</p>`;
    case 'quote':   return `<blockquote>${b.content}</blockquote>`;
    case 'focus-area': return `<div style="background:var(--med-sage-bg, #E2EFE9);padding:2.5rem;border-radius:var(--med-radius, 20px);border-left:4px solid var(--med-sage, #8BA89D);border-bottom:4px solid var(--med-dark, #14352D);margin-bottom:16px"><div style="font-family:var(--font-sans, 'Manrope', sans-serif);font-size:0.7rem;font-weight:700;letter-spacing:0.2em;color:var(--med-sage, #8BA89D);text-transform:uppercase;margin-bottom:1rem">${b.focusTitle || 'Focus Area'}</div><h3 style="font-size:1.35rem;font-weight:600;color:var(--med-dark, #14352D);margin:0;line-height:1.5">${b.content}</h3></div>`;
    case 'image':   return b.content ? `<img src="${b.content}" alt="${b.imageCaption || ''}">` : '';
    case 'divider': return `<hr style="border:none;height:1px;background:${b.content || '#000000'};margin:32px auto;width:50%">`;
    case 'stats':   return `<div class="stats">${(b.stats || []).map(s => `<div class="stat"><div class="sv">${s.value}</div><div class="sl">${s.label}</div></div>`).join('')}</div>`;
    default:        return '';
  }
}

function exportJson(state: ArticleState): string {
  return JSON.stringify({ metadata: { title: state.title, subtitle: state.subtitle, author: state.author, date: state.date, category: state.category, readingTime: state.readingTime, summary: state.summary, takeaways: state.takeaways, references: state.references }, sections: state.sections, exportedAt: new Date().toISOString() }, null, 2);
}

function sanitizeSlug(title: string): string {
  return (title || 'article').replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase().replace(/_+/g, '_').replace(/^_|_$/g, '') || 'article';
}
function download(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(url);
}

/* ================================================================
   LOCAL STORAGE
   ================================================================ */

const STORAGE_KEY = 'bfc_article_builder_v2';
function loadState(): ArticleState {
  const isNew = new URLSearchParams(window.location.search).get('new') === 'true';
  if (isNew) {
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  } else {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const p = JSON.parse(raw);
        if (p && p.sections) return p;
      }
    } catch { /* ignore */ }
  }
  return {
    title: '', subtitle: '',
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    author: '', category: '', readingTime: '', summary: '', heroImage: '',
    takeaways: [], references: [], sections: [],
  };
}

/* ================================================================
   RECHARTS TOOLTIP
   ================================================================ */
const RcTooltip: React.FC = () => (
  <Tooltip contentStyle={{ borderRadius: 0, border: '1px solid #e5e7eb', fontSize: 11 }} />
);

const COUNTRY_LABEL: Record<string, string> = { guinee: 'Guinea' };
const countryLabel = (alt: string) => COUNTRY_LABEL[alt] || (alt.charAt(0).toUpperCase() + alt.slice(1));

const AccordionItemBlock: React.FC<{ item: any }> = ({ item }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="ab-accordion-item" style={{ border: '1px solid #e5e7eb', borderRadius: 4, overflow: 'hidden' }}>
      <button type="button" onClick={() => setOpen(!open)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '12px 14px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', borderBottom: open ? '1px solid #e5e7eb' : 'none' }}>
        <svg style={{ width: 16, height: 16, color: '#99cdb3', flexShrink: 0, transform: open ? 'rotate(90deg)' : '', transition: 'transform 0.2s' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'inherit' }}>{item.question}</span>
      </button>
      {open && <div style={{ padding: '12px 14px', fontSize: '0.85rem', color: 'inherit', opacity: 0.7, lineHeight: 1.6 }}>{item.answer}</div>}
    </div>
  );
};

export interface DetailBlockProps {
  block: any;
}

export const DetailBlock: React.FC<DetailBlockProps> = ({ block }) => {
  const blk = block;
  const ctaColorMap: Record<string, string> = { navy: '#204383', mint: '#1f6f5c', slate: '#374151' };

  switch (blk.type) {
    case 'heading':
      return (
        <div className="ab-block-heading">
          <h2><MD text={blk.content} /></h2>
        </div>
      );

    case 'text':
      return (
        <div className="ab-block-text">
          <p><MD text={blk.content} /></p>
        </div>
      );

    case 'quote':
      return (
        <div className="ab-block-quote">
          <blockquote>{blk.content || ''}</blockquote>
        </div>
      );

    case 'callout':
      return (
        <div className="ab-block-callout">
          <svg width="20" height="20" fill="none" stroke="#204383" viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: 2 }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>{blk.content || ''}</p>
        </div>
      );

    case 'focus-area':
      return (
        <div style={{ background: 'var(--med-sage-bg, #E2EFE9)', padding: '2.5rem', borderRadius: 'var(--med-radius, 20px)', borderLeft: '4px solid var(--med-sage, #8BA89D)', borderBottom: '4px solid var(--med-dark, #14352D)', marginBottom: 16 }}>
          <div style={{ fontFamily: 'var(--font-sans, "Manrope", sans-serif)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', color: 'var(--med-sage, #8BA89D)', textTransform: 'uppercase', marginBottom: '1rem' }}>{blk.focusTitle || 'Focus Area'}</div>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 600, color: 'var(--med-dark, #14352D)', margin: 0, lineHeight: 1.5 }}>{blk.content || ''}</h3>
        </div>
      );

    case 'divider':
      return <hr style={{ border: 'none', height: 1, background: blk.content || '#000000', margin: '32px auto', width: '50%' }} />;

    case 'image': {
      const aspect = blk.imageAspectRatio || 'landscape';
      const arMap: Record<string, string> = { landscape: '3/2', portrait: '2/3', square: '1/1', banner: '21/9' };
      return (
        <div style={{ margin: '3rem 0' }}>
          <div style={{ aspectRatio: arMap[aspect] || '3/2', background: 'var(--med-cream, #F9F7F3)', borderRadius: 'var(--med-radius, 20px)', boxShadow: 'var(--med-shadow, 0 30px 60px rgba(20, 53, 45, 0.06))', overflow: 'hidden', position: 'relative' }}>
            {blk.content ? (
              <img src={blk.content} alt={blk.imageCaption || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#9ca3af', fontSize: 14 }}>No image</div>
            )}
          </div>
          {blk.imageCaption && (
            <p style={{ fontSize: 12, fontStyle: 'italic', color: '#6b7280', textAlign: 'center', marginTop: 6 }}>{blk.imageCaption}</p>
          )}
        </div>
      );
    }

    case 'video': {
      const ytId = extractYoutubeId(blk.videoUrl || blk.content);
      return (
        <div style={{ margin: '16px 0', aspectRatio: '16/9', background: '#000', borderRadius: '16px', overflow: 'hidden' }}>
          {ytId ? (
            <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${ytId}`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
          ) : blk.content ? (
            <video width="100%" height="100%" controls src={blk.content} />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#9ca3af' }}>No video url provided</div>
          )}
        </div>
      );
    }

    case 'stats': {
      const stats = blk.stats || [];
      return (
        <div className="ab-stats-grid" style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(stats.length, 4)}, 1fr)`, gap: 16, margin: '16px 0' }}>
          {stats.map((s: any, idx: number) => (
            <div key={idx} className="ab-stat-card" style={{ padding: 16, border: '1px solid #e5e7eb', borderRadius: '12px 4px 12px 4px', textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#204383' }}>{s.value}</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      );
    }

    case 'chart': {
      const data = blk.chartData || defaultChartData();
      const chartType = blk.chartType || 'bar';
      return (
        <div className="ab-chart-container" style={{ margin: '16px 0', padding: 16, border: '1px solid #e5e7eb', borderRadius: 8 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#204383', marginBottom: 12 }}>{blk.chartDataTitle || 'Data Chart'}</div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'bar'
                ? <ReBarChart data={data}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><RcTooltip /><Bar dataKey="value" fill="#204383" /></ReBarChart>
                : chartType === 'line'
                  ? <ReLineChart data={data}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><RcTooltip /><Line type="monotone" dataKey="value" stroke="#204383" strokeWidth={2} dot={{ fill: '#204383' }} /></ReLineChart>
                  : chartType === 'pie'
                    ? <RePieChart><RcTooltip /><Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>{data.map((_: any, idx: number) => <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />)}</Pie></RePieChart>
                    : chartType === 'area'
                      ? <AreaChart data={data}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><RcTooltip /><Area type="monotone" dataKey="value" stroke="#204383" fill="#99cdb3" fillOpacity={0.35} strokeWidth={2} /></AreaChart>
                      : <RadarChart data={data}><PolarGrid stroke="#e5e7eb" /><PolarAngleAxis dataKey="name" tick={{ fontSize: 10 }} /><PolarRadiusAxis angle={30} tick={{ fontSize: 8 }} /><Radar dataKey="value" stroke="#204383" fill="#99cdb3" fillOpacity={0.35} strokeWidth={2} /></RadarChart>}
            </ResponsiveContainer>
          </div>
        </div>
      );
    }

    case 'list': {
      const items = blk.listItems || [];
      const listStyle = blk.listStyle || 'bullet';
      return (
        <div style={{ margin: '16px 0', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {items.map((item: any, idx: number) => (
            <div key={idx} className="ab-list-item-row" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {listStyle === 'bullet' && <span style={{ color: '#204383', fontWeight: 700, fontSize: 16, lineHeight: 1 }}>•</span>}
              {listStyle === 'numbered' && <span style={{ color: '#204383', fontWeight: 700, fontSize: 12, minWidth: 18 }}>{idx + 1}.</span>}
              {listStyle === 'checklist' && <input type="checkbox" checked={item.checked || false} readOnly style={{ width: 16, height: 16, accentColor: '#204383', flexShrink: 0 }} />}
              <span style={{ fontSize: '0.92rem', color: item.checked ? 'rgba(0,0,0,0.3)' : 'inherit', textDecoration: item.checked ? 'line-through' : 'none' }}>{item.text}</span>
            </div>
          ))}
        </div>
      );
    }

    case 'accordion': {
      const items = blk.accordionItems || [];
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, margin: '16px 0' }}>
          {items.map((item: any, idx: number) => (
            <AccordionItemBlock key={idx} item={item} />
          ))}
        </div>
      );
    }

    case 'timeline': {
      const nodes = blk.timelineNodes || [];
      return (
        <div className="ab-timeline" style={{ margin: '16px 0' }}>
          {nodes.map((node: any, idx: number) => (
            <div key={idx} className="ab-timeline-node">
              <div className="ab-timeline-dot" />
              <div className="ab-timeline-date">{node.date}</div>
              <div className="ab-timeline-title">{node.title}</div>
              <div className="ab-timeline-desc">{node.description}</div>
            </div>
          ))}
        </div>
      );
    }

    case 'cta': {
      const cs = blk.ctaStyle || 'navy';
      const color = ctaColorMap[cs] || '#204383';
      return (
        <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
          <a className="ab-cta-preview-btn" href={blk.ctaLink || '#'} target="_blank" rel="noopener noreferrer" style={{ background: color }}>{blk.ctaButtonText || 'Learn More'}</a>
        </div>
      );
    }

    case 'team-member': {
      const members = blk.teamMembers || [];
      return (
        <div className="ab-team-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, margin: '16px 0' }}>
          {members.map((m: any, idx: number) => (
            <div key={idx} className="ab-team-card" style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, textAlign: 'center' }}>
              <div className="ab-team-avatar" style={{ width: 80, height: 80, borderRadius: '50%', overflow: 'hidden', margin: '0 auto 12px' }}>
                {m.avatar ? <img src={m.avatar} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ background: '#204383', color: '#fff', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700 }}>{m.name.charAt(0)}</div>}
              </div>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#204383' }}>{m.name}</div>
              <div style={{ fontSize: 11, color: '#6b7280', margin: '4px 0 8px' }}>{m.role}</div>
              <div style={{ fontSize: 11, color: '#4b5563', lineHeight: 1.4 }}>{m.bio}</div>
            </div>
          ))}
        </div>
      );
    }

    case 'row': {
      const row = blk;
      return (
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', margin: '16px 0' }}>
          {row.columns.map((col: any[], ci: number) => (
            <div key={ci} style={{ flex: 1, minWidth: 200 }}>
              {col.map((cb, cbi) => <DetailBlock key={cb.id || cbi} block={cb} />)}
            </div>
          ))}
        </div>
      );
    }

    default:
      return <p style={{ color: '#374151', fontSize: '0.95rem' }}>{blk.content}</p>;
  }
};

/* ================================================================
   MAIN COMPONENT
   ================================================================ */

export const ArticleBuilder: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const articleIdParam = searchParams.get('id');

  const [articleId, setArticleId] = useState<number | null>(
    articleIdParam ? parseInt(articleIdParam, 10) : null
  );

  const [state, setState] = useState<ArticleState>(loadState);
  const [mode, setMode] = useState<Mode>('edit');
  const [previewScrollProgress, setPreviewScrollProgress] = useState(0);
  const [previewHeroProgress, setPreviewHeroProgress] = useState(0);

  const handlePreviewScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const top = container.scrollTop;
    const height = container.scrollHeight - container.clientHeight;
    setPreviewScrollProgress(height > 0 ? Math.min(top / height, 1) : 0);
    const heroDistance = Math.max(container.clientHeight * 0.65, 1);
    setPreviewHeroProgress(Math.min(top / heroDistance, 1));
  };

  const heroFileRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [linkToolbar, setLinkToolbar] = useState<{ visible: boolean; x: number; y: number; blockId: string; url: string; selectedText: string }>(
    { visible: false, x: 0, y: 0, blockId: '', url: '', selectedText: '' }
  );
  const [articleFontSize, setArticleFontSize] = useState<string>('1rem');
  const [articleFontFamily, setArticleFontFamily] = useState<string>('Inter');
  const [articleTextColor, setArticleTextColor] = useState<string>('#374151');
  const [quickAddMenu, setQuickAddMenu] = useState<{ sectionIdx: number; targetId: string } | null>(null);
  const [openAccordions, setOpenAccordions] = useState<Record<string, number | null>>({});
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [activeBlockRect, setActiveBlockRect] = useState<{ x: number; y: number } | null>(null);
  const floatingToolbarRef = useRef<HTMLDivElement>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout>>();
  const exportDropdownRef = useRef<HTMLDivElement>(null);

  // Fetch existing article if editing
  useEffect(() => {
    if (!articleId) return;

    fetch(`${API_URL}/api/articles/${articleId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch article');
        return res.json();
      })
      .then((data) => {
        let content: any = {};
        try {
          content = JSON.parse(data.contentJson);
        } catch (err) {
          console.error('Failed to parse content JSON:', err);
        }

        setState({
          title: data.title || '',
          subtitle: data.subtitle || '',
          date: data.publishDate || '',
          author: data.author || '',
          category: data.category || '',
          readingTime: data.readingTime || '',
          summary: data.summary || '',
          heroImage: data.heroImage || '',
          takeaways: content.takeaways || [],
          references: content.references || [],
          sections: content.sections || [],
        });
        setArticleFontFamily(content.fontFamily || 'Inter');
        setArticleFontSize(content.fontSize || '1rem');
        setArticleTextColor(content.textColor || '#374151');
      })
      .catch((err) => {
        console.error(err);
        alert('Failed to load article from server.');
      });
  }, [articleId]);

  /* ----- Auto-save ----- */
  useEffect(() => {
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* ignore */ }
    }, 600);
    return () => clearTimeout(saveTimer.current);
  }, [state]);

  /* ----- Scroll progress + hero parallax ----- */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const handler = () => {
      const top = canvas.scrollTop;
      const height = canvas.scrollHeight - canvas.clientHeight;
      const bar = document.getElementById('ab-progress-fill');
      if (bar) bar.style.width = height > 0 ? (top / height) * 100 + '%' : '0%';
      const hero = canvas.querySelector('.ab-hero') as HTMLElement;
      if (hero) hero.style.setProperty('--hero-progress', String(Math.min(top / (hero.offsetHeight || 1), 1)));
    };
    canvas.addEventListener('scroll', handler, { passive: true });
    return () => canvas.removeEventListener('scroll', handler);
  }, []);

  /* ----- Generic meta updater ----- */
  const updateMeta = useCallback(<K extends keyof ArticleState>(key: K, value: ArticleState[K]) => {
    setState(prev => ({ ...prev, [key]: value }));
  }, []);

  /* ----- Block finder (flat) ----- */
  const findBlock = useCallback((id: string): Block | null => {
    for (const s of state.sections) {
      for (const b of s.blocks) {
        if (b.id === id) return b as Block;
        if (b.type === 'row') {
          const found = (b as RowBlock).columns.flat().find(c => c.id === id);
          if (found) return found;
        }
      }
    }
    return null;
  }, [state.sections]);

  /* ----- Block prop updater ----- */
  const updateBlockProp = useCallback((blockId: string, updates: Partial<Block>) => {
    setState(prev => {
      const mapBlock = (b: Block | RowBlock): Block | RowBlock => {
        if (b.id === blockId) return { ...b, ...updates } as Block;
        if (b.type === 'row') return { ...(b as RowBlock), columns: (b as RowBlock).columns.map(col => col.map(cb => cb.id === blockId ? { ...cb, ...updates } as Block : cb)) };
        return b;
      };
      return { ...prev, sections: prev.sections.map(s => ({ ...s, blocks: s.blocks.map(mapBlock) })) };
    });
  }, []);
  const updateBlockContent = useCallback((id: string, content: string) => updateBlockProp(id, { content }), [updateBlockProp]);

  /* ----- Section ops ----- */
  const addSection = useCallback(() => setState(prev => ({ ...prev, sections: [...prev.sections, { id: genId('s'), title: 'New Section', blocks: [] }] })), []);
  const insertSectionAfter = useCallback((idx: number) => setState(prev => { const s = [...prev.sections]; s.splice(idx + 1, 0, { id: genId('s'), title: 'New Section', blocks: [] }); return { ...prev, sections: s }; }), []);
  const deleteSection = useCallback((idx: number) => setState(prev => ({ ...prev, sections: prev.sections.filter((_, i) => i !== idx) })), []);
  const moveSection = useCallback((idx: number, dir: -1 | 1) => setState(prev => { const s = [...prev.sections]; const t = idx + dir; if (t < 0 || t >= s.length) return prev; [s[idx], s[t]] = [s[t], s[idx]]; return { ...prev, sections: s }; }), []);
  const updateSectionTitle = useCallback((idx: number, title: string) => setState(prev => { const s = [...prev.sections]; s[idx] = { ...s[idx], title }; return { ...prev, sections: s }; }), []);

  /* ----- Block delete ----- */
  const deleteBlock = useCallback((blockId: string) => {
    setState(prev => {
      const sections = prev.sections.map(s => {
        let blocks = s.blocks.filter(b => b.id !== blockId).map(b => {
          if (b.type === 'row') {
            const row = b as RowBlock;
            const cols = row.columns.map(col => col.filter(cb => cb.id !== blockId)).filter(col => col.length > 0);
            if (cols.length === 1) return cols[0][0];
            if (cols.length === 0) return null;
            return { ...row, columns: cols };
          }
          return b;
        }).filter(Boolean) as (Block | RowBlock)[];
        return { ...s, blocks };
      });
      return { ...prev, sections };
    });
  }, []);

  /* ----- Stats ops ----- */
  const updateStat = useCallback((blockId: string, idx: number, key: 'value' | 'label', val: string) => {
    setState(prev => {
      const mapBlock = (b: Block | RowBlock): Block | RowBlock => {
        const target = b.id === blockId ? b : (b.type === 'row' ? (b as RowBlock).columns.flat().find(c => c.id === blockId) : null);
        if (target && (target as Block).type === 'stats') {
          const stats = [...((target as Block).stats || [])];
          if (!stats[idx]) stats[idx] = { value: '—', label: 'Label' };
          stats[idx] = { ...stats[idx], [key]: val };
          if (b.id === blockId) return { ...(target as Block), stats } as Block;
          if (b.type === 'row') return { ...(b as RowBlock), columns: (b as RowBlock).columns.map(col => col.map(cb => cb.id === blockId ? { ...cb, stats } as Block : cb)) };
        }
        return b;
      };
      return { ...prev, sections: prev.sections.map(s => ({ ...s, blocks: s.blocks.map(mapBlock) })) };
    });
  }, []);
  const addStat = useCallback((id: string) => { const b = findBlock(id); if (b) updateBlockProp(id, { stats: [...(b.stats || []), { value: '—', label: 'Metric' }] }); }, [findBlock, updateBlockProp]);
  const removeStat = useCallback((id: string) => { const b = findBlock(id); if (b && b.stats && b.stats.length > 1) updateBlockProp(id, { stats: b.stats.slice(0, -1) }); }, [findBlock, updateBlockProp]);

  /* ----- Chart ops ----- */
  const updateChartData = useCallback((id: string, data: ChartDataItem[]) => updateBlockProp(id, { chartData: data }), [updateBlockProp]);
  const updateChartType = useCallback((id: string, chartType: ChartType) => updateBlockProp(id, { chartType }), [updateBlockProp]);

  /* ----- Video ops ----- */
  const updateVideoUrl = useCallback((id: string, url: string) => {
    const vid = extractYoutubeId(url);
    updateBlockProp(id, { videoUrl: url, content: vid || url, videoSourceType: vid ? 'youtube' : 'local' } as Partial<Block>);
  }, [updateBlockProp]);

  /* ----- Image upload ----- */
  const handleHeroUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { if (ev.target?.result) updateMeta('heroImage', ev.target.result as string); };
    reader.readAsDataURL(file);
  }, [updateMeta]);
  const handleImageUpload = useCallback((id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { if (ev.target?.result) updateBlockContent(id, ev.target.result as string); };
    reader.readAsDataURL(file);
  }, [updateBlockContent]);
  const handleVideoFileUpload = useCallback((id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { if (ev.target?.result) updateBlockProp(id, { videoUrl: ev.target.result as string, content: ev.target.result as string, videoSourceType: 'local' } as Partial<Block>); };
    reader.readAsDataURL(file);
  }, [updateBlockProp]);
  const handleTeamAvatarUpload = useCallback((id: string, memberIdx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const b = findBlock(id);
      if (b && b.teamMembers) {
        const members = [...b.teamMembers]; members[memberIdx] = { ...members[memberIdx], avatar: ev.target?.result as string };
        updateBlockProp(id, { teamMembers: members } as Partial<Block>);
      }
    };
    reader.readAsDataURL(file);
  }, [findBlock, updateBlockProp]);

  /* ----- List ops ----- */
  const updateListItem = useCallback((id: string, idx: number, text: string) => {
    const b = findBlock(id); if (!b || !b.listItems) return;
    const items = [...b.listItems]; items[idx] = { ...items[idx], text };
    updateBlockProp(id, { listItems: items } as Partial<Block>);
  }, [findBlock, updateBlockProp]);
  const toggleCheck = useCallback((id: string, idx: number) => {
    const b = findBlock(id); if (!b || !b.listItems) return;
    const items = [...b.listItems]; items[idx] = { ...items[idx], checked: !items[idx].checked };
    updateBlockProp(id, { listItems: items } as Partial<Block>);
  }, [findBlock, updateBlockProp]);
  const addListItem = useCallback((id: string) => { const b = findBlock(id); if (b) updateBlockProp(id, { listItems: [...(b.listItems || []), { text: 'New item', checked: false }] } as Partial<Block>); }, [findBlock, updateBlockProp]);
  const removeListItem = useCallback((id: string, idx: number) => { const b = findBlock(id); if (b && b.listItems) updateBlockProp(id, { listItems: b.listItems.filter((_, i) => i !== idx) } as Partial<Block>); }, [findBlock, updateBlockProp]);

  /* ----- Accordion ops ----- */
  const updateAccItem = useCallback((id: string, idx: number, key: 'question' | 'answer', val: string) => {
    const b = findBlock(id); if (!b || !b.accordionItems) return;
    const items = [...b.accordionItems]; items[idx] = { ...items[idx], [key]: val };
    updateBlockProp(id, { accordionItems: items } as Partial<Block>);
  }, [findBlock, updateBlockProp]);
  const addAccItem = useCallback((id: string) => { const b = findBlock(id); if (b) updateBlockProp(id, { accordionItems: [...(b.accordionItems || []), { question: 'New Question?', answer: 'Answer...' }] } as Partial<Block>); }, [findBlock, updateBlockProp]);
  const removeAccItem = useCallback((id: string, idx: number) => { const b = findBlock(id); if (b && b.accordionItems) updateBlockProp(id, { accordionItems: b.accordionItems.filter((_, i) => i !== idx) } as Partial<Block>); }, [findBlock, updateBlockProp]);

  /* ----- Timeline ops ----- */
  const updateTlNode = useCallback((id: string, idx: number, key: 'date' | 'title' | 'description', val: string) => {
    const b = findBlock(id); if (!b || !b.timelineNodes) return;
    const nodes = [...b.timelineNodes]; nodes[idx] = { ...nodes[idx], [key]: val };
    updateBlockProp(id, { timelineNodes: nodes } as Partial<Block>);
  }, [findBlock, updateBlockProp]);
  const addTlNode = useCallback((id: string) => { const b = findBlock(id); if (b) updateBlockProp(id, { timelineNodes: [...(b.timelineNodes || []), { date: '2025', title: 'New Event', description: '...' }] } as Partial<Block>); }, [findBlock, updateBlockProp]);
  const removeTlNode = useCallback((id: string, idx: number) => { const b = findBlock(id); if (b && b.timelineNodes) updateBlockProp(id, { timelineNodes: b.timelineNodes.filter((_, i) => i !== idx) } as Partial<Block>); }, [findBlock, updateBlockProp]);

  /* ----- Team member ops ----- */
  const updateTeamMember = useCallback((id: string, idx: number, key: 'name' | 'role' | 'bio', val: string) => {
    const b = findBlock(id); if (!b || !b.teamMembers) return;
    const members = [...b.teamMembers]; members[idx] = { ...members[idx], [key]: val };
    updateBlockProp(id, { teamMembers: members } as Partial<Block>);
  }, [findBlock, updateBlockProp]);
  const addTeamMember = useCallback((id: string) => { const b = findBlock(id); if (b) updateBlockProp(id, { teamMembers: [...(b.teamMembers || []), { name: 'Name', role: 'Role', bio: '...', avatar: '' }] } as Partial<Block>); }, [findBlock, updateBlockProp]);
  const removeTeamMember = useCallback((id: string, idx: number) => { const b = findBlock(id); if (b && b.teamMembers) updateBlockProp(id, { teamMembers: b.teamMembers.filter((_, i) => i !== idx) } as Partial<Block>); }, [findBlock, updateBlockProp]);

  /* ----- Array ops (takeaways / references) ----- */
  const addArrayItem = useCallback((key: 'takeaways' | 'references') => setState(prev => ({ ...prev, [key]: [...prev[key], 'New entry...'] })), []);
  const updateArrayItem = useCallback((key: 'takeaways' | 'references', idx: number, value: string) => setState(prev => { const a = [...prev[key]]; a[idx] = value; return { ...prev, [key]: a }; }), []);
  const removeArrayItem = useCallback((key: 'takeaways' | 'references', idx: number) => setState(prev => ({ ...prev, [key]: prev[key].filter((_, i) => i !== idx) })), []);

  /* ----- TOC (auto from section titles) ----- */
  const toc = useMemo(() => state.sections.map(s => s.title).filter(Boolean), [state.sections]);

  /* ================================================================
     DRAG & DROP
     ================================================================ */

  const handleToolboxDragStart = useCallback((e: React.DragEvent, type: BlockType) => {
    e.dataTransfer.setData('ab-type', type);
    e.dataTransfer.effectAllowed = 'copy';
  }, []);

  const handleBlockDragStart = useCallback((e: React.DragEvent, blockId: string) => {
    e.dataTransfer.setData('ab-id', blockId);
    e.dataTransfer.effectAllowed = 'move';
    e.stopPropagation();
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    const el = e.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    el.classList.remove('drop-top', 'drop-bottom', 'drop-left', 'drop-right');
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    if (x < rect.width * 0.25) el.classList.add('drop-left');
    else if (x > rect.width * 0.75) el.classList.add('drop-right');
    else if (y < rect.height * 0.5) el.classList.add('drop-top');
    else el.classList.add('drop-bottom');
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    (e.currentTarget as HTMLElement).classList.remove('drop-top', 'drop-bottom', 'drop-left', 'drop-right');
  }, []);

  const handleDropOnBlock = useCallback((e: React.DragEvent, sectionIdx: number, targetId: string) => {
    e.preventDefault(); e.stopPropagation();
    const el = e.currentTarget as HTMLElement;
    const pos = el.classList.contains('drop-left') ? 'left' : el.classList.contains('drop-right') ? 'right' : el.classList.contains('drop-top') ? 'top' : 'bottom';
    el.classList.remove('drop-top', 'drop-bottom', 'drop-left', 'drop-right');
    const existingId = e.dataTransfer.getData('ab-id');
    const newType = e.dataTransfer.getData('ab-type') as BlockType | '';

    if (existingId && existingId !== targetId) {
      setState(prev => {
        const sections = prev.sections.map(s => ({ ...s, blocks: [...s.blocks] }));
        const section = sections[sectionIdx]; if (!section) return prev;
        let movedBlock: (Block | RowBlock) | null = null;
        const filterAll = (blocks: (Block | RowBlock)[]): (Block | RowBlock)[] => {
          const result: (Block | RowBlock)[] = [];
          for (const b of blocks) {
            if (b.id === existingId) { movedBlock = b; continue; }
            if (b.type === 'row') {
              const row = b as RowBlock;
              const cols = row.columns.map(col => col.filter(cb => cb.id !== existingId)).filter(col => col.length > 0);
              if (cols.length === 1) result.push(cols[0][0]);
              else if (cols.length > 0) result.push({ ...row, columns: cols });
            } else result.push(b);
          }
          return result;
        };
        for (let si = 0; si < sections.length; si++) { sections[si].blocks = filterAll(sections[si].blocks); if (movedBlock) break; }
        if (!movedBlock) return prev;
        const tIdx = section.blocks.findIndex(b => b.id === targetId);
        const targetBlock = section.blocks[tIdx];
        if (tIdx >= 0) {
          if (targetBlock.type === 'row' && (targetBlock as RowBlock).columns.length < 3) {
            if (pos === 'left') (targetBlock as RowBlock).columns.unshift([movedBlock as Block]);
            else if (pos === 'right') (targetBlock as RowBlock).columns.push([movedBlock as Block]);
            else if (pos === 'top') section.blocks.splice(tIdx, 0, movedBlock);
            else section.blocks.splice(tIdx + 1, 0, movedBlock);
          } else {
            if (pos === 'left') section.blocks.splice(tIdx, 1, { id: genId('row'), type: 'row', columns: [[movedBlock as Block], [section.blocks[tIdx] as Block]] });
            else if (pos === 'right') section.blocks.splice(tIdx, 1, { id: genId('row'), type: 'row', columns: [[section.blocks[tIdx] as Block], [movedBlock as Block]] });
            else if (pos === 'top') section.blocks.splice(tIdx, 0, movedBlock);
            else section.blocks.splice(tIdx + 1, 0, movedBlock);
          }
        }
        return { ...prev, sections };
      });
      return;
    }

    if (!newType) return;
    const newBlock = createBlock(newType);
    setState(prev => {
      const sections = prev.sections.map(s => ({ ...s, blocks: [...s.blocks] }));
      const section = sections[sectionIdx]; if (!section) return prev;
      const tIdx = section.blocks.findIndex(b => b.id === targetId);
      const targetBlock = section.blocks[tIdx];
      if (tIdx >= 0) {
        if (targetBlock.type === 'row' && (targetBlock as RowBlock).columns.length < 3) {
          if (pos === 'left') (targetBlock as RowBlock).columns.unshift([newBlock]);
          else if (pos === 'right') (targetBlock as RowBlock).columns.push([newBlock]);
          else if (pos === 'top') section.blocks.splice(tIdx, 0, newBlock);
          else section.blocks.splice(tIdx + 1, 0, newBlock);
        } else {
          if (pos === 'left') section.blocks.splice(tIdx, 1, { id: genId('row'), type: 'row', columns: [[newBlock], [section.blocks[tIdx] as Block]] });
          else if (pos === 'right') section.blocks.splice(tIdx, 1, { id: genId('row'), type: 'row', columns: [[section.blocks[tIdx] as Block], [newBlock]] });
          else if (pos === 'top') section.blocks.splice(tIdx, 0, newBlock);
          else section.blocks.splice(tIdx + 1, 0, newBlock);
        }
      }
      return { ...prev, sections };
    });
  }, []);

  const handleDropOnAppend = useCallback((e: React.DragEvent, sectionIdx: number) => {
    e.preventDefault(); e.currentTarget.classList.remove('drag-over');
    const existingId = e.dataTransfer.getData('ab-id');
    const newType = e.dataTransfer.getData('ab-type') as BlockType | '';
    if (existingId) {
      setState(prev => {
        const sections = prev.sections.map(s => ({ ...s, blocks: [...s.blocks] }));
        let moved: (Block | RowBlock) | null = null;
        const filterAll = (blocks: (Block | RowBlock)[]): (Block | RowBlock)[] => {
          const result: (Block | RowBlock)[] = [];
          for (const b of blocks) {
            if (b.id === existingId) { moved = b; continue; }
            if (b.type === 'row') {
              const row = b as RowBlock;
              const cols = row.columns.map(col => col.filter(cb => cb.id !== existingId)).filter(col => col.length > 0);
              if (cols.length === 1) result.push(cols[0][0]);
              else if (cols.length > 0) result.push({ ...row, columns: cols });
            } else result.push(b);
          }
          return result;
        };
        for (let si = 0; si < sections.length; si++) { sections[si].blocks = filterAll(sections[si].blocks); if (moved) break; }
        if (moved) sections[sectionIdx].blocks.push(moved);
        return { ...prev, sections };
      });
      return;
    }
    if (newType) {
      setState(prev => { const s = [...prev.sections]; s[sectionIdx] = { ...s[sectionIdx], blocks: [...s[sectionIdx].blocks, createBlock(newType)] }; return { ...prev, sections: s }; });
    }
  }, []);

  const handleRowColDrop = useCallback((e: React.DragEvent, rowId: string, colIdx: number) => {
    e.preventDefault();
    const nt = e.dataTransfer.getData('ab-type');
    if (!nt) return;
    setState(prev => ({
      ...prev,
      sections: prev.sections.map(s => ({
        ...s, blocks: s.blocks.map(b => {
          if (b.id === rowId) { const r = b as RowBlock; return { ...r, columns: r.columns.map((c, i) => i === colIdx ? [...c, createBlock(nt as BlockType)] : c) }; }
          return b;
        }),
      })),
    }));
  }, []);

  const insertBlockDirectly = useCallback((sectionIdx: number, targetId: string, type: BlockType) => {
    const newBlock = createBlock(type);
    setState(prev => {
      const sections = prev.sections.map(s => ({ ...s, blocks: [...s.blocks] }));
      const section = sections[sectionIdx]; if (!section) return prev;
      const tIdx = section.blocks.findIndex(b => b.id === targetId);
      if (tIdx >= 0) section.blocks.splice(tIdx + 1, 0, newBlock);
      return { ...prev, sections };
    });
    setQuickAddMenu(null);
  }, []);

  const handleDragOverAppend = useCallback((e: React.DragEvent) => { e.preventDefault(); e.currentTarget.classList.add('drag-over'); }, []);
  const handleDragLeaveAppend = useCallback((e: React.DragEvent) => { e.currentTarget.classList.remove('drag-over'); }, []);

  /* ================================================================
     LINK TOOLBAR
     ================================================================ */

  

  const applyLink = useCallback(() => {
    if (!linkToolbar.url) { setLinkToolbar(prev => ({ ...prev, visible: false })); return; }
    const sel = window.getSelection();
    if (sel && !sel.isCollapsed && sel.rangeCount) {
      const range = sel.getRangeAt(0);
      const anchor = document.createElement('a');
      anchor.href = linkToolbar.url; anchor.target = '_blank'; anchor.rel = 'noopener noreferrer';
      anchor.textContent = range.toString();
      range.deleteContents(); range.insertNode(anchor);
      range.setStartAfter(anchor); sel.removeAllRanges(); sel.addRange(range);
    }
    setLinkToolbar(prev => ({ ...prev, visible: false }));
  }, [linkToolbar.url]);

  const applyFormat = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
  }, []);

  const removeLink = useCallback(() => {
    const sel = window.getSelection();
    if (sel && !sel.isCollapsed && sel.rangeCount) {
      const range = sel.getRangeAt(0);
      const container = range.commonAncestorContainer;
      const anchor = container.nodeType === 3 ? container.parentElement?.closest('a') : (container as HTMLElement).closest('a');
      if (anchor && anchor.parentNode) { anchor.parentNode.replaceChild(document.createTextNode(anchor.textContent || ''), anchor); }
    }
    setLinkToolbar(prev => ({ ...prev, visible: false }));
  }, []);

  

  /* Close export dropdown on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (exportDropdownOpen && exportDropdownRef.current && !exportDropdownRef.current.contains(e.target as HTMLElement))
        setExportDropdownOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [exportDropdownOpen]);

  /* ---- Floating toolbar: track active contenteditable block ---- */
  const handleBlockFocus = useCallback((blockId: string) => {
    setActiveBlockId(blockId);
    requestAnimationFrame(() => {
      const el = document.querySelector(`[data-block-id="${blockId}"]`) as HTMLElement;
      if (el) {
        const rect = el.getBoundingClientRect();
        const canvasEl = canvasRef.current;
        const canvasRect = canvasEl?.getBoundingClientRect();
        if (canvasRect) {
          setActiveBlockRect({
            x: Math.max(200, Math.min(rect.left + rect.width / 2, window.innerWidth - 200)),
            y: Math.max(68, rect.top - 8),
          });
        }
      }
    });
  }, []);

  const handleBlockBlur = useCallback((e: React.FocusEvent) => {
    const related = e.relatedTarget as HTMLElement | null;
    if (related && floatingToolbarRef.current?.contains(related)) return;
    setTimeout(() => {
      const sel = window.getSelection();
      if (sel && !sel.isCollapsed && sel.rangeCount) return;
      setActiveBlockId(null);
      setActiveBlockRect(null);
    }, 150);
  }, []);

  /* Update toolbar position on scroll */
  useEffect(() => {
    if (!activeBlockId) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const handler = () => {
      const el = document.querySelector(`[data-block-id="${activeBlockId}"]`) as HTMLElement;
      if (el) {
        const rect = el.getBoundingClientRect();
        setActiveBlockRect({ x: Math.max(200, Math.min(rect.left + rect.width / 2, window.innerWidth - 200)), y: rect.top - 8 });
      }
    };
    canvas.addEventListener('scroll', handler, { passive: true });
    return () => canvas.removeEventListener('scroll', handler);
  }, [activeBlockId]);

  /* Article-wide style settings */
  const ARTICLE_FONTS = [
    { value: 'Inter', label: 'Inter' },
    { value: 'Space Grotesk', label: 'Space Grotesk' },
    { value: 'Georgia', label: 'Georgia' },
    { value: 'system-ui', label: 'System' },
  ];
  const ARTICLE_SIZES = [
    { value: '0.875rem', label: 'Small' },
    { value: '1rem', label: 'Medium' },
    { value: '1.125rem', label: 'Large' },
    { value: '1.25rem', label: 'XL' },
  ];
  const ARTICLE_COLORS = [
    { value: '#374151', label: 'Default' },
    { value: '#1f2629', label: 'Dark' },
    { value: '#204383', label: 'Navy' },
    { value: '#1f6f5c', label: 'Mint' },
    { value: '#4b5563', label: 'Muted' },
    { value: '#000000', label: 'Black' },
  ];

  /* ================================================================
     EXPORT HANDLERS
     ================================================================ */

  const handleExportMd   = useCallback(() => { download(exportMd(state),   `${sanitizeSlug(state.title)}.md`,   'text/markdown'); setExportDropdownOpen(false); }, [state]);
  const handleExportHtml = useCallback(() => { download(exportHtml(state),  `${sanitizeSlug(state.title)}.html`, 'text/html'); setExportDropdownOpen(false); }, [state]);
  const handleExportJson = useCallback(() => { download(exportJson(state),  `${sanitizeSlug(state.title)}.json`, 'application/json'); setExportDropdownOpen(false); }, [state]);

  const handleSave = useCallback((isPublished: boolean = true) => {
    const token = localStorage.getItem('bfc_token');
    if (!token) {
      alert('You must be logged in to save articles.');
      navigate('/login');
      return;
    }

    setSaveStatus('saving');

    const payload = {
      title: state.title || 'Untitled Article',
      subtitle: state.subtitle || '',
      category: state.category || 'Strategy',
      author: state.author || 'BFC Insights',
      publishDate: state.date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      readingTime: state.readingTime || '8 min read',
      summary: state.summary || '',
      heroImage: state.heroImage || '',
      contentJson: JSON.stringify({
        takeaways: state.takeaways,
        references: state.references,
        sections: state.sections,
        isPublished: isPublished,
        fontFamily: articleFontFamily,
        fontSize: articleFontSize,
        textColor: articleTextColor
      })
    };

    const isEdit = articleId !== null;
    const url = isEdit ? `${API_URL}/api/articles/${articleId}` : `${API_URL}/api/articles`;
    const method = isEdit ? 'PUT' : 'POST';

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    })
      .then((res) => {
        if (!res.ok) throw new Error('Save failed');
        return res.json();
      })
      .then((data) => {
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
        if (!isEdit && data.id) {
          setArticleId(data.id);
          setSearchParams({ id: String(data.id) });
        }
      })
      .catch((err) => {
        console.error(err);
        setSaveStatus('idle');
        alert('Failed to save article to server.');
      });
  }, [state, articleId, navigate, setSearchParams]);

  /* ================================================================
     RENDER: BLOCK
     ================================================================ */

  const renderBlock = (block: Block | RowBlock, sectionIdx: number, isInRow = false): React.ReactNode => {
    if (block.type === 'row') {
      const row = block as RowBlock;
      return (
        <div className="ab-row" key={row.id}>
          {(row.columns || []).map((col, ci) => (
            <div className="ab-row-col" key={ci}
              onDragOver={handleDragOverAppend} onDragLeave={handleDragLeaveAppend}
              onDrop={e => handleRowColDrop(e, row.id, ci)}
            >
              {(col || []).map(cb => renderBlock(cb, sectionIdx, true))}
              {mode === 'edit' && (
                <div className="ab-append-zone" style={{ minHeight: 32 }}
                  onDragOver={handleDragOverAppend} onDragLeave={handleDragLeaveAppend}
                  onDrop={e => handleRowColDrop(e, row.id, ci)}
                >
                  <span className="ab-append-text">+ Drop here</span>
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }

    const isEdit = mode === 'edit';
    const blk = block as Block;

    const ctaColorMap: Record<string, string> = { navy: '#204383', mint: '#1f6f5c', slate: '#374151' };

    const blockEl = (() => {
      switch (blk.type) {

        case 'heading':
          return (
            <div className="ab-block-heading">
              <h2 contentEditable={isEdit} suppressContentEditableWarning
                data-block-id={blk.id}
                onFocus={() => handleBlockFocus(blk.id)} onBlur={e => { handleBlockBlur(e); updateBlockContent(blk.id, e.currentTarget.innerText); }}>
                {isEdit ? blk.content : <MD text={blk.content} />}
              </h2>
            </div>
          );

        case 'text':
          return (
            <div className="ab-block-text">
              <p contentEditable={isEdit} suppressContentEditableWarning
                data-block-id={blk.id}
                onFocus={() => handleBlockFocus(blk.id)} onBlur={e => { handleBlockBlur(e); updateBlockContent(blk.id, e.currentTarget.innerText); }}>
                {isEdit ? (blk.content || '') : <MD text={blk.content} />}
              </p>
            </div>
          );

        case 'quote':
          return (
            <div className="ab-block-quote">
              <blockquote contentEditable={isEdit} suppressContentEditableWarning
                data-block-id={blk.id}
                onFocus={() => handleBlockFocus(blk.id)} onBlur={e => { handleBlockBlur(e); updateBlockContent(blk.id, e.currentTarget.innerText); }}>
                {blk.content || ''}
              </blockquote>
            </div>
          );

        case 'callout':
          return (
            <div className="ab-block-callout">
              <svg width="20" height="20" fill="none" stroke="#204383" viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: 2 }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p contentEditable={isEdit} suppressContentEditableWarning
                data-block-id={blk.id}
                onFocus={() => handleBlockFocus(blk.id)} onBlur={e => { handleBlockBlur(e); updateBlockContent(blk.id, e.currentTarget.innerText); }}>
                {blk.content || ''}
              </p>
            </div>
          );

        case 'focus-area':
          return (
            <div className="ab-block-focus">
              <span className="ab-block-focus-label"
                contentEditable={isEdit} suppressContentEditableWarning
                onBlur={e => updateBlockProp(blk.id, { focusTitle: e.currentTarget.innerText } as Partial<Block>)}>
                {blk.focusTitle || 'Focus Area'}
              </span>
              <h3 contentEditable={isEdit} suppressContentEditableWarning
                data-block-id={blk.id}
                onFocus={() => handleBlockFocus(blk.id)} onBlur={e => { handleBlockBlur(e); updateBlockContent(blk.id, e.currentTarget.innerText); }}>
                {blk.content || ''}
              </h3>
            </div>
          );

        case 'divider':
          return (
            <div>
              <div style={{ height: 1, background: blk.content || '#000000', margin: '2.5rem auto', width: '50%' }} />
              {isEdit && (
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: -20, marginBottom: 20 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#6b7280' }}>Color:</span>
                  <input type="color" value={blk.content || '#000000'} onChange={e => updateBlockContent(blk.id, e.target.value)} style={{ width: 24, height: 24, padding: 0, border: 'none', cursor: 'pointer' }} />
                </div>
              )}
            </div>
          );

        case 'image': {
          const imgStyle = blk.imageStyle || 'leaf';
          const aspect = blk.imageAspectRatio || 'landscape';
          const arMap: Record<string, string> = { landscape: '3/2', portrait: '2/3', square: '1/1', banner: '21/9' };
          const borderRadius = imgStyle === 'leaf' ? '48px 12px 48px 12px' : imgStyle === 'rounded' ? '16px' : imgStyle === 'skewed' ? '28px 8px 28px 8px' : '12px 36px 12px 36px';
          return (
            <div>
              <div style={{ aspectRatio: arMap[aspect] || '3/2', background: '#f3f4f6', borderRadius, overflow: 'hidden', position: 'relative' }}>
                {blk.content
                  ? <img src={blk.content} alt={blk.imageCaption || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#9ca3af', fontSize: 14 }}>No image</div>}
                {isEdit && (
                  <div className="ab-media-overlay">
                    <div style={{ background: '#fff', padding: '8px 12px', borderRadius: 0, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', maxWidth: '90%' }}>
                      <input type="text" placeholder="Paste URL..." style={{ fontSize: 11, padding: '4px 8px', border: '1px solid #dce0e6', borderRadius: 0, outline: 'none', width: 120, flex: 1 }}
                        value={blk.content && !blk.content.startsWith('data:') ? blk.content : ''} onChange={e => updateBlockContent(blk.id, e.target.value)} />
                      <span style={{ fontSize: 9, fontWeight: 700, color: '#9ca3af' }}>OR</span>
                      <label style={{ cursor: 'pointer', background: '#204383', color: '#fff', padding: '5px 10px', borderRadius: 0, fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' }}>
                        Upload <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleImageUpload(blk.id, e)} />
                      </label>
                    </div>
                  </div>
                )}
              </div>
              {isEdit && (
                <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                  {(['leaf', 'rounded', 'skewed', 'asymmetric'] as ImageStyle[]).map(s => (
                    <button key={s} type="button" onClick={() => updateBlockProp(blk.id, { imageStyle: s } as Partial<Block>)}
                      style={{ fontSize: 10, padding: '3px 8px', borderRadius: 0, border: '1px solid', borderColor: blk.imageStyle === s ? '#204383' : '#e0e4ea', background: blk.imageStyle === s ? '#204383' : '#fff', color: blk.imageStyle === s ? '#fff' : '#6b7280', cursor: 'pointer', fontWeight: 700 }}>
                      {s}
                    </button>
                  ))}
                  {(['landscape', 'portrait', 'square', 'banner'] as ImageAspectRatio[]).map(s => (
                    <button key={s} type="button" onClick={() => updateBlockProp(blk.id, { imageAspectRatio: s } as Partial<Block>)}
                      style={{ fontSize: 10, padding: '3px 8px', borderRadius: 0, border: '1px solid', borderColor: blk.imageAspectRatio === s ? '#99cdb3' : '#e0e4ea', background: blk.imageAspectRatio === s ? 'rgba(153,205,179,0.15)' : '#fff', color: blk.imageAspectRatio === s ? '#1f6f5c' : '#6b7280', cursor: 'pointer', fontWeight: 700 }}>
                      {s}
                    </button>
                  ))}
                  <input type="text" placeholder="Caption..." style={{ fontSize: 10, padding: '3px 8px', border: '1px solid #e0e4ea', borderRadius: 0, outline: 'none', flex: 1, minWidth: 100 }}
                    value={blk.imageCaption || ''} onChange={e => updateBlockProp(blk.id, { imageCaption: e.target.value } as Partial<Block>)} />
                </div>
              )}
              {blk.imageCaption && !isEdit && <p style={{ fontSize: 11, color: '#9ca3af', textAlign: 'center', marginTop: 4, fontStyle: 'italic' }}>{blk.imageCaption}</p>}
            </div>
          );
        }

        case 'video':
          return (
            <div>
              {blk.videoSourceType === 'youtube' && extractYoutubeId(blk.videoUrl || '')
                ? <div className="ab-video-container"><iframe src={`https://www.youtube.com/embed/${extractYoutubeId(blk.videoUrl || '')}`} title="Video" allowFullScreen /></div>
                : blk.videoSourceType === 'local' && blk.videoUrl
                  ? <div className="ab-video-container"><video src={blk.videoUrl} controls /></div>
                  : <div className="ab-video-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1f2629' }}><span style={{ color: '#6b7280', fontSize: 13 }}>No video loaded</span></div>}
              {isEdit && (
                <div className="ab-video-input-group">
                  <input type="text" placeholder="Paste YouTube URL..." className="ab-video-input"
                    value={blk.videoSourceType === 'youtube' ? blk.videoUrl || '' : ''}
                    onChange={e => updateVideoUrl(blk.id, e.target.value)} />
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#9ca3af' }}>OR</span>
                  <label style={{ cursor: 'pointer', background: '#204383', color: '#fff', padding: '5px 10px', borderRadius: 0, fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' }}>
                    Upload MP4 <input type="file" accept="video/*" style={{ display: 'none' }} onChange={e => handleVideoFileUpload(blk.id, e)} />
                  </label>
                </div>
              )}
            </div>
          );

        case 'stats': {
          const stats = blk.stats || [];
          return (
            <div>
              <div className="ab-stats-grid" style={{ gridTemplateColumns: `repeat(${Math.max(1, stats.length)}, 1fr)` }}>
                {stats.map((s, i) => (
                  <div className="ab-stat-item" key={i}>
                    <span className="ab-stat-value" contentEditable={isEdit} suppressContentEditableWarning onBlur={e => updateStat(blk.id, i, 'value', e.currentTarget.innerText)}>{s.value}</span>
                    <span className="ab-stat-label" contentEditable={isEdit} suppressContentEditableWarning onBlur={e => updateStat(blk.id, i, 'label', e.currentTarget.innerText)}>{s.label}</span>
                  </div>
                ))}
              </div>
              {isEdit && (
                <div style={{ display: 'flex', gap: 6, marginTop: 8, justifyContent: 'flex-end' }}>
                  <button type="button" style={{ fontSize: 10, fontWeight: 700, padding: '4px 12px', border: '1px solid #e0e4ea', borderRadius: 0, cursor: 'pointer', color: '#374151', background: '#fff' }} onClick={() => addStat(blk.id)}>+ Metric</button>
                  {stats.length > 1 && <button type="button" style={{ fontSize: 10, fontWeight: 700, padding: '4px 12px', border: '1px solid #fecaca', borderRadius: 0, cursor: 'pointer', color: '#ef4444', background: '#fff' }} onClick={() => removeStat(blk.id)}>− Remove</button>}
                </div>
              )}
            </div>
          );
        }

        case 'chart': {
          const data = blk.chartData || defaultChartData();
          const chartType = blk.chartType || 'bar';
          return (
            <div className="ab-chart-container">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#204383' }}>{blk.chartDataTitle || 'Data Chart'}</span>
                {isEdit && <input type="text" placeholder="Chart title" style={{ fontSize: 10, padding: '3px 8px', border: '1px solid #e0e4ea', borderRadius: 0, outline: 'none', width: 120 }}
                  value={blk.chartDataTitle || ''} onChange={e => updateBlockProp(blk.id, { chartDataTitle: e.target.value } as Partial<Block>)} />}
              </div>
              {isEdit && (
                <div className="ab-chart-type-select">
                  {(['bar', 'line', 'pie', 'area', 'radar'] as ChartType[]).map(ct => (
                    <button key={ct} type="button" className={`ab-chart-type-btn ${chartType === ct ? 'ab-chart-type-btn--active' : ''}`} onClick={() => updateChartType(blk.id, ct)}>
                      {ct.charAt(0).toUpperCase() + ct.slice(1)}
                    </button>
                  ))}
                </div>
              )}
              <div style={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === 'bar'
                    ? <ReBarChart data={data}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><RcTooltip /><Bar dataKey="value" fill="#204383" radius={[0,0,0,0]} /></ReBarChart>
                    : chartType === 'line'
                      ? <ReLineChart data={data}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><RcTooltip /><Line type="monotone" dataKey="value" stroke="#204383" strokeWidth={2} dot={{ fill: '#204383' }} /></ReLineChart>
                      : chartType === 'pie'
                        ? <RePieChart><RcTooltip /><Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>{data.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}</Pie></RePieChart>
                        : chartType === 'area'
                          ? <AreaChart data={data}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><RcTooltip /><Area type="monotone" dataKey="value" stroke="#204383" fill="#99cdb3" fillOpacity={0.35} strokeWidth={2} /></AreaChart>
                          : <RadarChart data={data}><PolarGrid stroke="#e5e7eb" /><PolarAngleAxis dataKey="name" tick={{ fontSize: 10 }} /><PolarRadiusAxis angle={30} tick={{ fontSize: 8 }} /><Radar dataKey="value" stroke="#204383" fill="#99cdb3" fillOpacity={0.35} strokeWidth={2} /></RadarChart>}
                </ResponsiveContainer>
              </div>
              {isEdit && (
                <div className="ab-chart-data-edit">
                  {data.map((d, i) => (
                    <div className="ab-chart-data-row" key={i}>
                      <input className="ab-chart-data-input" value={d.name} onChange={e => { const nd = [...data]; nd[i] = { ...nd[i], name: e.target.value }; updateChartData(blk.id, nd); }} placeholder="Label" />
                      <input className="ab-chart-data-val" type="number" value={d.value} onChange={e => { const nd = [...data]; nd[i] = { ...nd[i], value: Number(e.target.value) || 0 }; updateChartData(blk.id, nd); }} placeholder="Val" />
                      {i === data.length - 1 && <button type="button" style={{ fontSize: 10, padding: '3px 8px', border: '1px solid #e0e4ea', borderRadius: 0, cursor: 'pointer', background: '#fff', color: '#6b7280' }} onClick={() => updateChartData(blk.id, [...data, { name: '', value: 0 }])}>+</button>}
                      {data.length > 1 && <button type="button" style={{ fontSize: 10, padding: '3px 8px', border: '1px solid #fecaca', borderRadius: 0, cursor: 'pointer', background: '#fff', color: '#ef4444' }} onClick={() => updateChartData(blk.id, data.filter((_, j) => j !== i))}>✕</button>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        }

        case 'list': {
          const items = blk.listItems || [];
          const listStyle = blk.listStyle || 'bullet';
          return (
            <div>
              {isEdit && (
                <div className="ab-list-style-btns">
                  {(['bullet', 'numbered', 'checklist'] as ListStyle[]).map(ls => (
                    <button key={ls} type="button" className={`ab-list-style-btn ${listStyle === ls ? 'ab-list-style-btn--active' : ''}`} onClick={() => updateBlockProp(blk.id, { listStyle: ls } as Partial<Block>)}>
                      {ls === 'bullet' ? '• Bullet' : ls === 'numbered' ? '1. Numbered' : '☑ Checklist'}
                    </button>
                  ))}
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {items.map((item, i) => (
                  <div key={i} className="ab-list-item-row">
                    {listStyle === 'bullet'    && <span style={{ color: '#204383', fontWeight: 700, fontSize: 16, lineHeight: 1 }}>•</span>}
                    {listStyle === 'numbered'  && <span style={{ color: '#204383', fontWeight: 700, fontSize: 12, minWidth: 18 }}>{i + 1}.</span>}
                    {listStyle === 'checklist' && <input type="checkbox" checked={item.checked || false} onChange={() => toggleCheck(blk.id, i)} style={{ width: 16, height: 16, accentColor: '#204383', flexShrink: 0 }} />}
                    {isEdit
                      ? <input type="text" className="ab-list-item-input" value={item.text} onChange={e => updateListItem(blk.id, i, e.target.value)} />
                      : <span style={{ fontSize: '0.92rem', color: item.checked ? 'rgba(0,0,0,0.3)' : 'inherit', textDecoration: item.checked ? 'line-through' : 'none' }}>{item.text}</span>}
                    {isEdit && <button type="button" className="ab-list-item-del" onClick={() => removeListItem(blk.id, i)}>✕</button>}
                  </div>
                ))}
              </div>
              {isEdit && <button type="button" onClick={() => addListItem(blk.id)} style={{ marginTop: 8, fontSize: 10, fontWeight: 700, padding: '5px 0', border: '1px dashed #e0e4ea', borderRadius: 0, cursor: 'pointer', color: '#9ca3af', background: 'transparent', width: '100%' }}>+ Add Item</button>}
            </div>
          );
        }

        case 'accordion': {
          const items = blk.accordionItems || [];
          const openIdx = openAccordions[blk.id] ?? null;
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {items.map((item, i) => (
                <div key={i} className="ab-accordion-item">
                  {isEdit ? (
                    <div className="ab-accordion-edit">
                      <input type="text" className="ab-accordion-q-input" value={item.question} onChange={e => updateAccItem(blk.id, i, 'question', e.target.value)} placeholder="Question" />
                      <textarea className="ab-accordion-a-input" rows={2} value={item.answer} onChange={e => updateAccItem(blk.id, i, 'answer', e.target.value)} placeholder="Answer" />
                      <button type="button" onClick={() => removeAccItem(blk.id, i)} style={{ fontSize: 10, color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 700 }}>Remove</button>
                    </div>
                  ) : (
                    <>
                      <button type="button" onClick={() => setOpenAccordions(prev => ({ ...prev, [blk.id]: prev[blk.id] === i ? null : i }))}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '12px 14px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', borderBottom: openIdx === i ? '1px solid #e5e7eb' : 'none' }}>
                        <svg style={{ width: 16, height: 16, color: '#99cdb3', flexShrink: 0, transform: openIdx === i ? 'rotate(90deg)' : '', transition: 'transform 0.2s' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'inherit' }}>{item.question}</span>
                      </button>
                      {openIdx === i && <div style={{ padding: '12px 14px', fontSize: '0.85rem', color: 'inherit', opacity: 0.7, lineHeight: 1.6 }}>{item.answer}</div>}
                    </>
                  )}
                </div>
              ))}
              {isEdit && <button type="button" onClick={() => addAccItem(blk.id)} style={{ fontSize: 10, fontWeight: 700, padding: '6px 0', border: '1px dashed #e0e4ea', borderRadius: 0, cursor: 'pointer', color: '#9ca3af', background: 'transparent', width: '100%' }}>+ Add Item</button>}
            </div>
          );
        }

        case 'timeline': {
          const nodes = blk.timelineNodes || [];
          return (
            <div className="ab-timeline">
              {nodes.map((node, i) => (
                <div key={i} className="ab-timeline-node">
                  <div className="ab-timeline-dot" />
                  {isEdit ? (
                    <div className="ab-timeline-edit">
                      <input className="ab-timeline-input" style={{ fontSize: 10, fontWeight: 700, color: 'inherit', opacity: 0.6 }} value={node.date} onChange={e => updateTlNode(blk.id, i, 'date', e.target.value)} placeholder="Date / Year" />
                      <input className="ab-timeline-input" style={{ fontWeight: 600, color: 'inherit' }} value={node.title} onChange={e => updateTlNode(blk.id, i, 'title', e.target.value)} placeholder="Title" />
                      <textarea className="ab-timeline-input" style={{ resize: 'none', color: 'inherit' }} rows={2} value={node.description} onChange={e => updateTlNode(blk.id, i, 'description', e.target.value)} placeholder="Description" />
                      <button type="button" onClick={() => removeTlNode(blk.id, i)} style={{ fontSize: 10, color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 700 }}>Remove</button>
                    </div>
                  ) : (
                    <>
                      <div className="ab-timeline-date">{node.date}</div>
                      <div className="ab-timeline-title">{node.title}</div>
                      <div className="ab-timeline-desc">{node.description}</div>
                    </>
                  )}
                </div>
              ))}
              {isEdit && <button type="button" onClick={() => addTlNode(blk.id)} style={{ fontSize: 10, fontWeight: 700, padding: '5px 12px', border: '1px solid #e0e4ea', borderRadius: 0, cursor: 'pointer', color: '#6b7280', background: '#f8fafc' }}>+ Add Node</button>}
            </div>
          );
        }

        case 'cta': {
          const cs = blk.ctaStyle || 'navy';
          const color = ctaColorMap[cs] || '#204383';
          return (
            <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
              {isEdit ? (
                <div style={{ maxWidth: 320, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <input type="text" style={{ fontSize: 12, padding: '8px 12px', border: '1px solid #e0e4ea', borderRadius: 0, outline: 'none', fontWeight: 600, textAlign: 'center' }}
                    value={blk.ctaButtonText || 'Learn More'} onChange={e => updateBlockProp(blk.id, { ctaButtonText: e.target.value } as Partial<Block>)} placeholder="Button text" />
                  <input type="url" style={{ fontSize: 12, padding: '8px 12px', border: '1px solid #e0e4ea', borderRadius: 0, outline: 'none' }}
                    value={blk.ctaLink || ''} onChange={e => updateBlockProp(blk.id, { ctaLink: e.target.value } as Partial<Block>)} placeholder="https://..." />
                  <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                    {(['navy', 'mint', 'slate'] as CtaStyle[]).map(s => (
                      <button key={s} type="button" onClick={() => updateBlockProp(blk.id, { ctaStyle: s } as Partial<Block>)}
                        style={{ fontSize: 11, fontWeight: 700, padding: '4px 14px', borderRadius: 0, border: '1px solid', cursor: 'pointer', borderColor: cs === s ? ctaColorMap[s] : '#e0e4ea', background: cs === s ? ctaColorMap[s] : '#fff', color: cs === s ? '#fff' : '#6b7280' }}>
                        {s}
                      </button>
                    ))}
                  </div>
                  <a className="ab-cta-preview-btn" href={blk.ctaLink || '#'} style={{ background: color }}>{blk.ctaButtonText || 'Learn More'}</a>
                </div>
              ) : (
                <a className="ab-cta-preview-btn" href={blk.ctaLink || '#'} target="_blank" rel="noopener noreferrer" style={{ background: color }}>{blk.ctaButtonText || 'Learn More'}</a>
              )}
            </div>
          );
        }

        case 'team-member': {
          const members = blk.teamMembers || [];
          return (
            <div className="ab-team-grid">
              {members.map((m, i) => (
                <div key={i} className="ab-team-card">
                  {isEdit ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
                      <div className="ab-team-avatar" style={{ cursor: 'pointer' }}>
                        {m.avatar ? <img src={m.avatar} alt="" /> : <span className="ab-team-initial">{m.name.charAt(0) || '?'}</span>}
                      </div>
                      <label style={{ fontSize: 10, color: '#204383', fontWeight: 700, cursor: 'pointer' }}>
                        Upload Photo <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleTeamAvatarUpload(blk.id, i, e)} />
                      </label>
                      <input type="text" style={{ width: '100%', fontSize: 12, padding: '4px 0', borderBottom: '1px solid #e5e7eb', outline: 'none', textAlign: 'center', fontWeight: 700, background: 'transparent' }} value={m.name} onChange={e => updateTeamMember(blk.id, i, 'name', e.target.value)} />
                      <input type="text" style={{ width: '100%', fontSize: 11, padding: '4px 0', borderBottom: '1px solid #e5e7eb', outline: 'none', textAlign: 'center', color: '#6b7280', background: 'transparent' }} value={m.role} onChange={e => updateTeamMember(blk.id, i, 'role', e.target.value)} />
                      <textarea style={{ width: '100%', fontSize: 11, padding: '6px 8px', border: '1px solid #e5e7eb', borderRadius: 0, outline: 'none', resize: 'none', color: '#6b7280', background: '#f8fafc' }} rows={2} value={m.bio} onChange={e => updateTeamMember(blk.id, i, 'bio', e.target.value)} />
                      <button type="button" onClick={() => removeTeamMember(blk.id, i)} style={{ fontSize: 10, color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 700 }}>Remove</button>
                    </div>
                  ) : (
                    <>
                      <div className="ab-team-avatar">
                        {m.avatar ? <img src={m.avatar} alt={m.name} /> : <span className="ab-team-initial">{m.name.charAt(0) || '?'}</span>}
                      </div>
                      <div className="ab-team-name">{m.name}</div>
                      <div className="ab-team-role">{m.role}</div>
                      <div className="ab-team-bio">{m.bio}</div>
                    </>
                  )}
                </div>
              ))}
              {isEdit && (
                <button type="button" className="ab-team-add-btn" onClick={() => addTeamMember(blk.id)}>+ Add Member</button>
              )}
            </div>
          );
        }

        default: return <p style={{ color: '#374151', fontSize: '0.95rem' }}>{blk.content}</p>;
      }
    })();

    return (
      <>
        <div
          key={blk.id}
          className={`ab-block ${isEdit ? 'edit-mode' : ''}`}
          draggable={isEdit}
          onDragStart={e => handleBlockDragStart(e, blk.id)}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={e => handleDropOnBlock(e, sectionIdx, blk.id)}
        >
          {isEdit && !isInRow && (
            <button type="button" className="ab-block-delete" onClick={() => deleteBlock(blk.id)} title="Delete block">
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
          {blockEl}
        </div>
        {isEdit && !isInRow && (
          <div className="ab-quick-add-wrapper">
            <button type="button" className={`ab-quick-add-trigger${quickAddMenu?.targetId === blk.id ? ' is-open' : ''}`} onClick={() => setQuickAddMenu(prev => prev?.targetId === blk.id ? null : { sectionIdx, targetId: blk.id })} title="Quick Add Block" aria-label="Quick add block">
              <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <div className={`ab-quick-add-menu${quickAddMenu?.targetId === blk.id ? ' is-open' : ''}`}>
              {TOOLBOX_ITEMS.map((item, idx) => (
                <button key={item.type} type="button" className="ab-quick-add-option" style={{ ['--d' as string]: idx }} onClick={() => insertBlockDirectly(sectionIdx, blk.id, item.type)}>
                  <span className="ab-qa-icon">{item.icon}</span> {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </>
    );
  };

  /* ================================================================
     RENDER: SECTIONS
     ================================================================ */

  const renderSections = () => (state.sections || []).map((section, sIdx) => (
    <div key={section.id} className="ab-section" data-section-id={section.id}>
      <div className={`ab-section-hd ${mode === 'edit' ? 'editor-only' : ''}`}>
        {mode === 'edit' && (
          <span className="ab-section-grip">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
            </svg>
          </span>
        )}
        <input className="ab-section-title-input" value={section.title} onChange={e => updateSectionTitle(sIdx, e.target.value)} disabled={mode === 'preview'} placeholder="Section Title" />
        {mode === 'edit' && (
          <div className="ab-section-actions editor-only">
            <button type="button" className="ab-section-action-btn" onClick={() => moveSection(sIdx, -1)} disabled={sIdx === 0} title="Move up">
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
            </button>
            <button type="button" className="ab-section-action-btn" onClick={() => moveSection(sIdx, 1)} disabled={sIdx === state.sections.length - 1} title="Move down">
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            <button type="button" className="ab-section-action-btn ab-section-action-btn--danger" onClick={() => deleteSection(sIdx)} title="Delete section">
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
        )}
      </div>

      <div>
        {section.blocks.map(block => renderBlock(block, sIdx))}
        {mode === 'edit' && (
          <div className="ab-append-zone editor-only" onDragOver={handleDragOverAppend} onDragLeave={handleDragLeaveAppend} onDrop={e => handleDropOnAppend(e, sIdx)}>
            <span className="ab-append-text">{section.blocks.length === 0 ? 'Drag first component here' : '+ Drop here to append'}</span>
          </div>
        )}
      </div>

      {mode === 'edit' && (
        <div className="ab-insert-section-wrap editor-only">
          <button type="button" className="ab-insert-section-btn" onClick={() => insertSectionAfter(sIdx)}>
            <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Insert Section Here
          </button>
        </div>
      )}
    </div>
  ));

  /* ================================================================
     RENDER: HERO
     ================================================================ */

  const renderHero = () => {
    const imgSrc = state.heroImage;
    return (
      <header className="ab-hero">
        <div className="ab-hero-media">
          {imgSrc
            ? <img src={imgSrc} alt="Hero" />
            : (
              <div className="ab-hero-placeholder-bg">
                <div className="ab-hero-placeholder-pattern" />
              </div>
            )}
          {mode === 'edit' && (
            <div className="ab-hero-upload-overlay">
              <label className="ab-hero-upload-btn">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                {imgSrc ? 'Change Hero Image' : 'Upload Hero Image'}
                <input ref={heroFileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleHeroUpload} />
              </label>
              {imgSrc && (
                <button type="button" onClick={() => updateMeta('heroImage', '')} style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: 0, cursor: 'pointer' }}>Remove</button>
              )}
            </div>
          )}
        </div>

        <div className="ab-hero-panel">
          <span className="ab-hero-eyebrow">Research Report</span>              <textarea
            className="ab-hero-title-field"
            placeholder="Article Title..."
            rows={2}
            value={state.title}
            onChange={e => updateMeta('title', e.target.value)}
            disabled={mode === 'preview'}
            style={{ fontFamily: articleFontFamily }}
          />              <textarea
            className="ab-hero-subtitle-field"
            placeholder="Add a subtitle..."
            rows={2}
            value={state.subtitle}
            onChange={e => updateMeta('subtitle', e.target.value)}
            disabled={mode === 'preview'}
            style={{ fontFamily: articleFontFamily }}
          />
          <div className="ab-hero-meta-row">
            <input className="ab-hero-meta-field" style={{ width: 80 }} placeholder="Read time" value={state.readingTime} onChange={e => updateMeta('readingTime', e.target.value)} disabled={mode === 'preview'} />
            <input className="ab-hero-meta-field" style={{ width: 110 }} placeholder="Date" value={state.date} onChange={e => updateMeta('date', e.target.value)} disabled={mode === 'preview'} />
            <input className="ab-hero-meta-field" style={{ width: 110 }} placeholder="Author" value={state.author} onChange={e => updateMeta('author', e.target.value)} disabled={mode === 'preview'} />
            <input className="ab-hero-meta-field" style={{ width: 110 }} placeholder="Category" value={state.category} onChange={e => updateMeta('category', e.target.value)} disabled={mode === 'preview'} />
          </div>
        </div>
      </header>
    );
  };

  /* ================================================================
     RENDER: RIGHT SIDEBAR CARDS
     ================================================================ */

  const renderRightSidebar = () => (
    <div className="ab-article-sidebar">

      {/* Table of Contents */}
      <div className="ab-sidebar-card">
        <div className="ab-sidebar-card-label">In this article</div>
        {toc.length === 0
          ? <p className="ab-toc-empty">Sections will appear here</p>
          : toc.map((title, i) => (
            <a key={i} className="ab-toc-link" href={`#section-${i}`}
              onClick={e => { e.preventDefault(); const el = document.querySelectorAll('[data-section-id]')[i]; if (el) el.scrollIntoView({ behavior: 'smooth' }); }}>
              {title}
            </a>
          ))}
      </div>

      {/* Key Takeaways */}
      <div className="ab-sidebar-card">
        <div className="ab-sidebar-card-label">
          Key Takeaways
          {mode === 'edit' && <button type="button" className="ab-sidebar-card-add editor-only" onClick={() => addArrayItem('takeaways')}>+ Add</button>}
        </div>
        {state.takeaways.length === 0 && mode !== 'edit' && <p className="ab-toc-empty">No takeaways added yet.</p>}
        {state.takeaways.map((t, i) => (
          <div key={i} className="ab-array-item">
            <span className="ab-array-item-dot" />
            {mode === 'edit'
              ? <textarea rows={2} value={t} onChange={e => updateArrayItem('takeaways', i, e.target.value)} disabled={mode !== 'edit'} />
              : <span className="ab-array-item-text">{t}</span>}
            {mode === 'edit' && (
              <button type="button" className="ab-array-del editor-only" onClick={() => removeArrayItem('takeaways', i)}>✕</button>
            )}
          </div>
        ))}
      </div>

      {/* References */}
      <div className="ab-sidebar-card">
        <div className="ab-sidebar-card-label">
          References
          {mode === 'edit' && <button type="button" className="ab-sidebar-card-add editor-only" onClick={() => addArrayItem('references')}>+ Add</button>}
        </div>
        {state.references.length === 0 && mode !== 'edit' && <p className="ab-toc-empty">No references added.</p>}
        {state.references.map((r, i) => (
          <div key={i} className="ab-array-item">
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="ab-array-item-icon">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            {mode === 'edit'
              ? <textarea rows={2} value={r} onChange={e => updateArrayItem('references', i, e.target.value)} />
              : <span className="ab-array-item-text">{r}</span>}
            {mode === 'edit' && (
              <button type="button" className="ab-array-del editor-only" onClick={() => removeArrayItem('references', i)}>✕</button>
            )}
          </div>
        ))}
      </div>

      {/* Article Styling Settings */}
      {mode === 'edit' && (
        <div className="ab-settings-card editor-only">
          <div className="ab-settings-label">Article Styling</div>
          <div className="ab-settings-row">
            <span className="ab-settings-row-label">Font</span>
            <select className="ab-settings-select" value={articleFontFamily} onChange={e => setArticleFontFamily(e.target.value)}>
              {ARTICLE_FONTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
            </select>
          </div>
          <div className="ab-settings-row">
            <span className="ab-settings-row-label">Size</span>
            <select className="ab-settings-select" value={articleFontSize} onChange={e => setArticleFontSize(e.target.value)}>
              {ARTICLE_SIZES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <div className="ab-settings-row">
            <span className="ab-settings-row-label">Color</span>
            <div className="ab-settings-color-row">
              {ARTICLE_COLORS.map(c => (
                <button key={c.value} type="button" className={`ab-settings-color-swatch${articleTextColor === c.value ? ' ab-settings-color-swatch--active' : ''}`} style={{ background: c.value }} onClick={() => setArticleTextColor(c.value)} title={c.label} />
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );

  /* ================================================================
     MAIN RENDER
     ================================================================ */

  const slug = sanitizeSlug(state.title);
  const slugFlags: Record<string, { alt: string; src: string }> = {
    'digitalization-strategy': { alt: 'tunisia', src: 'https://flagcdn.com/w80/tn.png' },
    'sme-formalization': { alt: 'senegal', src: 'https://flagcdn.com/w80/sn.png' },
    'pki-timing-matters': { alt: 'guinee', src: 'https://flagcdn.com/w80/gn.png' },
    'pki-strategic-backbone': { alt: 'mauritania', src: 'https://flagcdn.com/cg.svg' }
  };
  const flag = slugFlags[slug] || null;

  return (
    <div className={`ab-page ${mode}-mode`}>

      {/* ---- BLURRED BACKGROUND (matches AdminDashboard) ---- */}
      <div className="ab-bg">
        <div className="ab-bg-image" />
        <div className="ab-bg-gradient" />
      </div>

      {/* ---- TOP HEADER ---- */}
      <header className="ab-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* BFC Logo mark */}
          <div className="ab-logo">
            <div className="ab-logo-row">
              <span className="ab-logo-bf">BF</span>
              <span className="ab-logo-c">C
                <span className="ab-logo-globe">
                  <span className="ab-logo-globe-line" />
                  <span className="ab-logo-globe-line" />
                  <span className="ab-logo-globe-line" />
                  <span className="ab-logo-globe-line" />
                </span>
              </span>
            </div>
            <span className="ab-logo-studio">Creative Studio</span>
          </div>
          <span style={{ fontSize: '0.6rem', fontWeight: 700, color: 'rgba(153,205,179,0.8)', borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: 12, fontFamily: 'ui-monospace, monospace', letterSpacing: '0.35em', textTransform: 'uppercase' }}>
            Article Builder
          </span>
        </div>

        <div className="ab-header-actions">
          {/* Back button */}
          <button type="button" className="ab-mode-btn" onClick={() => navigate('/admin?tab=articles')} style={{ marginRight: 12, background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#e2e8f0', borderRadius: 999 }}>
            <ArrowLeft size={13} />
            <span>Dashboard</span>
          </button>

          {/* Mode toggle */}
          <div className="ab-mode-toggle">
            <button type="button" className={`ab-mode-btn ${mode === 'edit' ? 'ab-mode-btn--active' : ''}`} onClick={() => setMode('edit')}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              <span>Edit</span>
            </button>
            <button type="button" className={`ab-mode-btn ${mode === 'preview' ? 'ab-mode-btn--active' : ''}`} onClick={() => setMode('preview')}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              <span>Preview</span>
            </button>
          </div>

          {/* Save + Export */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: 12 }}>
            <button type="button" className="ab-save-btn" onClick={() => handleSave(false)} title="Save as draft" style={{ background: '#f3f4f6', color: '#374151', border: '1px solid #e5e7eb' }}>
              {saveStatus === 'saving' ? 'Saving…' : 'Save Draft'}
            </button>
            <button type="button" className="ab-save-btn" onClick={() => handleSave(true)} title="Publish to public site">
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              {saveStatus === 'saving' ? 'Publishing…' : saveStatus === 'saved' ? 'Published ✓' : 'Publish'}
            </button>
            <div ref={exportDropdownRef} style={{ position: 'relative' }}>
              <button type="button" className="ab-export-dropdown-trigger" onClick={() => setExportDropdownOpen(prev => !prev)} title="Export article">
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export
                <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ transition: 'transform 0.2s', transform: exportDropdownOpen ? 'rotate(180deg)' : '' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {exportDropdownOpen && (
                <div className="ab-export-dropdown">
                  <button type="button" className="ab-export-dropdown-item" onClick={handleExportHtml}>
                    <span className="ab-export-dropdown-icon">&lt;/&gt;</span>
                    <div>
                      <div className="ab-export-dropdown-label">HTML</div>
                      <div className="ab-export-dropdown-desc">Web-ready page with styling</div>
                    </div>
                  </button>
                  <button type="button" className="ab-export-dropdown-item" onClick={handleExportJson}>
                    <span className="ab-export-dropdown-icon">{'{}'}</span>
                    <div>
                      <div className="ab-export-dropdown-label">JSON</div>
                      <div className="ab-export-dropdown-desc">Structured data for API/CMS</div>
                    </div>
                  </button>
                  <button type="button" className="ab-export-dropdown-item" onClick={handleExportMd}>
                    <span className="ab-export-dropdown-icon">*.md</span>
                    <div>
                      <div className="ab-export-dropdown-label">Markdown</div>
                      <div className="ab-export-dropdown-desc">Lightweight text format</div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ---- BODY ---- */}
      <div className="ab-body">
        {mode === 'preview' ? (
          <div 
            className="article-detail-preview-wrapper" 
            onScroll={handlePreviewScroll}
            style={{ flex: 1, overflowY: 'auto', background: '#f8fafc', zIndex: 10, position: 'relative' }}
          >
            <article className="article-detail" style={{ 
              ['--hero-progress' as any]: previewHeroProgress,
              ['--ab-font' as any]: articleFontFamily,
              ['--ab-color' as any]: articleTextColor,
              ['--ab-size' as any]: articleFontSize,
              fontFamily: 'var(--ab-font)',
              color: 'var(--ab-color)',
              fontSize: 'var(--ab-size)'
            }}>
              {/* ── Reading progress bar ─────────────────────────────── */}
              <div className="article-detail__progress">
                <span style={{ transform: `scaleX(${previewScrollProgress})` }} />
              </div>

              {/* ── Hero ─────────────────────────────────────────────── */}
              <header className="article-detail__hero">
                <div className="article-detail__hero-media">
                  <img src={state.heroImage || 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800'} alt="" />
                </div>
                <div className="article-detail__hero-panel">
                  <span className="article-detail__back" style={{ cursor: 'pointer' }} onClick={() => setMode('edit')}>← Back to Editor</span>
                  <span className="article-detail__eyebrow">Research Report</span>
                  <h1 className="article-detail__title">{state.title || 'Untitled Article'}</h1>
                  {state.subtitle && (
                    <p className="article-detail__subtitle">{state.subtitle}</p>
                  )}
                  <div className="article-detail__meta">
                    <span>{state.readingTime || '8 min read'}</span>
                    <span>{state.date || new Date().toLocaleDateString()}</span>
                    <span>By {state.author || 'BFC Insights'}</span>
                  </div>
                  {flag && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16 }}>
                      <span className="article-detail__tag" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 12px' }}>
                        <img src={flag.src} alt={flag.alt} style={{ width: 16, height: 11, borderRadius: 1 }} />
                        <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{countryLabel(flag.alt)}</span>
                      </span>
                    </div>
                  )}
                </div>
              </header>

              {/* ── Body ─────────────────────────────────────────────── */}
              <section className="article-detail__body">
                <div className="article-detail__content">
                  {/* Executive Summary */}
                  {state.summary && (
                    <div className="article-detail__reveal is-visible" style={{ marginBottom: '2rem' }}>
                      <div className="ab-summary-box" style={{ margin: 0 }}>
                        <div className="ab-summary-label">Executive Summary</div>
                        <p style={{ fontSize: '0.95rem', lineHeight: 1.75, color: '#374151', margin: 0 }}>{state.summary}</p>
                      </div>
                    </div>
                  )}

                  {/* Sections */}
                  {(state.sections || []).map((s, i) => (
                    <div key={i} className="article-detail__reveal is-visible">
                      {s.title && <h2 id={`sec-${i}`}>{s.title}</h2>}
                      {s.blocks && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                          {s.blocks.map((block, bi) => (
                            <DetailBlock key={block.id || bi} block={block} />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  <div className="article-detail__divider" />

                  {/* References */}
                  {state.references && state.references.length > 0 && (
                    <div className="article-detail__references article-detail__reveal is-visible">
                      <h2>References</h2>
                      <ol>
                        {state.references.map((ref, i) => (
                          <li key={i} className="article-detail__reference-item">
                            <span>{ref}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {/* Author */}
                  <div className="article-detail__author article-detail__reveal is-visible">
                    <div className="article-detail__author-avatar">BI</div>
                    <div>
                      <p className="article-detail__author-name">{state.author || 'BFC Insights'}</p>
                      <p className="article-detail__author-role">Strategy & Digital Transformation Practice</p>
                    </div>
                  </div>
                </div>

                {/* ── Sidebar ──────────────────────────────────────── */}
                <aside className="article-detail__sidebar">
                  {state.sections.length > 0 && (
                    <div className="article-detail__card article-detail__reveal is-visible">
                      <p className="article-detail__card-label">In this article</p>
                      {(state.sections || []).map((s, i) => s.title && (
                        <a key={i} href={`#sec-${i}`} className="article-detail__toc-link" onClick={e => {
                          e.preventDefault();
                          const el = document.getElementById(`sec-${i}`);
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}>
                          {s.title}
                        </a>
                      ))}
                    </div>
                  )}
                  {state.takeaways && state.takeaways.length > 0 && (
                    <div className="article-detail__card article-detail__reveal is-visible">
                      <p className="article-detail__takeaways-label">Key takeaways</p>
                      <ul className="article-detail__sidebar-takeaways">
                        {state.takeaways.map((t, i) => (
                          <li key={i}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </aside>
              </section>

              {/* ── CTA ──────────────────────────────────────────── */}
              <section className="article-detail__cta">
                <div className="article-detail__cta-inner">
                  <div>
                    <p className="article-detail__cta-eyebrow">Continue exploring</p>
                    <h3>Read more from the BFC strategy series</h3>
                  </div>
                  <button 
                    className="article-detail__cta-button" 
                    style={{ border: 'none', background: '#99cdb3', color: '#204383', cursor: 'pointer', fontFamily: 'Inter', fontWeight: 'bold' }} 
                    onClick={() => setMode('edit')}
                  >
                    Back to Editor
                  </button>
                </div>
              </section>
            </article>
          </div>
        ) : (
          <>
            {/* ---- LEFT SIDEBAR ---- */}
            <aside className={`ab-sidebar ${mode === 'preview' ? 'ab-sidebar--hidden' : ''} editor-only`}>
              <div className="ab-sidebar-top">
                <svg width="16" height="16" fill="none" stroke="#204383" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span className="ab-sidebar-top-label">Components</span>
              </div>

              <div className="ab-sidebar-scroll">
                {/* Toolbox */}
                <div className="ab-toolbox">
                  <div className="ab-toolbox-section-title">Drag &amp; Drop Blocks</div>
                  <div className="ab-toolbox-grid">
                    {TOOLBOX_ITEMS.map(item => (
                      <div key={item.type} className="ab-toolbox-item" draggable onDragStart={e => handleToolboxDragStart(e, item.type)}>
                        <div className="ab-toolbox-item-icon">
                          <span style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "#204383" }}>{item.icon}</span>
                        </div>
                        <div>
                          <div className="ab-toolbox-item-label">{item.label}</div>
                          <div className="ab-toolbox-item-desc">{item.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section list navigator */}
                <div className="ab-section-list">
                  <div className="ab-section-list-header">
                    <span>Sections</span>
                    <button type="button" className="ab-section-add-btn" onClick={addSection} title="Add section">
                      <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                  {state.sections.length === 0
                    ? <p style={{ fontSize: 11, color: '#9ca3af', padding: '8px', textAlign: 'center' }}>No sections yet</p>
                    : (state.sections || []).map((s, i) => (
                      <div key={s.id} className="ab-section-list-item"
                        onClick={() => { const el = document.querySelector(`[data-section-id="${s.id}"]`); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}>
                        <div className="ab-section-list-dot" />
                        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.title || `Section ${i + 1}`}</span>
                      </div>
                    ))}
                </div>
              </div>
            </aside>

            {/* ---- MAIN CANVAS ---- */}
            <main className="ab-canvas" ref={canvasRef} id="ab-canvas">

              {/* Scroll progress */}
              <div className="ab-scroll-progress">
                <div className="ab-scroll-progress-fill" id="ab-progress-fill" />
              </div>

              {/* Sticky meta bar (edit only) */}
              {mode === 'edit' && (
                <div className="ab-meta-bar editor-only">
                  <input className="ab-meta-input ab-meta-input--wide" placeholder="Article Title..." value={state.title} onChange={e => updateMeta('title', e.target.value)} />
                  <input className="ab-meta-input" style={{ minWidth: 140 }} placeholder="Subtitle" value={state.subtitle} onChange={e => updateMeta('subtitle', e.target.value)} />
                  <input className="ab-meta-input" style={{ width: 100 }} placeholder="Author" value={state.author} onChange={e => updateMeta('author', e.target.value)} />
                  <input className="ab-meta-input" style={{ width: 120 }} placeholder="Date" value={state.date} onChange={e => updateMeta('date', e.target.value)} />
                  <input className="ab-meta-input" style={{ width: 100 }} placeholder="Category" value={state.category} onChange={e => updateMeta('category', e.target.value)} />
                  <input className="ab-meta-input" style={{ width: 90 }} placeholder="Read time" value={state.readingTime} onChange={e => updateMeta('readingTime', e.target.value)} />
                </div>
              )}

              {/* Hero */}
              {renderHero()}

              {/* Article body grid (content + right sidebar) */}
              <div className="ab-article-body">

                {/* Middle: content */}
                <div className="ab-article-content" style={{ fontFamily: articleFontFamily, fontSize: articleFontSize, color: articleTextColor }}>

                  {/* Executive summary */}
                  <div className="ab-summary-box">
                    <div className="ab-summary-label">Executive Summary</div>
                    {mode === 'edit'
                      ? <textarea className="ab-summary-field" placeholder="Write an executive summary..." rows={3} value={state.summary} onChange={e => updateMeta('summary', e.target.value)} />
                      : <p style={{ fontSize: '0.9rem', lineHeight: 1.75, color: '#4b5563' }}>{state.summary || 'No summary provided.'}</p>}
                  </div>

                  {/* Sections in white card */}
                  <div className="ab-content-card" style={{ fontFamily: articleFontFamily, fontSize: articleFontSize, color: articleTextColor }}>
                    {state.sections.length === 0 && mode === 'edit' ? (
                      <div className="ab-empty-canvas editor-only" style={{ color: articleTextColor }}>
                        <div className="ab-empty-canvas-icon">📝</div>
                        <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Start building your article</p>
                        <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 20 }}>Drag blocks from the left sidebar, or click below to add a section</p>
                        <button type="button" onClick={addSection}
                          style={{ padding: '10px 24px', background: '#204383', color: '#fff', fontSize: 13, fontWeight: 700, borderRadius: 0, border: 'none', cursor: 'pointer' }}>
                          + Add First Section
                        </button>
                      </div>
                    ) : (
                      <>
                        {renderSections()}
                        {mode === 'edit' && (
                          <div className="editor-only" style={{ textAlign: 'center', marginTop: 32 }}>
                            <button type="button" onClick={addSection} className="ab-btn-mint">
                              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                              Add New Section
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer (matches AdminDashboard footer) */}
              <footer style={{ background: '#204383', borderTop: '1px solid rgba(153,205,179,0.2)', color: '#fff', padding: '32px 24px', textAlign: 'center' }}>
                <div style={{ maxWidth: 500, margin: '0 auto' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, fontFamily: 'Inter, sans-serif', letterSpacing: '-0.02em', marginBottom: 4 }}>BFC</div>
                  <div style={{ fontSize: '0.6rem', fontWeight: 700, color: '#99cdb3', letterSpacing: '0.5em', fontFamily: 'ui-monospace, monospace', marginBottom: 12, textTransform: 'uppercase' }}>GROUPE</div>
                  <p style={{ fontSize: '0.65rem', color: 'rgba(153,205,179,0.4)', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.4em', textTransform: 'uppercase' }}>
                    Built with BFC Creative Studio — © {new Date().getFullYear()} BFC GROUPE
                  </p>
                </div>
              </footer>
            </main>

            {/* ---- RIGHT SIDEBAR ---- */}
            <aside className={`ab-right-sidebar ${mode === 'preview' ? 'ab-right-sidebar--hidden' : ''}`}>
              <div className="ab-right-sidebar-scroll">
                {renderRightSidebar()}
              </div>
            </aside>
          </>
        )}
      </div>

      {/* ---- FLOATING FORMATTING TOOLBAR (always visible above active block) ---- */}
      {mode === 'edit' && activeBlockId && activeBlockRect && (
        <div
          ref={floatingToolbarRef}
          className="ab-floating-toolbar"
          style={{
            position: 'fixed',
            left: activeBlockRect.x,
            top: activeBlockRect.y,
            transform: 'translate(-50%, -100%)',
            zIndex: 9999,
          }}
          onMouseDown={e => { if ((e.target as HTMLElement).tagName !== "INPUT") e.preventDefault(); }}
        >
          <div className="ab-floating-toolbar-row">
            <button type="button" className="ab-ft-btn" onClick={() => applyFormat('bold')} title="Bold"><strong>B</strong></button>
            <button type="button" className="ab-ft-btn" onClick={() => applyFormat('italic')} title="Italic"><em>I</em></button>
            <button type="button" className="ab-ft-btn" onClick={() => applyFormat('underline')} title="Underline"><u>U</u></button>
            <button type="button" className="ab-ft-btn" onClick={() => applyFormat('strikeThrough')} title="Strikethrough"><s>S</s></button>
            <div className="ab-ft-divider" />
            <button type="button" className="ab-ft-btn" onClick={() => applyFormat('insertUnorderedList')} title="Bullet List">
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <button type="button" className="ab-ft-btn" onClick={() => applyFormat('insertOrderedList')} title="Numbered List">
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 6v12m4-12v12m4-12v12" /></svg>
            </button>
            <div className="ab-ft-divider" />
            {[{c: '#204383', l: 'Navy'}, {c: '#1f6f5c', l: 'Mint'}, {c: '#ef4444', l: 'Red'}, {c: '#374151', l: 'Slate'}, {c: '#000000', l: 'Black'}].map(clr => (
              <button key={clr.c} type="button" className="ab-ft-color" style={{ background: clr.c }} onClick={() => applyFormat('foreColor', clr.c)} title={clr.l} />
            ))}
            <div className="ab-ft-divider" />
            <button type="button" className="ab-ft-btn" style={{ fontFamily: 'Inter', width: 'auto', padding: '0 7px', fontSize: 10 }} onClick={() => applyFormat('fontName', 'Inter')}>Inter</button>
            <button type="button" className="ab-ft-btn" style={{ fontFamily: 'JetBrains Mono, monospace', width: 'auto', padding: '0 7px', fontSize: 10 }} onClick={() => applyFormat('fontName', 'JetBrains Mono')}>Mono</button>
            <button type="button" className="ab-ft-btn" style={{ fontFamily: 'Georgia, serif', width: 'auto', padding: '0 7px', fontSize: 10 }} onClick={() => applyFormat('fontName', 'Georgia')}>Serif</button>
            <div className="ab-ft-divider" />
            <button type="button" className="ab-ft-btn" onClick={() => {
              const sel = window.getSelection();
              if (sel && !sel.isCollapsed) {
                const range = sel.getRangeAt(0);
                const rect = range.getBoundingClientRect();
                setLinkToolbar({ visible: true, x: Math.max(200, Math.min(rect.left + rect.width / 2, window.innerWidth - 200)), y: rect.bottom + 6, blockId: activeBlockId, url: '', selectedText: sel.toString() });
              }
            }} title="Insert Link">
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
            </button>
          </div>
          {linkToolbar.visible && activeBlockId === linkToolbar.blockId && (
            <div className="ab-floating-toolbar-row" style={{ borderTop: '1px solid #e5e7eb', paddingTop: 6, marginTop: 4 }}>
              <input type="url" placeholder="Paste URL..." value={linkToolbar.url}
                onChange={e => setLinkToolbar(prev => ({ ...prev, url: e.target.value }))}
                className="ab-ft-link-input" autoFocus />
              <button type="button" className="ab-ft-btn ab-ft-btn--primary" onClick={applyLink}>Apply</button>
              <button type="button" className="ab-ft-btn ab-ft-btn--danger" onClick={removeLink}>Unlink</button>
              <button type="button" className="ab-ft-btn" onClick={() => setLinkToolbar(prev => ({ ...prev, visible: false }))}>✕</button>
            </div>
          )}
        </div>
      )}    </div>
  );
};

export default ArticleBuilder;
