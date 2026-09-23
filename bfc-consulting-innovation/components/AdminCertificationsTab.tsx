import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Upload, X } from 'lucide-react';
import '../pages/BfcAcademy.css';
import { API_URL } from '../utils/constants';

const getUploadUrl = (url: string | null | undefined): string => {
  if (!url) return '';
  if (url.startsWith('/uploads/')) return `${API_URL}${url}`;
  return url;
};

export const AdminCertificationsTab: React.FC<{ token: string, setConfirmDialog: any, searchOuter?: string, triggerAdd?: number }> = ({ token, setConfirmDialog, searchOuter = '', triggerAdd = 0 }) => {
  const [courses, setCourses] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  // search is now managed by props or locally if needed

  // Form State
  const [title, setTitle] = useState('');
  const [institution, setInstitution] = useState('');
    const [year, setYear] = useState('');
  const [category, setCategory] = useState('International Courses');
  const [logo, setLogo] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isAccredited, setIsAccredited] = useState(false);
  const [programs, setPrograms] = useState('');
  const [accreditation, setAccreditation] = useState('');
  const [intake, setIntake] = useState('');
  const [description, setDescription] = useState('');
  const [certificationDescription, setCertificationDescription] = useState('');
  const [brochureUrl, setBrochureUrl] = useState('');
  const [brochureFile, setBrochureFile] = useState<File | null>(null);
  const [intro, setIntro] = useState('');
  const [participants, setParticipants] = useState('');
  const [duration, setDuration] = useState('');
  const [location, setLocation] = useState('');
  const [language, setLanguage] = useState('');

  const [learnPoints, setLearnPoints] = useState<string[]>([]);
  const [journeySteps, setJourneySteps] = useState<{title: string, detail: string}[]>([]);

  const fetchCourses = async () => {
    try {
      const res = await fetch(`${API_URL}/api/courses/show`);
      if (res.ok) setCourses(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (triggerAdd > 0) handleAdd();
  }, [triggerAdd]);

  const handleOpenEdit = (course: any) => {
    setEditingId(course.id || null);
    setTitle(course.title || '');
    setInstitution(course.institution || '');
    
    setYear(course.year || '');
    setCategory(course.category || 'International Courses');
    setLogo(course.logo || '');
    setLogoFile(null);
    setIsAccredited(course.isAccredited || false);
    setPrograms(course.programs || '');
    setAccreditation(course.accreditation || '');
    setIntake(course.intake || '');
    setDescription(course.description || '');
    setCertificationDescription(course.certificationDescription || '');
    setBrochureUrl(course.brochureUrl || '');
    setBrochureFile(null);
    setIntro(course.intro || '');
    setParticipants(course.participants || '');
    setDuration(course.duration || '');
    setLocation(course.location || '');
    setLanguage(course.language || '');
    setLearnPoints(course.learnPoints || []);
    setJourneySteps(course.journeySteps || []);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingId(null);
    setTitle(''); setInstitution(''); setYear(''); setCategory('International Courses');
    setLogo(''); setLogoFile(null); setIsAccredited(false); setPrograms('');
    setAccreditation(''); setIntake(''); setDescription(''); setCertificationDescription('');
    setBrochureUrl(''); setBrochureFile(null); setIntro(''); setParticipants(''); setDuration('');
    setLocation(''); setLanguage(''); setLearnPoints([]);
    setJourneySteps([]);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Course/Certification',
      message: 'Are you sure you want to delete this item? This action cannot be undone.',
      isAlert: false,
      onConfirm: async () => {
        setConfirmDialog((prev: any) => ({ ...prev, isOpen: false }));
        try {
          const res = await fetch(`${API_URL}/api/courses/delete/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) fetchCourses();
        } catch (err) {
          console.error(err);
        }
      }
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let finalLogo = logo;
      if (logoFile) {
        const fd = new FormData(); fd.append('file', logoFile);
        const res = await fetch(`${API_URL}/api/upload`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: fd });
        if (res.ok) { const data = await res.json(); finalLogo = data.url; }
      }

      let finalBrochureUrl = brochureUrl;
      if (brochureFile) {
        const fd = new FormData(); fd.append('file', brochureFile);
        const res = await fetch(`${API_URL}/api/upload`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: fd });
        if (res.ok) { const data = await res.json(); finalBrochureUrl = data.url; }
      }

      const payload = {
        title, institution, year, category,
        logo: finalLogo, isAccredited, programs, accreditation, intake,
        description, certificationDescription, brochureUrl: finalBrochureUrl,
        intro, participants, duration, location, language,
        learnPoints, journeySteps
      };

      const url = editingId ? `${API_URL}/api/courses/update/${editingId}` : `${API_URL}/api/courses/create`;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchCourses();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredCourses = courses.filter(c => c.title?.toLowerCase().includes(searchOuter.toLowerCase()) || c.category?.toLowerCase().includes(searchOuter.toLowerCase()));

  return (
    <div>


      <div className="formations-list-grid-inner" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
        {filteredCourses.map(c => (
          <div key={c.id} className="course-card rectangular" style={{ position: 'relative' }}>
            {c.isAccredited && (
              <span className="accredited-badge">ACCREDITED</span>
            )}
            <div className="course-card__top-row">
              <div className="course-card__image-container">
                <img src={getUploadUrl(c.logo)} alt={c.title} className="course-card__photo" />
              </div>
              <div className="course-card__title-block">
                <h5 className="course-card__title">{c.title}</h5>
                <div className="course-card__meta">{c.institution}</div>
              </div>
            </div>
            <div className="course-card__desc">
              {c.description}
            </div>
            <div className="info-strip" role="list">
              <div className="info-item" role="listitem">
                <span className="label">Programs</span>
                <span className="value">{c.programs}</span>
              </div>
              <div className="info-item" role="listitem">
                <span className="label">Duration</span>
                <span className="value">{c.duration} days</span>
              </div>
            </div>
            
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', borderTop: '1px solid #f3f4f6', paddingTop: '1rem' }}>
              <button onClick={() => handleOpenEdit(c)} className="btn-icon" style={{ background: 'rgba(32, 67, 131, 0.1)', color: '#204383', border: 'none', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Edit2 size={14} /></button>
              <button onClick={() => handleDelete(c.id)} className="btn-icon delete" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="bfc-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="bfc-id-modal" onClick={e => e.stopPropagation()} style={{ width: '900px', maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto', background: '#fff', padding: '2rem', borderRadius: '24px' }}>
            <div className="bfc-id-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>{editingId ? 'Edit Course/Certification' : 'Add Course/Certification'}</h3>
              <button type="button" className="bfc-id-close" style={{ position: 'relative', top: 0, right: 0 }} onClick={() => setIsModalOpen(false)}><X size={18}/></button>
            </div>
            <form onSubmit={handleSave} className="bfc-id-fields" style={{ padding: '1.5rem' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="bfc-field">
                  <label>Title *</label>
                  <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="bfc-field">
                  <label>Category *</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="International Courses">International Courses</option>
                    <option value="Our Courses">Our Courses</option>
                  </select>
                </div>
                <div className="bfc-field">
                  <label>Institution</label>
                  <input type="text" value={institution} onChange={(e) => setInstitution(e.target.value)} />
                </div>
                <div className="bfc-field">
                  <label>Location</label>
                  <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
                </div>

                <div className="bfc-field">
                  <label>Year / Intake</label>
                  <input type="text" value={intake} onChange={(e) => setIntake(e.target.value)} placeholder="e.g. 2026" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                 <div className="bfc-field">
                  <label>Programs Format</label>
                  <input type="text" value={programs} onChange={(e) => setPrograms(e.target.value)} placeholder="e.g. 3-Day Certification + Final Exam" />
                </div>
                {isAccredited && (
                  <div className="bfc-field">
                    <label>Accreditation text</label>
                    <input type="text" value={accreditation} onChange={(e) => setAccreditation(e.target.value)} placeholder="e.g. Institute of Risk Management (IRM)" />
                  </div>
                )}
              </div>

              <div style={{ marginTop: '1rem' }} className="bfc-field">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={isAccredited} onChange={(e) => setIsAccredited(e.target.checked)} />
                  Is Accredited? (Displays Accredited Badge)
                </label>
              </div>

              <div className="bfc-field" style={{ marginTop: '1rem' }}>
                <label>Short Description (Card)</label>
                <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} style={{ background: '#f5f7fa', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '10px', padding: '0.6rem 0.85rem', fontFamily: 'Inter, sans-serif', width: '100%' }} />
              </div>
              <div className="bfc-field">
                <label>Intro (Full Page)</label>
                <textarea rows={4} value={intro} onChange={(e) => setIntro(e.target.value)} style={{ background: '#f5f7fa', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '10px', padding: '0.6rem 0.85rem', fontFamily: 'Inter, sans-serif', width: '100%' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                <div className="bfc-field">
                  <label>Duration (Days)</label>
                  <input type="number" min="1" value={duration} onChange={(e) => {
                    const days = parseInt(e.target.value) || 0;
                    setDuration(days.toString());
                    const newSteps = [];
                    for(let i=0; i<days; i++) {
                      newSteps.push({
                        title: `Day ${i + 1}`,
                        detail: journeySteps[i] ? journeySteps[i].detail : ''
                      });
                    }
                    setJourneySteps(newSteps);
                  }} />
                </div>
                <div className="bfc-field">
                  <label>Language</label>
                  <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                    <option value="">Select Language</option>
                    <option value="English">English</option>
                    <option value="French">French</option>
                    <option value="Arabic">Arabic</option>
                    <option value="Bilingual (Eng/Fr)">Bilingual (Eng/Fr)</option>
                  </select>
                </div>
                <div className="bfc-field">
                  <label>Participants / Target Audience</label>
                  <input type="text" value={participants} onChange={(e) => setParticipants(e.target.value)} />
                </div>
              </div>

              <div className="bfc-field" style={{ marginTop: '1rem' }}>
                <label>Certification Description (Extra info on details page)</label>
                <textarea rows={2} value={certificationDescription} onChange={(e) => setCertificationDescription(e.target.value)} style={{ background: '#f5f7fa', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '10px', padding: '0.6rem 0.85rem', fontFamily: 'Inter, sans-serif', width: '100%' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                <div className="bfc-field">
                  <label>Image Upload</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <label className="bfc-cv-file-label" style={{ flex: 1, justifyContent: 'center' }}>
                      <Upload size={14} /> {logoFile ? logoFile.name : logo ? logo.split('/').pop() : 'Choose Image'}
                      <input type="file" style={{ display: 'none' }} onChange={(e) => setLogoFile(e.target.files?.[0] || null)} accept="image/*" />
                    </label>
                    {(logoFile || logo) && (
                      <button type="button" className="bfc-cv-clear-btn" onClick={() => { setLogoFile(null); setLogo(''); }}><X size={14}/></button>
                    )}
                  </div>
                </div>
                <div className="bfc-field">
                  <label>Brochure PDF Upload</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <label className="bfc-cv-file-label" style={{ flex: 1, justifyContent: 'center' }}>
                      <Upload size={14} /> {brochureFile ? brochureFile.name : brochureUrl ? brochureUrl.split('/').pop() : 'Choose PDF'}
                      <input type="file" style={{ display: 'none' }} onChange={(e) => setBrochureFile(e.target.files?.[0] || null)} accept="application/pdf" />
                    </label>
                    {(brochureFile || brochureUrl) && (
                      <button type="button" className="bfc-cv-clear-btn" onClick={() => { setBrochureFile(null); setBrochureUrl(''); }}><X size={14}/></button>
                    )}
                  </div>
                </div>
              </div>

              {/* Dynamic Arrays */}
              <div style={{ marginTop: '2rem', borderTop: '1px solid #e0e7ef', paddingTop: '1.5rem' }}>
                <h4>Learn Points</h4>
                {learnPoints.map((pt, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <textarea value={pt} onChange={(e) => {
                      const newPts = [...learnPoints]; newPts[i] = e.target.value; setLearnPoints(newPts);
                    }}  style={{ flex: 1, background: '#f5f7fa', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '10px', padding: '0.6rem 0.85rem' }} rows={2} />
                    <button type="button" onClick={() => setLearnPoints(learnPoints.filter((_, idx) => idx !== i))} style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', padding: '0 10px' }}><Trash2 size={14}/></button>
                  </div>
                ))}
                <button type="button" onClick={() => setLearnPoints([...learnPoints, ''])} style={{ background: '#f8fafb', border: '1px solid #e0e7ef', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>+ Add Learn Point</button>
              </div>

              <div style={{ marginTop: '2rem', borderTop: '1px solid #e0e7ef', paddingTop: '1.5rem', marginBottom: '2rem' }}>
                <h4>Journey Steps (Auto-generated from Duration)</h4>
                {journeySteps.map((st, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', background: '#f8fafb', padding: '1rem', borderRadius: '8px', border: '1px solid #e0e7ef' }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <input type="text" placeholder="Title (e.g. Journey 01 - ...)" value={st.title} onChange={(e) => {
                        const newSteps = [...journeySteps]; newSteps[i].title = e.target.value; setJourneySteps(newSteps);
                      }} />
                      <textarea placeholder="Detail" value={st.detail} onChange={(e) => {
                        const newSteps = [...journeySteps]; newSteps[i].detail = e.target.value; setJourneySteps(newSteps);
                      }} rows={2} />
                    </div>
                    <button type="button" onClick={() => setJourneySteps(journeySteps.filter((_, idx) => idx !== i))} style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', padding: '0 10px' }}><Trash2 size={14}/></button>
                  </div>
                ))}

              </div>

              <div className="bfc-modal-actions" style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="bfc-btn-outline">Cancel</button>
                <button type="submit" className="bfc-btn-mint">Save Course</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
