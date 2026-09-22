import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.join(__dirname, 'pages', 'AdminDashboard.tsx');

let content = fs.readFileSync(filePath, 'utf8');
let modified = content;

// Helper: tag template literal to escape backticks in strings
function esc(str) {
  return str.replace(/`/g, '\\`').replace(/\${/g, '\\${');
}

// =====================================================
// 1. Replace Service Modal with BFC-styled version
// =====================================================
const modalRegex = /\/\* Service Modal \*\//;
const modalStart = modified.indexOf('{/* Service Modal */}');
if (modalStart < 0) {
  // Try without braces
  const idx = modified.indexOf('{/* Service Modal */}');
  if (idx >= 0) console.log('Found modal at', idx);
}
// Let's just find by matching the exact comments
const idx1 = modified.indexOf('{/* Service Modal */}');
const idx2 = modified.indexOf('{/* Service Modal */');
if (idx1 >= 0) console.log('Found modal (with braces)');
if (idx2 >= 0) console.log('Found modal (partial)');

// Find the exact position of the modal
const modalComment = '      {/* Service Modal */}';
const modalPos = modified.indexOf(modalComment);
if (modalPos >= 0) {
  console.log('Modal found at position:', modalPos);
  
  // Find the closing of this section - it ends with "      )}"
  // The next section component starts with "    </div>"
  // Let's find the end
  const afterModal = modified.substring(modalPos);
  // Find the end of the modal section: the closing of the wrapping div after the modal
  // The modal ends with `      )}` followed by `    </div>\n  );\n};`
  // Actually let's find the pattern: the modal's last `)` then the closing
  
  // The modal section ends with:
  //       )}
  //     </div>
  //   );
  // };
  
  // Let's find the pattern more carefully
  const endMarker = '      )}\n    </div>\n  );\n};';
  const endPos = modified.indexOf(endMarker, modalPos);
  
  if (endPos >= 0) {
    const fullSection = modified.substring(modalPos, endPos + endMarker.length);
    console.log('Full modal section length:', fullSection.length);
    
    // Now find the modal open/close pattern within this section
    const openDiv = modified.indexOf('{isServiceModalOpen && (', modalPos);
    const closeDiv = modified.lastIndexOf('      )}', openDiv + 200);
    
    // Actually let's find from the specific comment to the matching close
    // The structure is:
    //       {/* Service Modal */}
    //       {isServiceModalOpen && (
    //         ...
    //       )}
    //     </div>
    //   );
    // };
    
    const modalStartActual = modalPos;
    const modalContentStart = modified.indexOf('{isServiceModalOpen && (', modalPos);
    
    // Count parentheses to find matching close
    let depth = 0;
    let endIdx = modalContentStart;
    for (let i = modalContentStart; i < modified.length; i++) {
      if (modified[i] === '(') depth++;
      else if (modified[i] === ')') depth--;
      if (depth === 0 && i > modalContentStart) {
        endIdx = i + 1; // include the closing paren
        break;
      }
    }
    
    // The modal section includes the comment + the {isServiceModalOpen ... )} block
    const modalSection = modified.substring(modalPos, endIdx);
    console.log('Modal section length:', modalSection.length, 'ends with:', modalSection.slice(-30));
    
    // Check if it ends with the closing pattern
    if (modalSection.trimEnd().endsWith(')}') || modalSection.trimEnd().endsWith('})')) {
      console.log('Modal section properly closed');
    }
    
    const newModalContent = `      {/* Service Modal — BFC Styled */}
      {isServiceModalOpen && (
        <div className="bfc-modal-overlay" onClick={() => setIsServiceModalOpen(false)}>
          <div className="bfc-id-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '560px', width: '95%', padding: '2.5rem', background: '#fff', borderRadius: '24px', boxShadow: '0 30px 80px rgba(0,0,0,0.35)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '3px solid #204383', paddingBottom: '1rem' }}>
              <h2 style={{ color: '#204383', margin: 0, display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '1.4rem', fontWeight: 900 }}>
                <MessageSquare size={24} /> New Service Page
              </h2>
              <button className="bfc-id-close" style={{ position: 'static', background: 'rgba(32,67,131,0.08)' }} onClick={() => setIsServiceModalOpen(false)}><X size={18} /></button>
            </div>
            
            <form onSubmit={handleSaveService} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="bfc-field">
                <label style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.1em', color: '#204383', opacity: 0.7, display: 'flex', alignItems: 'center', gap: '5px' }}>SERVICE TITLE</label>
                <input value={serviceFormTitle} onChange={e => {
                  setServiceFormTitle(e.target.value);
                  setServiceFormSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                }} placeholder="e.g. Tax and Legal" required style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid rgba(32,67,131,0.15)', background: '#f8f9fc', fontSize: '0.95rem', fontFamily: 'Inter, sans-serif', color: '#0f172a', outline: 'none', transition: 'all 0.2s' }} onFocus={e => { e.target.style.borderColor = '#99cdb3'; e.target.style.boxShadow = '0 0 0 4px rgba(153,205,179,0.15)'; e.target.style.background = '#fff'; }} onBlur={e => { e.target.style.borderColor = 'rgba(32,67,131,0.15)'; e.target.style.boxShadow = 'none'; e.target.style.background = '#f8f9fc'; }} />
              </div>
              
              <div className="bfc-field">
                <label style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.1em', color: '#204383', opacity: 0.7, display: 'flex', alignItems: 'center', gap: '5px' }}>SLUG</label>
                <input value={serviceFormSlug} onChange={e => setServiceFormSlug(e.target.value.toLowerCase())} placeholder="e.g. tax-legal" required style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid rgba(32,67,131,0.15)', background: '#f8f9fc', fontSize: '0.95rem', fontFamily: 'Inter, sans-serif', color: '#0f172a', outline: 'none', transition: 'all 0.2s' }} onFocus={e => { e.target.style.borderColor = '#99cdb3'; e.target.style.boxShadow = '0 0 0 4px rgba(153,205,179,0.15)'; e.target.style.background = '#fff'; }} onBlur={e => { e.target.style.borderColor = 'rgba(32,67,131,0.15)'; e.target.style.boxShadow = 'none'; e.target.style.background = '#f8f9fc'; }} />
              </div>
              
              <div className="bfc-field">
                <label style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.1em', color: '#204383', opacity: 0.7, display: 'flex', alignItems: 'center', gap: '5px' }}>SUBTITLE</label>
                <input value={serviceFormSubtitle} onChange={e => setServiceFormSubtitle(e.target.value)} placeholder="Optional Subtitle" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid rgba(32,67,131,0.15)', background: '#f8f9fc', fontSize: '0.95rem', fontFamily: 'Inter, sans-serif', color: '#0f172a', outline: 'none', transition: 'all 0.2s' }} onFocus={e => { e.target.style.borderColor = '#99cdb3'; e.target.style.boxShadow = '0 0 0 4px rgba(153,205,179,0.15)'; e.target.style.background = '#fff'; }} onBlur={e => { e.target.style.borderColor = 'rgba(32,67,131,0.15)'; e.target.style.boxShadow = 'none'; e.target.style.background = '#f8f9fc'; }} />
              </div>
              
              <div className="bfc-field">
                <label style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.1em', color: '#204383', opacity: 0.7, display: 'flex', alignItems: 'center', gap: '5px' }}>HERO DESCRIPTION</label>
                <textarea value={serviceFormDescription} onChange={e => setServiceFormDescription(e.target.value)} placeholder="Description at the top of the page..." rows={3} style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid rgba(32,67,131,0.15)', background: '#f8f9fc', fontSize: '0.95rem', fontFamily: 'Inter, sans-serif', color: '#0f172a', outline: 'none', resize: 'vertical', transition: 'all 0.2s' }} onFocus={e => { e.target.style.borderColor = '#99cdb3'; e.target.style.boxShadow = '0 0 0 4px rgba(153,205,179,0.15)'; e.target.style.background = '#fff'; }} onBlur={e => { e.target.style.borderColor = 'rgba(32,67,131,0.15)'; e.target.style.boxShadow = 'none'; e.target.style.background = '#f8f9fc'; }} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '0.25rem 0', padding: '0.75rem 1rem', background: 'rgba(153,205,179,0.08)', borderRadius: '12px', border: '1px solid rgba(153,205,179,0.2)' }}>
                <input 
                  type="checkbox" 
                  id="has-categories" 
                  checked={serviceFormHasCategories} 
                  onChange={e => setServiceFormHasCategories(e.target.checked)} 
                  style={{ width: 'auto', margin: 0, accentColor: '#204383', cursor: 'pointer' }}
                />
                <label htmlFor="has-categories" style={{ fontWeight: 800, fontSize: '0.85rem', color: '#204383', cursor: 'pointer', userSelect: 'none', letterSpacing: '0.02em' }}>ORGANIZED BY CATEGORIES</label>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem' }}>
                <button type="button" onClick={() => setIsServiceModalOpen(false)} style={{ flex: 1, padding: '0.875rem', borderRadius: '9999px', border: '1px solid rgba(32,67,131,0.2)', background: '#fff', color: '#64748b', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s', letterSpacing: '0.02em' }} onMouseEnter={e => { e.currentTarget.style.borderColor = '#204383'; e.currentTarget.style.color = '#204383'; }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(32,67,131,0.2)'; e.currentTarget.style.color = '#64748b'; }}>CANCEL</button>
                <button type="submit" style={{ flex: 1, padding: '0.875rem', borderRadius: '9999px', border: 'none', background: '#204383', color: '#fff', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.3s', letterSpacing: '0.02em' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(32,67,131,0.3)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                  SAVE SERVICE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}`;
    
    modified = modified.substring(0, modalPos) + newModalContent + modified.substring(endIdx);
    console.log('✅ Service Modal replaced successfully');
  } else {
    console.log('❌ Could not find end of modal section');
  }
} else {
  console.log('❌ Could not find modal comment');
}

// =====================================================
// 2. Replace Detail View dark theme header with BFC class
// =====================================================
const oldHeader = "style={{ background: 'rgba(255, 255, 255, 0.06)', backdropFilter: 'blur(10px)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '2rem', marginTop: '1.5rem', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)', color: '#fff' }}>";
const newHeader = 'className="bfc-service-editor">';
if (modified.includes(oldHeader)) {
  modified = modified.replace(oldHeader, newHeader);
  console.log('✅ Detail View header replaced');
} else {
  console.log('❌ Detail header not found - trying alternate approach');
  // Find by context: look for "Detail View: Inline form"
  const altIdx = modified.indexOf('Detail View: Inline form and content builder');
  if (altIdx >= 0) {
    const after = modified.substring(altIdx);
    const divStart = after.indexOf('<div');
    if (divStart >= 0) {
      const divContent = after.substring(divStart, divStart + 300);
      console.log('Found div:', divContent.substring(0, 100));
    }
  }
}

// =====================================================
// 3. Replace various inline styles with CSS classes
// =====================================================

// Back button
const oldBackBtn = "style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 255, 255, 0.08)', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', marginBottom: '0.5rem', transition: 'all 0.2s' }}>";
const newBackBtn = 'className="bfc-back-btn">';
if (modified.includes(oldBackBtn)) {
  modified = modified.replace(oldBackBtn, newBackBtn);
  console.log('✅ Back button replaced');
}

// Title
const oldTitle = "style={{ margin: 0, color: '#fff', fontSize: '1.65rem', fontWeight: 800 }}>{selectedService.title} Cards Dashboard";
const newTitle = 'className="bfc-editor-title">{selectedService.title} — Cards';
if (modified.includes(oldTitle)) {
  modified = modified.replace(oldTitle, newTitle);
  console.log('✅ Title replaced');
}

// Save button
const oldSaveBtn = "style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s' }}>";
const newSaveBtn = 'className="bfc-save-btn">';
if (modified.includes(oldSaveBtn)) {
  modified = modified.replace(oldSaveBtn, newSaveBtn);
  console.log('✅ Save button replaced');
}

// Metadata section
const oldMeta = "style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '1.5rem' }}>";
const newMeta = 'className="bfc-editor-meta">';
if (modified.includes(oldMeta)) {
  modified = modified.replace(oldMeta, newMeta);
  console.log('✅ Metadata section replaced');
}

// Organizer switcher
const oldSwitcher = "style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', background: 'rgba(255, 255, 255, 0.03)', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '1.5rem' }}>";
const newSwitcher = 'className="bfc-editor-toolbar">';
if (modified.includes(oldSwitcher)) {
  modified = modified.replace(oldSwitcher, newSwitcher);
  console.log('✅ Switcher toolbar replaced');
}

// Add Card button (flat mode - #3b82f6 background)
const oldAddFlat = "style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>";
const newAddFlat = 'className="bfc-add-card-btn">';
if (modified.includes(oldAddFlat)) {
  modified = modified.replace(oldAddFlat, newAddFlat);
  console.log('✅ Add Card (flat) button replaced');
}

// Category bar
const oldCatBar = "style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255, 255, 255, 0.03)', padding: '0.75rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '1.5rem' }}>";
const newCatBar = 'className="bfc-category-bar">';
if (modified.includes(oldCatBar)) {
  modified = modified.replace(oldCatBar, newCatBar);
  console.log('✅ Category bar replaced');
}

// Category tab active style
const oldTabActive = "style={{\n                                    display: 'flex',\n                                    alignItems: 'center',\n                                    gap: '0.35rem',\n                                    padding: '0.4rem 0.85rem',\n                                    borderRadius: '20px',\n                                    background: isActive ? '#3b82f6' : 'rgba(255, 255, 255, 0.05)',\n                                    color: '#fff',\n                                    border: isActive ? '1px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.1)',\n                                    cursor: 'pointer',\n                                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',\n                                    transition: 'all 0.2s'\n                                  }}>";
const newTabActive = 'className={isActive ? "bfc-cat-tab bfc-cat-tab--active" : "bfc-cat-tab"}>';
if (modified.includes(oldTabActive)) {
  modified = modified.replace(oldTabActive, newTabActive);
  console.log('✅ Category tab styles replaced');
}

// Add Category button
const oldAddCat = "style={{\n                                display: 'flex',\n                                alignItems: 'center',\n                                gap: '4px',\n                                padding: '0.4rem 0.85rem',\n                                borderRadius: '20px',\n                                background: 'transparent',\n                                border: '1px dashed rgba(255, 255, 255, 0.3)',\n                                color: 'rgba(255, 255, 255, 0.8)',\n                                cursor: 'pointer',\n                                fontSize: '0.8rem',\n                                fontWeight: 700\n                              }}>";
const newAddCat = 'className="bfc-add-cat-btn">';
if (modified.includes(oldAddCat)) {
  modified = modified.replace(oldAddCat, newAddCat);
  console.log('✅ Add Category button replaced');
}

// Add Card to Category button (#10b981)
const oldAddCatCard = "style={{\n                                background: '#10b981',\n                                color: '#fff',\n                                border: 'none',\n                                padding: '0.5rem 1rem',\n                                borderRadius: '6px',\n                                fontSize: '0.85rem',\n                                fontWeight: 700,\n                                cursor: 'pointer',\n                                display: 'flex',\n                                alignItems: 'center',\n                                gap: 4\n                              }}>";
const newAddCatCard = 'className="bfc-add-card-btn">';
if (modified.includes(oldAddCatCard)) {
  modified = modified.replace(oldAddCatCard, newAddCatCard);
  console.log('✅ Add Card to Category replaced');
}

// Category inline input
const oldCatInput = "style={{\n                                      background: 'transparent',\n                                      border: 'none',\n                                      color: '#fff',\n                                      fontWeight: 700,\n                                      fontSize: '0.85rem',\n                                      width: '110px',\n                                      outline: 'none',\n                                      padding: 0\n                                    }}>";
const newCatInput = 'className="bfc-cat-input">';
if (modified.includes(oldCatInput)) {
  modified = modified.replace(oldCatInput, newCatInput);
  console.log('✅ Category inline input replaced');
}

// Cat counter
const oldCounter = "style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)', fontWeight: 700 }}>";
const newCounter = 'className="bfc-cat-counter">';
if (modified.includes(oldCounter)) {
  modified = modified.replace(oldCounter, newCounter);
  console.log('✅ Category counter replaced');
}

// Cat name span
const oldCatName = "style={{ color: '#3b82f6' }}>{activeCat.name || '(unnamed)'}";
const newCatName = 'className="bfc-cat-name">{activeCat.name || "(unnamed)"}';
if (modified.includes(oldCatName)) {
  modified = modified.replace(oldCatName, newCatName);
  console.log('✅ Category name span replaced');
}

// Empty states - replace dark text with light theme
const oldEmpty1 = "style={{ textAlign: 'center', padding: '3rem', background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px dashed rgba(255, 255, 255, 0.2)', color: 'rgba(255, 255, 255, 0.5)' }}>";
const newEmpty1 = 'className="bfc-empty-state">';
// First occurrence: "No categories found"
const firstEmpty = modified.indexOf(oldEmpty1);
if (firstEmpty >= 0) {
  modified = modified.substring(0, firstEmpty) + newEmpty1 + modified.substring(firstEmpty + oldEmpty1.length);
  console.log('✅ Empty state 1 replaced');
}

// Second occurrence: "No cards in this category"
if (modified.indexOf(oldEmpty1) >= 0) {
  const secondEmpty = modified.indexOf(oldEmpty1);
  modified = modified.substring(0, secondEmpty) + newEmpty1 + modified.substring(secondEmpty + oldEmpty1.length);
  console.log('✅ Empty state 2 replaced');
}

// Third occurrence (flat mode): "No cards yet"
if (modified.indexOf(oldEmpty1) >= 0) {
  const thirdEmpty = modified.indexOf(oldEmpty1);
  modified = modified.substring(0, thirdEmpty) + newEmpty1 + modified.substring(thirdEmpty + oldEmpty1.length);
  console.log('✅ Empty state 3 replaced');
}


// =====================================================
// Write changes
// =====================================================
if (modified !== content) {
  fs.writeFileSync(filePath, modified, 'utf8');
  console.log('\n✅ File saved successfully!');
} else {
  console.log('\n⚠️ No changes were made - file content is identical');
}

console.log('\nDone!');
