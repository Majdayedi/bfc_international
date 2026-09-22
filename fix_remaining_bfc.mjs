import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.join(__dirname, 'pages', 'AdminDashboard.tsx');
let content = fs.readFileSync(filePath, 'utf8');
let count = 0;

function replace(oldStr, newStr, desc) {
  if (content.includes(oldStr)) {
    content = content.replace(oldStr, newStr);
    console.log('  OK: ' + desc);
    count++;
  } else {
    console.log('  SKIP: ' + desc + ' (not found)');
  }
}

console.log('Applying remaining BFC style replacements...\n');

// 1. Save button (#3b82f6 -> class)
replace(
  "style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s' }}",
  'className="bfc-save-btn"',
  'Save button class'
);

// 2. Add Card flat button (#3b82f6 -> class)
replace(
  "style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}",
  'className="bfc-add-card-btn"',
  'Add Card flat button class'
);

// 3. Back button (rgba(255,255,255,0.08) dark -> class)
replace(
  "style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 255, 255, 0.08)', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', marginBottom: '0.5rem', transition: 'all 0.2s' }}",
  'className="bfc-back-btn"',
  'Back button class'
);

// 4. Category tab inline style (dark theme version)
replace(
  "style={{\n                                    display: 'flex',\n                                    alignItems: 'center',\n                                    gap: '0.35rem',\n                                    padding: '0.4rem 0.85rem',\n                                    borderRadius: '20px',\n                                    background: isActive ? '#3b82f6' : 'rgba(255, 255, 255, 0.05)',\n                                    color: '#fff',\n                                    border: isActive ? '1px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.1)',\n                                    cursor: 'pointer',\n                                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',\n                                    transition: 'all 0.2s'\n                                  }}>",
  'className={isActive ? "bfc-cat-tab bfc-cat-tab--active" : "bfc-cat-tab"}>',
  'Category tab styles'
);

// 5. Card badge #1 (in category mode)
replace(
  "<span style={{ fontWeight: 800, color: '#3b82f6', fontSize: '0.85rem' }}>CARD {String(boxIdx + 1).padStart(2, '0')}</span>",
  '<span className="bfc-card-badge">CARD {String(boxIdx + 1).padStart(2, \'0\')}</span>',
  'Card badge in category mode'
);

// 6. Card badge #2 (in flat mode)
replace(
  '<span style={{ fontWeight: 800, color: \'#3b82f6\', fontSize: \'0.85rem\' }}>CARD {String(boxIdx + 1).padStart(2, \'0\')}</span>',
  '<span className="bfc-card-badge">CARD {String(boxIdx + 1).padStart(2, \'0\')}</span>',
  'Card badge in flat mode'
);

// 7. Bullet point #1 (in category mode)
replace(
  "<span style={{ color: '#3b82f6', fontWeight: 900 }}>&bull;</span>",
  '<span className="bfc-card-bullet">&bull;</span>',
  'Bullet point in category mode'
);

// 8. Bullet point #2 (in flat mode)
replace(
  '<span style={{ color: \'#3b82f6\', fontWeight: 900 }}>&bull;</span>',
  '<span className="bfc-card-bullet">&bull;</span>',
  'Bullet point in flat mode'
);

// 9. Card header border style (category mode)
replace(
  "<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.5rem' }}>",
  '<div className="bfc-service-card-header">',
  'Card header in category mode'
);

// 10. Card header border style (flat mode)
replace(
  "<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.5rem' }}>",
  '<div className="bfc-service-card-header">',
  'Card header in flat mode (dup)'
);

// 11. Card container (category mode) - entire style block
replace(
  "style={{ \n                                          background: 'rgba(255, 255, 255, 0.05)', \n                                          border: '1px solid rgba(255, 255, 255, 0.1)', \n                                          borderRadius: '16px', \n                                          padding: '1.25rem', \n                                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',\n                                          display: 'flex',\n                                          flexDirection: 'column',\n                                          justifyContent: 'space-between',\n                                          minHeight: '260px'\n                                        }}",
  'className="bfc-service-card"',
  'Card container category mode'
);

// 12. Card container (flat mode) - different indentation
replace(
  "style={{ \n                                      background: 'rgba(255, 255, 255, 0.05)', \n                                      border: '1px solid rgba(255, 255, 255, 0.1)', \n                                      borderRadius: '16px', \n                                      padding: '1.25rem', \n                                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',\n                                      display: 'flex',\n                                      flexDirection: 'column',\n                                      justifyContent: 'space-between',\n                                      minHeight: '260px'\n                                    }}",
  'className="bfc-service-card"',
  'Card container flat mode'
);

// 13. Remove button (dark theme version)
replace(
  "style={{ background: 'transparent', color: '#ef4444', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 2 }}",
  'className="bfc-remove-btn"',
  'Remove button class'
);

// 14. Card title dark label
replace(
  "<label style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.6)', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>CARD TITLE</label>",
  '<label className="bfc-card-field-label">CARD TITLE</label>',
  'Card title label'
);

// 15. Card title input dark style
replace(
  "style={{ width: '100%', padding: '0.5rem 0.75rem', fontSize: '0.9rem', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '6px', outline: 'none', background: 'rgba(0, 0, 0, 0.25)', color: '#fff' }}",
  'className="bfc-card-input"',
  'Card title input dark'
);

// 16. Bullet points dark label
replace(
  "<label style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.6)', fontWeight: 700, display: 'block', marginBottom: 6 }}>BULLET POINTS (Tirets)</label>",
  '<label className="bfc-card-field-label">BULLET POINTS (Tirets)</label>',
  'Bullet points label'
);

// 17. Bullet points container
replace(
  "<div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>",
  '<div className="bfc-items-list">',
  'Bullet points container'
);

// 18. Item row
replace(
  "<div key={itemIdx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>",
  '<div key={itemIdx} className="bfc-item-row">',
  'Item row'
);

// 19. Item input dark
replace(
  "style={{ flex: 1, padding: '0.4rem 0.65rem', fontSize: '0.85rem', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '6px', outline: 'none', background: 'rgba(0, 0, 0, 0.2)', color: '#fff' }}",
  'className="bfc-item-input"',
  'Item input dark'
);

// 20. Item input with different spacing
replace(
  "style={{ flex: 1, padding: '0.4rem 0.65rem', fontSize: '0.8rem', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '6px', outline: 'none', background: 'rgba(0, 0, 0, 0.2)', color: '#fff' }}",
  'className="bfc-item-input"',
  'Item input dark (alt)'
);

// 21. Add item button dark
replace(
  "style={{ background: 'transparent', border: '1px dashed rgba(255, 255, 255, 0.2)', color: '#99cdb3', padding: '0.3rem 0.75rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}",
  'className="bfc-add-item-btn"',
  'Add item button dark'
);

// 22. Image upload row dark
replace(
  "<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>",
  '<div className="bfc-img-upload-row">',
  'Image upload row'
);

// Save
if (count > 0) {
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('\n' + count + ' replacements applied and saved!');
} else {
  console.log('\nNo replacements were applied.');
}
