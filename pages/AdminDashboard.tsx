import React, { useState } from 'react';
import { 
  FileText, 
  Award, 
  History, 
  Users, 
  MessageSquare, 
  UserCheck, 
  Briefcase, 
  LogOut, 
  Plus,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

type Tab = 'overview' | 'certif' | 'articles' | 'history' | 'team members' | 'contact' | 'candidat' | 'projects';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  const menuCards: { id: Tab; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: 'certif', label: 'Certifications', icon: <Award size={32} />, desc: 'Manage company certifications and awards' },
    { id: 'articles', label: 'Articles', icon: <FileText size={32} />, desc: 'Publish and edit insights & news' },
    { id: 'history', label: 'History', icon: <History size={32} />, desc: 'Update company milestones & timeline' },
    { id: 'team members', label: 'Team Members', icon: <Users size={32} />, desc: 'Manage directory of representatives' },
    { id: 'contact', label: 'Contact Messages', icon: <MessageSquare size={32} />, desc: 'View inquiries from clients' },
    { id: 'candidat', label: 'Candidates', icon: <UserCheck size={32} />, desc: 'Review job applications and CVs' },
    { id: 'projects', label: 'Projects', icon: <Briefcase size={32} />, desc: 'Showcase portfolio and references' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="admin-menu-grid">
            {menuCards.map(card => (
              <button key={card.id} className="admin-menu-card" onClick={() => setActiveTab(card.id)}>
                <div className="admin-menu-card-icon">{card.icon}</div>
                <h3>{card.label}</h3>
                <p>{card.desc}</p>
              </button>
            ))}
          </div>
        );
      case 'certif':
        return <DummyTable title="Certifications" columns={['ID', 'Name', 'Organization', 'Date']} />;
      case 'articles':
        return <DummyTable title="Articles" columns={['ID', 'Title', 'Author', 'Published Date']} />;
      case 'history':
        return <DummyTable title="Company History" columns={['Year', 'Milestone', 'Description']} />;
      case 'team members':
        return <DummyTable title="Team Members" columns={['Name', 'Role', 'Department', 'Email']} />;
      case 'contact':
        return <DummyTable title="Contact Messages" columns={['Date', 'Name', 'Email', 'Subject']} hideAddBtn />;
      case 'candidat':
        return <DummyTable title="Job Candidates" columns={['Date', 'Candidate Name', 'Position', 'Status']} hideAddBtn />;
      case 'projects':
        return <DummyTable title="Projects" columns={['ID', 'Project Name', 'Client', 'Status']} />;
      default:
        return <div>Select a module</div>;
    }
  };

  return (
    <div className="admin-layout-topbar">
      <header className="admin-header-main">
        <div className="admin-logo-container-top">
          <h2>BFC<span>.</span>Admin</h2>
        </div>
        <div className="admin-header-actions">
          {activeTab !== 'overview' && (
            <button className="admin-btn-outline" onClick={() => setActiveTab('overview')}>
              <ArrowLeft size={16} /> Back to Hub
            </button>
          )}
          <button className="admin-logout-btn" onClick={handleLogout}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      <main className="admin-main-content">
        {activeTab === 'overview' && (
          <div className="admin-hub-header">
            <h1>Administration Hub</h1>
            <p>Select a module below to manage your website content.</p>
          </div>
        )}
        <section className="admin-content-area">
          {renderContent()}
        </section>
      </main>
    </div>
  );
};

interface DummyTableProps {
  title: string;
  columns: string[];
  hideAddBtn?: boolean;
}

const DummyTable: React.FC<DummyTableProps> = ({ title, columns, hideAddBtn }) => {
  return (
    <div className="admin-card-table">
      <div className="admin-card-header">
        <h3>{title}</h3>
        {!hideAddBtn && (
          <button className="admin-btn-primary">
            <Plus size={18} /> Add New
          </button>
        )}
      </div>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              {columns.map((col, index) => (
                <th key={index}>{col}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {columns.map((_, index) => (
                <td key={index}>Sample Data {index + 1}</td>
              ))}
              <td>
                <div className="admin-action-links">
                  <span className="admin-link-edit">Edit</span>
                  <span className="admin-link-delete">Delete</span>
                </div>
              </td>
            </tr>
            <tr>
              {columns.map((_, index) => (
                <td key={index}>Sample Data {index + 1}</td>
              ))}
              <td>
                <div className="admin-action-links">
                  <span className="admin-link-edit">Edit</span>
                  <span className="admin-link-delete">Delete</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
