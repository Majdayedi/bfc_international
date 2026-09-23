import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { API_URL } from '../utils/constants';
import {
  BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  LineChart as ReLineChart, Line,
  PieChart as RePieChart, Pie, Cell,
  AreaChart, Area,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import { getClientLogo } from './OurProjectsPage';
import { ArrowLeft, GripVertical, Plus, Trash2, X, ChevronDown, ChevronUp, Maximize2, Layout, Image as ImageIcon, Type, Quote, Settings, Eye, Monitor, Smartphone, MessageSquare, BarChart, List, Target, Shield, Upload } from 'lucide-react';
import { toBullets, computeStrategicImpact, computeFocusAreas } from './ProjectArticlePage';
import './ArticleBuilder.css';
import './ProjectBuilder.css';
import './ProjectArticlePage.css';

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
  focusTitle?: string;
  imageStyle?: ImageStyle; imageAspectRatio?: ImageAspectRatio; imageCaption?: string;
  accordionItems?: AccordionItem[];
  timelineNodes?: TimelineNode[];
  ctaButtonText?: string; ctaLink?: string; ctaStyle?: CtaStyle;
  listItems?: ListItem[]; listStyle?: ListStyle;
  teamMembers?: TeamMember[];
}
export interface RowBlock { id: string; type: 'row'; columns: Block[][]; }
export interface Section { id: string; title: string; blocks: (Block | RowBlock)[]; }

export interface ProjectState {
  title: string;
  client: string;
  clientImageUrl: string;
  category: string;
  country: string;
  representativeSlug: string;
  flag: string;
  startDate: string;
  endDate: string;
  year: string;
  accent: string;
  imageUrl: string;
  description: string;
  sections: Section[];
  relatedArticleIds: number[];
}

type Mode = 'edit' | 'preview';

/* ================================================================
   CONSTANTS
   ================================================================ */

const CHART_COLORS = ['#204383', '#99cdb3', '#4a7db5', '#7dbba3', '#1a3566', '#b8dac8', '#1f6f5c', '#1694a6'];

const AVAILABLE_COUNTRIES = [
  { code: 'af', name: 'Afghanistan' },
  { code: 'al', name: 'Albania' },
  { code: 'dz', name: 'Algeria' },
  { code: 'ao', name: 'Angola' },
  { code: 'ar', name: 'Argentina' },
  { code: 'am', name: 'Armenia' },
  { code: 'au', name: 'Australia' },
  { code: 'at', name: 'Austria' },
  { code: 'az', name: 'Azerbaijan' },
  { code: 'bh', name: 'Bahrain' },
  { code: 'bd', name: 'Bangladesh' },
  { code: 'by', name: 'Belarus' },
  { code: 'be', name: 'Belgium' },
  { code: 'bj', name: 'Benin' },
  { code: 'bo', name: 'Bolivia' },
  { code: 'ba', name: 'Bosnia and Herzegovina' },
  { code: 'bw', name: 'Botswana' },
  { code: 'br', name: 'Brazil' },
  { code: 'bg', name: 'Bulgaria' },
  { code: 'bf', name: 'Burkina Faso' },
  { code: 'bi', name: 'Burundi' },
  { code: 'kh', name: 'Cambodia' },
  { code: 'cm', name: 'Cameroon' },
  { code: 'ca', name: 'Canada' },
  { code: 'cf', name: 'Central African Republic' },
  { code: 'td', name: 'Chad' },
  { code: 'cl', name: 'Chile' },
  { code: 'cn', name: 'China' },
  { code: 'co', name: 'Colombia' },
  { code: 'km', name: 'Comoros' },
  { code: 'cg', name: 'Congo' },
  { code: 'cd', name: 'DR Congo' },
  { code: 'cr', name: 'Costa Rica' },
  { code: 'hr', name: 'Croatia' },
  { code: 'cu', name: 'Cuba' },
  { code: 'cy', name: 'Cyprus' },
  { code: 'cz', name: 'Czechia' },
  { code: 'dk', name: 'Denmark' },
  { code: 'dj', name: 'Djibouti' },
  { code: 'do', name: 'Dominican Republic' },
  { code: 'ec', name: 'Ecuador' },
  { code: 'eg', name: 'Egypt' },
  { code: 'sv', name: 'El Salvador' },
  { code: 'gq', name: 'Equatorial Guinea' },
  { code: 'er', name: 'Eritrea' },
  { code: 'ee', name: 'Estonia' },
  { code: 'et', name: 'Ethiopia' },
  { code: 'fi', name: 'Finland' },
  { code: 'fr', name: 'France' },
  { code: 'ga', name: 'Gabon' },
  { code: 'gm', name: 'Gambia' },
  { code: 'ge', name: 'Georgia' },
  { code: 'de', name: 'Germany' },
  { code: 'gh', name: 'Ghana' },
  { code: 'gr', name: 'Greece' },
  { code: 'gt', name: 'Guatemala' },
  { code: 'gn', name: 'Guinea' },
  { code: 'gw', name: 'Guinea-Bissau' },
  { code: 'ht', name: 'Haiti' },
  { code: 'hn', name: 'Honduras' },
  { code: 'hu', name: 'Hungary' },
  { code: 'is', name: 'Iceland' },
  { code: 'in', name: 'India' },
  { code: 'id', name: 'Indonesia' },
  { code: 'ir', name: 'Iran' },
  { code: 'iq', name: 'Iraq' },
  { code: 'ie', name: 'Ireland' },
  { code: 'il', name: 'Israel' },
  { code: 'it', name: 'Italy' },
  { code: 'ci', name: 'Ivory Coast' },
  { code: 'jm', name: 'Jamaica' },
  { code: 'jp', name: 'Japan' },
  { code: 'jo', name: 'Jordan' },
  { code: 'kz', name: 'Kazakhstan' },
  { code: 'ke', name: 'Kenya' },
  { code: 'kw', name: 'Kuwait' },
  { code: 'kg', name: 'Kyrgyzstan' },
  { code: 'la', name: 'Laos' },
  { code: 'lv', name: 'Latvia' },
  { code: 'lb', name: 'Lebanon' },
  { code: 'ls', name: 'Lesotho' },
  { code: 'lr', name: 'Liberia' },
  { code: 'ly', name: 'Libya' },
  { code: 'lt', name: 'Lithuania' },
  { code: 'lu', name: 'Luxembourg' },
  { code: 'mg', name: 'Madagascar' },
  { code: 'mw', name: 'Malawi' },
  { code: 'my', name: 'Malaysia' },
  { code: 'ml', name: 'Mali' },
  { code: 'mt', name: 'Malta' },
  { code: 'mr', name: 'Mauritania' },
  { code: 'mu', name: 'Mauritius' },
  { code: 'mx', name: 'Mexico' },
  { code: 'md', name: 'Moldova' },
  { code: 'mn', name: 'Mongolia' },
  { code: 'ma', name: 'Morocco' },
  { code: 'mz', name: 'Mozambique' },
  { code: 'mm', name: 'Myanmar' },
  { code: 'na', name: 'Namibia' },
  { code: 'np', name: 'Nepal' },
  { code: 'nl', name: 'Netherlands' },
  { code: 'nz', name: 'New Zealand' },
  { code: 'ni', name: 'Nicaragua' },
  { code: 'ne', name: 'Niger' },
  { code: 'ng', name: 'Nigeria' },
  { code: 'kp', name: 'North Korea' },
  { code: 'mk', name: 'North Macedonia' },
  { code: 'no', name: 'Norway' },
  { code: 'om', name: 'Oman' },
  { code: 'pk', name: 'Pakistan' },
  { code: 'ps', name: 'Palestine' },
  { code: 'pa', name: 'Panama' },
  { code: 'py', name: 'Paraguay' },
  { code: 'pe', name: 'Peru' },
  { code: 'ph', name: 'Philippines' },
  { code: 'pl', name: 'Poland' },
  { code: 'pt', name: 'Portugal' },
  { code: 'qa', name: 'Qatar' },
  { code: 'ro', name: 'Romania' },
  { code: 'ru', name: 'Russia' },
  { code: 'rw', name: 'Rwanda' },
  { code: 'sa', name: 'Saudi Arabia' },
  { code: 'sn', name: 'Senegal' },
  { code: 'rs', name: 'Serbia' },
  { code: 'sl', name: 'Sierra Leone' },
  { code: 'sg', name: 'Singapore' },
  { code: 'sk', name: 'Slovakia' },
  { code: 'si', name: 'Slovenia' },
  { code: 'so', name: 'Somalia' },
  { code: 'za', name: 'South Africa' },
  { code: 'kr', name: 'South Korea' },
  { code: 'ss', name: 'South Sudan' },
  { code: 'es', name: 'Spain' },
  { code: 'lk', name: 'Sri Lanka' },
  { code: 'sd', name: 'Sudan' },
  { code: 'se', name: 'Sweden' },
  { code: 'ch', name: 'Switzerland' },
  { code: 'sy', name: 'Syria' },
  { code: 'tw', name: 'Taiwan' },
  { code: 'tj', name: 'Tajikistan' },
  { code: 'tz', name: 'Tanzania' },
  { code: 'th', name: 'Thailand' },
  { code: 'tg', name: 'Togo' },
  { code: 'tn', name: 'Tunisia' },
  { code: 'tr', name: 'Turkey' },
  { code: 'tm', name: 'Turkmenistan' },
  { code: 'ug', name: 'Uganda' },
  { code: 'ua', name: 'Ukraine' },
  { code: 'ae', name: 'United Arab Emirates' },
  { code: 'gb', name: 'United Kingdom' },
  { code: 'us', name: 'United States' },
  { code: 'uy', name: 'Uruguay' },
  { code: 'uz', name: 'Uzbekistan' },
  { code: 've', name: 'Venezuela' },
  { code: 'vn', name: 'Vietnam' },
  { code: 'ye', name: 'Yemen' },
  { code: 'zm', name: 'Zambia' },
  { code: 'zw', name: 'Zimbabwe' },
];

