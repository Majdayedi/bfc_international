import React, { useState, useEffect, useRef, useCallback } from 'react';
import './ComplianceComposer.css';

const DEFAULT_HERO = 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&q=80';

interface ComposerState {
  category: string;
  title: string;
  subtitle: string;
  author: string;
  readTime: string;
  summary: string;
  heroImage: string;
}

const STORAGE_KEYS: Record<keyof ComposerState, string> = {
  category: 'cc_category',
  title: 'cc_title',
  subtitle: 'cc_subtitle',
  author: 'cc_author',
  readTime: 'cc_readTime',
  summary: 'cc_summary',
  heroImage: 'cc_heroImage',
};

function loadState(): ComposerState {
  const state: ComposerState = {
    category: 'COMPLIANCE & AUDITING',
    title: 'Aviation Fuel Storage Structural Regulations & Operational Integrity Guide',
    subtitle:
      'Official guidelines compiled under the secondary review of quality limits and facilities containment.',
    author: 'BFC Executive Auditor',
    readTime: '14 MIN READ',
    summary:
      'This master workbook highlights standard operation regulations across global refueling hubs, including secondary seal failure parameters, cathodic security logs, and unified regulatory compliance schedules.',
    heroImage: DEFAULT_HERO,
  };    for (const key of Object.keys(STORAGE_KEYS) as (keyof ComposerState)[]) {
      const stored = localStorage.getItem(STORAGE_KEYS[key]);
      if (stored !== null) {
        state[key] = stored as ComposerState[typeof key];
      }
    }
  return state;
}

function saveState(state: ComposerState) {
  for (const key of Object.keys(STORAGE_KEYS) as (keyof ComposerState)[]) {
    localStorage.setItem(STORAGE_KEYS[key], state[key]);
  }
}

/* ---------- BFC Logo Component ---------- */
const BfcLogo: React.FC<{ variant?: 'header' | 'footer' }> = ({ variant = 'header' }) => {
  if (variant === 'footer') {
    return (
      <div className="cc-footer-logo">
        <span className="cc-footer-logo-text">BFC</span>
      </div>
    );
  }

  return (
    <div className="cc-logo">
      <div className="cc-logo-row">
        <span className="cc-logo-bf">BF</span>
        <span className="cc-logo-c">
          C
          <span className="cc-logo-globe">
            <span className="cc-logo-globe-line" />
            <span className="cc-logo-globe-line" />
            <span className="cc-logo-globe-line" />
            <span className="cc-logo-globe-line" />
          </span>
        </span>
      </div>
      <span className="cc-logo-groupe">GROUPE</span>
    </div>
  );
};

/* ---------- Mode Toggle Component ---------- */
const EditIcon: React.FC = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const PreviewIcon: React.FC = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

