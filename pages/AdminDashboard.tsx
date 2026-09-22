import React, { useState, useEffect } from 'react';
import { 
  FileText, Award, History, Users, MessageSquare, 
  UserCheck, Briefcase, LogOut, Plus, 
  Trash2, Edit2, Mail, Phone, Globe, X, 
  Upload, ChevronRight, LayoutDashboard,
  MapPin, Fingerprint, Eye, Search, Filter, ChevronDown,
  GripVertical, BarChart
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { API_URL } from '../utils/constants';
import { getClientLogo, PROJECTS } from './OurProjectsPage';
import { AdminCertificationsTab } from '../components/AdminCertificationsTab';
import './AdminDashboard.css';

interface ExtraFlag { name: string; url: string; }

interface HistoryEvent {
  id?: number;
  eventYear: number;
  title: string;
  description: string;
  backgroundColor?: string;
  countryFlag?: string;
  logoUrl?: string;
  photoUrl?: string;
}

interface TeamMember {
  id?: number;
  name: string;
  role: string;
  roleType?: string;
  img: string;
  email?: string;
  phone?: string;
  cvUrl?: string;
  countryName?: string;
  countryFlagUrl?: string;
  extraFlags?: ExtraFlag[];
  showPrimaryFlag?: boolean;
  displayOrder?: number;
}

export interface Representative {
  id?: number;
  slug: string;
  title: string;
  subtitle: string;
  creationYear?: number;
  description: string;
  location: string;
  manager?: TeamMember | null;
  globeMarkerTop?: string;
  globeMarkerLeft: string;
  globeViewRotateY: string;
  globeViewMapX: string;
  flagIconUrl: string;
  imageUrl: string;
  projectCountries: string[];
  fallbackCountries: string[];
}

type Tab = 'overview' | 'certif' | 'articles' | 'history' | 'team members' | 'Services' | 'Representatives' | 'projects';

type RoleType = 'CEO' | 'MANAGING_PARTNER' | 'PARTNER' | 'COUNTRY_MANAGER' | 'ASSOCIATE' | 'CONSULTANT' | 'AUDITING_ACCOUNTANT';

const ROLES: { value: RoleType; label: string; isCountryRole: boolean }[] = [
  { value: 'CEO', label: 'CEO & Country Manager', isCountryRole: true },
  { value: 'MANAGING_PARTNER', label: 'Managing Partner & CEO', isCountryRole: false },
  { value: 'PARTNER', label: 'Partner', isCountryRole: false },
  { value: 'COUNTRY_MANAGER', label: 'Country Manager', isCountryRole: true },
  { value: 'ASSOCIATE', label: 'Associate & Country Manager', isCountryRole: true },
  { value: 'CONSULTANT', label: 'Consultant', isCountryRole: false },
  { value: 'AUDITING_ACCOUNTANT', label: 'Auditing Accountant', isCountryRole: false },
];

const ROLE_LABELS: Record<RoleType, string> = {
  CEO: 'CEO & Country Manager',
  MANAGING_PARTNER: 'Managing Partner & CEO',
  PARTNER: 'Partner',
  COUNTRY_MANAGER: 'Country Manager',
  ASSOCIATE: 'Associate & Country Manager',
  CONSULTANT: 'Consultant',
  AUDITING_ACCOUNTANT: 'Auditing Accountant',
};

const isCountryManagerRole = (roleType: RoleType | null | undefined): boolean => {
  if (!roleType) return false;
  const role = ROLES.find(r => r.value === roleType);
  return role?.isCountryRole ?? false;
};

const buildRoleDisplay = (roleType: RoleType | null | undefined, countryName?: string): string => {
  if (!roleType) return '';
  const label = ROLE_LABELS[roleType] || '';
  if (isCountryManagerRole(roleType) && countryName) {
    return `${label} ${countryName}`;
  }
  return label;
};

// Resolve backend upload URLs (relative paths like /uploads/...) to full URLs
const getUploadUrl = (url: string | null | undefined): string => {
  if (!url) return '';
  if (url.startsWith('/uploads/')) {
    return `${API_URL}${url}`;
  }
  return url;
};

const AVAILABLE_COUNTRIES = [
  { code: 'TN', name: 'Tunisia', flag: 'https://flagcdn.com/w40/tn.png' },
  { code: 'DZ', name: 'Algeria', flag: 'https://flagcdn.com/w40/dz.png' },
  { code: 'LY', name: 'Libya', flag: 'https://flagcdn.com/w40/ly.png' },
  { code: 'MA', name: 'Morocco', flag: 'https://flagcdn.com/w40/ma.png' },
  { code: 'EG', name: 'Egypt', flag: 'https://flagcdn.com/w40/eg.png' },
  { code: 'FR', name: 'France', flag: 'https://flagcdn.com/w40/fr.png' },
  { code: 'IT', name: 'Italy', flag: 'https://flagcdn.com/w40/it.png' },
  { code: 'SA', name: 'Saudi Arabia', flag: 'https://flagcdn.com/w40/sa.png' },
  { code: 'AE', name: 'UAE', flag: 'https://flagcdn.com/w40/ae.png' },
  { code: 'QA', name: 'Qatar', flag: 'https://flagcdn.com/w40/qa.png' },
  { code: 'CG', name: 'Republic of the Congo', flag: 'https://flagcdn.com/w40/cg.png' },
  { code: 'GN', name: 'Guinea', flag: 'https://flagcdn.com/w40/gn.png' },
  { code: 'SN', name: 'Senegal', flag: 'https://flagcdn.com/w40/sn.png' },
  { code: 'MR', name: 'Mauritania', flag: 'https://flagcdn.com/w40/mr.png' },
  { code: 'ML', name: 'Mali', flag: 'https://flagcdn.com/w40/ml.png' },
];

export const AdminDashboard: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlTab = searchParams.get('tab') as Tab;
  
  const [activeTab, setActiveTabState] = useState<Tab>(urlTab || 'overview');
  const [isStatsExpanded, setIsStatsExpanded] = useState(false);
  const [statsTab, setStatsTab] = useState<'enrollment' | 'contact'>('enrollment');
  
  useEffect(() => {
    if (urlTab && urlTab !== activeTab) {
      setActiveTabState(urlTab);
    }
  }, [urlTab]);

  const setActiveTab = (tab: Tab) => {
    setActiveTabState(tab);
    setSearchParams({ tab });
    setSelectedService(null);
  };

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [historyEvents, setHistoryEvents] = useState<HistoryEvent[]>([]);
  const [representatives, setRepresentatives] = useState<Representative[]>([]);
  const [selectedHistoryYear, setSelectedHistoryYear] = useState<number | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formName, setFormName] = useState('');
  const [formRoleType, setFormRoleType] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formImg, setFormImg] = useState('');
  const [formImgFile, setFormImgFile] = useState<File | null>(null);
  const [formImgUploading, setFormImgUploading] = useState(false);
  const [formImgUploadError, setFormImgUploadError] = useState('');
  const [formCvUrl, setFormCvUrl] = useState<string | null>(null);
  const [formCvFile, setFormCvFile] = useState<File | null>(null);
  const [formCvUploading, setFormCvUploading] = useState(false);
  const [formCvUploadError, setFormCvUploadError] = useState('');
  const [formCountryName, setFormCountryName] = useState('Tunisia');
  const [formExtraFlags, setFormExtraFlags] = useState<string[]>([]);
  const [formShowPrimaryFlag, setFormShowPrimaryFlag] = useState(true);
  const [isOrderChanged, setIsOrderChanged] = useState(false);

  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [historyFormTitle, setHistoryFormTitle] = useState('');
  const [historyFormYear, setHistoryFormYear] = useState('');
  const [historyFormDesc, setHistoryFormDesc] = useState('');
  const [historyFormBranchLink, setHistoryFormBranchLink] = useState('');
  const [historyFormManagerEmail, setHistoryFormManagerEmail] = useState('');
  const [historyFormBgColor, setHistoryFormBgColor] = useState('#f8fafc');
  const [historyFormFlagUrl, setHistoryFormFlagUrl] = useState('');
  const [historyFormFlagFile, setHistoryFormFlagFile] = useState<File | null>(null);
  const [editingHistoryId, setEditingHistoryId] = useState<number | null>(null);
  
  const [historyFormLogoUrl, setHistoryFormLogoUrl] = useState('');
  const [historyFormLogoFile, setHistoryFormLogoFile] = useState<File | null>(null);
  
  const [historyFormPhotoUrl, setHistoryFormPhotoUrl] = useState('');
  const [historyFormPhotoFile, setHistoryFormPhotoFile] = useState<File | null>(null);

  // Representative state
  const [isRepModalOpen, setIsRepModalOpen] = useState(false);
  const [editingRepId, setEditingRepId] = useState<number | null>(null);
  const [repFormStep, setRepFormStep] = useState<1 | 2>(1);
  const [repForm, setRepForm] = useState<Partial<Representative>>({
    title: '', slug: '', subtitle: '', description: '', location: '',
    manager: null,
    globeMarkerTop: '', globeMarkerLeft: '', globeViewRotateY: '', globeViewMapX: '',
    flagIconUrl: '', imageUrl: '', projectCountries: [], fallbackCountries: []
  });
  const [repFormLogoFile, setRepFormLogoFile] = useState<File | null>(null);
  const [repFormPhotoFile, setRepFormPhotoFile] = useState<File | null>(null);

  // Services state
  const [services, setServices] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null);
  const [serviceFormTitle, setServiceFormTitle] = useState('');
  const [serviceFormSlug, setServiceFormSlug] = useState('');
  const [serviceFormSubtitle, setServiceFormSubtitle] = useState('');
  const [serviceFormDescription, setServiceFormDescription] = useState('');
  const [serviceFormLayoutType, setServiceFormLayoutType] = useState('CLEAN_CARD_GRID');
  const [serviceFormHasCategories, setServiceFormHasCategories] = useState(false);
  const [serviceFormCategories, setServiceFormCategories] = useState<any[]>([]);
  const [serviceFormBoxes, setServiceFormBoxes] = useState<any[]>([]);
  const [activeCategoryIdx, setActiveCategoryIdx] = useState<number>(0);
  const [draggedCardIndex, setDraggedCardIndex] = useState<number | null>(null);
  const [draggedServiceIndex, setDraggedServiceIndex] = useState<number | null>(null);
  const [draggedOverServiceIndex, setDraggedOverServiceIndex] = useState<number | null>(null);
  const [isServiceOrderChanged, setIsServiceOrderChanged] = useState(false);

  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [enrollmentsLoading, setEnrollmentsLoading] = useState(false);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [editingEnrollId, setEditingEnrollId] = useState<number | null>(null);
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [enrollForm, setEnrollForm] = useState({
    fullName: '', email: '', country: '', phone: '', jobTitle: '', organization: '', courses: [] as string[], message: ''
  });
  const [enrollPage, setEnrollPage] = useState(1);
  const enrollPageSize = 10;

  // Contact messages state
  const [contactMessages, setContactMessages] = useState<any[]>([]);
  const [contactMessagesLoading, setContactMessagesLoading] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [editingContactId, setEditingContactId] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({
    fullName: '', email: '', company: '', phone: '', phonePrefix: '+216', service: '', message: ''
  });

  const [searchTeam, setSearchTeam] = useState('');
  const [searchArticle, setSearchArticle] = useState('');
  const [searchProject, setSearchProject] = useState('');
  const [searchCertif, setSearchCertif] = useState('');
  const [triggerAddCertif, setTriggerAddCertif] = useState(0);

  const [filterTeamRole, setFilterTeamRole] = useState('All');
  const [filterArticleCategory, setFilterArticleCategory] = useState('All');
  const [filterProjectCategory, setFilterProjectCategory] = useState('All');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; title: string; message: string; isAlert: boolean; onConfirm: () => void }>({ isOpen: false, title: '', message: '', isAlert: false, onConfirm: () => {} });

  const token = localStorage.getItem('bfc_token');

  const fetchMembers = async () => {
    try {
      const res = await fetch(`${API_URL}/api/team-members`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setTeamMembers(await res.json());
      } else if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('bfc_token');
        navigate('/login', { replace: true });
      }
    } catch (err) {
      console.error('Failed to fetch team members:', err);
    }
  };

  const fetchHistoryEvents = async () => {
    try {
      const res = await fetch(`${API_URL}/api/history-events`);
      if (res.ok) {
        const data = await res.json();
        setHistoryEvents(data);
      }
    } catch (err) {
      console.error('Failed to fetch history events:', err);
    }
  };

  const fetchRepresentatives = async () => {
    try {
      const res = await fetch(`${API_URL}/api/representatives`);
      if (res.ok) {
        const data = await res.json();
        setRepresentatives(data);
      }
    } catch (err) {
      console.error('Failed to fetch representatives:', err);
    }
  };

  const fetchArticles = async () => {
    try {
      const res = await fetch(`${API_URL}/api/articles`);
      if (res.ok) setArticles(await res.json());
    } catch (err) {
      console.error('Failed to fetch articles:', err);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API_URL}/api/projects`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setProjects(await res.json());
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    }
  };

  const handleDeleteArticle = (id: number) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Article',
      message: 'Are you sure you want to delete this article? This action cannot be undone.',
      isAlert: false,
      onConfirm: async () => {
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        try {
          const res = await fetch(`${API_URL}/api/articles/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) await fetchArticles();
        } catch (err) {
          console.error('Failed to delete article:', err);
        }
      }
    });
  };

  const handleDeleteProject = (id: number) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Project',
      message: 'Are you sure you want to delete this project? This action cannot be undone.',
      isAlert: false,
      onConfirm: async () => {
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        try {
          const res = await fetch(`${API_URL}/api/projects/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) await fetchProjects();
        } catch (err) {
          console.error('Failed to delete project:', err);
        }
      }
    });
  };

  const handleTogglePublishArticle = async (art: any, isDraft: boolean) => {
    try {
      const c = JSON.parse(art.contentJson || '{}');
      c.isPublished = isDraft; // If it was a draft, make it published (true), if it was published, make it draft (false)
      const updatedContentJson = JSON.stringify(c);

      const res = await fetch(`${API_URL}/api/articles/${art.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...art, contentJson: updatedContentJson })
      });
      if (res.ok) await fetchArticles();
    } catch (err) {
      console.error('Failed to toggle publish status:', err);
    }
  };

  const handleToggleTopArticle = async (art: any, isTopArticle: boolean) => {
    if (!token) return;
    if (!isTopArticle) {
      let topCount = 0;
      articles.forEach(a => {
        if (a.topArticle) topCount++;
      });
      if (topCount >= 5) {
        setConfirmDialog({
          isOpen: true,
          title: 'Maximum Reached',
          message: 'You can only select up to 5 top articles.',
          isAlert: true,
          onConfirm: () => setConfirmDialog(prev => ({ ...prev, isOpen: false }))
        });
        return;
      }
    }

    try {
      const res = await fetch(`${API_URL}/api/articles/${art.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...art, topArticle: !isTopArticle })
      });
      if (res.ok) await fetchArticles();
    } catch (err) {
      console.error('Failed to toggle top article status:', err);
    }
  };

  const handleTogglePublishProject = async (proj: any, isDraft: boolean) => {
    try {
      const c = JSON.parse(proj.contentJson || '{}');
      c.isPublished = isDraft;
      const updatedContentJson = JSON.stringify(c);

      const res = await fetch(`${API_URL}/api/projects/${proj.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...proj, contentJson: updatedContentJson })
      });
      if (res.ok) await fetchProjects();
    } catch (err) {
      console.error('Failed to toggle publish status:', err);
    }
  };

 

  const handleDragStart = (e: React.DragEvent, index: number) => {
    if ((e.target as HTMLElement).closest('.card-actions') || (e.target as HTMLElement).closest('button')) {
      e.preventDefault();
      return;
    }
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newMembers = [...teamMembers];
    const draggedItem = newMembers[draggedIndex];
    newMembers.splice(draggedIndex, 1);
    newMembers.splice(index, 0, draggedItem);
    setTeamMembers(newMembers);
    setDraggedIndex(index);
    setIsOrderChanged(true);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleSaveOrder = async () => {
    const ids = teamMembers.map(m => m.id).filter((id): id is number => id !== undefined);
    try {
      const res = await fetch(`${API_URL}/api/team-members/reorder`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(ids)
      });
      if (res.ok) {
        const updated = await res.json();
        setTeamMembers(updated);
        setIsOrderChanged(false);
      }
    } catch (err) {
      console.error('Failed to update order:', err);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true });
    } else {
      fetchMembers();
      fetchArticles();
      fetchProjects();
      fetchHistoryEvents();
      fetchRepresentatives();
      fetchServices();
      fetchContactMessages();
    }
  }, [token, navigate]);

  if (!token) return null;

  const handleSaveHistory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!historyFormTitle || !historyFormYear || !historyFormDesc) return;
    try {
      let uploadedLogoUrl = historyFormLogoUrl;
      if (historyFormLogoFile) {
        const fd = new FormData();
        fd.append('file', historyFormLogoFile);
        const res = await fetch(`${API_URL}/api/upload`, {
          method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: fd
        });
        if (res.ok) {
          const data = await res.json();
          uploadedLogoUrl = data.url;
        }
      }

      let uploadedPhotoUrl = historyFormPhotoUrl;
      if (historyFormPhotoFile) {
        const fd = new FormData();
        fd.append('file', historyFormPhotoFile);
        const res = await fetch(`${API_URL}/api/upload`, {
          method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: fd
        });
        if (res.ok) {
          const data = await res.json();
          uploadedPhotoUrl = data.url;
        }
      }

      let flagUrl = historyFormFlagUrl;
      if (historyFormFlagFile) {
        const fd = new FormData();
        fd.append('file', historyFormFlagFile);
        const res = await fetch(`${API_URL}/api/upload`, {
          method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: fd
        });
        if (res.ok) {
          const data = await res.json();
          flagUrl = data.url;
        }
      }

      const isEdit = editingHistoryId !== null;
      const url = isEdit ? `${API_URL}/api/history-events/${editingHistoryId}` : `${API_URL}/api/history-events`;
      
      let finalDesc = historyFormDesc;
      if (historyFormBranchLink || historyFormManagerEmail) {
        const selectedManager = teamMembers.find(m => m.email === historyFormManagerEmail);
        const mName = selectedManager ? selectedManager.name : '';
        finalDesc = `${finalDesc}::link=${historyFormBranchLink}::email=${historyFormManagerEmail}::managerName=${mName}`;
      }

      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          eventYear: parseInt(historyFormYear),
          title: historyFormTitle,
          description: finalDesc,
          backgroundColor: historyFormBgColor,
          countryFlag: flagUrl,
          logoUrl: uploadedLogoUrl,
          photoUrl: uploadedPhotoUrl
        })
      });
      if (res.ok) {
        setIsHistoryModalOpen(false);
        setHistoryFormTitle('');
        setHistoryFormYear('');
        setHistoryFormDesc('');
        setHistoryFormBranchLink('');
        setHistoryFormManagerEmail('');
        setHistoryFormBgColor('#f8fafc');
        setHistoryFormFlagUrl('');
        setHistoryFormFlagFile(null);
        setHistoryFormLogoUrl('');
        setHistoryFormLogoFile(null);
        setHistoryFormPhotoUrl('');
        setHistoryFormPhotoFile(null);
        setEditingHistoryId(null);
        fetchHistoryEvents();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenHistoryEdit = (event: HistoryEvent) => {
    let desc = event.description || '';
    let path = '';
    let email = '';
    let managerName = '';
    if (desc && desc.includes('::link=')) {
      const parts = desc.split('::link=');
      desc = parts[0];
      let remainder = parts[1] || '';
      if (remainder.includes('::email=')) {
        const subParts = remainder.split('::email=');
        path = subParts[0];
        remainder = subParts[1] || '';
        
        if (remainder.includes('::managerName=')) {
          const mParts = remainder.split('::managerName=');
          email = mParts[0];
          managerName = mParts[1];
        } else {
          email = remainder;
        }
      } else {
        path = remainder;
      }
    }

    setEditingHistoryId(event.id || null);
    setHistoryFormTitle(event.title);
    setHistoryFormYear(event.eventYear.toString());
    setHistoryFormDesc(desc);
    setHistoryFormBranchLink(path);
    setHistoryFormManagerEmail(email);
    setHistoryFormBgColor(event.backgroundColor || '#f8fafc');
    setHistoryFormFlagUrl(event.countryFlag || '');
    setHistoryFormFlagFile(null);
    setHistoryFormLogoUrl(event.logoUrl || '');
    setHistoryFormLogoFile(null);
    setHistoryFormPhotoUrl(event.photoUrl || '');
    setHistoryFormPhotoFile(null);
    setIsHistoryModalOpen(true);
  };

  const handleDeleteHistory = (id: number | undefined) => {
    if (!id) return;
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Event',
      message: 'Are you sure you want to delete this event?',
      isAlert: false,
      onConfirm: async () => {
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        try {
          const res = await fetch(`${API_URL}/api/history-events/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) fetchHistoryEvents();
        } catch (err) { console.error(err); }
      }
    });
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    const countryObj = AVAILABLE_COUNTRIES.find(c => c.name === formCountryName) || AVAILABLE_COUNTRIES[2];
    const extraFlagsData = formExtraFlags.map(cName => ({
      name: cName,
      url: AVAILABLE_COUNTRIES.find(c => c.name === cName)?.flag || ''
    }));

    const selectedRoleType = formRoleType as RoleType | null;
    const finalRole = buildRoleDisplay(formRoleType as RoleType | null | undefined, formCountryName || undefined);
    const payload = {
      name: formName, role: finalRole || formRole || formRoleType || '',
      roleType: selectedRoleType || null,
      img: formImg || 'https://via.placeholder.com/150',
      email: formEmail, phone: formPhone, cvUrl: formCvUrl || '',
      countryName: countryObj.name, countryFlagUrl: countryObj.flag,
      extraFlags: extraFlagsData,
      showPrimaryFlag: formShowPrimaryFlag
    };

    try {
      const isEdit = editingId !== null;
      const res = await fetch(
        isEdit ? `${API_URL}/api/team-members/${editingId}` : `${API_URL}/api/team-members`,
        {
          method: isEdit ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        }
      );
      if (res.ok) {
        await fetchMembers();
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error('Failed to save member:', err);
    }
  };

  const handleOpenEdit = (index: number) => {
    const member = teamMembers[index];
    setEditingId(member.id ?? null);
    setFormName(member.name);
    setFormRole(member.role);
    setFormRoleType(member.roleType || '');
    setFormEmail(member.email || '');
    setFormPhone(member.phone || '');
    setFormImg(member.img || '');
    setFormImgFile(null);
    setFormImgUploadError('');
    setFormCvUrl(member.cvUrl || null);
    setFormCvFile(null);
    setFormCvUploadError('');
    setFormCountryName(member.countryName || 'Tunisia');
    setFormExtraFlags(member.extraFlags?.map(f => f.name) || []);
    setFormShowPrimaryFlag(member.showPrimaryFlag !== false);
    setIsModalOpen(true);
  };

  const handleDeleteMember = (index: number) => {
    const member = teamMembers[index];
    if (!member.id) return;
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Team Member',
      message: `Are you sure you want to delete ${member.name}? This action cannot be undone.`,
      isAlert: false,
      onConfirm: async () => {
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        try {
          const res = await fetch(`${API_URL}/api/team-members/${member.id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) await fetchMembers();
        } catch (err) {
          console.error('Failed to delete member:', err);
        }
      }
    });
  };

  const handleSaveRepresentative = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repForm.slug || !repForm.title) return;
    try {
      let flagUrl = repForm.flagIconUrl;
      if (repFormLogoFile) {
        const fd = new FormData();
        fd.append('file', repFormLogoFile);
        const res = await fetch(`${API_URL}/api/upload`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: fd });
        if (res.ok) { const data = await res.json(); flagUrl = data.url; }
      }
      let photoUrl = repForm.imageUrl;
      if (repFormPhotoFile) {
        const fd = new FormData();
        fd.append('file', repFormPhotoFile);
        const res = await fetch(`${API_URL}/api/upload`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: fd });
        if (res.ok) { const data = await res.json(); photoUrl = data.url; }
      }
      const payload = { ...repForm, flagIconUrl: flagUrl, imageUrl: photoUrl };
      const isEdit = editingRepId !== null;
      const url = isEdit ? `${API_URL}/api/representatives/${editingRepId}` : `${API_URL}/api/representatives`;
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        // Automatically create a history event if this is a new branch and a history paragraph was provided
        if (!isEdit && (repForm as any).historyParagraph) {
          const encodedDesc = `${(repForm as any).historyParagraph}::link=/representatives/${repForm.slug}::email=${repForm.manager?.email || ''}::managerName=${repForm.manager?.name || ''}`;
          const historyPayload = {
            eventYear: repForm.creationYear || new Date().getFullYear(),
            title: `Creation of BFC ${repForm.title.replace('BFC ', '')}`,
            description: encodedDesc,
            countryFlag: flagUrl,
            logoUrl: photoUrl || flagUrl,
            photoUrl: photoUrl || flagUrl,
            backgroundColor: (repForm as any).historyBgColor || '#204383',
          };
          try {
            const histRes = await fetch(`${API_URL}/api/history-events`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
              body: JSON.stringify(historyPayload)
            });
            if (!histRes.ok) {
              console.error('Failed to create history event, status:', histRes.status);
              alert('Branch was saved, but failed to automatically create the history event (Status: ' + histRes.status + ').');
            } else {
              // Clear the history paragraph field if successful
              setRepForm({...repForm, historyParagraph: ''} as any);
            }
          } catch (e) {
            console.error('Failed to create history event for new branch:', e);
            alert('Branch was saved, but network error occurred when creating the history event.');
          }
        }

        setIsRepModalOpen(false);
        fetchRepresentatives();
      } else if (res.status === 403 || res.status === 401) {
        alert("Your session has expired or you do not have permission. Please log out and log back in as admin.");
      } else {
        alert(`Failed to save representative. Server returned: ${res.status}`);
      }
    } catch (err) {
      console.error(err);
      alert("Network error: Failed to reach the server.");
    }
  };

  const handleOpenEditRepresentative = (rep: Representative) => {
    setEditingRepId(rep.id || null);
    setRepFormStep(1);
    setRepForm(rep);
    setRepFormLogoFile(null);
    setIsRepModalOpen(true);
  };

  const handleDeleteRepresentative = (id: number | undefined) => {
    if (!id) return;
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Representative',
      message: 'Are you sure you want to delete this representative?',
      isAlert: false,
      onConfirm: async () => {
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        try {
          const res = await fetch(`${API_URL}/api/representatives/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) fetchRepresentatives();
        } catch (err) { console.error(err); }
      }
    });
  };

  const handleSaveEnrollment = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...enrollForm, courses: enrollForm.courses };
    try {
      const isEdit = editingEnrollId !== null;
      const url = isEdit 
        ? `${API_URL}/api/enrollments/update/${editingEnrollId}`
        : `${API_URL}/api/enrollments/submit`;
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setIsEnrollModalOpen(false);
        setEditingEnrollId(null);
        setEnrollForm({ fullName: '', email: '', country: '', phone: '', jobTitle: '', organization: '', courses: [], message: '' });
        fetchEnrollments();
      } else {
        alert('Failed to save enrollment. Please try again.');
      }
    } catch (err) {
      console.error('Failed to save enrollment:', err);
      alert('Network error. Please try again.');
    }
  };

  const fetchCoursesForEnroll = async () => {
    try {
      const res = await fetch(`${API_URL}/api/courses/show`);
      if (res.ok) setAllCourses(await res.json());
    } catch (err) {
      console.error('Failed to fetch courses:', err);
    }
  };

  const handleOpenEditEnrollment = (e: any) => {
    setEditingEnrollId(e.id || null);
    fetchCoursesForEnroll();
    setEnrollForm({
      fullName: e.fullName || '',
      email: e.email || '',
      country: e.country || '',
      phone: e.phone || '',
      jobTitle: e.jobTitle || '',
      organization: e.organization || '',
      courses: (() => {
        try {
          const courses = typeof e.courses === 'string' ? JSON.parse(e.courses) : (e.courses || []);
          return Array.isArray(courses) ? courses : [];
        } catch { return []; }
      })(),
      message: e.message || ''
    });
    setIsEnrollModalOpen(true);
  };

  const handleDeleteEnrollment = (id: number) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Enrollment',
      message: 'Are you sure you want to delete this enrollment? This cannot be undone.',
      isAlert: false,
      onConfirm: async () => {
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        try {
          const res = await fetch(`${API_URL}/api/enrollments/delete/${id}`, { method: 'DELETE' });
          if (res.ok) fetchEnrollments();
        } catch (err) { console.error(err); }
      }
    });
  };

  const fetchEnrollments = async () => {
    try {
      setEnrollmentsLoading(true);
      const res = await fetch(`${API_URL}/api/enrollments/list`);
      if (res.ok) {
        const data = await res.json();
        setEnrollments(data);
      }
    } catch (err) {
      console.error('Failed to fetch enrollments:', err);
    } finally {
      setEnrollmentsLoading(false);
    }
  };

  // Contact message handlers
  const fetchContactMessages = async () => {
    try {
      setContactMessagesLoading(true);
      const res = await fetch(`${API_URL}/api/contact/list`);
      if (res.ok) {
        const data = await res.json();
        setContactMessages(data);
      }
    } catch (err) {
      console.error('Failed to fetch contact messages:', err);
    } finally {
      setContactMessagesLoading(false);
    }
  };

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...contactForm };
    try {
      const isEdit = editingContactId !== null;
      const url = isEdit 
        ? `${API_URL}/api/contact/update/${editingContactId}`
        : `${API_URL}/api/contact/submit`;
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setIsContactModalOpen(false);
        setEditingContactId(null);
        setContactForm({ fullName: '', email: '', company: '', phone: '', phonePrefix: '+216', service: '', message: '' });
        fetchContactMessages();
      } else {
        alert('Failed to save contact message. Please try again.');
      }
    } catch (err) {
      console.error('Failed to save contact message:', err);
      alert('Network error. Please try again.');
    }
  };

  const handleOpenEditContact = (c: any) => {
    setEditingContactId(c.id || null);
    setContactForm({
      fullName: c.fullName || '',
      email: c.email || '',
      company: c.company || '',
      phone: c.phone || '',
      phonePrefix: c.phonePrefix || '+216',
      service: c.service || '',
      message: c.message || ''
    });
    setIsContactModalOpen(true);
  };

  const handleDeleteContact = (id: number) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Contact Message',
      message: 'Are you sure you want to delete this contact message? This cannot be undone.',
      isAlert: false,
      onConfirm: async () => {
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        try {
          const res = await fetch(`${API_URL}/api/contact/delete/${id}`, { method: 'DELETE' });
          if (res.ok) fetchContactMessages();
        } catch (err) { console.error(err); }
      }
    });
  };

  const fetchServices = async () => {
    try {
      const res = await fetch(`${API_URL}/api/services`);
      if (res.ok) {
        setServices(await res.json());
      }
    } catch (err) {
      console.error('Failed to fetch services:', err);
    }
  };

  const handleOpenEditService = (service: any) => {
    setSelectedService(service);
    setEditingServiceId(service.id);
    setActiveCategoryIdx(0);
    setServiceFormTitle(service.title || '');
    setServiceFormSlug(service.slug || '');
    setServiceFormSubtitle(service.subtitle || '');
    setServiceFormDescription(service.description || '');
    setServiceFormLayoutType(service.layoutType || 'CLEAN_CARD_GRID');
    
    let content: any = {};
    try {
      if (service.contentJson) {
        content = JSON.parse(service.contentJson);
      }
    } catch (e) {
      console.error(e);
    }
    
    if (content.categories && content.categories.length > 0) {
      setServiceFormHasCategories(true);
      setServiceFormCategories(content.categories.map((c: any) => ({ name: c.name || '' })));
      const loadedBoxes: any[] = [];
      content.categories.forEach((cat: any) => {
        const catName = cat.name || 'General';
        if (cat.boxes && Array.isArray(cat.boxes)) {
          cat.boxes.forEach((box: any) => {
            loadedBoxes.push({
              ...box,
              categoryName: catName
            });
          });
        }
      });
      setServiceFormBoxes(loadedBoxes);
    } else {
      setServiceFormHasCategories(false);
      setServiceFormBoxes(content.boxes || []);
      setServiceFormCategories([]);
    }
  };

  const handleDeleteService = (id: number) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Service Page',
      message: 'Are you sure you want to delete this service page? This action cannot be undone.',
      isAlert: false,
      onConfirm: async () => {
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        try {
          const res = await fetch(`${API_URL}/api/services/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) fetchServices();
        } catch (err) {
          console.error('Failed to delete service page:', err);
        }
      }
    });
  };

  const handleSaveService = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!serviceFormTitle || !serviceFormSlug) return;
    
    let contentObj = {};
    if (serviceFormHasCategories) {
      const updatedCategories = serviceFormCategories.map(cat => {
        const catName = cat.name || '';
        const matchingBoxes = serviceFormBoxes.filter((box: any) => (box.categoryName || '') === catName);
        const updatedBoxes = matchingBoxes.map((box: any, idx: number) => ({
          id: String(idx + 1).padStart(2, '0'),
          title: box.title || '',
          items: box.items || [''],
          image: box.image || ''
        }));
        return { name: catName, boxes: updatedBoxes };
      });
      contentObj = { categories: updatedCategories };
    } else {
      const updatedBoxes = serviceFormBoxes.map((box: any, idx: number) => ({
        id: String(idx + 1).padStart(2, '0'),
        title: box.title || '',
        items: box.items || [''],
        image: box.image || ''
      }));
      contentObj = { boxes: updatedBoxes };
    }
      
    const payload = {
      title: serviceFormTitle,
      slug: serviceFormSlug,
      subtitle: serviceFormSubtitle,
      description: serviceFormDescription,
      layoutType: serviceFormLayoutType,
      contentJson: JSON.stringify(contentObj)
    };
    
    try {
      const isEdit = editingServiceId !== null;
      const url = isEdit ? `${API_URL}/api/services/${editingServiceId}` : `${API_URL}/api/services`;
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        setIsServiceModalOpen(false);
        setSelectedService(null);
        setEditingServiceId(null);
        fetchServices();
      } else {
        const errData = await res.json().catch(() => null);
        alert(errData?.message || "Failed to save service page");
      }
    } catch (err) {
      console.error(err);
      alert("Network error: Failed to save service page");
    }
  };

  const handleReorderCards = (fromIdx: number | null, toIdx: number) => {
    if (fromIdx === null || fromIdx === toIdx) return;
    const updated = [...serviceFormBoxes];
    const [movedCard] = updated.splice(fromIdx, 1);
    
    // If dragging in category mode, update the card's categoryName to the target card's categoryName
    if (serviceFormHasCategories) {
      const targetCard = updated[toIdx >= fromIdx ? toIdx : toIdx];
      if (targetCard) {
        movedCard.categoryName = targetCard.categoryName;
      }
    }
    
    updated.splice(toIdx, 0, movedCard);
    setServiceFormBoxes(updated);
    setDraggedCardIndex(null);
  };

  const handleReorderServices = (fromIdx: number | null, toIdx: number) => {
    if (fromIdx === null || fromIdx === toIdx) return;
    const updated = [...services];
    const [movedService] = updated.splice(fromIdx, 1);
    updated.splice(toIdx, 0, movedService);
    setServices(updated);
    setDraggedServiceIndex(null);
    setDraggedOverServiceIndex(null);
    setIsServiceOrderChanged(true);
  };

  const handleApplyServiceOrder = async () => {
    const ids = services.map(s => s.id);
    try {
      const res = await fetch(`${API_URL}/api/services/reorder`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(ids)
      });
      if (!res.ok) {
        throw new Error(`Failed to apply order: ${res.statusText}`);
      }
      setIsServiceOrderChanged(false);
      fetchServices();
      setConfirmDialog({
        isOpen: true,
        title: 'Order Saved',
        message: 'The new order has been applied successfully.',
        isAlert: true,
        onConfirm: () => setConfirmDialog(prev => ({ ...prev, isOpen: false }))
      });
    } catch (err) {
      console.error("Failed to persist services order:", err);
      setConfirmDialog({
        isOpen: true,
        title: 'Error',
        message: 'Failed to apply order. Please try again.',
        isAlert: true,
        onConfirm: () => setConfirmDialog(prev => ({ ...prev, isOpen: false }))
      });
    }
  };

  // Helper functions for dynamic Categories list
  const addCategory = () => {
    setServiceFormCategories([...serviceFormCategories, { name: '', boxes: [] }]);
  };
  const removeCategory = (index: number) => {
    const catName = serviceFormCategories[index]?.name || '';
    setServiceFormCategories(serviceFormCategories.filter((_, i) => i !== index));
    setServiceFormBoxes(prev => prev.map(box => 
      (box.categoryName || '') === catName ? { ...box, categoryName: '' } : box
    ));
  };
  const changeCategoryName = (index: number, val: string) => {
    const oldName = serviceFormCategories[index]?.name || '';
    const updated = [...serviceFormCategories];
    updated[index].name = val;
    setServiceFormCategories(updated);
    setServiceFormBoxes(prev => prev.map(box => 
      (box.categoryName || '') === oldName ? { ...box, categoryName: val } : box
    ));
  };
  const addBoxToCategory = (catIdx: number) => {
    const updated = [...serviceFormCategories];
    if (!updated[catIdx].boxes) updated[catIdx].boxes = [];
    const nextId = String(updated[catIdx].boxes.length + 1).padStart(2, '0');
    updated[catIdx].boxes.push({ id: nextId, title: '', items: [''], image: '' });
    setServiceFormCategories(updated);
  };
  const removeBoxFromCategory = (catIdx: number, boxIdx: number) => {
    const updated = [...serviceFormCategories];
    updated[catIdx].boxes = updated[catIdx].boxes.filter((_: any, i: number) => i !== boxIdx);
    setServiceFormCategories(updated);
  };
  const changeBoxFieldInCategory = (catIdx: number, boxIdx: number, field: string, val: any) => {
    const updated = [...serviceFormCategories];
    updated[catIdx].boxes[boxIdx][field] = val;
    setServiceFormCategories(updated);
  };
  const addItemToBoxInCategory = (catIdx: number, boxIdx: number) => {
    const updated = [...serviceFormCategories];
    if (!updated[catIdx].boxes[boxIdx].items) updated[catIdx].boxes[boxIdx].items = [];
    updated[catIdx].boxes[boxIdx].items.push('');
    setServiceFormCategories(updated);
  };
  const removeItemFromBoxInCategory = (catIdx: number, boxIdx: number, itemIdx: number) => {
    const updated = [...serviceFormCategories];
    updated[catIdx].boxes[boxIdx].items = updated[catIdx].boxes[boxIdx].items.filter((_: any, i: number) => i !== itemIdx);
    setServiceFormCategories(updated);
  };
  const changeItemInBoxInCategory = (catIdx: number, boxIdx: number, itemIdx: number, val: string) => {
    const updated = [...serviceFormCategories];
    updated[catIdx].boxes[boxIdx].items[itemIdx] = val;
    setServiceFormCategories(updated);
  };

  // Helper functions for dynamic flat Box list
  const addBox = () => {
    const nextId = String(serviceFormBoxes.length + 1).padStart(2, '0');
    setServiceFormBoxes([...serviceFormBoxes, { id: nextId, title: '', items: [''], image: '' }]);
  };
  const removeBox = (index: number) => {
    setServiceFormBoxes(serviceFormBoxes.filter((_, i) => i !== index));
  };
  const changeBoxField = (boxIdx: number, field: string, val: any) => {
    const updated = [...serviceFormBoxes];
    updated[boxIdx][field] = val;
    setServiceFormBoxes(updated);
  };
  const addItemToBox = (boxIdx: number) => {
    const updated = [...serviceFormBoxes];
    if (!updated[boxIdx].items) updated[boxIdx].items = [];
    updated[boxIdx].items.push('');
    setServiceFormBoxes(updated);
  };
  const removeItemFromBox = (boxIdx: number, itemIdx: number) => {
    const updated = [...serviceFormBoxes];
    updated[boxIdx].items = updated[boxIdx].items.filter((_: any, i: number) => i !== itemIdx);
    setServiceFormBoxes(updated);
  };
  const changeItemInBox = (boxIdx: number, itemIdx: number, val: string) => {
    const updated = [...serviceFormBoxes];
    updated[boxIdx].items[itemIdx] = val;
    setServiceFormBoxes(updated);
  };

  const menuCards: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'certif', label: 'COURSES', icon: <Award size={28} /> },
    { id: 'articles', label: 'ARTICLES', icon: <FileText size={28} /> },
    { id: 'history', label: 'HISTORY', icon: <History size={28} /> },
    { id: 'team members', label: 'TEAM MEMBERS', icon: <Users size={28} /> },
    { id: 'Services', label: 'SERVICES', icon: <MessageSquare size={28} /> },
    { id: 'Representatives', label: 'REPRESENTATIVES', icon: <Globe size={28} /> },
    { id: 'projects', label: 'PROJECTS', icon: <Briefcase size={28} /> },
  ];

  // Unique categories for dropdowns
  const uniqueTeamRoles = ['All', ...Array.from(new Set(teamMembers.map(m => m.role).filter(Boolean)))];
  const uniqueArticleCategories = ['All', ...Array.from(new Set(articles.map(a => a.category).filter(Boolean)))];
  const uniqueProjectCategories = ['All', ...Array.from(new Set(projects.map(p => p.category).filter(Boolean)))];

  const filteredTeamMembers = teamMembers.filter(m => 
    (filterTeamRole === 'All' || m.role === filterTeamRole) &&
    (m.name.toLowerCase().includes(searchTeam.toLowerCase()) || m.role.toLowerCase().includes(searchTeam.toLowerCase()))
  );
  
  const filteredArticles = articles.filter(a => 
    (filterArticleCategory === 'All' || a.category === filterArticleCategory) &&
    (a.title.toLowerCase().includes(searchArticle.toLowerCase()) || (a.category && a.category.toLowerCase().includes(searchArticle.toLowerCase())))
  );
  
  const filteredProjects = projects.filter(p => 
    (filterProjectCategory === 'All' || p.category === filterProjectCategory) &&
    (p.title.toLowerCase().includes(searchProject.toLowerCase()) || (p.client && p.client.toLowerCase().includes(searchProject.toLowerCase())))
  );

  return (
    <div className="bfc-admin-layout">
      {/* Full Page Background */}
      <div className="bfc-admin-bg">
        <div className="bfc-admin-bg-image"></div>
        <div className="bfc-admin-bg-gradient"></div>
      </div>

      {/* Floating Logout Button */}
      <button className="bfc-admin-logout-float" onClick={() => {
        localStorage.removeItem('bfc_token');
        navigate('/login');
      }}>
        <LogOut size={20} />
      </button>

      {/* Floating Stats Button */}
      <button 
        className={`bfc-admin-stats-float ${isStatsExpanded ? 'is-hidden' : ''}`} 
        onClick={() => { setIsStatsExpanded(true); fetchEnrollments(); fetchCoursesForEnroll(); fetchContactMessages(); setStatsTab('enrollment'); }}
      >
        <BarChart size={24} />
      </button>

      {/* Expandable Stats Overlay */}
      <div className={`bfc-admin-stats-overlay ${isStatsExpanded ? 'is-expanded' : ''}`}>
        <button className="bfc-stats-close" onClick={() => setIsStatsExpanded(false)}>
          <X size={20} />
        </button>
        <div className="bfc-stats-overlay-content" style={{ overflowY: 'auto', paddingBottom: '6rem' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            
            {/* Stats Tab Indicators */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.12)', paddingBottom: '1rem' }}>
              <button
                onClick={() => setStatsTab('enrollment')}
                style={{
                  padding: '0.6rem 1.5rem',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '0.9rem',
                  fontWeight: statsTab === 'enrollment' ? 700 : 500,
                  cursor: 'pointer',
                  background: statsTab === 'enrollment' ? '#99cdb3' : 'rgba(255,255,255,0.08)',
                  color: statsTab === 'enrollment' ? '#0f2a4a' : '#94a3b8',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <BarChart size={16} /> Enrollment Stats
              </button>
              <button
                onClick={() => { setStatsTab('contact'); fetchContactMessages(); }}
                style={{
                  padding: '0.6rem 1.5rem',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '0.9rem',
                  fontWeight: statsTab === 'contact' ? 700 : 500,
                  cursor: 'pointer',
                  background: statsTab === 'contact' ? '#99cdb3' : 'rgba(255,255,255,0.08)',
                  color: statsTab === 'contact' ? '#0f2a4a' : '#94a3b8',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <Mail size={16} /> Contact Stats
              </button>
            </div>

            {/* ─── Enrollment Stats Page ─── */}
            <div style={{ display: statsTab === 'enrollment' ? 'block' : 'none' }}>
            <h2 style={{ margin: '0 0 2rem 0', color: '#fff', fontSize: '2rem', fontWeight: 800 }}>Enrollment Statistics</h2>
            
            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
              <div className="bfc-table-container" style={{ padding: '1.5rem', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#99cdb3' }}>{enrollments.length}</div>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.25rem' }}>Total Enrollments</div>
              </div>
              
              {/* Top Countries */}
              <div className="bfc-table-container" style={{ padding: '1.5rem' }}>
                <h4 style={{ margin: '0 0 0.75rem 0', color: '#fff', fontSize: '0.9rem', fontWeight: 600 }}>Top Countries</h4>
                {(() => {
                  const countryCounts: Record<string, number> = {};
                  enrollments.forEach((e: any) => {
                    const c = e.country || 'Unknown';
                    countryCounts[c] = (countryCounts[c] || 0) + 1;
                  });
                  const sorted = Object.entries(countryCounts).sort(([,a], [,b]) => b - a).slice(0, 5);
                  const maxCount = sorted.length > 0 ? sorted[0][1] : 1;
                  return sorted.length > 0 ? sorted.map(([country, count]) => (
                    <div key={country} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <span style={{ flex: 1, fontSize: '0.82rem', color: '#e2e8f0' }}>{country}</span>
                      <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${(count / maxCount) * 100}%`, height: '100%', background: '#99cdb3', borderRadius: '3px', transition: 'width 0.5s' }} />
                      </div>
                      <span style={{ fontSize: '0.78rem', color: '#94a3b8', minWidth: '24px', textAlign: 'right' }}>{count}</span>
                    </div>
                  )) : <div style={{ fontSize: '0.82rem', color: '#64748b' }}>No data yet</div>;
                })()}
              </div>

              {/* Top Courses */}
              <div className="bfc-table-container" style={{ padding: '1.5rem' }}>
                <h4 style={{ margin: '0 0 0.75rem 0', color: '#fff', fontSize: '0.9rem', fontWeight: 600 }}>Most Selected Courses</h4>
                {(() => {
                  const courseCounts: Record<string, number> = {};
                  enrollments.forEach((e: any) => {
                    try {
                      const courses = typeof e.courses === 'string' ? JSON.parse(e.courses) : (e.courses || []);
                      if (Array.isArray(courses)) {
                        courses.forEach((c: string) => { courseCounts[c] = (courseCounts[c] || 0) + 1; });
                      }
                    } catch { /* ignore parse errors */ }
                  });
                  const sorted = Object.entries(courseCounts).sort(([,a], [,b]) => b - a).slice(0, 5);
                  const maxCount = sorted.length > 0 ? sorted[0][1] : 1;
                  return sorted.length > 0 ? sorted.map(([course, count]) => (
                    <div key={course} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <span style={{ flex: 1, fontSize: '0.82rem', color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{course}</span>
                      <div style={{ width: '80px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden', flexShrink: 0 }}>
                        <div style={{ width: `${(count / maxCount) * 100}%`, height: '100%', background: '#204383', borderRadius: '3px', transition: 'width 0.5s' }} />
                      </div>
                      <span style={{ fontSize: '0.78rem', color: '#94a3b8', minWidth: '20px', textAlign: 'right', flexShrink: 0 }}>{count}</span>
                    </div>
                  )) : <div style={{ fontSize: '0.82rem', color: '#64748b' }}>No data yet</div>;
                })()}
              </div>
            </div>

            {/* Enrollments Table */}
            <div className="bfc-table-container">
              <div className="bfc-table-header">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3>Course Enrollment Submissions ({enrollments.length})</h3>
                  <button className="bfc-btn-mint" onClick={() => {
                    setEditingEnrollId(null);
                    setEnrollForm({ fullName: '', email: '', country: '', phone: '', jobTitle: '', organization: '', courses: [], message: '' });
                    fetchCoursesForEnroll();
                    setIsEnrollModalOpen(true);
                  }}><Plus size={16} /> Add Enrollment</button>
                </div>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table className="bfc-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Country</th>
                      <th>Job / Organization</th>
                      <th>Courses</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enrollmentsLoading ? (
                      <tr><td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>Loading...</td></tr>
                    ) : enrollments.length === 0 ? (
                      <tr><td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>No enrollments yet</td></tr>
                    ) : (
                      (() => {
                        const listForDisplay = [...enrollments].reverse();
                        const totalPages = Math.max(1, Math.ceil(listForDisplay.length / enrollPageSize));
                        if (enrollPage > totalPages && totalPages > 0) {
                          setEnrollPage(totalPages);
                        }
                        const start = (enrollPage - 1) * enrollPageSize;
                        const pageItems = listForDisplay.slice(start, start + enrollPageSize);
                        return pageItems.map((e: any, rowIdx: number) => {
                        let coursesDisplay = '';
                        try {
                          const courses = typeof e.courses === 'string' ? JSON.parse(e.courses) : (e.courses || []);
                          coursesDisplay = Array.isArray(courses) ? courses.join(', ') : String(e.courses || '');
                        } catch { coursesDisplay = e.courses || ''; }
                        const date = e.submittedAt ? new Date(e.submittedAt).toLocaleDateString() : '-';
                        const jobOrg = [e.jobTitle, e.organization].filter(Boolean);
                        const jobOrgDisplay = jobOrg.length === 2 ? `${e.jobTitle}(${e.organization})` : (jobOrg[0] || '-');
                        return (
                          <tr key={e.id}>
                            <td style={{ fontWeight: 600 }}>{e.fullName}</td>
                            <td>{e.email}</td>
                            <td>{e.phone || '-'}</td>
                            <td>{e.country || '-'}</td>
                            <td style={{ fontSize: '0.82rem' }} title={jobOrgDisplay}>{jobOrgDisplay}</td>
                            <td style={{ maxWidth: 150, position: 'relative' }}>
                              <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                                {(() => {
                                  const courseNames = coursesDisplay ? coursesDisplay.split(', ') : [];
                                  const maxShow = 2;
                                  const visible = courseNames.slice(0, maxShow);
                                  const remaining = courseNames.length - maxShow;
                                  return (
                                    <>
                                      {courseNames.length === 0 ? (
                                        <span style={{ color: '#94a3b8', fontSize: '0.82rem' }}>-</span>
                                      ) : (
                                        <>
                                          {visible.map((name: string, idx: number) => {
                                            const course = allCourses.find((c: any) => c.title === name);
                                            const logoUrl = course?.logo ? getUploadUrl(course.logo) : null;
                                            return (
                                              <div key={name + idx} className="bfc-course-thumb-wrap" style={{ display: 'inline-flex', flexShrink: 0 }}>
                                                <div
                                                  style={{
                                                    width: 28, height: 28, borderRadius: '50%',
                                                    background: '#1e293b',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)',
                                                    cursor: 'pointer',
                                                  }}
                                                >
                                                  {logoUrl ? (
                                                    <img src={logoUrl} alt={name} style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
                                                  ) : (
                                                    <span style={{ fontSize: '0.55rem', fontWeight: 700, color: '#64748b' }}>?</span>
                                                  )}
                                                </div>
                                                <div className={`bfc-course-tooltip bfc-course-tooltip--list${rowIdx === 0 ? ' bfc-course-tooltip--below' : ''}`}>{courseNames.map((cn: string) => <span key={cn} className="bfc-tooltip-item">{cn}</span>)}</div>
                                              </div>
                                            );
                                          })}
                                          {remaining > 0 && (
                                            <div className="bfc-course-thumb-wrap" style={{ display: 'inline-flex', flexShrink: 0 }}>
                                              <div
                                                style={{
                                                  width: 28, height: 28, borderRadius: '50%',
                                                  background: '#99cdb3', color: '#204383',
                                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                  fontSize: '0.65rem', fontWeight: 800, cursor: 'pointer',
                                                }}
                                              >+{remaining}</div>
                                              <div className={`bfc-course-tooltip bfc-course-tooltip--list${rowIdx === 0 ? ' bfc-course-tooltip--below' : ''}`}>{courseNames.map((cn: string) => <span key={cn} className="bfc-tooltip-item">{cn}</span>)}</div>
                                            </div>
                                          )}
                                        </>
                                      )}
                                    </>
                                  );
                                })()}
                              </div>
                            </td>
                            <td>{date}</td>
                            <td>
                              <div style={{ display: 'flex', gap: '0.35rem' }}>
                                <button className="btn-icon" onClick={() => handleOpenEditEnrollment(e)} style={{ width: 28, height: 28 }}><Edit2 size={12} /></button>
                                <button className="btn-icon delete" onClick={() => handleDeleteEnrollment(e.id)} style={{ width: 28, height: 28 }}><Trash2 size={12} /></button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                      })()
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Pagination controls */}
            {!enrollmentsLoading && enrollments.length > 0 && (() => {
              const totalPages = Math.max(1, Math.ceil(enrollments.length / enrollPageSize));
              return (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                  <button
                    style={{ padding: '0.4rem 0.8rem', background: enrollPage <= 1 ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: enrollPage <= 1 ? '#475569' : '#e2e8f0', cursor: enrollPage <= 1 ? 'not-allowed' : 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                    disabled={enrollPage <= 1}
                    onClick={() => setEnrollPage(p => Math.max(1, p - 1))}
                  >
                    Prev
                  </button>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      style={{
                        width: '32px', height: '32px', borderRadius: '6px',
                        border: enrollPage === i + 1 ? '1px solid #99cdb3' : '1px solid rgba(255,255,255,0.15)',
                        background: enrollPage === i + 1 ? '#99cdb3' : 'rgba(255,255,255,0.05)',
                        color: enrollPage === i + 1 ? '#1a365d' : '#94a3b8',
                        cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700
                      }}
                      onClick={() => setEnrollPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    style={{ padding: '0.4rem 0.8rem', background: enrollPage >= totalPages ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: enrollPage >= totalPages ? '#475569' : '#e2e8f0', cursor: enrollPage >= totalPages ? 'not-allowed' : 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                    disabled={enrollPage >= totalPages}
                    onClick={() => setEnrollPage(p => Math.min(totalPages, p + 1))}
                  >
                    Next
                  </button>
                </div>
              );
            })()}
            </div>

            {/* ─── Contact Stats Page ─── */}
            <div style={{ display: statsTab === 'contact' ? 'block' : 'none' }}>
        <h2 style={{ margin: '0 0 2rem 0', color: '#fff', fontSize: '2rem', fontWeight: 800 }}>Contact Statistics</h2>
        
        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          <div className="bfc-table-container" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#99cdb3' }}>{contactMessages.length}</div>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.25rem' }}>Total Messages</div>
          </div>
          
          {/* Top Services */}
          <div className="bfc-table-container" style={{ padding: '1.5rem' }}>
            <h4 style={{ margin: '0 0 0.75rem 0', color: '#fff', fontSize: '0.9rem', fontWeight: 600 }}>Services Requested</h4>
            {(() => {
              const serviceCounts: Record<string, number> = {};
              contactMessages.forEach((c: any) => {
                const s = c.service || 'Not specified';
                serviceCounts[s] = (serviceCounts[s] || 0) + 1;
              });
              const sorted = Object.entries(serviceCounts).sort(([,a], [,b]) => b - a);
              const maxCount = sorted.length > 0 ? sorted[0][1] : 1;
              return sorted.length > 0 ? sorted.map(([service, count]) => (
                <div key={service} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ flex: 1, fontSize: '0.82rem', color: '#e2e8f0' }}>{service}</span>
                  <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${(count / maxCount) * 100}%`, height: '100%', background: '#99cdb3', borderRadius: '3px', transition: 'width 0.5s' }} />
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8', minWidth: '24px', textAlign: 'right' }}>{count}</span>
                </div>
              )) : <div style={{ fontSize: '0.82rem', color: '#64748b' }}>No data yet</div>;
            })()}
          </div>

          {/* Countries */}
          <div className="bfc-table-container" style={{ padding: '1.5rem' }}>
            <h4 style={{ margin: '0 0 0.75rem 0', color: '#fff', fontSize: '0.9rem', fontWeight: 600 }}>Countries by Phone Prefix</h4>
            {(() => {
              const prefixToCountry: Record<string, string> = {
                '+216': 'Tunisia 🇹🇳',
                '+213': 'Algeria 🇩🇿',
                '+212': 'Morocco 🇲🇦',
                '+218': 'Libya 🇱🇾',
                '+20': 'Egypt 🇪🇬',
                '+222': 'Mauritania 🇲🇷',
                '+221': 'Senegal 🇸🇳',
                '+223': 'Mali 🇲🇱',
                '+225': 'Ivory Coast 🇨🇮',
                '+237': 'Cameroon 🇨🇲',
                '+242': 'Congo 🇨🇬',
                '+224': 'Guinea 🇬🇳',
                '+33': 'France 🇫🇷',
                '+32': 'Belgium 🇧🇪',
                '+39': 'Italy 🇮🇹',
                '+971': 'UAE 🇦🇪',
                '+974': 'Qatar 🇶🇦',
                '+966': 'Saudi Arabia 🇸🇦',
                '+961': 'Lebanon 🇱🇧',
                '+965': 'Kuwait 🇰🇼',
                '+973': 'Bahrain 🇧🇭',
                '+968': 'Oman 🇴🇲',
              };
              const countryCounts: Record<string, number> = {};
              contactMessages.forEach((c: any) => {
                const prefix = c.phonePrefix || '';
                const country = prefixToCountry[prefix] || prefix || 'Unknown';
                countryCounts[country] = (countryCounts[country] || 0) + 1;
              });
              const sorted = Object.entries(countryCounts).sort(([,a], [,b]) => b - a);
              const maxCount = sorted.length > 0 ? sorted[0][1] : 1;
              return sorted.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {sorted.map(([country, count]: [string, number], idx: number) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ flex: 1, fontSize: '0.82rem', color: '#e2e8f0' }}>{country}</span>
                      <div style={{ width: '80px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden', flexShrink: 0 }}>
                        <div style={{ width: `${(count / maxCount) * 100}%`, height: '100%', background: '#204383', borderRadius: '3px', transition: 'width 0.5s' }} />
                      </div>
                      <span style={{ fontSize: '0.78rem', color: '#94a3b8', minWidth: '20px', textAlign: 'right', flexShrink: 0 }}>{count}</span>
                    </div>
                  ))}
                </div>
              ) : <div style={{ fontSize: '0.82rem', color: '#64748b' }}>No data yet</div>;
            })()}
          </div>
        </div>

        {/* Contact Messages Table */}
        <div className="bfc-table-container">
          <div className="bfc-table-header">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3>Contact Messages Submissions ({contactMessages.length})</h3>
              <button className="bfc-btn-mint" onClick={() => {
                setEditingContactId(null);
                setContactForm({ fullName: '', email: '', company: '', phone: '', phonePrefix: '+216', service: '', message: '' });
                setIsContactModalOpen(true);
              }}><Plus size={16} /> Add Message</button>
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="bfc-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Company</th>
                  <th>Phone</th>
                  <th>Service</th>
                  <th>Message</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {contactMessagesLoading ? (
                  <tr><td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>Loading...</td></tr>
                ) : contactMessages.length === 0 ? (
                  <tr><td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>No contact messages yet</td></tr>
                ) : (
                  [...contactMessages].reverse().map((c: any) => {
                    const date = c.submittedAt ? new Date(c.submittedAt).toLocaleDateString() : '-';
                    const msgPreview = c.message ? (c.message.length > 80 ? c.message.substring(0, 80) + '...' : c.message) : '-';
                    return (
                      <tr key={c.id}>
                        <td style={{ fontWeight: 600 }}>{c.fullName}</td>
                        <td>{c.email}</td>
                        <td>{c.company || '-'}</td>
                        <td>{c.phone ? (c.phonePrefix || '') + c.phone : '-'}</td>
                        <td><span style={{ background: 'rgba(153,205,179,0.2)', color: '#99cdb3', padding: '0.2rem 0.5rem', fontSize: '0.78rem', fontWeight: 600, borderRadius: '4px' }}>{c.service || '-'}</span></td>
                        <td style={{ maxWidth: 200, fontSize: '0.82rem', color: '#64748b' }} title={c.message}>{msgPreview}</td>
                        <td>{date}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.35rem' }}>
                            <button className="bfc-btn-icon" title="Edit" onClick={() => handleOpenEditContact(c)}>
                              <Edit2 size={15} />
                            </button>
                            <button className="bfc-btn-icon" title="Delete" onClick={() => handleDeleteContact(c.id)} style={{ color: '#ef4444' }}>
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
            </div>

          </div>
        </div>
      </div>

      {/* Enrollment Add/Edit Modal */}
      {isEnrollModalOpen && (
        <div className="bfc-modal-overlay" onClick={() => setIsEnrollModalOpen(false)}>
          <div className="bfc-modal-card" style={{ maxWidth: '600px', padding: '2rem' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 1.5rem 0', color: '#204383', fontSize: '1.2rem', fontWeight: 800 }}>
              {editingEnrollId ? 'Edit Enrollment' : 'Add Enrollment'}
            </h3>
            <form onSubmit={handleSaveEnrollment}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="bfc-field">
                  <label>Full Name *</label>
                  <input required value={enrollForm.fullName} onChange={e => setEnrollForm({...enrollForm, fullName: e.target.value})} />
                </div>
                <div className="bfc-field">
                  <label>Email *</label>
                  <input required type="email" value={enrollForm.email} onChange={e => setEnrollForm({...enrollForm, email: e.target.value})} />
                </div>
                <div className="bfc-field">
                  <label>Phone</label>
                  <input value={enrollForm.phone} onChange={e => setEnrollForm({...enrollForm, phone: e.target.value})} />
                </div>
                <div className="bfc-field">
                  <label>Country</label>
                  <select value={enrollForm.country} onChange={e => setEnrollForm({...enrollForm, country: e.target.value})}>
                    <option value="" disabled>Select your country</option>
                    <option value="Tunisia">Tunisia</option>
                    <option value="Algeria">Algeria</option>
                    <option value="Morocco">Morocco</option>
                    <option value="Libya">Libya</option>
                    <option value="Egypt">Egypt</option>
                    <option value="Mauritania">Mauritania</option>
                    <option value="Senegal">Senegal</option>
                    <option value="Mali">Mali</option>
                    <option value="Ivory Coast">Ivory Coast</option>
                    <option value="Cameroon">Cameroon</option>
                    <option value="Congo">Congo</option>
                    <option value="Guinea">Guinea</option>
                    <option value="France">France</option>
                    <option value="Belgium">Belgium</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="Qatar">Qatar</option>
                    <option value="Saudi Arabia">Saudi Arabia</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="bfc-field">
                  <label>Job Title</label>
                  <input value={enrollForm.jobTitle} onChange={e => setEnrollForm({...enrollForm, jobTitle: e.target.value})} />
                </div>
                <div className="bfc-field">
                  <label>Organization</label>
                  <input value={enrollForm.organization} onChange={e => setEnrollForm({...enrollForm, organization: e.target.value})} />
                </div>
              </div>
              <div className="bfc-field" style={{ marginTop: '1rem' }}>
                <label>Select Courses</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '160px', overflowY: 'auto', padding: '0.5rem', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '10px', background: '#f5f7fa' }}>
                  {allCourses.length === 0 ? (
                    <div style={{ fontSize: '0.82rem', color: '#94a3b8', padding: '0.5rem' }}>Loading courses...</div>
                  ) : (
                    allCourses.map((course: any) => {
                      const checked = enrollForm.courses.includes(course.title);
                      return (
                        <label key={course.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.3rem 0.5rem', borderRadius: '6px', background: checked ? 'rgba(32,67,131,0.08)' : 'transparent', transition: 'background 0.15s' }}>
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => {
                              setEnrollForm(prev => ({
                                ...prev,
                                courses: checked
                                  ? prev.courses.filter((t: string) => t !== course.title)
                                  : [...prev.courses, course.title]
                              }));
                            }}
                            style={{ accentColor: '#204383' }}
                          />
                          <span style={{ fontSize: '0.85rem', color: '#1e293b', fontWeight: checked ? 600 : 400 }}>{course.title}</span>
                        </label>
                      );
                    })
                  )}
                </div>
              </div>
              <div className="bfc-field" style={{ marginTop: '1rem' }}>
                <label>Message (optional)</label>
                <textarea rows={2} value={enrollForm.message} onChange={e => setEnrollForm({...enrollForm, message: e.target.value})} style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '10px', fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', resize: 'vertical' }} />
              </div>
              <div className="bfc-id-footer" style={{ marginTop: '1.5rem' }}>
                <button type="button" className="bfc-btn-outline" onClick={() => setIsEnrollModalOpen(false)}>Cancel</button>
                <button type="submit" className="bfc-btn-navy">{editingEnrollId ? 'Update' : 'Add'} Enrollment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contact Message Add/Edit Modal */}
      {isContactModalOpen && (
        <div className="bfc-modal-overlay" onClick={() => setIsContactModalOpen(false)}>
          <div className="bfc-modal-card" style={{ maxWidth: '600px', padding: '2rem' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 1.5rem 0', color: '#204383', fontSize: '1.2rem', fontWeight: 800 }}>
              {editingContactId ? 'Edit Contact Message' : 'Add Contact Message'}
            </h3>
            <form onSubmit={handleSaveContact}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="bfc-field">
                  <label>Full Name *</label>
                  <input value={contactForm.fullName} onChange={e => setContactForm({...contactForm, fullName: e.target.value})} placeholder="Name" required />
                </div>
                <div className="bfc-field">
                  <label>Email *</label>
                  <input type="email" value={contactForm.email} onChange={e => setContactForm({...contactForm, email: e.target.value})} placeholder="email@example.com" required />
                </div>
                <div className="bfc-field">
                  <label>Company</label>
                  <input value={contactForm.company} onChange={e => setContactForm({...contactForm, company: e.target.value})} placeholder="Organization" />
                </div>
                <div className="bfc-field">
                  <label>Phone</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <select value={contactForm.phonePrefix} onChange={e => setContactForm({...contactForm, phonePrefix: e.target.value})} style={{ width: '130px', padding: '0.6rem' }}>
                      <option value="+216">+216</option>
                      <option value="+221">+221</option>
                      <option value="+242">+242</option>
                      <option value="+224">+224</option>
                      <option value="+33">+33</option>
                    </select>
                    <input value={contactForm.phone} onChange={e => setContactForm({...contactForm, phone: e.target.value})} placeholder="Phone" style={{ flex: 1 }} />
                  </div>
                </div>
              </div>
              <div className="bfc-field" style={{ marginTop: '1rem' }}>
                <label>Service</label>
                <select value={contactForm.service} onChange={e => setContactForm({...contactForm, service: e.target.value})}>
                  <option value="">Select a service</option>
                  <option value="Training">Training</option>
                  <option value="Consulting">Consulting</option>
                  <option value="Audit">Audit</option>
                  <option value="Tax and Legal">Tax and Legal</option>
                  <option value="Expertise">Expertise</option>
                  <option value="Collaboration">Collaboration</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="bfc-field" style={{ marginTop: '1rem' }}>
                <label>Message</label>
                <textarea
                  value={contactForm.message}
                  onChange={e => setContactForm({...contactForm, message: e.target.value})}
                  placeholder="Message content"
                  rows={4}
                />
              </div>
              <div className="bfc-id-footer" style={{ marginTop: '1.5rem' }}>
                <button type="button" className="bfc-btn-outline" onClick={() => setIsContactModalOpen(false)}>Cancel</button>
                <button type="submit" className="bfc-btn-solid">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <main className="bfc-admin-container">
        {activeTab === 'overview' ? (
          <div className="bfc-orbital-hub">
            <div className="bfc-hub-center">
              <div className="bfc-hub-circle">
                <span className="eyebrow">ADMINISTRATIVE</span>
                <h2>HUB</h2>
              </div>
            </div>
            
            {menuCards.map((card, index) => {
              const angle = (index / menuCards.length) * 360;
              const radius = 280;
              const x = Math.cos((angle - 90) * (Math.PI / 180)) * radius;
              const y = Math.sin((angle - 90) * (Math.PI / 180)) * radius;
              return (
                <div key={card.id} className="bfc-hub-node-wrapper" style={{ '--x': `${x}px`, '--y': `${y}px`, '--delay': `${index * 0.1}s` } as any}>
                  <button className="bfc-hub-node" onClick={() => setActiveTab(card.id)}>
                    <div className="bfc-node-icon">{card.icon}</div>
                    <span className="bfc-node-label">{card.label}</span>
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bfc-module-view">
            <div className="bfc-breadcrumb-pill">
              <button onClick={() => setActiveTab('overview')}><LayoutDashboard size={14}/> DASHBOARD</button>
              <ChevronRight size={14} />
              <span className="current">{(menuCards.find(c => c.id === activeTab)?.label || activeTab).toUpperCase()}</span>
            </div>

            <section className="bfc-module-content">
              {!(activeTab === 'Services' && selectedService) && (
                <div className="bfc-module-header">
                  <div className="bfc-title-group" style={{ flexShrink: 0 }}>
                    <span className="eyebrow">MANAGEMENT</span>
                    <h2 className="section-title">{menuCards.find(c => c.id === activeTab)?.label || activeTab}</h2>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', marginLeft: 'auto', alignItems: 'center' }}>
                    {/* Unified Search and Filter Bar */}
                    {['team members', 'articles', 'projects', 'certif'].includes(activeTab) && (
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', background: '#ffffff', padding: '0.4rem 0.75rem', borderRadius: '8px', border: '1px solid rgba(32, 67, 131, 0.2)', boxShadow: '0 2px 8px rgba(32, 67, 131, 0.05)', width: '400px' }}>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                          <Search size={16} color="#204383" style={{ opacity: 0.6 }} />
                          <input 
                            type="text" 
                            placeholder={`Search ${menuCards.find(c => c.id === activeTab)?.label || activeTab}...`}
                            value={
                              activeTab === 'team members' ? searchTeam :
                              activeTab === 'articles' ? searchArticle :
                              activeTab === 'projects' ? searchProject :
                              activeTab === 'certif' ? searchCertif : ''
                            }
                            onChange={(e) => {
                              if (activeTab === 'team members') setSearchTeam(e.target.value);
                              if (activeTab === 'articles') setSearchArticle(e.target.value);
                              if (activeTab === 'projects') setSearchProject(e.target.value);
                              if (activeTab === 'certif') setSearchCertif(e.target.value);
                            }}
                            style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.85rem', color: '#204383', fontWeight: 500 }}
                          />
                        </div>

                        <div style={{ width: '1px', height: '20px', background: 'rgba(32, 67, 131, 0.2)' }}></div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', position: 'relative' }}>
                          <Filter size={14} color="#204383" style={{ opacity: 0.6 }} />
                          <div 
                            onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer', userSelect: 'none', padding: '0.2rem 0.4rem', borderRadius: '4px', transition: 'background 0.2s', ...(isFilterDropdownOpen ? { background: 'rgba(32, 67, 131, 0.05)' } : {}) }}
                          >
                            <span style={{ fontSize: '0.8rem', color: '#204383', fontWeight: 600, whiteSpace: 'nowrap', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {activeTab === 'team members' ? filterTeamRole : activeTab === 'articles' ? filterArticleCategory : filterProjectCategory}
                            </span>
                            <ChevronDown size={14} color="#204383" style={{ opacity: 0.6, transform: isFilterDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                          </div>

                          {/* Custom Dropdown Menu */}
                          {isFilterDropdownOpen && (
                            <div style={{ position: 'absolute', top: 'calc(100% + 12px)', right: 0, width: '220px', background: '#fff', borderRadius: '12px', boxShadow: '0 10px 30px rgba(32, 67, 131, 0.15)', border: '1px solid rgba(32, 67, 131, 0.1)', zIndex: 100, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                              <div style={{ padding: '0.75rem 1rem', background: '#f8fafc', borderBottom: '1px solid rgba(32, 67, 131, 0.05)', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Filter by {activeTab === 'team members' ? 'Role' : 'Category'}
                              </div>
                              <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                                {(activeTab === 'team members' ? uniqueTeamRoles : activeTab === 'articles' ? uniqueArticleCategories : uniqueProjectCategories).map(item => (
                                  <div 
                                    key={item}
                                    onClick={() => {
                                      if (activeTab === 'team members') setFilterTeamRole(item);
                                      if (activeTab === 'articles') setFilterArticleCategory(item);
                                      if (activeTab === 'projects') setFilterProjectCategory(item);
                                      setIsFilterDropdownOpen(false);
                                    }}
                                    onMouseEnter={(e) => {
                                      if ((activeTab === 'team members' ? filterTeamRole : activeTab === 'articles' ? filterArticleCategory : filterProjectCategory) !== item) {
                                        e.currentTarget.style.background = '#f1f5f9';
                                      }
                                    }}
                                    onMouseLeave={(e) => {
                                      if ((activeTab === 'team members' ? filterTeamRole : activeTab === 'articles' ? filterArticleCategory : filterProjectCategory) !== item) {
                                        e.currentTarget.style.background = 'transparent';
                                      }
                                    }}
                                    style={{ padding: '0.6rem 1rem', fontSize: '0.85rem', color: '#334155', cursor: 'pointer', transition: 'all 0.2s', borderLeft: '3px solid transparent', 
                                      ...((activeTab === 'team members' ? filterTeamRole : activeTab === 'articles' ? filterArticleCategory : filterProjectCategory) === item 
                                        ? { background: 'rgba(32, 67, 131, 0.05)', color: '#204383', fontWeight: 600, borderLeftColor: '#204383' } 
                                        : {}
                                      ) 
                                    }}
                                  >
                                    {item}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                      </div>
                    )}
                    {activeTab === 'team members' && isOrderChanged && (
                      <button className="bfc-btn-mint" onClick={handleSaveOrder} style={{ background: '#204383', color: 'white' }}>
                        SAVE ORDER
                      </button>
                    )}
                    {activeTab === 'Services' && isServiceOrderChanged && (
                      <button className="bfc-btn-mint" onClick={handleApplyServiceOrder} style={{ background: '#204383', color: 'white' }}>
                        APPLY ORDER
                      </button>
                    )}
                   
                    <button
                      className="bfc-btn-mint"
                      onClick={() => {
                        if (activeTab === 'articles') {
                          navigate('/article-builder?new=true');
                        } else if (activeTab === 'projects') {
                          navigate('/project-builder?new=true');
                        } else if (activeTab === 'certif') {
                          setTriggerAddCertif(prev => prev + 1);
                        } else if (activeTab === 'history') {
                          setEditingHistoryId(null);
                          setHistoryFormTitle('');
                          setHistoryFormYear('');
                          setHistoryFormDesc('');
                          setHistoryFormBranchLink('');
                          setHistoryFormManagerEmail('');
                          setHistoryFormBgColor('#f8fafc');
                          setHistoryFormFlagUrl('');
                          setHistoryFormFlagFile(null);
                          setHistoryFormLogoUrl('');
                          setHistoryFormLogoFile(null);
                          setHistoryFormPhotoUrl('');
                          setHistoryFormPhotoFile(null);
                          setIsHistoryModalOpen(true);
                        } else if (activeTab === 'Representatives') {
                          setEditingRepId(null);
                          setRepFormStep(1);
                          setRepForm({
                            title: '', slug: '', subtitle: '', description: '', location: '',
                            manager: null,
                            globeMarkerTop: '', globeMarkerLeft: '', globeViewRotateY: '', globeViewMapX: '',
                            flagIconUrl: '', imageUrl: '', projectCountries: [], fallbackCountries: []
                          });
                          setRepFormLogoFile(null);
                          setRepFormPhotoFile(null);
                          setIsRepModalOpen(true);
                        } else if (activeTab === 'Services') {
                          setEditingServiceId(null);
                          setServiceFormTitle('');
                          setServiceFormSlug('');
                          setServiceFormSubtitle('');
                          setServiceFormDescription('');
                          setServiceFormLayoutType('CLEAN_CARD_GRID');
                          setServiceFormHasCategories(false);
                          setServiceFormCategories([]);
                          setServiceFormBoxes([]);
                          setActiveCategoryIdx(0);
                          setIsServiceModalOpen(true);
                        } else {
                          setEditingId(null); setFormName(''); setFormRole(''); setFormRoleType(''); setFormEmail(''); setFormPhone('');
                          setFormImg(''); setFormImgFile(null); setFormImgUploadError(''); setFormCvUrl(null); setFormCvFile(null); setFormCvUploadError(''); setFormCountryName('Tunisia'); setFormExtraFlags([]); setFormShowPrimaryFlag(true); setIsModalOpen(true);
                        }
                      }}
                    >
                      <Plus size={18} /> ADD NEW
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'certif' && (
                <div style={{ padding: '2rem 1rem' }}>
                  <AdminCertificationsTab token={token as string} setConfirmDialog={setConfirmDialog} searchOuter={searchCertif} triggerAdd={triggerAddCertif} />
                </div>
              )}

              {activeTab === 'history' && (
                <div style={{ padding: '2rem 1rem', minHeight: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>
                  {/* Timeline Bar */}
                  <div style={{ 
                    position: 'relative', display: 'flex', alignItems: 'center', marginBottom: '3rem', minHeight: '60px', padding: '0 2rem',
                    transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: selectedHistoryYear === null ? 'translateY(25vh)' : 'translateY(0)',
                    opacity: 1
                  }}>
                    <div style={{ position: 'absolute', top: '50%', left: '2rem', right: '2rem', height: '4px', background: 'linear-gradient(90deg, rgba(32,67,131,0.1) 0%, rgba(32,67,131,0.6) 50%, rgba(32,67,131,0.1) 100%)', borderRadius: '4px', transform: 'translateY(-50%)' }}></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', position: 'relative', zIndex: 1 }}>
                      {Array.from(new Set(historyEvents.map(e => e.eventYear))).sort((a, b) => a - b).map(year => {
                        const firstEventWithLogo = historyEvents.find(e => e.eventYear === year && e.logoUrl);
                        const logoToShow = firstEventWithLogo ? firstEventWithLogo.logoUrl : null;
                        return (
                        <div 
                          key={year} 
                          onClick={() => setSelectedHistoryYear(year)}
                          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
                        >
                          <div style={{ 
                            width: selectedHistoryYear === year ? '48px' : '36px', 
                            height: selectedHistoryYear === year ? '48px' : '36px', 
                            borderRadius: '50%', 
                            background: '#fff',
                            border: `3px solid ${selectedHistoryYear === year ? '#204383' : '#cbd5e1'}`,
                            boxShadow: selectedHistoryYear === year ? '0 0 0 4px rgba(32, 67, 131, 0.15)' : '0 2px 4px rgba(0,0,0,0.05)',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
                          }}>
                            {logoToShow ? (
                              <img src={logoToShow.startsWith('http') ? logoToShow : getUploadUrl(logoToShow)} alt="" style={{ width: '70%', height: '70%', objectFit: 'contain' }} />
                            ) : (
                              <div style={{ width: selectedHistoryYear === year ? '12px' : '8px', height: selectedHistoryYear === year ? '12px' : '8px', borderRadius: '50%', background: selectedHistoryYear === year ? '#204383' : '#cbd5e1' }}></div>
                            )}
                          </div>
                          <span style={{ 
                            fontSize: selectedHistoryYear === year ? '1.1rem' : '0.9rem', 
                            fontWeight: selectedHistoryYear === year ? 800 : 600, 
                            color: selectedHistoryYear === year ? '#204383' : '#64748b',
                            transition: 'all 0.3s ease',
                            position: 'absolute',
                            top: '56px',
                            whiteSpace: 'nowrap'
                          }}>
                            {year}
                          </span>
                        </div>
                        );
                      })}
                    </div>
                  </div>

                  <div 
                    className="bfc-history-grid"
                    style={{ 
                      display: 'flex', 
                      flexDirection: 'row',
                      gap: '1.5rem', 
                      marginTop: '2rem',
                      overflowX: 'auto',
                      paddingBottom: '1.5rem',
                      opacity: selectedHistoryYear === null ? 0 : 1,
                      pointerEvents: selectedHistoryYear === null ? 'none' : 'auto',
                      transition: 'opacity 0.6s ease 0.2s'
                    }}
                  >
                    {historyEvents.filter(e => e.eventYear === selectedHistoryYear).map((event, idx) => (
                      <div key={event.id || idx} style={{ 
                        minWidth: '450px', maxWidth: '500px', flex: '0 0 auto',
                        background: event.backgroundColor || '#fff', padding: '1.5rem', borderRadius: '16px', 
                        border: '1px solid rgba(32, 67, 131, 0.1)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                        position: 'relative', display: 'flex', flexDirection: 'column',
                        transition: 'transform 0.2s'
                      }}>
                        {event.photoUrl && (
                          <div style={{ width: '100%', height: '180px', marginBottom: '1rem', borderRadius: '12px', overflow: 'hidden' }}>
                            <img src={event.photoUrl.startsWith('http') ? event.photoUrl : getUploadUrl(event.photoUrl)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', gap: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            {event.logoUrl && (
                              <img src={event.logoUrl.startsWith('http') ? event.logoUrl : getUploadUrl(event.logoUrl)} alt="logo" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
                            )}
                            <h3 style={{ color: '#204383', margin: 0, fontSize: '1.25rem', fontWeight: 800, lineHeight: 1.3 }}>{event.title}</h3>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {event.countryFlag && (
                              <img src={event.countryFlag} alt="flag" style={{ width: '24px', height: '18px', borderRadius: '2px', objectFit: 'cover' }} />
                            )}
                            <button onClick={() => handleOpenHistoryEdit(event)} className="btn-icon" style={{ border: 'none', background: 'rgba(32, 67, 131, 0.1)', color: '#204383', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <Edit2 size={14} />
                            </button>
                            <button onClick={() => handleDeleteHistory(event.id)} className="btn-icon delete" style={{ border: 'none', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>{event.description}</p>
                      </div>
                    ))}
                    {historyEvents.filter(e => e.eventYear === selectedHistoryYear).length === 0 && selectedHistoryYear !== null && (
                      <div style={{ width: '100%', textAlign: 'center', padding: '3rem', background: 'rgba(255, 255, 255, 0.5)', borderRadius: '16px', border: '1px dashed rgba(32, 67, 131, 0.2)', color: '#64748b' }}>
                        No events found for {selectedHistoryYear}. Click "ADD NEW" to create one.
                      </div>
                    )}
                    {historyEvents.length === 0 && (
                      <div style={{ width: '100%', textAlign: 'center', padding: '3rem', background: 'rgba(255, 255, 255, 0.5)', borderRadius: '16px', border: '1px dashed rgba(32, 67, 131, 0.2)', color: '#64748b' }}>
                        The timeline is empty. Add a new event to start your history!
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'team members' && (
                <>

                  <div className="bfc-team-grid">
                    {filteredTeamMembers.map((member, idx) => (
                      <div
                      key={member.id || idx}
                      className={`bfc-member-card ${draggedIndex === idx ? 'dragging' : ''}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, idx)}
                      onDragOver={(e) => handleDragOver(e, idx)}
                      onDrop={(e) => e.preventDefault()}
                      onDragEnd={handleDragEnd}
                    >
                      <div className="card-image">
                        <img src={getUploadUrl(member.img)} alt={member.name} />
                        <div className="flag-pill">
                          <img src={member.countryFlagUrl} alt={member.countryName} />
                          <span className="flag-country">{member.countryName}</span>
                          {member.extraFlags && member.extraFlags.map((f, i) => (
                            <img key={i} src={f.url} alt={f.name} style={{ width: 18, height: 13 }} />
                          ))}
                          {(member.extraFlags?.length || 0) >= 2 && <Globe size={14} style={{ color: '#204383' }} />}
                        </div>
                      </div>
                      <div className="card-body">
                        <h4>{member.name}</h4>
                        <span className="role-label">{member.role}</span>
                        <div className="card-coordinates">
                          {member.email && (
                            <div className="coord-row">
                              <Mail size={12} /> <span>{member.email}</span>
                            </div>
                          )}
                          {member.phone && (
                            <div className="coord-row">
                              <Phone size={12} /> <span>{member.phone}</span>
                            </div>
                          )}
                        </div>
                        <div className="card-actions">
                          <button onClick={() => handleOpenEdit(idx)} className="btn-icon"><Edit2 size={14}/></button>
                          <button onClick={() => handleDeleteMember(idx)} className="btn-icon delete"><Trash2 size={14}/></button>
                        </div>
                      </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {activeTab === 'articles' && (
                <>
                  <div className="bfc-articles-admin-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
                    {filteredArticles.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '3rem', background: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(8px)', borderRadius: 12, border: '1px solid rgba(255, 255, 255, 0.1)', color: 'rgba(255,255,255,0.6)' }}>
                        No articles found matching your criteria.
                      </div>
                    ) : (
                      filteredArticles.map((art) => {
                      const isDraft = (() => {
                        try {
                          const c = JSON.parse(art.contentJson || '{}');
                          return c.isPublished === false;
                        } catch { return false; }
                      })();

                      const isTopArticle = art.topArticle === true;

                      return (
                        <div key={art.id} className="bfc-admin-article-card" style={{ display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)', borderRadius: '16px 4px 16px 4px', borderBottom: '3px solid #204383', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                          <div style={{ height: 160, width: '100%', background: '#f3f4f6', position: 'relative' }}>
                            <img src={art.heroImage || 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800'} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            {isDraft && <span style={{ position: 'absolute', top: 12, right: 12, fontSize: 11, padding: '4px 8px', background: '#fee2e2', color: '#ef4444', borderRadius: 6, fontWeight: 700, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>DRAFT</span>}
                            {isTopArticle && <span style={{ position: 'absolute', top: 12, left: 12, fontSize: 14, padding: '4px 8px', background: '#fef3c7', color: '#d97706', borderRadius: 6, fontWeight: 700, boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: 4 }}>★ Top Article</span>}
                          </div>
                          <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <h4 style={{ margin: 0, color: '#204383', fontSize: '1.15rem', fontWeight: 800, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                              {art.title}
                            </h4>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', marginTop: 12, fontSize: '0.8rem', color: '#6b7280' }}>
                              <span style={{ background: 'rgba(32,67,131,0.1)', color: '#204383', padding: '2px 8px', borderRadius: 999, fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase' }}>{art.category}</span>
                              <span>{art.publishDate || 'No date'}</span>
                            </div>
                            <div style={{ marginTop: 'auto', paddingTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f3f4f6' }}>
                              <button onClick={() => handleTogglePublishArticle(art, isDraft)} style={{ fontSize: '0.8rem', fontWeight: 600, padding: '6px 12px', borderRadius: 6, cursor: 'pointer', border: 'none', background: isDraft ? '#10b981' : '#f59e0b', color: '#fff', display: 'flex', alignItems: 'center', gap: 6 }}>
                                {isDraft ? 'Publish' : 'Unpublish'}
                              </button>
                              <div style={{ display: 'flex', gap: '0.4rem' }}>
                                <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleToggleTopArticle(art, isTopArticle); }} className="btn-icon" style={{ background: isTopArticle ? '#fef3c7' : 'rgba(200, 200, 200, 0.2)', color: isTopArticle ? '#d97706' : '#9ca3af', border: 'none', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, position: 'relative' }} title={isTopArticle ? "Remove from Top" : "Mark as Top"}><span style={{ fontSize: 16 }}>★</span></button>
                                <button onClick={() => window.open(`/articles/${art.slug}`, '_blank')} className="btn-icon" style={{ background: 'rgba(153, 205, 179, 0.15)', color: '#1f6f5c', border: 'none', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="Preview"><Eye size={14} /></button>
                                <button onClick={() => navigate(`/article-builder?id=${art.id}`)} className="btn-icon" style={{ background: 'rgba(32, 67, 131, 0.1)', color: '#204383', border: 'none', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="Edit"><Edit2 size={14} /></button>
                                <button onClick={() => handleDeleteArticle(art.id)} className="btn-icon delete" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="Delete"><Trash2 size={14} /></button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </>
            )}

              {activeTab === 'projects' && (
                <>
                  <div className="bfc-projects-admin-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
                    {filteredProjects.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '3rem', background: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(8px)', borderRadius: 12, border: '1px solid rgba(255, 255, 255, 0.1)', color: 'rgba(255,255,255,0.6)' }}>
                        No projects found matching your criteria.
                      </div>
                    ) : (
                      filteredProjects.map((proj) => {
                      const isDraft = (() => {
                        try {
                          const c = JSON.parse(proj.contentJson || '{}');
                          return c.isPublished === false;
                        } catch { return false; }
                      })();

                      return (
                        <div key={proj.id} className="bfc-admin-article-card" style={{ display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)', borderRadius: '16px 4px 16px 4px', borderBottom: '3px solid #204383', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                          <div style={{ height: 160, width: '100%', background: '#fff', borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                            <img src={getClientLogo(proj.client) || proj.imageUrl || 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800'} alt="" style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
                            {isDraft && <span style={{ position: 'absolute', top: 12, right: 12, fontSize: 11, padding: '4px 8px', background: '#fee2e2', color: '#ef4444', borderRadius: 6, fontWeight: 700, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>DRAFT</span>}
                          </div>
                          <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <h4 style={{ margin: 0, color: '#204383', fontSize: '1.15rem', fontWeight: 800, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                              {proj.title}
                            </h4>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', marginTop: 12, fontSize: '0.8rem', color: '#6b7280' }}>
                              <span style={{ background: 'rgba(32,67,131,0.1)', color: '#204383', padding: '2px 8px', borderRadius: 999, fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase' }}>{proj.category}</span>
                              <span>{proj.year || 'No period'}</span>
                            </div>
                            <div style={{ marginTop: 'auto', paddingTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f3f4f6' }}>
                              <button onClick={() => handleTogglePublishProject(proj, isDraft)} style={{ fontSize: '0.8rem', fontWeight: 600, padding: '6px 12px', borderRadius: 6, cursor: 'pointer', border: 'none', background: isDraft ? '#10b981' : '#f59e0b', color: '#fff', display: 'flex', alignItems: 'center', gap: 6 }}>
                                {isDraft ? 'Publish' : 'Unpublish'}
                              </button>
                              <div style={{ display: 'flex', gap: '0.4rem' }}>
                                <button onClick={() => window.open(`/who-we-are/our-projects/${proj.id}`, '_blank')} className="btn-icon" style={{ background: 'rgba(153, 205, 179, 0.15)', color: '#1f6f5c', border: 'none', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="Preview"><Eye size={14} /></button>
                                <button onClick={() => navigate(`/project-builder?id=${proj.id}`)} className="btn-icon" style={{ background: 'rgba(32, 67, 131, 0.1)', color: '#204383', border: 'none', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="Edit"><Edit2 size={14} /></button>
                                <button onClick={() => handleDeleteProject(proj.id)} className="btn-icon delete" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="Delete"><Trash2 size={14} /></button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </>
            )}
            
              {activeTab === 'Representatives' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
                  {representatives.length === 0 ? (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', background: 'rgba(255, 255, 255, 0.08)', borderRadius: 12, border: '1px solid rgba(255, 255, 255, 0.1)', color: '#64748b' }}>
                      No representatives found.
                    </div>
                  ) : (
                    representatives.map(rep => (
                      <div key={rep.id} className="bfc-admin-article-card" style={{ background: '#fff', padding: '1rem', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <img src={rep.flagIconUrl} alt={rep.slug} style={{ width: 40, height: 'auto', borderRadius: 4 }} />
                          <div>
                            <h4 style={{ margin: 0, color: '#204383' }}>{rep.title}</h4>
                            <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>{rep.location}</span>
                          </div>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: '#4b5563', margin: '0.5rem 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{rep.description}</p>
                        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                          <button onClick={() => handleOpenEditRepresentative(rep)} className="btn-icon" style={{ background: 'rgba(32, 67, 131, 0.1)', color: '#204383', border: 'none', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Edit2 size={14} /></button>
                          <button onClick={() => handleDeleteRepresentative(rep.id)} className="btn-icon delete" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Trash2 size={14} /></button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'Services' && (
                <div>
                  {/* Service Types Selector Area */}
                  {!selectedService && (
                    <div style={{ padding: '0 0 1.5rem 0', marginBottom: '2rem' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2.5rem', maxWidth: '1050px', margin: '0 auto' }}>
                        {services.map((service, idx) => {
                          const isSelected = selectedService?.id === service.id;
                          return (
                            <div
                              key={service.id}
                              draggable={true}
                              onDragStart={(e) => {
                                setDraggedServiceIndex(idx);
                                e.dataTransfer.effectAllowed = "move";
                              }}
                              onDragOver={(e) => {
                                e.preventDefault();
                                if (draggedOverServiceIndex !== idx) setDraggedOverServiceIndex(idx);
                              }}
                              onDragLeave={() => setDraggedOverServiceIndex(null)}
                              onDragEnd={() => {
                                setDraggedServiceIndex(null);
                                setDraggedOverServiceIndex(null);
                              }}
                              onDrop={(e) => {
                                e.preventDefault();
                                handleReorderServices(draggedServiceIndex, idx);
                              }}
                              onClick={() => handleOpenEditService(service)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '0.75rem',
                                padding: '1.25rem 1.75rem',
                                width: '100%',
                                minHeight: '80px',
                                borderRadius: '0px',
                                background: isSelected ? '#99cdb3' : (draggedOverServiceIndex === idx ? 'rgba(153, 205, 179, 0.1)' : '#ffffff'),
                                color: '#204383',
                                border: isSelected 
                                  ? '2px solid #99cdb3' 
                                  : (draggedOverServiceIndex === idx ? '2px dashed #204383' : (draggedServiceIndex === idx ? '2px dashed #99cdb3' : '2px solid #ffffff')),
                                opacity: draggedServiceIndex === idx ? 0.6 : 1,
                                fontWeight: 900,
                                fontSize: '1.15rem',
                                letterSpacing: '0.03em',
                                cursor: 'grab',
                                transition: 'all 0.2s',
                                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
                                userSelect: 'none',
                                position: 'relative'
                              }}
                              onMouseEnter={(e) => {
                                  e.currentTarget.style.transform = 'translateY(-2px)';
                                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.3)';
                              }}
                              onMouseLeave={(e) => {
                                  e.currentTarget.style.transform = 'none';
                                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.2)';
                              }}
                            >
                              <GripVertical size={16} style={{ cursor: 'grab', color: '#cbd5e1', position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                              <span style={{ flex: 1, textAlign: 'center', padding: '0 5rem 0 3.5rem' }}>{service.title.toUpperCase()}</span>
                              <div style={{ display: 'flex', gap: '0.75rem', position: 'absolute', right: '24px', top: '50%', transform: 'translateY(-50%)' }} onClick={e => e.stopPropagation()}>
                                <button 
                                  onClick={() => {
                                    setEditingServiceId(service.id);
                                    setServiceFormTitle(service.title || '');
                                    setServiceFormSlug(service.slug || '');
                                    setServiceFormSubtitle(service.subtitle || '');
                                    setServiceFormDescription(service.description || '');
                                    setServiceFormHasCategories(!!service.contentJson && JSON.parse(service.contentJson).categories?.length > 0);
                                    setIsServiceModalOpen(true);
                                  }} 
                                  style={{ background: 'transparent', border: 'none', color: '#204383', padding: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                  title="Edit Type Name & Description"
                                >
                                  <Edit2 size={14} />
                                </button>
                                <button 
                                  onClick={() => handleDeleteService(service.id)} 
                                  style={{ background: 'transparent', border: 'none', color: '#ef4444', padding: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                  title="Delete Service Type"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                        {services.length === 0 && (
                          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', fontStyle: 'italic', fontWeight: 600 }}>No service types created yet. Click "ADD NEW" in the header to create one.</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Selected Service Cards Dashboard */}
                  {selectedService && (
                    <div style={{ background: 'transparent', padding: '1rem 0', color: '#ffffff' }}>
                      {/* Header Details */}
                      <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#99cdb3', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Selected Service Type</span>
                            <h2 style={{ color: '#ffffff', margin: '0.25rem 0 0.5rem 0', fontSize: '1.6rem', fontWeight: 900 }}>{serviceFormTitle}</h2>
                            <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.95rem', margin: 0, lineHeight: 1.5 }}>{serviceFormDescription || 'No description provided.'}</p>
                          </div>
                          <div style={{ display: 'flex', gap: '1.5rem' }}>
                            <button 
                              type="button" 
                              onClick={() => handleSaveService()} 
                              style={{ background: '#10b981', border: 'none', color: '#ffffff', padding: '0.5rem 1.5rem', borderRadius: '0px', fontSize: '0.8rem', fontWeight: 900, cursor: 'pointer', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)' }}
                            >
                              SAVE CHANGES
                            </button>
                            <button 
                              type="button" 
                              onClick={() => setSelectedService(null)} 
                              style={{ background: 'transparent', border: '1px solid rgba(255, 255, 255, 0.3)', color: '#ffffff', padding: '0.5rem 1rem', borderRadius: '0px', fontSize: '0.8rem', fontWeight: 900, cursor: 'pointer' }}
                            >
                              CLOSE EDITOR
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Controls Row */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem', background: 'rgba(255, 255, 255, 0.05)', padding: '1rem', borderRadius: '0px', border: '1px solid rgba(255, 255, 255, 0.1)', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input 
                            type="checkbox" 
                            id="inline-has-categories" 
                            checked={serviceFormHasCategories} 
                            onChange={e => {
                              const checked = e.target.checked;
                              setServiceFormHasCategories(checked);
                              if (checked && serviceFormCategories.length === 0) {
                                setServiceFormCategories([{ name: 'General', boxes: [] }]);
                                setActiveCategoryIdx(0);
                              }
                            }} 
                            style={{ margin: 0, cursor: 'pointer', width: '16px', height: '16px' }}
                          />
                          <label htmlFor="inline-has-categories" style={{ fontWeight: 900, fontSize: '0.85rem', color: '#ffffff', cursor: 'pointer', userSelect: 'none' }}>ORGANIZE BY CATEGORIES</label>
                        </div>

                        {/* Flat Mode: Add Card button next to cards list */}
                        {!serviceFormHasCategories && (
                          <button 
                            type="button" 
                            onClick={addBox}
                            style={{ background: '#99cdb3', color: '#204383', border: 'none', padding: '0.6rem 1.5rem', borderRadius: '0px', fontSize: '0.85rem', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                          >
                            <Plus size={16} /> ADD CARD
                          </button>
                        )}
                      </div>

                      {/* Category Manager Bar */}
                      {serviceFormHasCategories && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255, 255, 255, 0.05)', padding: '0.75rem 1rem', borderRadius: '0px', border: '1px solid rgba(255, 255, 255, 0.1)', marginBottom: '1.5rem' }}>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
                            <span style={{ fontWeight: 900, fontSize: '0.85rem', color: '#99cdb3', marginRight: '0.5rem' }}>CATEGORIES:</span>
                            {serviceFormCategories.map((cat, catIdx) => (
                              <div 
                                key={catIdx}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.35rem',
                                  padding: '0.4rem 0.85rem',
                                  borderRadius: '0px',
                                  background: 'rgba(255, 255, 255, 0.05)',
                                  color: '#ffffff',
                                  border: '1px solid rgba(255, 255, 255, 0.15)',
                                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                                }}
                              >
                                <input 
                                  value={cat.name} 
                                  onChange={e => changeCategoryName(catIdx, e.target.value)} 
                                  placeholder={`Category ${catIdx + 1}`}
                                  style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#ffffff',
                                    fontWeight: 900,
                                    fontSize: '0.85rem',
                                    width: '110px',
                                    outline: 'none',
                                    padding: 0
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() => removeCategory(catIdx)}
                                  style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'rgba(255,255,255,0.7)',
                                    cursor: 'pointer',
                                    fontSize: '1rem',
                                    padding: '0 2px',
                                    fontWeight: 900,
                                    display: 'flex',
                                    alignItems: 'center'
                                  }}
                                  title="Delete Category"
                                >
                                  &times;
                                </button>
                              </div>
                            ))}
                            
                            <button
                              type="button"
                              onClick={() => {
                                setServiceFormCategories([...serviceFormCategories, { name: '', boxes: [] }]);
                              }}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '0.4rem 0.85rem',
                                borderRadius: '0px',
                                background: 'transparent',
                                border: '1px dashed rgba(255, 255, 255, 0.3)',
                                color: '#ffffff',
                                cursor: 'pointer',
                                fontSize: '0.8rem',
                                fontWeight: 900
                              }}
                            >
                              <Plus size={14} /> Add Category
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Cards Grid Menu */}
                      <div style={{ marginTop: '1rem' }}>
                        {serviceFormHasCategories ? (
                          // Category Mode
                          <div>
                            {serviceFormCategories.map((cat, catIdx) => {
                              const catName = cat.name || '';
                              const matchingBoxesWithIndices = serviceFormBoxes
                                .map((box, idx) => ({ box, originalIdx: idx }))
                                .filter(item => (item.box.categoryName || '') === catName);
                              
                              return (
                                <div key={catIdx} style={{ marginBottom: '2.5rem', borderBottom: '1px dashed rgba(255, 255, 255, 0.1)', paddingBottom: '2rem' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                                    <h3 style={{ color: '#99cdb3', margin: 0, fontSize: '1.2rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                      {catName || `Unnamed Category`} ({matchingBoxesWithIndices.length})
                                    </h3>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const nextId = String(serviceFormBoxes.length + 1).padStart(2, '0');
                                        setServiceFormBoxes([...serviceFormBoxes, { id: nextId, title: '', items: [''], image: '', categoryName: catName }]);
                                      }}
                                      style={{ background: 'transparent', border: '1px dashed #99cdb3', color: '#99cdb3', padding: '0.4rem 1rem', borderRadius: '0px', fontSize: '0.8rem', fontWeight: 900, cursor: 'pointer' }}
                                    >
                                      + Add Card to {catName || 'Category'}
                                    </button>
                                  </div>

                                  {matchingBoxesWithIndices.length === 0 ? (
                                    <div style={{ padding: '2rem', background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.15)', textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem', fontStyle: 'italic' }}>
                                      No cards assigned to this category. Choose this category on any card dropdown below to move it here.
                                    </div>
                                  ) : (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                                      {matchingBoxesWithIndices.map(({ box, originalIdx }) => (
                                        <div 
                                          key={originalIdx} 
                                          draggable={true}
                                          onDragStart={(e) => {
                                            setDraggedCardIndex(originalIdx);
                                            e.dataTransfer.effectAllowed = "move";
                                          }}
                                          onDragOver={(e) => e.preventDefault()}
                                          onDragEnd={() => setDraggedCardIndex(null)}
                                          onDrop={(e) => {
                                            e.preventDefault();
                                            handleReorderCards(draggedCardIndex, originalIdx);
                                          }}
                                          style={{ 
                                            background: '#ffffff', 
                                            border: draggedCardIndex === originalIdx ? '2px dashed #99cdb3' : '1px solid rgba(32, 67, 131, 0.2)', 
                                            opacity: draggedCardIndex === originalIdx ? 0.6 : 1,
                                            borderRadius: '0px', 
                                            padding: '1.5rem', 
                                            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                            minHeight: '280px',
                                            cursor: 'grab'
                                          }}
                                        >
                                          <div>
                                            {/* Category Selector Dropdown */}
                                            <div style={{ marginBottom: '0.75rem' }}>
                                              <label style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 900, display: 'block', marginBottom: 4 }}>ASSIGN TO CATEGORY</label>
                                              <select
                                                value={box.categoryName || ''}
                                                onChange={e => {
                                                  const updated = [...serviceFormBoxes];
                                                  updated[originalIdx].categoryName = e.target.value;
                                                  setServiceFormBoxes(updated);
                                                }}
                                                style={{ width: '100%', padding: '0.4rem 0.6rem', borderRadius: '0px', border: '1px solid rgba(32, 67, 131, 0.2)', fontSize: '0.85rem', outline: 'none', background: '#f8fafc', color: '#204383', fontWeight: 900 }}
                                              >
                                                <option value="">-- Unassigned --</option>
                                                {serviceFormCategories.map((c, cIdx) => (
                                                  <option key={cIdx} value={c.name}>{c.name || `Category ${cIdx + 1}`}</option>
                                                ))}
                                              </select>
                                            </div>

                                            {/* Title Input with Inline Remove Button */}
                                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem' }}>
                                              <GripVertical size={20} style={{ cursor: 'grab', color: '#cbd5e1', flexShrink: 0 }} />
                                              <input 
                                                value={box.title} 
                                                onChange={e => changeBoxField(originalIdx, 'title', e.target.value)} 
                                                placeholder="Card Title" 
                                                style={{ flex: 1, padding: '0.6rem 0.85rem', borderRadius: '0px', border: '1px solid rgba(32, 67, 131, 0.2)', fontSize: '0.95rem', outline: 'none', fontWeight: 900, background: '#f8fafc', color: '#204383' }} 
                                              />
                                              <button 
                                                type="button" 
                                                onClick={() => removeBox(originalIdx)} 
                                                style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: 'none', width: '36px', height: '36px', borderRadius: '0px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                                                title="Remove Card"
                                              >
                                                <Trash2 size={16} />
                                              </button>
                                            </div>

                                            {/* Items Bullet Points */}
                                            <div>
                                              <label style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 900, display: 'block', marginBottom: 6 }}>BULLET POINTS</label>
                                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                {(box.items || []).map((item: string, itemIdx: number) => (
                                                  <div key={itemIdx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                                    <span style={{ color: '#204383', fontWeight: 900 }}>&bull;</span>
                                                    <input 
                                                      value={item} 
                                                      onChange={e => changeItemInBox(originalIdx, itemIdx, e.target.value)} 
                                                      placeholder="Description bullet point" 
                                                      style={{ flex: 1, padding: '0.4rem 0.6rem', borderRadius: '0px', border: '1px solid rgba(32, 67, 131, 0.15)', fontSize: '0.85rem', outline: 'none', background: '#f8fafc', color: '#204383' }} 
                                                    />
                                                    <button 
                                                      type="button" 
                                                      onClick={() => removeItemFromBox(originalIdx, itemIdx)} 
                                                      style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: 'none', borderRadius: 0, width: 26, height: 26, cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                    >
                                                      &times;
                                                    </button>
                                                  </div>
                                                ))}
                                                <button 
                                                  type="button" 
                                                  onClick={() => addItemToBox(originalIdx)} 
                                                  style={{ border: '1px dashed rgba(32, 67, 131, 0.4)', color: '#204383', background: 'transparent', padding: '0.35rem 0.75rem', borderRadius: 0, cursor: 'pointer', fontSize: '0.75rem', fontWeight: 900, width: 'fit-content', marginTop: 4 }}
                                                >
                                                  + Add Bullet Point
                                                </button>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}

                            {/* Render Unassigned Cards */}
                            {(() => {
                              const unassignedBoxesWithIndices = serviceFormBoxes
                                .map((box, idx) => ({ box, originalIdx: idx }))
                                .filter(item => !item.box.categoryName || !serviceFormCategories.some(c => c.name === item.box.categoryName));
                              
                              if (unassignedBoxesWithIndices.length === 0) return null;

                              return (
                                <div style={{ marginTop: '3rem', borderTop: '2px dashed rgba(255, 255, 255, 0.15)', paddingTop: '2rem' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                                    <h3 style={{ color: '#e5e7eb', margin: 0, fontSize: '1.2rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                      Unassigned Cards ({unassignedBoxesWithIndices.length})
                                    </h3>
                                  </div>

                                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                                    {unassignedBoxesWithIndices.map(({ box, originalIdx }) => (
                                      <div 
                                        key={originalIdx} 
                                        draggable={true}
                                        onDragStart={(e) => {
                                          setDraggedCardIndex(originalIdx);
                                          e.dataTransfer.effectAllowed = "move";
                                        }}
                                        onDragOver={(e) => e.preventDefault()}
                                        onDragEnd={() => setDraggedCardIndex(null)}
                                        onDrop={(e) => {
                                          e.preventDefault();
                                          handleReorderCards(draggedCardIndex, originalIdx);
                                        }}
                                        style={{ 
                                          background: '#ffffff', 
                                          border: draggedCardIndex === originalIdx ? '2px dashed #99cdb3' : '1px solid rgba(32, 67, 131, 0.2)', 
                                          opacity: draggedCardIndex === originalIdx ? 0.6 : 1,
                                          borderRadius: '0px', 
                                          padding: '1.5rem', 
                                          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                                          display: 'flex',
                                          flexDirection: 'column',
                                          justifyContent: 'space-between',
                                          minHeight: '280px',
                                          cursor: 'grab'
                                        }}
                                      >
                                        <div>
                                          {/* Category Selector Dropdown */}
                                          <div style={{ marginBottom: '0.75rem' }}>
                                            <label style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 900, display: 'block', marginBottom: 4 }}>ASSIGN TO CATEGORY</label>
                                            <select
                                              value={box.categoryName || ''}
                                              onChange={e => {
                                                const updated = [...serviceFormBoxes];
                                                updated[originalIdx].categoryName = e.target.value;
                                                setServiceFormBoxes(updated);
                                              }}
                                              style={{ width: '100%', padding: '0.4rem 0.6rem', borderRadius: '0px', border: '1px solid rgba(32, 67, 131, 0.2)', fontSize: '0.85rem', outline: 'none', background: '#f8fafc', color: '#204383', fontWeight: 900 }}
                                            >
                                              <option value="">-- Unassigned --</option>
                                              {serviceFormCategories.map((c, cIdx) => (
                                                <option key={cIdx} value={c.name}>{c.name || `Category ${cIdx + 1}`}</option>
                                              ))}
                                            </select>
                                          </div>

                                          {/* Title Input with Inline Remove Button */}
                                          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem' }}>
                                            <GripVertical size={20} style={{ cursor: 'grab', color: '#cbd5e1', flexShrink: 0 }} />
                                            <input 
                                              value={box.title} 
                                              onChange={e => changeBoxField(originalIdx, 'title', e.target.value)} 
                                              placeholder="Card Title" 
                                              style={{ flex: 1, padding: '0.6rem 0.85rem', borderRadius: '0px', border: '1px solid rgba(32, 67, 131, 0.2)', fontSize: '0.95rem', outline: 'none', fontWeight: 900, background: '#f8fafc', color: '#204383' }} 
                                            />
                                            <button 
                                              type="button" 
                                              onClick={() => removeBox(originalIdx)} 
                                              style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: 'none', width: '36px', height: '36px', borderRadius: '0px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                                              title="Remove Card"
                                            >
                                              <Trash2 size={16} />
                                            </button>
                                          </div>

                                          {/* Items Bullet Points */}
                                          <div>
                                            <label style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 900, display: 'block', marginBottom: 6 }}>BULLET POINTS</label>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                              {(box.items || []).map((item: string, itemIdx: number) => (
                                                <div key={itemIdx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                                  <span style={{ color: '#204383', fontWeight: 900 }}>&bull;</span>
                                                  <input 
                                                    value={item} 
                                                    onChange={e => changeItemInBox(originalIdx, itemIdx, e.target.value)} 
                                                    placeholder="Description bullet point" 
                                                    style={{ flex: 1, padding: '0.4rem 0.6rem', borderRadius: '0px', border: '1px solid rgba(32, 67, 131, 0.15)', fontSize: '0.85rem', outline: 'none', background: '#f8fafc', color: '#204383' }} 
                                                  />
                                                  <button 
                                                    type="button" 
                                                    onClick={() => removeItemFromBox(originalIdx, itemIdx)} 
                                                    style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: 'none', borderRadius: 0, width: 26, height: 26, cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                  >
                                                    &times;
                                                  </button>
                                                </div>
                                              ))}
                                              <button 
                                                type="button" 
                                                onClick={() => addItemToBox(originalIdx)} 
                                                style={{ border: '1px dashed rgba(32, 67, 131, 0.4)', color: '#204383', background: 'transparent', padding: '0.35rem 0.75rem', borderRadius: 0, cursor: 'pointer', fontSize: '0.75rem', fontWeight: 900, width: 'fit-content', marginTop: 4 }}
                                              >
                                                + Add Bullet Point
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        ) : (
                          // Flat Mode (No categories)
                          <div>
                            {serviceFormBoxes.length === 0 ? (
                              <div style={{ textAlign: 'center', padding: '3rem', background: '#f8fafc', borderRadius: 12, border: '1px dashed #cbd5e1', color: '#64748b' }}>
                                No cards found. Click "Add Card" above to add one.
                              </div>
                            ) : (
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                                {serviceFormBoxes.map((box, boxIdx) => (
                                  <div 
                                    key={boxIdx} 
                                    draggable={true}
                                    onDragStart={(e) => {
                                      setDraggedCardIndex(boxIdx);
                                      e.dataTransfer.effectAllowed = "move";
                                    }}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDragEnd={() => setDraggedCardIndex(null)}
                                    onDrop={(e) => {
                                      e.preventDefault();
                                      handleReorderCards(draggedCardIndex, boxIdx);
                                    }}
                                    style={{ 
                                      background: '#ffffff', 
                                      border: draggedCardIndex === boxIdx ? '2px dashed #99cdb3' : '1px solid rgba(32, 67, 131, 0.2)', 
                                      opacity: draggedCardIndex === boxIdx ? 0.6 : 1,
                                      borderRadius: '0px', 
                                      padding: '1.5rem', 
                                      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                                      display: 'flex',
                                      flexDirection: 'column',
                                      justifyContent: 'space-between',
                                      minHeight: '260px',
                                      cursor: 'grab'
                                    }}
                                  >
                                    <div>
                                      {/* Title Input with Inline Remove Button */}
                                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem' }}>
                                        <GripVertical size={20} style={{ cursor: 'grab', color: '#cbd5e1', flexShrink: 0 }} />
                                        <input 
                                          value={box.title} 
                                          onChange={e => changeBoxField(boxIdx, 'title', e.target.value)} 
                                          placeholder="Card Title" 
                                          style={{ flex: 1, padding: '0.6rem 0.85rem', borderRadius: '0px', border: '1px solid rgba(32, 67, 131, 0.2)', fontSize: '0.95rem', outline: 'none', fontWeight: 900, background: '#f8fafc', color: '#204383' }} 
                                        />
                                        <button 
                                          type="button" 
                                          onClick={() => removeBox(boxIdx)} 
                                          style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: 'none', width: '36px', height: '36px', borderRadius: '0px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                                          title="Remove Card"
                                        >
                                          <Trash2 size={16} />
                                        </button>
                                      </div>

                                      {/* Items Bullet Points */}
                                      <div>
                                        <label style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 900, display: 'block', marginBottom: 6 }}>BULLET POINTS</label>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                          {(box.items || []).map((item: string, itemIdx: number) => (
                                            <div key={itemIdx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                              <span style={{ color: '#204383', fontWeight: 900 }}>&bull;</span>
                                              <input 
                                                value={item} 
                                                onChange={e => changeItemInBox(boxIdx, itemIdx, e.target.value)} 
                                                placeholder="Description bullet point" 
                                                style={{ flex: 1, padding: '0.4rem 0.6rem', borderRadius: '0px', border: '1px solid rgba(32, 67, 131, 0.15)', fontSize: '0.85rem', outline: 'none', background: '#f8fafc', color: '#204383' }} 
                                              />
                                              <button 
                                                type="button" 
                                                onClick={() => removeItemFromBox(boxIdx, itemIdx)} 
                                                style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: 'none', borderRadius: 0, width: 26, height: 26, cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                              >
                                                &times;
                                              </button>
                                            </div>
                                          ))}
                                          <button 
                                            type="button" 
                                            onClick={() => addItemToBox(boxIdx)} 
                                            style={{ border: '1px dashed rgba(32, 67, 131, 0.4)', color: '#204383', background: 'transparent', padding: '0.35rem 0.75rem', borderRadius: 0, cursor: 'pointer', fontSize: '0.75rem', fontWeight: 900, width: 'fit-content', marginTop: 4 }}
                                          >
                                            + Add Bullet Point
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

            </section>
          </div>
        )}
      </main>

      {/* Representative Modal */}
      {isRepModalOpen && (
        <div className="bfc-modal-overlay" onClick={() => setIsRepModalOpen(false)}>
          <div className="bfc-id-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '620px', width: '95%', padding: '2rem', background: '#fff', borderRadius: '20px', maxHeight: '92vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ color: '#204383', margin: 0 }}><Globe size={20} /> {editingRepId ? 'Edit Representative' : 'Add Representative'}</h2>
              <button className="bfc-id-close" style={{ position: 'static', background: 'transparent' }} onClick={() => setIsRepModalOpen(false)}><X size={18} /></button>
            </div>
            
            <form onSubmit={handleSaveRepresentative} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              {/* --- STEP 1: Representative Details --- */}
              <div style={{ display: repFormStep === 1 ? 'flex' : 'none', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: '#204383', fontSize: '1.2rem' }}>Step 1: Representative Details</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="bfc-field">
                  <label>TITLE</label>
                  <input value={repForm.title} onChange={e => setRepForm({...repForm, title: e.target.value})} placeholder="e.g. BFC Congo" required />
                </div>
                <div className="bfc-field">
                  <label>SLUG</label>
                  <input value={repForm.slug} onChange={e => setRepForm({...repForm, slug: e.target.value.toLowerCase()})} placeholder="e.g. congo" required />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="bfc-field">
                  <label>SUBTITLE</label>
                  <input value={repForm.subtitle} onChange={e => setRepForm({...repForm, subtitle: e.target.value})} placeholder="Subtitle" />
                </div>
                <div className="bfc-field">
                  <label>CREATION YEAR</label>
                  <input type="number" value={repForm.creationYear || ''} onChange={e => setRepForm({...repForm, creationYear: parseInt(e.target.value)})} placeholder="e.g. 2022" />
                </div>
              </div>
              <div className="bfc-field">
                <label>DESCRIPTION</label>
                <textarea value={repForm.description} onChange={e => setRepForm({...repForm, description: e.target.value})} rows={3} />
              </div>
              <div className="bfc-field">
                <label>LOCATION</label>
                <input value={repForm.location} onChange={e => setRepForm({...repForm, location: e.target.value})} placeholder="e.g. Brazzaville, Republic of Congo" />
              </div>

              {/* Branch Manager */}
              <h4 style={{ color: '#204383', margin: '0.5rem 0 0 0' }}>Branch Manager Info</h4>
              <div className="bfc-field">
                <label>MANAGER</label>
                <select
                  value={repForm.manager?.id || ''}
                  onChange={e => {
                    const tmId = e.target.value ? parseInt(e.target.value) : null;
                    const selectedManager = teamMembers.find(m => m.id === tmId) || null;
                    setRepForm({...repForm, manager: selectedManager});
                  }}
                >
                  <option value="">-- Select Manager --</option>
                  {teamMembers.map(m => (
                    <option key={m.id} value={m.id}>{m.name} ({m.role})</option>
                  ))}
                </select>
                {/* Typing control when no manager is selected */}
                {!repForm.manager?.id && (
                  <input
                    style={{ marginTop: '0.5rem' }}
                    value={(repForm as any)._managerFreeText || repForm.manager?.name || ''}
                    onChange={e => setRepForm({...repForm, manager: { name: e.target.value, role: '', img: '' } as any, _managerFreeText: e.target.value } as any)}
                    placeholder="Or type manager name manually..."
                  />
                )}
              </div>

              {/* Interactive Globe Picker */}
              <h4 style={{ color: '#204383', margin: '0.5rem 0 0 0' }}>Globe Position</h4>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.75rem' }}>
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>CLICK ON THE MAP TO PLACE THE MARKER</p>
                <div
                  style={{ position: 'relative', width: '100%', cursor: 'crosshair', userSelect: 'none', borderRadius: '8px', overflow: 'hidden', border: '2px solid #e2e8f0' }}
                  onClick={e => {
                    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const leftPct = (x / rect.width) * 100;
                    const topPct = Math.round((y / rect.height) * 100);
                    
                    // Math to perfectly map a flat 2D coordinate to our 3D CSS globe.
                    // The CSS globe uses a background-size of 200% 100%. 
                    // To ensure the marker aligns with the country, the relationship is: (MarkerLeft + MapX) / 2 = FlatLeft
                    // We constrain MarkerLeft to stay near the center of the visual globe (35% to 65%)
                    const markerLeft = Math.max(35, Math.min(65, leftPct));
                    const mapX = (2 * leftPct) - markerLeft;
                    
                    // RotateY is purely visual for the 3D grid lines, it doesn't affect the map alignment
                    const rotateY = Math.round(180 - (markerLeft - 50) * 2);

                    setRepForm({
                      ...repForm,
                      globeMarkerTop: `${Math.min(100, topPct + 4)}%`,
                      globeMarkerLeft: `${Math.round(markerLeft)}%`,
                      globeViewRotateY: `${rotateY}deg`,
                      globeViewMapX: `${Math.round(mapX)}%`,
                    });
                  }}
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg"
                    alt="World Map"
                    style={{ width: '100%', height: 'auto', display: 'block', filter: 'sepia(0.3) hue-rotate(130deg) saturate(2) brightness(0.85)', background: 'rgba(32,67,131,0.12)' }}
                    draggable={false}
                  />
                  {/* Marker dot */}
                  {repForm.globeMarkerTop && repForm.globeMarkerLeft && (
                    <div style={{
                      position: 'absolute',
                      top: (() => {
                        const topVal = parseFloat(repForm.globeMarkerTop || '0');
                        return isNaN(topVal) ? repForm.globeMarkerTop : `${topVal - 4}%`;
                      })(),
                      left: (() => {
                        const markerLeft = parseFloat(repForm.globeMarkerLeft || '0');
                        const mapX = parseFloat(repForm.globeViewMapX || '0');
                        if (isNaN(markerLeft) || isNaN(mapX) || !repForm.globeViewMapX) {
                          return repForm.globeMarkerLeft;
                        }
                        return `${(markerLeft + mapX) / 2}%`;
                      })(),
                      transform: 'translate(-50%, -50%)',
                      width: 14,
                      height: 14,
                      background: '#ff4242',
                      border: '2.5px solid #fff',
                      borderRadius: '50%',
                      boxShadow: '0 0 0 4px rgba(255,66,66,0.3)',
                      pointerEvents: 'none',
                    }} />
                  )}
                </div>
                {/* Coordinate readout */}
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.75rem', color: '#475569', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '3px 8px' }}>Top: <b>{repForm.globeMarkerTop || '—'}</b></span>
                  <span style={{ fontSize: '0.75rem', color: '#475569', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '3px 8px' }}>Left: <b>{repForm.globeMarkerLeft || '—'}</b></span>
                  <span style={{ fontSize: '0.75rem', color: '#475569', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '3px 8px' }}>RotateY: <b>{repForm.globeViewRotateY || '—'}</b></span>
                  <span style={{ fontSize: '0.75rem', color: '#475569', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '3px 8px' }}>MapX: <b>{repForm.globeViewMapX || '—'}</b></span>
                </div>
              </div>

              {/* Images */}
              <h4 style={{ color: '#204383', margin: '0.5rem 0 0 0' }}>Images</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="bfc-field">
                  <label>FLAG ICON URL</label>
                  <input value={repForm.flagIconUrl || ''} onChange={e => setRepForm({...repForm, flagIconUrl: e.target.value})} placeholder="https://flagcdn.com/w80/cg.png" />
                  <input type="file" accept="image/*" onChange={e => setRepFormLogoFile(e.target.files?.[0] || null)} style={{ marginTop: '0.5rem' }} />
                  {(repForm.flagIconUrl || repFormLogoFile) && (
                    <img
                      src={repFormLogoFile ? URL.createObjectURL(repFormLogoFile) : (repForm.flagIconUrl?.startsWith('/') ? `${API_URL}${repForm.flagIconUrl}` : repForm.flagIconUrl)}
                      alt="Flag preview"
                      style={{ marginTop: '0.5rem', height: 28, width: 'auto', borderRadius: 3, border: '1px solid #e2e8f0' }}
                    />
                  )}
                </div>
                <div className="bfc-field">
                  <label>OFFICE PHOTO (BFC LOGO)</label>
                  <input value={repForm.imageUrl || ''} onChange={e => setRepForm({...repForm, imageUrl: e.target.value})} placeholder="/uploads/offices/bfc_congo.png" />
                  <input type="file" accept="image/*" onChange={e => setRepFormPhotoFile(e.target.files?.[0] || null)} style={{ marginTop: '0.5rem' }} />
                  {(repForm.imageUrl || repFormPhotoFile) && (
                    <img
                      src={repFormPhotoFile ? URL.createObjectURL(repFormPhotoFile) : (repForm.imageUrl?.startsWith('/') ? `${API_URL}${repForm.imageUrl}` : repForm.imageUrl)}
                      alt="Office photo preview"
                      style={{ marginTop: '0.5rem', height: 48, width: 'auto', maxWidth: '100%', objectFit: 'contain', border: '1px solid #e2e8f0', borderRadius: 4, background: '#f8fafc' }}
                    />
                  )}
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                  <button type="button" onClick={() => setIsRepModalOpen(false)} style={{ padding: '0.5rem 1rem', background: '#e2e8f0', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                  {editingRepId ? (
                    <button type="submit" style={{ padding: '0.5rem 1rem', background: '#204383', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Save</button>
                  ) : (
                    <button type="button" onClick={() => {
                      if (!repForm.title || !repForm.slug) {
                        alert('Title and Slug are required before proceeding.');
                        return;
                      }
                      setRepFormStep(2);
                    }} style={{ padding: '0.5rem 1rem', background: '#204383', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Next</button>
                  )}
                </div>
              </div>
              
              {/* --- STEP 2: History Event Auto-Creation --- */}
              {!editingRepId && (
                <div style={{ display: repFormStep === 2 ? 'flex' : 'none', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', color: '#204383', fontSize: '1.2rem' }}>
                      Step 2: History Event Auto-Creation (Required)
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                      Every new branch requires a milestone entry on the History Wheel. Please fill out the details below.
                    </p>
                    
                    <div className="bfc-field">
                      <label style={{ color: '#204383' }}>HISTORY PARAGRAPH *</label>
                      <textarea required value={(repForm as any).historyParagraph || ''} onChange={e => setRepForm({...repForm, historyParagraph: e.target.value} as any)} rows={3} placeholder="e.g. BFC Congo is officially established to provide..." />
                    </div>

                    <div className="bfc-field">
                      <label style={{ color: '#204383' }}>WHEEL BACKGROUND COLOR</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <input type="color" value={(repForm as any).historyBgColor || '#204383'} onChange={e => setRepForm({...repForm, historyBgColor: e.target.value} as any)} style={{ width: '50px', height: '40px', padding: '0', border: 'none', borderRadius: '8px', cursor: 'pointer' }} />
                        <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Choose the background color for this milestone on the history timeline.</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                    <button type="button" onClick={() => setRepFormStep(1)} style={{ padding: '0.5rem 1rem', background: '#e2e8f0', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Back</button>
                    <button type="submit" style={{ padding: '0.5rem 1rem', background: '#204383', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Save</button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}


      {/* Modal - Identity Card Layout */}
      {isModalOpen && (
        <div className="bfc-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="bfc-id-modal bfc-id-modal-wide" onClick={e => e.stopPropagation()}>
            <button className="bfc-id-close" onClick={() => setIsModalOpen(false)}><X size={18} /></button>
            <div className="bfc-id-card-redesigned">
              {/* LEFT: Large Photo Panel */}
              <div className="bfc-id-photo-panel">
                <div className="bfc-id-photo-large">
                  {formImg ? (
                    <img src={getUploadUrl(formImg)} alt={formName || 'Preview'} />
                  ) : (
                    <div className="bfc-id-photo-empty">
                      <Upload size={40} />
                      <span>Photo</span>
                    </div>
                  )}
                </div>
                <label className="bfc-id-photo-upload-btn" style={{ position: 'relative' }}>
                  <Upload size={14} />
                  <span>{formImgFile ? formImgFile.name : 'Upload photo'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="bfc-id-file-input"
                    onChange={async e => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setFormImgFile(file);
                      setFormImgUploading(true);
                      setFormImgUploadError('');
                      try {
                        const fd = new FormData();
                        fd.append('file', file);
                        const res = await fetch(`${API_URL}/api/upload`, {
                          method: 'POST',
                          headers: { 'Authorization': `Bearer ${token}` },
                          body: fd
                        });
                        if (res.ok) {
                          const data = await res.json();
                          setFormImg(data.url);
                        } else {
                          setFormImgUploadError('Upload failed');
                        }
                      } catch (err) {
                        console.error('Upload failed:', err);
                        setFormImgUploadError('Upload failed: network error');
                      } finally {
                        setFormImgUploading(false);
                      }
                    }}
                  />
                </label>
                {formImgUploading && <span className="bfc-id-uploading-sm">Uploading...</span>}
                {formImgUploadError && <span className="bfc-id-error-sm">{formImgUploadError}</span>}
                {formImg && !formImgUploading && (
                  <button
                    type="button"
                    className="bfc-id-photo-remove"
                    onClick={() => { setFormImg(''); setFormImgFile(null); }}
                  >
                    <X size={12} /> Remove
                  </button>
                )}
                <div className="bfc-id-flags-preview">
                  {formCountryName && (() => {
                    const c = AVAILABLE_COUNTRIES.find(cc => cc.name === formCountryName);
                    return c ? <><img src={c.flag} alt="" className="bfc-id-flag" /><span>{c.name}</span></> : null;
                  })()}
                  {formExtraFlags.length > 0 && formExtraFlags.map((cName, i) => {
                    const c = AVAILABLE_COUNTRIES.find(cc => cc.name === cName);
                    return c ? <img key={i} src={c.flag} alt="" className="bfc-id-flag small" /> : null;
                  })}
                  {formExtraFlags.length >= 2 && <Globe size={16} className="bfc-id-globe-icon" />}
                </div>
              </div>

              {/* RIGHT: Fields Panel */}
              <div className="bfc-id-fields-panel">
                <div className="bfc-id-header">
                  <span className="bfc-id-badge">
                    <Fingerprint size={12} style={{ marginRight: 4 }} />
                    {formRoleType ? (ROLES.find(r => r.value === formRoleType)?.label ?? 'TEAM MEMBER') : 'TEAM MEMBER'}
                  </span>
                  <h3>{formName || 'Full Name'}</h3>
                  <p className="bfc-id-role-preview">
                    {buildRoleDisplay(formRoleType as RoleType | null | undefined, formCountryName || undefined) || 'Role / Position'}
                  </p>
                </div>

                <div className="bfc-id-fields">
                  {/* Name field */}
                  <div className="bfc-field">
                    <label><Fingerprint size={11} /> FULL NAME</label>
                    <input value={formName} onChange={e => setFormName(e.target.value)} placeholder="Full name" required />
                  </div>

                  {/* Role dropdown */}
                  <div className="bfc-field">
                    <label><Briefcase size={11} /> ROLE</label>
                    <select
                      value={formRoleType}
                      onChange={e => {
                        setFormRoleType(e.target.value);
                        setFormRole('');
                      }}
                      required
                    >
                      <option value="">-- Select role --</option>
                      {ROLES.map(r => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Email + Phone side by side */}
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <div className="bfc-field" style={{ flex: 1 }}>
                      <label><Mail size={11} /> EMAIL</label>
                      <input type="email" value={formEmail} onChange={e => setFormEmail(e.target.value)} placeholder="email@bfc.com.tn" />
                    </div>
                    <div className="bfc-field" style={{ flex: 1 }}>
                      <label><Phone size={11} /> PHONE</label>
                      <input value={formPhone} onChange={e => setFormPhone(e.target.value)} placeholder="+216 XX XXX XXX" />
                    </div>
                  </div>

                  {/* CV Upload */}
                  <div className="bfc-field">
                    <label><FileText size={11} /> CV DOCUMENT</label>
                    <div className="bfc-cv-upload-row">
                      <label className="bfc-cv-file-label" style={{ position: 'relative' }}>
                        <Upload size={14} />
                        <span>{formCvFile ? formCvFile.name : formCvUrl ? 'CV uploaded' : 'Upload PDF'}</span>
                        <input
                          type="file"
                          accept=".pdf,application/pdf"
                          className="bfc-id-file-input"
                          onChange={async e => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            setFormCvFile(file);
                            setFormCvUploading(true);
                            setFormCvUploadError('');
                            try {
                              const fd = new FormData();
                              fd.append('file', file);
                              const res = await fetch(`${API_URL}/api/upload`, {
                                method: 'POST',
                                headers: { 'Authorization': `Bearer ${token}` },
                                body: fd
                              });
                              if (res.ok) {
                                const data = await res.json();
                                setFormCvUrl(data.url);
                              } else {
                                setFormCvUploadError('Upload failed');
                              }
                            } catch (err) {
                              console.error('Upload failed:', err);
                              setFormCvUploadError('Upload failed: network error');
                            } finally {
                              setFormCvUploading(false);
                            }
                          }}
                        />
                      </label>
                      {formCvUploading && <span className="bfc-id-uploading-sm">Uploading...</span>}
                      {formCvUploadError && <span className="bfc-id-error-sm">{formCvUploadError}</span>}
                      {formCvUrl && !formCvUploading && (
                        <button
                          type="button"
                          className="bfc-cv-clear-btn"
                          onClick={() => { setFormCvUrl(null); setFormCvFile(null); }}
                          title="Remove CV"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Country Section */}
                  <div className="bfc-country-section">
                    <div className="bfc-country-section-header">
                      <MapPin size={16} />
                      Country Assignment
                    </div>
                    <div className="bfc-field">
                      <label><Globe size={11} /> PRIMARY COUNTRY</label>
                      <select
                        id="bfc-country-select"
                        value={formCountryName}
                        onChange={e => setFormCountryName(e.target.value)}
                      >
                        {AVAILABLE_COUNTRIES.map(c => (
                          <option key={c.code} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="bfc-field" style={{ marginTop: '0.5rem', flexDirection: 'row', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        id="bfc-show-primary-flag"
                        checked={formShowPrimaryFlag}
                        onChange={e => setFormShowPrimaryFlag(e.target.checked)}
                        style={{ width: 'auto', margin: 0 }}
                      />
                      <label htmlFor="bfc-show-primary-flag" style={{ opacity: 1, letterSpacing: '0.05em', cursor: 'pointer', userSelect: 'none' }}>
                        SHOW PRIMARY FLAG
                      </label>
                    </div>
                    <div className="bfc-field" style={{ marginTop: '0.5rem' }}>
                      <label><Globe size={11} /> ADDITIONAL COUNTRIES</label>
                      <div className="bfc-id-extra-flags">
                        {formExtraFlags.map((cName, i) => {
                          const c = AVAILABLE_COUNTRIES.find(cc => cc.name === cName);
                          return (
                            <span key={i} className="bfc-id-flag-tag">
                              {c && <img src={c.flag} alt="" />}
                              {cName}
                              <button type="button" onClick={() => setFormExtraFlags(prev => prev.filter((_, j) => j !== i))}>&times;</button>
                            </span>
                          );
                        })}
                      </div>
                      <select
                        value=""
                        onChange={e => {
                          if (e.target.value && !formExtraFlags.includes(e.target.value)) {
                            setFormExtraFlags(prev => [...prev, e.target.value]);
                          }
                          e.target.value = '';
                        }}
                      >
                        <option value="">+ Add country</option>
                        {AVAILABLE_COUNTRIES.filter(c => c.name !== formCountryName && !formExtraFlags.includes(c.name)).map(c => (
                          <option key={c.code} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bfc-id-footer">
                  <button
                    type="button"
                    className="bfc-btn-outline"
                    onClick={() => setIsModalOpen(false)}
                  >
                    CANCEL
                  </button>
                  <button
                    type="button"
                    className="bfc-btn-navy"
                    onClick={handleSaveMember as any}
                    disabled={!formName || !formRoleType}
                  >
                    {editingId ? 'UPDATE' : 'SAVE'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog Modal */}
      {confirmDialog.isOpen && (
        <div className="bfc-modal-overlay" onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))} style={{ zIndex: 9999 }}>
          <div className="bfc-id-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px', padding: '1.5rem', textAlign: 'center', background: '#fff', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h3 style={{ color: '#204383', marginTop: 0, marginBottom: '0.5rem', fontSize: '1.2rem', fontWeight: 800 }}>{confirmDialog.title}</h3>
            <p style={{ color: '#6b7280', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>{confirmDialog.message}</p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', width: '100%' }}>
              {!confirmDialog.isAlert && (
                <button 
                  onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
                  style={{ padding: '0.6rem 1.5rem', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#fff', color: '#4b5563', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', flex: 1 }}
                >
                  Cancel
                </button>
              )}
              <button 
                onClick={confirmDialog.onConfirm}
                style={{ padding: '0.6rem 1.5rem', borderRadius: '8px', border: 'none', background: confirmDialog.isAlert ? '#204383' : '#ef4444', color: '#fff', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', flex: 1 }}
              >
                {confirmDialog.isAlert ? 'OK' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History Event Modal */}
      {isHistoryModalOpen && (
        <div className="bfc-modal-overlay" onClick={() => setIsHistoryModalOpen(false)}>
          <div className="bfc-id-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px', width: '90%', padding: '2rem', background: '#fff', borderRadius: '20px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '2px solid rgba(32, 67, 131, 0.1)', paddingBottom: '1rem' }}>
              <h2 style={{ color: '#204383', fontSize: '1.5rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <History size={24} /> Add History Event
              </h2>
              <button className="bfc-id-close" style={{ position: 'static', background: 'rgba(0,0,0,0.05)', color: '#64748b' }} onClick={() => setIsHistoryModalOpen(false)}><X size={18} /></button>
            </div>
            
            <form onSubmit={handleSaveHistory} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="bfc-field">
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', marginBottom: '0.5rem', display: 'block' }}>YEAR</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <input 
                    type="number" 
                    value={historyFormYear} 
                    onChange={e => setHistoryFormYear(e.target.value)}
                    placeholder="e.g. 2023"
                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none' }}
                    required 
                  />
                  <input 
                    type="color" 
                    value={historyFormBgColor} 
                    onChange={e => setHistoryFormBgColor(e.target.value)}
                    title="Background Color"
                    style={{ width: '100%', height: '44px', padding: '0.2rem', borderRadius: '8px', border: '1px solid #e2e8f0', cursor: 'pointer' }}
                  />
                </div>
              </div>
              <div className="bfc-field">
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', marginBottom: '0.5rem', display: 'block' }}>COUNTRY FLAG</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <input 
                    type="text" 
                    value={historyFormFlagUrl}
                    onChange={e => setHistoryFormFlagUrl(e.target.value)}
                    placeholder="Flag URL (e.g. https://flagcdn.com/w80/tn.png)"
                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none' }}
                  />
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px dashed #cbd5e1', background: '#f8fafc', cursor: 'pointer', fontSize: '0.9rem', color: '#64748b', overflow: 'hidden' }}>
                    <Upload size={16} style={{ flexShrink: 0 }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                      {historyFormFlagFile ? historyFormFlagFile.name : 'Upload Flag...'}
                    </span>
                    <input 
                      type="file" accept="image/*" style={{ display: 'none' }}
                      onChange={e => { if(e.target.files?.[0]) setHistoryFormFlagFile(e.target.files[0]) }}
                    />
                  </label>
                  {(historyFormFlagUrl || historyFormFlagFile) && (
                    <img
                      src={historyFormFlagFile ? URL.createObjectURL(historyFormFlagFile) : (historyFormFlagUrl.startsWith('/') ? `${API_URL}${historyFormFlagUrl}` : historyFormFlagUrl)}
                      alt="Flag preview"
                      style={{ height: 28, width: 'auto', borderRadius: 3, border: '1px solid #e2e8f0', alignSelf: 'flex-start' }}
                    />
                  )}
                </div>
              </div>
              <div className="bfc-field">
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', marginBottom: '0.5rem', display: 'block' }}>TITLE</label>
                <input 
                  type="text" 
                  value={historyFormTitle} 
                  onChange={e => setHistoryFormTitle(e.target.value)}
                  placeholder="Event Title"
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none' }}
                  required 
                />
              </div>
              <div className="bfc-field">
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', marginBottom: '0.5rem', display: 'block' }}>DESCRIPTION / TEXT</label>
                <textarea 
                  value={historyFormDesc} 
                  onChange={e => setHistoryFormDesc(e.target.value)}
                  placeholder="What happened in this year?"
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '1rem', minHeight: '100px', resize: 'vertical', outline: 'none' }}
                  required 
                />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="bfc-field">
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', marginBottom: '0.5rem', display: 'block' }}>BRANCH PATH (for "See More")</label>
                  <input 
                    type="text" 
                    value={historyFormBranchLink} 
                    onChange={e => setHistoryFormBranchLink(e.target.value)}
                    placeholder="e.g. /representatives/congo"
                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none' }}
                  />
                </div>
                <div className="bfc-field">
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', marginBottom: '0.5rem', display: 'block' }}>COUNTRY MANAGER</label>
                  <select
                    value={historyFormManagerEmail}
                    onChange={e => setHistoryFormManagerEmail(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none' }}
                  >
                    <option value="">-- Select Manager --</option>
                    {teamMembers.map(m => (
                      <option key={m.id} value={m.email || ''}>{m.name} ({m.role})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="bfc-field" style={{ minWidth: 0 }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', marginBottom: '0.5rem', display: 'block' }}>LOGO (WHEEL)</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px dashed #cbd5e1', background: '#f8fafc', cursor: 'pointer', fontSize: '0.9rem', color: '#64748b', overflow: 'hidden' }}>
                    <Upload size={16} style={{ flexShrink: 0 }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                      {historyFormLogoFile ? historyFormLogoFile.name : (historyFormLogoUrl ? historyFormLogoUrl.split('/').pop() : 'Upload Logo...')}
                    </span>
                    <input 
                      type="file" accept="image/*" style={{ display: 'none' }}
                      onChange={e => { if(e.target.files?.[0]) setHistoryFormLogoFile(e.target.files[0]) }}
                    />
                  </label>
                  {(historyFormLogoUrl || historyFormLogoFile) && (
                    <img
                      src={historyFormLogoFile ? URL.createObjectURL(historyFormLogoFile) : (historyFormLogoUrl.startsWith('/') ? `${API_URL}${historyFormLogoUrl}` : historyFormLogoUrl)}
                      alt="Logo preview"
                      style={{ marginTop: '0.5rem', height: 48, width: 'auto', maxWidth: '100%', objectFit: 'contain', border: '1px solid #e2e8f0', borderRadius: 4, background: '#f8fafc' }}
                    />
                  )}
                </div>
                <div className="bfc-field" style={{ minWidth: 0 }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', marginBottom: '0.5rem', display: 'block' }}>EVENT PHOTO</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px dashed #cbd5e1', background: '#f8fafc', cursor: 'pointer', fontSize: '0.9rem', color: '#64748b', overflow: 'hidden' }}>
                    <Upload size={16} style={{ flexShrink: 0 }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                      {historyFormPhotoFile ? historyFormPhotoFile.name : (historyFormPhotoUrl ? historyFormPhotoUrl.split('/').pop() : 'Upload Photo...')}
                    </span>
                    <input 
                      type="file" accept="image/*" style={{ display: 'none' }}
                      onChange={e => { if(e.target.files?.[0]) setHistoryFormPhotoFile(e.target.files[0]) }}
                    />
                  </label>
                  {(historyFormPhotoUrl || historyFormPhotoFile) && (
                    <img
                      src={historyFormPhotoFile ? URL.createObjectURL(historyFormPhotoFile) : (historyFormPhotoUrl.startsWith('/') ? `${API_URL}${historyFormPhotoUrl}` : historyFormPhotoUrl)}
                      alt="Photo preview"
                      style={{ marginTop: '0.5rem', height: 48, width: 'auto', maxWidth: '100%', objectFit: 'contain', border: '1px solid #e2e8f0', borderRadius: 4, background: '#f8fafc' }}
                    />
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsHistoryModalOpen(false)} style={{ flex: 1, padding: '0.875rem', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', fontWeight: 700, cursor: 'pointer' }}>CANCEL</button>
                <button type="submit" disabled={!historyFormTitle || !historyFormYear || !historyFormDesc} style={{ flex: 1, padding: '0.875rem', borderRadius: '8px', border: 'none', background: (!historyFormTitle || !historyFormYear || !historyFormDesc) ? '#94a3b8' : '#204383', color: '#fff', fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s' }}>{editingHistoryId ? 'UPDATE EVENT' : 'SAVE EVENT'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Service Modal */}
      {isServiceModalOpen && (
        <div className="bfc-modal-overlay" onClick={() => setIsServiceModalOpen(false)}>
          <div className="bfc-id-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px', width: '95%', padding: '2rem', background: '#fff', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '2px solid rgba(32,67,131,0.1)', paddingBottom: '1rem' }}>
              <h2 style={{ color: '#204383', margin: 0, fontSize: '1.4rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MessageSquare size={24} /> {editingServiceId ? 'Edit Service Type' : 'Add Service Type'}
              </h2>
              <button className="bfc-id-close" style={{ position: 'static', background: 'transparent' }} onClick={() => setIsServiceModalOpen(false)}><X size={18} /></button>
            </div>
            
            <form onSubmit={handleSaveService} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="bfc-field">
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#204383', marginBottom: 4 }}>SERVICE TYPE TITLE</label>
                <input 
                  value={serviceFormTitle} 
                  onChange={e => {
                    setServiceFormTitle(e.target.value);
                    setServiceFormSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                  }} 
                  placeholder="e.g. Tax & Legal, Academy..." 
                  required 
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none' }} 
                />
              </div>
              
              <div className="bfc-field">
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#204383', marginBottom: 4 }}>DESCRIPTION</label>
                <textarea 
                  value={serviceFormDescription} 
                  onChange={e => setServiceFormDescription(e.target.value)} 
                  placeholder="Describe this service type..." 
                  rows={4} 
                  required
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none', resize: 'vertical' }} 
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsServiceModalOpen(false)} style={{ flex: 1, padding: '0.875rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', color: '#64748b', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '0.875rem', borderRadius: '8px', border: 'none', background: '#204383', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};