const PRESETS_CATEGORIES = [
  'Global Strategy',
  'Digital Trust',
  'ICT',
  'Organizational Management',
  'Strategy / Organizational Management',
  'Feasibility Study',
  'Institutional Governance',
  'ICT / Institutional',
  'Management',
  'Strategy / Governance',
  'Finance / Operations',
  'Risk / Audit / Training',
  'Training / Strategy',
  'Training',
  'State / Government',
  'ICT / Feasibility Study',
  'ICT / TIC',
];

const TOOLBOX_ITEMS: { type: BlockType; label: string; icon: React.ReactNode; desc: string }[] = [
  { type: 'heading', label: 'Heading', icon: <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10" /></svg>, desc: 'Section titles' },
  { type: 'text', label: 'Rich Text', icon: <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h10M4 18h7" /></svg>, desc: 'Paragraph with markdown' },
  { type: 'image', label: 'Image', icon: <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>, desc: 'Photo with styles & captions' },
  { type: 'video', label: 'Video', icon: <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21" /></svg>, desc: 'YouTube or local MP4' },
  { type: 'quote', label: 'Blockquote', icon: <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 8c-1.1 0-2 .9-2 2v4h4v-4H8c0-1.1.9-2 2-2V6c-2.2 0-4 1.8-4 4v8h8v-8c0-1.1-.9-2-2-2z" /></svg>, desc: 'Pull-quote statement' },
  { type: 'callout', label: 'Callout', icon: <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, desc: 'Info note or alert' },
  { type: 'focus-area', label: 'Focus Area', icon: <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>, desc: 'Key highlight card' },
  { type: 'stats', label: 'Stats', icon: <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="12" width="4" height="9" /><rect x="10" y="7" width="4" height="14" /><rect x="17" y="3" width="4" height="18" /></svg>, desc: 'Key metrics grid' },
  { type: 'chart', label: 'Chart', icon: <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polyline points="22,12 18,12 15,21 9,3 6,12 2,12" /></svg>, desc: '5 chart types' },
  { type: 'list', label: 'List', icon: <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>, desc: 'Bullet / Numbered / Checklist' },
  { type: 'accordion', label: 'Accordion', icon: <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>, desc: 'Expandable Q&A' },
  { type: 'timeline', label: 'Timeline', icon: <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>, desc: 'Chronological milestones' },
  { type: 'cta', label: 'CTA Button', icon: <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>, desc: 'Call-to-action' },
  { type: 'team-member', label: 'Team', icon: <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>, desc: 'Member profiles' },
  { type: 'divider', label: 'Divider', icon: <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><line x1="2" y1="12" x2="22" y2="12" strokeWidth={2} /></svg>, desc: 'Visual break' },
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
    case 'heading': return { id, type, content: '' };
    case 'text': return { id, type, content: '' };
    case 'image': return { id, type, content: '', imageStyle: 'leaf', imageAspectRatio: 'landscape', imageCaption: '' };
    case 'video': return { id, type, content: '', videoSourceType: 'youtube', videoUrl: '' };
    case 'quote': return { id, type, content: '' };
    case 'callout': return { id, type, content: '' };
    case 'focus-area': return { id, type, content: '', focusTitle: 'Focus Area' };
    case 'stats': return { id, type, content: '', stats: [{ value: '—', label: 'Metric 1' }, { value: '—', label: 'Metric 2' }, { value: '—', label: 'Metric 3' }] };
    case 'chart': return { id, type, content: '', chartType: 'bar', chartData: defaultChartData(), chartDataTitle: 'Performance Data' };
    case 'list': return { id, type, content: '', listStyle: 'bullet', listItems: [{ text: 'New item', checked: false }] };
    case 'accordion': return { id, type, content: '', accordionItems: [{ question: 'What is your question?', answer: 'Answer goes here...' }] };
    case 'timeline': return { id, type, content: '', timelineNodes: [{ date: '2024', title: 'Milestone', description: 'Description...' }] };
    case 'cta': return { id, type, content: '', ctaButtonText: 'Learn More', ctaLink: 'https://', ctaStyle: 'navy' };
    case 'team-member': return { id, type, content: '', teamMembers: [{ name: 'Full Name', role: 'Title', bio: 'Short bio...', avatar: '' }] };
    case 'divider': return { id, type, content: '#000000' };
    default: return { id, type, content: '' };
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

const getUploadUrl = (url: string | null | undefined): string => {
  if (!url) return '';
  if (url.startsWith('/uploads/')) {
    return `${API_URL}${url}`;
  }
  return url;
};

/* ================================================================
   LOCAL STORAGE
   ================================================================ */

const STORAGE_KEY = 'bfc_project_builder_v2';
function loadState(): ProjectState {
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
    title: '',
    client: '',
    clientImageUrl: '',
    category: 'Global Strategy',
    country: 'Tunisia',
    representativeSlug: '',
    flag: 'https://flagcdn.com/w40/tn.png',
    startDate: '',
    endDate: '',
    year: '',
    accent: '#243c8a',
    imageUrl: '',
    description: '',
    sections: [],
    relatedArticleIds: [],
  };
}

/* ================================================================
   RECHARTS TOOLTIP
   ================================================================ */
const RcTooltip: React.FC = () => (
  <Tooltip contentStyle={{ borderRadius: 0, border: '1px solid #e5e7eb', fontSize: 11 }} />
);

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

interface DetailBlockProps {
  block: any;
}

const DetailBlock: React.FC<DetailBlockProps> = ({ block }) => {
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
        <div className="ab-block-focus">
          <span className="ab-block-focus-label">{blk.focusTitle || 'Focus Area'}</span>
          <h3>{blk.content || ''}</h3>
        </div>
      );

    case 'divider':
      return <div style={{ height: 1, background: blk.content || '#000000', margin: '2.5rem auto', width: '50%' }} />;

    case 'image': {
      const imgStyle = blk.imageStyle || 'leaf';
      const aspect = blk.imageAspectRatio || 'landscape';
      const arMap: Record<string, string> = { landscape: '3/2', portrait: '2/3', square: '1/1', banner: '21/9' };
      const borderRadius = imgStyle === 'leaf' ? '48px 12px 48px 12px' : imgStyle === 'rounded' ? '16px' : imgStyle === 'skewed' ? '28px 8px 28px 8px' : '12px 36px 12px 36px';
      return (
        <div style={{ margin: '16px 0' }}>
          <div style={{ aspectRatio: arMap[aspect] || '3/2', background: '#f3f4f6', borderRadius, overflow: 'hidden', position: 'relative' }}>
            {blk.content ? (
              <img src={getUploadUrl(blk.content)} alt={blk.imageCaption || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
            <video width="100%" height="100%" controls src={getUploadUrl(blk.content)} />
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
                {m.avatar ? <img src={getUploadUrl(m.avatar)} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ background: '#204383', color: '#fff', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700 }}>{m.name.charAt(0)}</div>}
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

export const ProjectBuilder: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const projectIdParam = searchParams.get('id');

  const [projectId, setProjectIdState] = useState<number | null>(
    projectIdParam ? parseInt(projectIdParam, 10) : null
  );

  const [state, setState] = useState<ProjectState>(loadState);
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
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [activeBlockRect, setActiveBlockRect] = useState<{ x: number; y: number } | null>(null);

  const floatingToolbarRef = useRef<HTMLDivElement>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout>>();

  const [articles, setArticles] = useState<any[]>([]);
  const [representatives, setRepresentatives] = useState<any[]>([]);

  const token = localStorage.getItem('bfc_token');

  // Load articles checklist
  useEffect(() => {
    fetch(`${API_URL}/api/articles`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setArticles(data);
        }
      })
      .catch((err) => console.error('Error fetching articles:', err));

    fetch(`${API_URL}/api/representatives`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setRepresentatives(data);
      })
      .catch((err) => console.error('Error fetching representatives:', err));
  }, []);

  // Fetch existing project if editing
  useEffect(() => {
    if (!projectId) return;

    fetch(`${API_URL}/api/projects/${projectId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch project');
        return res.json();
      })
      .then((data) => {
        let content: any = {};
        try {
          content = JSON.parse(data.contentJson);
        } catch (err) {
          console.error('Failed to parse content JSON:', err);
        }

          let defaultSections = [];
          if (!content.sections || content.sections.length === 0) {
            const bullets = toBullets(data.description || '');
            const focusAreas = computeFocusAreas(data as any);
            const impact = computeStrategicImpact(data as any);
            const ts = Date.now();
            defaultSections = [
              {
                id: `sec-${ts}-1`,
                blocks: [
                  { id: `blk-${ts}-1a`, type: 'text', content: 'This project was delivered as a strategic intervention to improve organizational performance, implementation capability, and measurable impact for the client institution.' },
                  { id: `blk-${ts}-1b`, type: 'callout', content: data.description || 'Executive Summary' }
                ]
              },
              {
                id: `sec-${ts}-2`,
                title: 'Mission Context',
                blocks: [
                  { id: `blk-${ts}-2a`, type: 'text', content: `In ${data.country || 'the region'}, ${data.client || 'the client'} commissioned this mission to address priorities in ${(data.category || '').toLowerCase()}. The engagement combined assessment, design, and implementation support to ensure practical and sustainable outcomes.` }
                ]
              },
              {
                id: `sec-${ts}-3`,
                title: 'Key Workstreams',
                blocks: [
                  { id: `blk-${ts}-3a`, type: 'heading', content: 'Primary focus' },
                  { id: `blk-${ts}-3b`, type: 'list', listStyle: 'bullet', listItems: focusAreas.map(f => ({ text: f, checked: false })) },
                  { id: `blk-${ts}-3c`, type: 'heading', content: 'Executed activities' },
                  { id: `blk-${ts}-3d`, type: 'list', listStyle: 'bullet', listItems: bullets.map(b => ({ text: b, checked: false })) }
                ]
              },
              {
                id: `sec-${ts}-4`,
                title: 'Strategic Impact',
                blocks: [
                  { id: `blk-${ts}-4a`, type: 'quote', content: impact }
                ]
              },
              {
                id: `sec-${ts}-5`,
                title: 'Delivery Approach',
                blocks: [
                  { id: `blk-${ts}-5a`, type: 'list', listStyle: 'numbered', listItems: [
                    { text: '**Diagnosis:** baseline assessment of context, systems, and constraints.', checked: false },
                    { text: '**Design:** co-construction of a realistic roadmap with stakeholders.', checked: false },
                    { text: '**Execution support:** operational guidance, capacity transfer, and follow-up actions.', checked: false }
                  ] }
                ]
              }
            ];
          }

          setState({
            title: data.title || '',
            client: data.client || '',
            clientImageUrl: data.clientImageUrl || '',
            category: data.category || 'Global Strategy',
            country: data.country || 'Tunisia',
            representativeSlug: data.representativeSlug || '',
            flag: data.flag || 'https://flagcdn.com/w40/tn.png',
            startDate: data.startDate || '',
            endDate: data.endDate || '',
            year: data.year || '',
            accent: data.accent || '#243c8a',
            imageUrl: data.imageUrl || '',
            description: data.description || '',
            sections: content.sections && content.sections.length > 0 ? content.sections : defaultSections,
            relatedArticleIds: content.relatedArticleIds || [],
          });
          setArticleFontFamily(content.fontFamily || 'Inter');
          setArticleFontSize(content.fontSize || '1rem');
          setArticleTextColor(content.textColor || '#374151');
      })
      .catch((err) => {
        console.error(err);
        alert('Failed to load project from server.');
      });
  }, [projectId]);

  /* ----- Auto-save local draft ----- */
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
  }, [mode]);

  /* ----- Generic meta updater ----- */
  const updateMeta = useCallback(<K extends keyof ProjectState>(key: K, value: ProjectState[K]) => {
    setState(prev => ({ ...prev, [key]: value }));
  }, []);

  // Country select handler - maps flag Automatically
  const handleCountryChange = (countryName: string) => {
    updateMeta('country', countryName);
    const countryObj = AVAILABLE_COUNTRIES.find(c => c.name === countryName);
    if (countryObj) {
      updateMeta('flag', `https://flagcdn.com/w40/${countryObj.code}.png`);
    }
  };

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
  const moveSection = useCallback((idx: number, dir: -1 | 1) => setState(prev => { const s = [...prev.sections]; const t = idx + dir; if (t < 0 || t >= s.length) return prev;[s[idx], s[t]] = [s[t], s[idx]]; return { ...prev, sections: s }; }), []);
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

  // Upload file utility
  const uploadFile = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: fd
      });
      if (res.ok) {
        const data = await res.json();
        return data.url; // /uploads/...
      }
    } catch (err) {
      console.error('File upload failed, falling back to base64', err);
    }
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = ev => resolve(ev.target?.result as string);
      reader.onerror = err => reject(err);
      reader.readAsDataURL(file);
    });
  };

  /* ----- Upload Handlers ----- */
  const handleHeroUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    try {
      const url = await uploadFile(file);
      updateMeta('imageUrl', url);
    } catch (err) {
      console.error(err);
    }
  }, [updateMeta]);

  const handleClientImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    try {
      const url = await uploadFile(file);
      updateMeta('clientImageUrl', url);
    } catch (err) {
      console.error(err);
    }
  }, [updateMeta]);

  const handleImageUpload = useCallback(async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    try {
      const url = await uploadFile(file);
      updateBlockContent(id, url);
    } catch (err) {
      console.error(err);
    }
  }, [updateBlockContent]);

  const handleVideoFileUpload = useCallback(async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    try {
      const url = await uploadFile(file);
      updateBlockProp(id, { videoUrl: url, content: url, videoSourceType: 'local' } as Partial<Block>);
    } catch (err) {
      console.error(err);
    }
  }, [updateBlockProp]);

  const handleTeamAvatarUpload = useCallback(async (id: string, memberIdx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    try {
      const url = await uploadFile(file);
      const b = findBlock(id);
      if (b && b.teamMembers) {
        const members = [...b.teamMembers]; members[memberIdx] = { ...members[memberIdx], avatar: url };
        updateBlockProp(id, { teamMembers: members } as Partial<Block>);
      }
    } catch (err) {
      console.error(err);
    }
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

  // Related articles checkboxes toggle
  const toggleArticleSelection = (id: number) => {
    updateMeta('relatedArticleIds',
      state.relatedArticleIds.includes(id)
        ? state.relatedArticleIds.filter((artId) => artId !== id)
        : [...state.relatedArticleIds, id]
    );
  };

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

  /* ---- Floating toolbar: track active contenteditable block ---- */
  const handleBlockFocus = useCallback((blockId: string) => {
    setActiveBlockId(blockId);
    requestAnimationFrame(() => {
      const el = document.querySelector(`[data-block-id="${blockId}"]`) as HTMLElement;
      if (el) {
        const rect = el.getBoundingClientRect();
        setActiveBlockRect({
          x: Math.max(200, Math.min(rect.left + rect.width / 2, window.innerWidth - 200)),
          y: Math.max(68, rect.top - 8),
        });
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

  /* Article styling presets */
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
     SAVE ACTION
     ================================================================ */

  const handleSave = useCallback((isPublished: boolean = true) => {
    if (!token) {
      alert('You must be logged in to save projects.');
      navigate('/login');
      return;
    }

    setSaveStatus('saving');

    const startDate = state.startDate?.trim() || '';
    const endDate = state.endDate?.trim() || '';
    const computedYear = startDate
      ? (endDate && endDate !== startDate ? `${startDate} - ${endDate}` : startDate)
      : (state.year || '');

    const payload = {
      title: state.title || 'Untitled Project',
      client: state.client || '',
      clientImageUrl: state.clientImageUrl || '',
      category: state.category || 'Global Strategy',
      country: state.country || 'Tunisia',
      flag: state.flag || 'https://flagcdn.com/w40/tn.png',
      startDate: startDate,
      endDate: endDate,
      year: computedYear,
      accent: state.accent || '#243c8a',
      imageUrl: state.imageUrl || '',
      description: state.description || '',
      contentJson: JSON.stringify({
        sections: state.sections,
        relatedArticleIds: state.relatedArticleIds,
        isPublished: isPublished,
        fontFamily: articleFontFamily,
        fontSize: articleFontSize,
        textColor: articleTextColor
      })
    };

    const isEdit = projectId !== null;
    const url = isEdit ? `${API_URL}/api/projects/${projectId}` : `${API_URL}/api/projects`;
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
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem('bfc_token');
          navigate('/login');
          throw new Error('Authentication expired. Redirecting to login...');
        }
        if (!res.ok) throw new Error('Save failed');
        return res.json();
      })
      .then((data) => {
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
        if (!isEdit && data.id) {
          setProjectIdState(data.id);
          setSearchParams({ id: String(data.id) });
        }
      })
      .catch((err) => {
        console.error(err);
        setSaveStatus('idle');
        alert('Failed to save project to server.');
      });
  }, [state, projectId, token, navigate, setSearchParams]);

  // Memoize checked article details for preview
  const previewRelatedArticles = useMemo(() => {
    return articles.filter((art) => state.relatedArticleIds.includes(art.id));
  }, [articles, state.relatedArticleIds]);

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
            <div style={{ background: 'var(--med-sage-bg, #E2EFE9)', padding: '2.5rem', borderRadius: 'var(--med-radius, 20px)', borderLeft: '4px solid var(--med-sage, #8BA89D)', borderBottom: '4px solid var(--med-dark, #14352D)', marginBottom: 16 }}>
              <div
                style={{ fontFamily: 'var(--font-sans, "Manrope", sans-serif)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', color: 'var(--med-sage, #8BA89D)', textTransform: 'uppercase', marginBottom: '1rem', outline: 'none' }}
                contentEditable={isEdit} suppressContentEditableWarning
                onBlur={e => updateBlockProp(blk.id, { focusTitle: e.currentTarget.innerText } as Partial<Block>)}>
                {blk.focusTitle || 'Focus Area'}
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 600, color: 'var(--med-dark, #14352D)', margin: 0, lineHeight: 1.5, outline: 'none' }}
                contentEditable={isEdit} suppressContentEditableWarning
                data-block-id={blk.id}
                onFocus={() => handleBlockFocus(blk.id)} onBlur={e => { handleBlockBlur(e); updateBlockContent(blk.id, e.currentTarget.innerText); }}>
                {blk.content || ''}
              </h3>
            </div>
          );

        case 'divider':
          return (
            <div>
              <hr style={{ border: 'none', height: 1, background: blk.content || '#000000', margin: '32px auto', width: '50%' }} />
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
                  ? <img src={getUploadUrl(blk.content)} alt={blk.imageCaption || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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

        case 'video': {
          const ytId = extractYoutubeId(blk.videoUrl || blk.content);
          return (
            <div>
              <div style={{ aspectRatio: '16/9', background: '#000', borderRadius: '16px', overflow: 'hidden', position: 'relative' }}>
                {ytId ? (
                  <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${ytId}`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                ) : blk.content ? (
                  <video width="100%" height="100%" controls src={getUploadUrl(blk.content)} />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#9ca3af' }}>No video selected</div>
                )}
                {isEdit && (
                  <div className="ab-media-overlay">
                    <div style={{ background: '#fff', padding: '8px 12px', borderRadius: 0, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', maxWidth: '90%' }}>
                      <input type="text" placeholder="Paste YouTube link..." style={{ fontSize: 11, padding: '4px 8px', border: '1px solid #dce0e6', borderRadius: 0, outline: 'none', width: 140, flex: 1 }}
                        value={blk.videoUrl || ''} onChange={e => updateVideoUrl(blk.id, e.target.value)} />
                      <span style={{ fontSize: 9, fontWeight: 700, color: '#9ca3af' }}>OR</span>
                      <label style={{ cursor: 'pointer', background: '#204383', color: '#fff', padding: '5px 10px', borderRadius: 0, fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' }}>
                        Upload MP4 <input type="file" accept="video/mp4" style={{ display: 'none' }} onChange={e => handleVideoFileUpload(blk.id, e)} />
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        }

        case 'stats': {
          const stats = blk.stats || [];
          return (
            <div className="ab-stats-grid" style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(stats.length, 4)}, 1fr)`, gap: 16 }}>
              {stats.map((s, idx) => (
                <div key={idx} className="ab-stat-card" style={{ position: 'relative' }}>
                  {isEdit && (
                    <div className="ab-stat-card-inputs">
                      <input style={{ fontSize: 18, fontWeight: 900, color: '#204383', textAlign: 'center', width: '100%', border: 'none', outline: 'none', background: 'transparent' }} value={s.value} onChange={e => updateStat(blk.id, idx, 'value', e.target.value)} placeholder="88%" />
                      <input style={{ fontSize: 9, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', textAlign: 'center', width: '100%', border: 'none', outline: 'none', background: 'transparent', marginTop: 4 }} value={s.label} onChange={e => updateStat(blk.id, idx, 'label', e.target.value)} placeholder="Metric" />
                    </div>
                  )}
                  {!isEdit && (
                    <>
                      <div className="ab-stat-card-value">{s.value}</div>
                      <div className="ab-stat-card-label">{s.label}</div>
                    </>
                  )}
                </div>
              ))}
              {isEdit && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, justifyContent: 'center' }}>
                  <button type="button" onClick={() => addStat(blk.id)} style={{ fontSize: 9, fontWeight: 700, padding: '4px 8px', border: '1px solid #e0e4ea', background: '#fff', color: '#6b7280', cursor: 'pointer' }}>+ Stat</button>
                  <button type="button" onClick={() => removeStat(blk.id)} disabled={stats.length <= 1} style={{ fontSize: 9, fontWeight: 700, padding: '4px 8px', border: '1px solid #e0e4ea', background: '#fff', color: '#ef4444', cursor: 'pointer' }}>- Remove</button>
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
              {isEdit ? (
                <div style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                  <input type="text" style={{ fontSize: 11, fontWeight: 700, color: '#204383', border: '1px solid #e5e7eb', padding: '4px 8px', outline: 'none', flex: 1 }}
                    value={blk.chartDataTitle || ''} onChange={e => updateBlockProp(blk.id, { chartDataTitle: e.target.value } as Partial<Block>)} placeholder="Chart Title..." />
                  <div style={{ display: 'flex', gap: 4 }}>
                    {(['bar', 'line', 'pie', 'area', 'radar'] as ChartType[]).map(t => (
                      <button key={t} type="button" onClick={() => updateChartType(blk.id, t)}
                        style={{ fontSize: 9, padding: '3px 8px', border: '1px solid', borderColor: chartType === t ? '#204383' : '#e0e4ea', background: chartType === t ? '#204383' : '#fff', color: chartType === t ? '#fff' : '#6b7280', cursor: 'pointer', fontWeight: 700 }}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="ab-chart-title">{blk.chartDataTitle || 'Performance Data'}</div>
              )}
              <div style={{ height: 220, position: 'relative' }}>
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === 'bar'
                    ? <ReBarChart data={data}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="name" tick={{ fontSize: 9 }} /><YAxis tick={{ fontSize: 9 }} /><RcTooltip /><Bar dataKey="value" fill="#204383" /></ReBarChart>
                    : chartType === 'line'
                      ? <ReLineChart data={data}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="name" tick={{ fontSize: 9 }} /><YAxis tick={{ fontSize: 9 }} /><RcTooltip /><Line type="monotone" dataKey="value" stroke="#204383" strokeWidth={2} dot={{ fill: '#204383' }} /></ReLineChart>
                      : chartType === 'pie'
                        ? <RePieChart><RcTooltip /><Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>{data.map((_, idx) => <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />)}</Pie></RePieChart>
                        : chartType === 'area'
                          ? <AreaChart data={data}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="name" tick={{ fontSize: 9 }} /><YAxis tick={{ fontSize: 9 }} /><RcTooltip /><Area type="monotone" dataKey="value" stroke="#204383" fill="#99cdb3" fillOpacity={0.35} strokeWidth={2} /></AreaChart>
                          : <RadarChart data={data}><PolarGrid stroke="#e5e7eb" /><PolarAngleAxis dataKey="name" tick={{ fontSize: 9 }} /><PolarRadiusAxis angle={30} tick={{ fontSize: 8 }} /><Radar dataKey="value" stroke="#204383" fill="#99cdb3" fillOpacity={0.35} strokeWidth={2} /></RadarChart>}
                </ResponsiveContainer>
              </div>
              {isEdit && (
                <div style={{ marginTop: 12, borderTop: '1px solid #f0f0f0', paddingTop: 8 }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: '#9ca3af', marginBottom: 6 }}>Edit Data Metrics (Name / Value)</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {data.map((d, i) => (
                      <div key={i} style={{ display: 'flex', gap: 2, alignItems: 'center', background: '#f8fafc', padding: 3, border: '1px solid #e2e8f0' }}>
                        <input style={{ width: 44, fontSize: 9, border: 'none', background: 'transparent', outline: 'none', textAlign: 'center', fontWeight: 600 }} value={d.name} onChange={e => { const nd = [...data]; nd[i] = { ...nd[i], name: e.target.value }; updateChartData(blk.id, nd); }} />
                        <span style={{ fontSize: 9, color: '#cbd5e1' }}>|</span>
                        <input type="number" style={{ width: 34, fontSize: 9, border: 'none', background: 'transparent', outline: 'none', textAlign: 'center' }} value={d.value} onChange={e => { const nd = [...data]; nd[i] = { ...nd[i], value: Number(e.target.value) }; updateChartData(blk.id, nd); }} />
                      </div>
                    ))}
                    <button type="button" onClick={() => updateChartData(blk.id, [...data, { name: `Metric ${data.length + 1}`, value: 50 }])} style={{ fontSize: 9, border: '1px dashed #cbd5e1', padding: '3px 8px', cursor: 'pointer', background: '#fff' }}>+ Add Row</button>
                    <button type="button" onClick={() => updateChartData(blk.id, data.slice(0, -1))} disabled={data.length <= 1} style={{ fontSize: 9, border: '1px dashed #cbd5e1', padding: '3px 8px', cursor: 'pointer', background: '#fff', color: '#ef4444' }}>- Del</button>
                  </div>
                </div>
              )}
            </div>
          );
        }

        case 'list': {
          const items = blk.listItems || [];
          const listStyle = blk.listStyle || 'bullet';
          return (
            <div className="ab-list">
              {isEdit && (
                <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                  {(['bullet', 'numbered', 'checklist'] as ListStyle[]).map(s => (
                    <button key={s} type="button" onClick={() => updateBlockProp(blk.id, { listStyle: s } as Partial<Block>)}
                      style={{ fontSize: 9, padding: '3px 8px', border: '1px solid', borderColor: listStyle === s ? '#204383' : '#e0e4ea', background: listStyle === s ? '#204383' : '#fff', color: listStyle === s ? '#fff' : '#6b7280', cursor: 'pointer', fontWeight: 700 }}>
                      {s}
                    </button>
                  ))}
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {listStyle === 'bullet' && <span style={{ color: '#204383', fontWeight: 700, fontSize: 16 }}>•</span>}
                    {listStyle === 'numbered' && <span style={{ color: '#204383', fontWeight: 700, fontSize: 11, minWidth: 16 }}>{idx + 1}.</span>}
                    {listStyle === 'checklist' && <input type="checkbox" checked={item.checked || false} onChange={() => toggleCheck(blk.id, idx)} style={{ width: 14, height: 14, accentColor: '#204383', cursor: 'pointer' }} />}
                    {isEdit ? (
                      <input style={{ flex: 1, fontSize: 12, border: 'none', borderBottom: '1px solid #f0f0f0', outline: 'none', background: 'transparent' }} value={item.text} onChange={e => updateListItem(blk.id, idx, e.target.value)} />
                    ) : (
                      <span style={{ fontSize: '0.92rem', textDecoration: item.checked && listStyle === 'checklist' ? 'line-through' : 'none', color: item.checked && listStyle === 'checklist' ? '#9ca3af' : 'inherit' }}>{item.text}</span>
                    )}
                    {isEdit && <button type="button" onClick={() => removeListItem(blk.id, idx)} style={{ border: 'none', background: 'transparent', color: '#ef4444', fontSize: 12, cursor: 'pointer' }}>✕</button>}
                  </div>
                ))}
              </div>
              {isEdit && <button type="button" onClick={() => addListItem(blk.id)} style={{ fontSize: 10, fontWeight: 700, color: '#204383', background: 'transparent', border: 'none', marginTop: 8, cursor: 'pointer' }}>+ Add Row</button>}
            </div>
          );
        }

        case 'accordion': {
          const items = blk.accordionItems || [];
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {items.map((item, i) => (
                <div key={i} style={{ border: '1px solid #e5e7eb', padding: 8 }}>
                  {isEdit ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <input style={{ fontWeight: 700, fontSize: 12, width: '100%', border: 'none', borderBottom: '1px solid #f0f0f0', outline: 'none' }} value={item.question} onChange={e => updateAccItem(blk.id, i, 'question', e.target.value)} placeholder="Question" />
                      <textarea style={{ fontSize: 11, width: '100%', border: 'none', outline: 'none', resize: 'none', color: '#4b5563' }} rows={2} value={item.answer} onChange={e => updateAccItem(blk.id, i, 'answer', e.target.value)} placeholder="Answer" />
                      <button type="button" onClick={() => removeAccItem(blk.id, i)} style={{ fontSize: 9, color: '#ef4444', border: 'none', background: 'transparent', textAlign: 'right', cursor: 'pointer' }}>Remove</button>
                    </div>
                  ) : (
                    <AccordionItemBlock item={item} />
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
                  <a className="ab-cta-preview-btn" href={blk.ctaLink || '#'} style={{ background: color }} onClick={e => e.preventDefault()}>{blk.ctaButtonText || 'Learn More'}</a>
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
                        {m.avatar ? <img src={getUploadUrl(m.avatar)} alt="" /> : <span className="ab-team-initial">{m.name.charAt(0) || '?'}</span>}
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
                        {m.avatar ? <img src={getUploadUrl(m.avatar)} alt={m.name} /> : <span className="ab-team-initial">{m.name.charAt(0) || '?'}</span>}
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
      <React.Fragment key={blk.id}>
        <div
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
                <button key={item.type} type="button" className="ab-quick-add-option" style={{ ['--d' as string]: String(idx) }} onClick={() => insertBlockDirectly(sectionIdx, blk.id, item.type)}>
                  <span className="ab-qa-icon">{item.icon}</span> {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </React.Fragment>
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
    const imgSrc = state.imageUrl;
    return (
      <header className="ab-hero">
        <div className="ab-hero-media">
          {imgSrc
            ? <img src={getUploadUrl(imgSrc)} alt="Hero" />
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
                <button type="button" onClick={() => updateMeta('imageUrl', '')} style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: 0, cursor: 'pointer' }}>Remove</button>
              )}
            </div>
          )}
        </div>

        <div className="ab-hero-panel">
          <span className="ab-hero-eyebrow">Project Reference</span>
          <textarea
            className="ab-hero-title-field"
            placeholder="Project Title..."
            rows={2}
            value={state.title}
            onChange={e => updateMeta('title', e.target.value)}
            disabled={mode === 'preview'}
            style={{ fontFamily: articleFontFamily }}
          />
          <p className="article-detail__subtitle" style={{ fontSize: '0.95rem', margin: '8px 0 0', opacity: 0.8 }}>
            Detailed mission brief for {state.client || '[Client]'}, focused on {state.category.toLowerCase()} outcomes in {state.country}.
          </p>
          <div className="ab-hero-meta-row" style={{ marginTop: 16 }}>
            <span style={{ color: '#fff', fontSize: '0.8rem', fontWeight: 600 }}>{state.country}</span>
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>|</span>
            <span style={{ color: '#fff', fontSize: '0.8rem', fontWeight: 600 }}>{state.year || '2025'}</span>
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>|</span>
            <span style={{ color: '#fff', fontSize: '0.8rem', fontWeight: 600 }}>{state.category}</span>
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

      {/* Project facts specifications */}
      <div className="ab-sidebar-card">
        <div className="ab-sidebar-card-label" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 6 }}>Project Specifications</div>

        <div className="pb-sidebar-fields" style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>

          <div className="pb-sidebar-field" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Client Name</label>
            <input
              type="text"
              style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '6px 8px', borderRadius: 4, fontSize: 12 }}
              value={state.client}
              onChange={e => updateMeta('client', e.target.value)}
              placeholder="e.g. ADPME, World Bank"
            />
          </div>

          {/* Client Logo */}
          <div className="pb-sidebar-field" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Client Logo</label>
              {state.clientImageUrl && (
                <button
                  type="button"
                  onClick={() => updateMeta('clientImageUrl', '')}
                  style={{ fontSize: 10, color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '2px 6px', borderRadius: 4, cursor: 'pointer', fontWeight: 600 }}
                >Clear Logo</button>
              )}
            </div>
            {state.clientImageUrl ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <img
                  src={getUploadUrl(state.clientImageUrl)}
                  alt="Client logo"
                  style={{ height: 36, maxWidth: 100, objectFit: 'contain', background: '#fff', borderRadius: 4, padding: '2px 6px', border: '1px solid rgba(255,255,255,0.15)' }}
                />
              </div>
            ) : null}
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.07)', border: '1px dashed rgba(255,255,255,0.2)', borderRadius: 4, padding: '6px 10px', cursor: 'pointer', fontSize: 11, color: '1px solid rgba(255,255,255,0.15)' }}>
              <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              {state.clientImageUrl ? 'Change logo' : 'Upload'}
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleClientImageUpload} />
            </label>
            <input
              type="text"
              style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '6px 8px', borderRadius: 4, fontSize: 12 }}
              value={state.clientImageUrl}
              onChange={e => updateMeta('clientImageUrl', e.target.value)}
              placeholder="Or paste logo URL..."
            />
          </div>

          {/* Start/End Dates */}
          <div className="pb-sidebar-field" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Project Period</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: 9, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Start</span>
                <input
                  type="date"
                  style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '6px 8px', borderRadius: 4, fontSize: 12, width: '100%', boxSizing: 'border-box', colorScheme: 'dark' }}
                  value={state.startDate}
                  onChange={e => updateMeta('startDate', e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, margin: '2px 0' }}>
                <input
                  type="checkbox"
                  id="ongoing-check"
                  checked={state.endDate === 'ongoing'}
                  onChange={(e) => updateMeta('endDate', e.target.checked ? 'ongoing' : '')}
                  style={{ accentColor: '#99cdb3' }}
                />
                <label htmlFor="ongoing-check" style={{ fontSize: 10, color: '#cbd5e1', cursor: 'pointer' }}>Ongoing Project</label>
              </div>
              {state.endDate !== 'ongoing' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ fontSize: 9, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>End</span>
                  <input
                    type="date"
                    style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '6px 8px', borderRadius: 4, fontSize: 12, width: '100%', boxSizing: 'border-box', colorScheme: 'dark' }}
                    value={state.endDate}
                    onChange={e => updateMeta('endDate', e.target.value)}
                  />
                </div>
              )}
            </div>
            {(() => {
              if (state.startDate) {
                const s = new Date(state.startDate);
                if (!isNaN(s.getTime())) {
                  let months = 0;
                  if (state.endDate === 'ongoing') {
                     const e = new Date();
                     months = (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth());
                  } else if (state.endDate) {
                     const e = new Date(state.endDate);
                     if (!isNaN(e.getTime())) {
                       months = (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth());
                     }
                  }
                  if (months >= 0 && (state.endDate || state.endDate === 'ongoing')) {
                    return <div style={{ fontSize: 10, color: 'rgba(153,205,179,0.8)', marginTop: 4, fontFamily: 'ui-monospace, monospace' }}>Period: {months} months</div>;
                  }
                }
              }
              return null;
            })()}
          </div>

          <div className="pb-sidebar-field" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Category Domain</label>
            <select
              style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '6px 8px', borderRadius: 4, fontSize: 12 }}
              value={state.category}
              onChange={e => updateMeta('category', e.target.value)}
            >
              {PRESETS_CATEGORIES.map(cat => (
                <option key={cat} value={cat} style={{ background: '#0f172a' }}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="pb-sidebar-field" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Country &amp; Flag</label>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <select
                style={{ flex: 1, background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '6px 8px', borderRadius: 4, fontSize: 12 }}
                value={state.country}
                onChange={e => handleCountryChange(e.target.value)}
              >
                {AVAILABLE_COUNTRIES.map(c => (
                  <option key={c.code} value={c.name} style={{ background: '#0f172a' }}>{c.name}</option>
                ))}
              </select>
              {state.flag && (
                <img src={state.flag} alt="" style={{ width: 28, height: 19, borderRadius: 2, border: '1px solid rgba(255,255,255,0.1)' }} />
              )}
            </div>
          </div>

          <div className="pb-sidebar-field" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Representative (Office)</label>
            <select
              style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '6px 8px', borderRadius: 4, fontSize: 12 }}
              value={state.representativeSlug}
              onChange={e => updateMeta('representativeSlug', e.target.value)}
            >
              <option value="" style={{ background: '#0f172a' }}>-- None --</option>
              {representatives.map(r => (
                <option key={r.slug} value={r.slug} style={{ background: '#0f172a' }}>{r.title}</option>
              ))}
            </select>
          </div>

          <div className="pb-sidebar-field" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Accent Color</label>
            <div style={{ display: 'flex', gap: 6 }}>
              <input
                type="color"
                style={{ width: 32, height: 32, background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', padding: 1, cursor: 'pointer' }}
                value={state.accent}
                onChange={e => updateMeta('accent', e.target.value)}
              />
              <input
                type="text"
                style={{ flex: 1, background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '6px 8px', borderRadius: 4, fontSize: 12 }}
                value={state.accent}
                onChange={e => updateMeta('accent', e.target.value)}
              />
            </div>
          </div>

          <div className="pb-sidebar-field" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Executive Summary</label>
            <textarea
              style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '6px 8px', borderRadius: 4, fontSize: 12, resize: 'none', fontFamily: 'inherit' }}
              rows={4}
              value={state.description}
              onChange={e => updateMeta('description', e.target.value)}
              placeholder="Describe the context, primary objectives, and outcomes..."
            />
          </div>

        </div>
      </div>

      {/* Link Related Articles checklist */}
      <div className="ab-sidebar-card">
        <div className="ab-sidebar-card-label" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 6 }}>Link Related Articles</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12, maxHeight: 145, overflowY: 'auto', paddingRight: 4 }}>
          {articles.length === 0 ? (
            <div style={{ fontSize: 11, color: '#94a3b8', textAlign: 'center', padding: '12px' }}>No articles available.</div>
          ) : (
            articles.map((art) => {
              const isChecked = state.relatedArticleIds.includes(art.id);
              return (
                <div
                  key={art.id}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, background: isChecked ? 'rgba(32, 67, 131, 0.2)' : 'rgba(255,255,255,0.02)', border: isChecked ? '1px solid rgba(32,67,131,0.5)' : '1px solid rgba(255,255,255,0.05)', padding: 6, borderRadius: 4, cursor: 'pointer' }}
                  onClick={() => toggleArticleSelection(art.id)}
                >
                  <div style={{ width: 14, height: 14, border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: isChecked ? '#204383' : 'transparent', color: '#fff', fontSize: 10 }}>
                    {isChecked && '✓'}
                  </div>
                  <span style={{ fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#7b7c7e99' }} title={art.title}>
                    {art.title}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Table of Contents section */}
      <div className="ab-sidebar-card">
        <div className="ab-sidebar-card-label">In this project article</div>
        {toc.length === 0
          ? <p className="ab-toc-empty">Sections will appear here</p>
          : toc.map((title, i) => (
            <a key={i} className="ab-toc-link" href={`#section-${i}`}
              onClick={e => { e.preventDefault(); const el = document.querySelectorAll('[data-section-id]')[i]; if (el) el.scrollIntoView({ behavior: 'smooth' }); }}>
              {title}
            </a>
          ))}
      </div>

      {/* Styling Card */}
      <div className="ab-settings-card">
        <div className="ab-settings-label">Workspace Styling</div>
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

    </div>
  );

  /* ================================================================
     MAIN RENDER
     ================================================================ */

  return (
    <div className={`ab-page ${mode}-mode`} style={{
      ['--ab-font' as any]: articleFontFamily,
      ['--ab-color' as any]: articleTextColor,
      ['--ab-size' as any]: articleFontSize,
      fontFamily: 'var(--ab-font)',
      color: 'var(--ab-color)',
      fontSize: 'var(--ab-size)'
    }}>

      {/* ---- BACKGROUND ---- */}
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
            Project Builder
          </span>
        </div>

        <div className="ab-header-actions">
          {/* Back button */}
          <button type="button" className="pb-back-btn" onClick={() => navigate('/admin?tab=projects')} style={{ marginRight: 12 }}>
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

          {/* Save Action */}
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
          </div>
        </div>
      </header>

      {/* ---- BODY ---- */}
      <div className="ab-body">
        {mode === 'preview' ? (
          <div
            className="pb-preview-canvas"
            onScroll={handlePreviewScroll}
            style={{ flex: 1, overflowY: 'auto', position: 'relative' }}
          >
            <article className="project-article" style={{ ['--hero-progress' as any]: previewHeroProgress }}>
              <div className="project-article__progress">
                <span style={{ transform: `scaleX(${previewScrollProgress})` }} />
              </div>

              <header className="project-article__hero">
                <div className="project-article__hero-media">
                  <img src={getUploadUrl(state.imageUrl) || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800'} alt={state.title} />
                </div>

                <div className="project-article__hero-panel">
                  {(state.clientImageUrl || getClientLogo(state.client)) && (
                    <img
                      src={getUploadUrl(state.clientImageUrl) || getClientLogo(state.client)}
                      alt={`${state.client} logo`}
                      className="project-article__hero-logo"
                    />
                  )}
                  <div className="project-article__hero-top">
                    <button type="button" className="project-article__back" style={{ border: 'none', cursor: 'pointer' }} onClick={() => setMode('edit')}>
                      ← Editor
                    </button>
                    <span className="project-article__eyebrow">Project Reference</span>
                  </div>

                  <h1 className="project-article__title">{state.title || 'Untitled Project'}</h1>

                  <p className="project-article__subtitle">
                    Detailed mission brief for {state.client || '[Client]'}, focused on {state.category.toLowerCase()} outcomes in {state.country}.
                  </p>

                  <div className="project-article__hero-stats">
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.25rem' }}>
                        {state.flag && (
                          <img
                            src={state.flag}
                            alt={state.country}
                            style={{ width: '20px', height: '14px', objectFit: 'cover', borderRadius: '2px', border: '1px solid rgba(0,0,0,0.1)' }}
                          />
                        )}
                        <p className="project-article__stat-value" style={{ margin: 0 }}>{state.country}</p>
                      </div>
                      <p className="project-article__stat-label">Country</p>
                    </div>
                    <div>
                      {(() => {
                        const sd = state.startDate?.trim();
                        const ed = state.endDate?.trim();
                        const period = sd
                          ? (ed && ed !== sd ? `${sd} – ${ed}` : sd)
                          : (state.year || '—');
                        return <p className="project-article__stat-value">{period}</p>;
                      })()}
                      <p className="project-article__stat-label">Period</p>
                    </div>
                    <div>
                      <p className="project-article__stat-value">{state.category}</p>
                      <p className="project-article__stat-label">Category</p>
                    </div>
                  </div>
                </div>
              </header>

              <section className="project-article__body">
                <div className="project-article__content">
                  <p className="project-article__lead">
                    This project was delivered as a strategic intervention to improve organizational performance,
                    implementation capability, and measurable impact for the client institution.
                  </p>

                  <div className="project-article__callout">
                    <p className="project-article__callout-title">Executive summary</p>
                    <p>{state.description || 'No description provided.'}</p>
                  </div>

                  {/* Dynamic sections from project builder */}
                  {(state.sections || []).map((s, i) => (
                    <div key={i} className="project-article__reveal is-visible" style={{ marginTop: '2.5rem' }}>
                      {s.title && <h2 id={`section-${i}`} style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.8rem' }}>{s.title}</h2>}
                      {s.blocks && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                          {s.blocks.map((block, bi) => (
                            <DetailBlock key={block.id || bi} block={block} />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <aside className="project-article__sidebar">
                  {state.sections.length > 0 && (
                    <div className="project-article__card project-article__reveal is-visible">
                      <p className="project-article__card-label">In this project article</p>
                      {(state.sections || []).map((s, i) => s.title && (
                        <a key={i} href={`#section-${i}`} className="project-article__toc-link" onClick={e => {
                          e.preventDefault();
                          const el = document.getElementById(`section-${i}`);
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}>
                          {s.title}
                        </a>
                      ))}
                    </div>
                  )}

                  <div className="project-article__card project-article__reveal is-visible">
                    <p className="project-article__card-label">Project facts</p>
                    <p className="project-article__card-copy"><strong>Client:</strong> {state.client || '[Client]'}</p>
                    <p className="project-article__card-copy"><strong>Country:</strong> {state.country}</p>
                    <p className="project-article__card-copy"><strong>Period:</strong> {state.year || '2025'}</p>
                    <p className="project-article__card-copy"><strong>Domain:</strong> {state.category}</p>
                  </div>

                  {previewRelatedArticles.length > 0 && (
                    <div className="project-article__card project-article__reveal is-visible">
                      <p className="project-article__card-label">Related Articles</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '150px', overflowY: 'auto', paddingRight: '4px' }}>
                        {previewRelatedArticles.map((article: any) => (
                          <div
                            key={article.id}
                            className="project-article__toc-link"
                            style={{
                              color: '#1f4a96',
                              margin: 0,
                              fontSize: '0.88rem',
                              lineHeight: '1.4',
                              borderBottom: '1px solid rgba(31, 74, 150, 0.1)',
                              paddingBottom: '0.5rem',
                              cursor: 'default'
                            }}
                          >
                            <span style={{ marginRight: '6px' }}>↗</span> {article.title}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </aside>
              </section>

              <section className="project-article__cta">
                <div className="project-article__cta-inner">
                  <div>
                    <p className="project-article__cta-eyebrow">Continue exploring</p>
                    <h3>Browse the full project portfolio</h3>
                  </div>
                  <button type="button" className="project-article__cta-button" style={{ border: 'none', cursor: 'pointer' }} onClick={() => setMode('edit')}>
                    Back to Editor
                  </button>
                </div>
              </section>
            </article>
          </div>
        ) : (
          <>
            {/* ---- LEFT SIDEBAR TOOLBOX ---- */}
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

              {/* Meta bar */}
              {mode === 'edit' && (
                <div className="ab-meta-bar editor-only" style={{ display: 'flex', gap: '10px' }}>
                  <input className="ab-meta-input ab-meta-input--wide" placeholder="Project Title..." value={state.title} onChange={e => updateMeta('title', e.target.value)} />
                  <input className="ab-meta-input" style={{ width: 150 }} placeholder="Client" value={state.client} onChange={e => updateMeta('client', e.target.value)} />
                  <input className="ab-meta-input" style={{ width: 120 }} placeholder="Period / Year" value={state.year} onChange={e => updateMeta('year', e.target.value)} />
                </div>
              )}

              {/* Hero */}
              {renderHero()}

              {/* Project body grid */}
              <div className="ab-article-body">
                {/* Middle: content */}
                <div className="ab-article-content" style={{ fontFamily: articleFontFamily, fontSize: articleFontSize, color: articleTextColor }}>

                  {/* Summary Callout Box */}
                  <div className="ab-summary-box">
                    <div className="ab-summary-label">Executive Summary</div>
                    {mode === 'edit'
                      ? <textarea className="ab-summary-field" placeholder="Write an executive summary..." rows={3} value={state.description} onChange={e => updateMeta('description', e.target.value)} />
                      : <p style={{ fontSize: '0.9rem', lineHeight: 1.75, color: '#4b5563' }}>{state.description || 'No description provided.'}</p>}
                  </div>

                  {/* Sections Card */}
                  <div className="ab-content-card" style={{ fontFamily: articleFontFamily, fontSize: articleFontSize, color: articleTextColor }}>
                    {state.sections.length === 0 && mode === 'edit' ? (
                      <div className="ab-empty-canvas editor-only" style={{ color: articleTextColor }}>
                        <div className="ab-empty-canvas-icon">💼</div>
                        <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Start building your project details</p>
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

              {/* Footer */}
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

            {/* ---- RIGHT SIDEBAR PROPERTIES ---- */}
            <aside className={`ab-right-sidebar ${mode === 'preview' ? 'ab-right-sidebar--hidden' : ''}`}>
              <div className="ab-right-sidebar-scroll">
                {renderRightSidebar()}
              </div>
            </aside>
          </>
        )}
      </div>

      {/* ---- FLOATING FORMATTING TOOLBAR ---- */}
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
            {[{ c: '#204383', l: 'Navy' }, { c: '#1f6f5c', l: 'Mint' }, { c: '#ef4444', l: 'Red' }, { c: '#374151', l: 'Slate' }, { c: '#000000', l: 'Black' }].map(clr => (
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
      )}

    </div>
  );
};