/* ---------- Main Page Component ---------- */
export const ComplianceComposer: React.FC = () => {
  const [state, setState] = useState<ComposerState>(loadState);
  const [isEditMode, setIsEditMode] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Persist to localStorage on every state change
  useEffect(() => {
    saveState(state);
  }, [state]);

  const updateField = useCallback(
    (key: keyof ComposerState, value: string) => {
      setState((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      if (result) {
        setState((prev) => ({ ...prev, heroImage: result }));
      }
    };
    reader.readAsDataURL(file);
  }, []);

  return (
    <div className="cc-page">
      {/* ---- Header ---- */}
      <header className="cc-header">
        <div className="cc-header-left">
          <BfcLogo variant="header" />
          <span className="cc-header-tag">🔧 Compliance Composer</span>
        </div>

        <div className="cc-mode-toggle">
          <button
            type="button"
            className={`cc-mode-btn ${isEditMode ? 'cc-mode-btn--active' : ''}`}
            onClick={() => setIsEditMode(true)}
            aria-label="Edit mode"
          >
            <EditIcon />
            <span>Edit Settings</span>
          </button>
          <button
            type="button"
            className={`cc-mode-btn ${!isEditMode ? 'cc-mode-btn--active' : ''}`}
            onClick={() => setIsEditMode(false)}
            aria-label="Preview mode"
          >
            <PreviewIcon />
            <span>Preview Style</span>
          </button>
        </div>
      </header>

      {/* ---- Body ---- */}
      <div className="cc-body">
        {/* ---- Sidebar (Edit Panel) ---- */}
        <aside className={`cc-sidebar ${!isEditMode ? 'cc-sidebar--hidden' : ''}`}>
          {/* Palette Badge */}
          <div className="cc-palette-badge">
            <div className="cc-palette-label">Active Compliance Palette</div>
            <div className="cc-palette-swatches">
              <div className="cc-palette-swatch">
                <span className="cc-palette-dot" style={{ background: '#204383' }} />
                <span className="cc-palette-hex">#204383</span>
              </div>
              <div className="cc-palette-swatch">
                <span className="cc-palette-dot" style={{ background: '#99cdb3' }} />
                <span className="cc-palette-hex">#99cdb3</span>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div>
            <h3 className="cc-sidebar-section-title">
              <span>📝</span> Edit Header Information
            </h3>
          </div>

          <div className="cc-field">
            <label className="cc-field-label">Thumbnail Photo (Local Computer)</label>
            <button
              type="button"
              className="cc-upload-btn cc-shape-sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span>Upload Local Photo</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />
          </div>

          <div className="cc-field">
            <label className="cc-field-label" htmlFor="cc-category">Category Label Tag</label>
            <input
              id="cc-category"
              type="text"
              className="cc-input cc-input--uppercase cc-shape-xs"
              value={state.category}
              onChange={(e) => updateField('category', e.target.value)}
            />
          </div>

          <div className="cc-field">
            <label className="cc-field-label" htmlFor="cc-title">Article Title</label>
            <textarea
              id="cc-title"
              className="cc-textarea cc-shape-md"
              rows={3}
              value={state.title}
              onChange={(e) => updateField('title', e.target.value)}
            />
          </div>

          <div className="cc-field">
            <label className="cc-field-label" htmlFor="cc-subtitle">Auxiliary Subtitle</label>
            <textarea
              id="cc-subtitle"
              className="cc-textarea cc-shape-md"
              rows={2}
              value={state.subtitle}
              onChange={(e) => updateField('subtitle', e.target.value)}
            />
          </div>

          <div className="cc-field-row">
            <div className="cc-field">
              <label className="cc-field-label" htmlFor="cc-author">Author Specialist</label>
              <input
                id="cc-author"
                type="text"
                className="cc-input cc-shape-xs"
                value={state.author}
                onChange={(e) => updateField('author', e.target.value)}
              />
            </div>
            <div className="cc-field">
              <label className="cc-field-label" htmlFor="cc-readtime">Reading Estimation</label>
              <input
                id="cc-readtime"
                type="text"
                className="cc-input cc-shape-xs"
                style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}
                value={state.readTime}
                onChange={(e) => updateField('readTime', e.target.value)}
              />
            </div>
          </div>

          <div className="cc-field">
            <label className="cc-field-label" htmlFor="cc-summary">Executive Abstract Overview</label>
            <textarea
              id="cc-summary"
              className="cc-textarea cc-shape-md"
              rows={4}
              value={state.summary}
              onChange={(e) => updateField('summary', e.target.value)}
            />
          </div>

          <div className="cc-sidebar-footer">State Saved to Local Sandbox</div>
        </aside>

        {/* ---- Canvas (Preview Area) ---- */}
        <main className="cc-canvas">
          {/* Progress bar */}
          <div className="cc-progress-bar">
            <div className="cc-progress-fill" />
          </div>

          {/* ---- Hero Cover ---- */}
          <section className="cc-hero-cover cc-shape-lg">
            <div className="cc-hero-bg">
              <img src={state.heroImage} alt="BFC Operations Backdrop" />
            </div>
            <div className="cc-hero-overlay" />

            {/* Hero Card */}
            <div className="cc-hero-card cc-shape-lg">
              <div className="cc-hero-meta">
                <span className="cc-hero-category cc-shape-xs">{state.category.toUpperCase()}</span>
                <span className="cc-hero-sep">•</span>
                <span className="cc-hero-readtime">{state.readTime.toUpperCase()}</span>
              </div>

              <h1 className="cc-hero-title">{state.title}</h1>

              {state.subtitle && (
                <p className="cc-hero-subtitle">{state.subtitle}</p>
              )}

              <div className="cc-hero-details">
                <div className="cc-hero-detail-item">
                  <div className="cc-hero-detail-avatar">BF</div>
                  <div className="cc-hero-detail-info">
                    <span className="cc-hero-detail-meta">Specialist</span>
                    <span className="cc-hero-detail-value">{state.author}</span>
                  </div>
                </div>

                <div className="cc-hero-detail-item">
                  <svg className="cc-hero-detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div className="cc-hero-detail-info">
                    <span className="cc-hero-detail-meta">Created on</span>
                    <span className="cc-hero-detail-value">June 12, 2026</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ---- Article Content ---- */}
          <article className="cc-article-content">
            {/* Executive Summary */}
            <div className="cc-summary-box cc-shape-md">
              <div className="cc-summary-label">Executive Abstract Overview</div>
              <p className="cc-summary-text">{state.summary}</p>
            </div>

            {/* Section Block */}
            <div className="cc-section-block cc-shape-md">
              <div className="cc-section-header">
                <span className="cc-section-label">Section 1. Compliance Assessment</span>
                <span className="cc-section-badge cc-shape-xs">Standard QA</span>
              </div>

              <h2 className="cc-section-title">Operational Safety Containment Logs</h2>
              <p className="cc-section-desc">
                As part of regular site environmental protection reviews, facilities maintain constant ground
                pressure monitoring. Any deviation exceeding ±0.05 bar prompts immediate shutdown protocols.
              </p>

              <div className="cc-checklist">
                <label className="cc-check-item cc-shape-sm">
                  <input type="checkbox" defaultChecked className="cc-checkbox" />
                  <span>Verify double-barrier secondary seal tolerances</span>
                </label>
                <label className="cc-check-item cc-shape-sm">
                  <input type="checkbox" className="cc-checkbox" />
                  <span>Submit environmental certification alignment form monthly</span>
                </label>
              </div>
            </div>
          </article>

          {/* ---- Footer ---- */}
          <footer className="cc-footer cc-shape-lg">
            <div className="cc-footer-content">
              <BfcLogo variant="footer" />
              <div className="cc-footer-groupe">GROUPE</div>
              <p className="cc-footer-copy">
                © 2026 BFC GROUPE compliance framework system. All rights reserved. Registered content cached locally.
              </p>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};
