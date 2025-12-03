import React from 'react';
import {
  LayoutDashboard,
  Users,
  Vote,
  MessageSquare,
  FileText,
  FolderOpen,
  X,
  Menu
} from 'lucide-react';
import styles from '../styles/adminSidebar.module.css';

export type AdminSection = 'dashboard' | 'students' | 'polling' | 'messages' | 'minutes' | 'documents';

interface AdminSidebarProps {
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
  isOpen: boolean;
  onToggle: () => void;
}

interface MenuItem {
  id: AdminSection;
  label: string;
  icon: React.ReactNode;
}

const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'students', label: 'Students', icon: <Users size={20} /> },
  { id: 'polling', label: 'Polling', icon: <Vote size={20} /> },
  { id: 'messages', label: 'Messages', icon: <MessageSquare size={20} /> },
  { id: 'minutes', label: 'Minutes', icon: <FileText size={20} /> },
  { id: 'documents', label: 'Documents', icon: <FolderOpen size={20} /> },
];

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeSection,
  onSectionChange,
  isOpen,
  onToggle
}) => {
  const handleItemClick = (section: AdminSection) => {
    onSectionChange(section);
    // Close sidebar on mobile after selection
    if (window.innerWidth < 768) {
      onToggle();
    }
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button className={styles.mobileToggle} onClick={onToggle}>
        <Menu size={24} />
      </button>

      {/* Overlay for mobile */}
      {isOpen && <div className={styles.overlay} onClick={onToggle} />}

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sidebarTitle}>Admin Panel</h2>
          <button className={styles.closeButton} onClick={onToggle}>
            <X size={20} />
          </button>
        </div>

        <nav className={styles.nav}>
          <ul className={styles.menuList}>
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  className={`${styles.menuItem} ${activeSection === item.id ? styles.active : ''}`}
                  onClick={() => handleItemClick(item.id)}
                >
                  <span className={styles.menuIcon}>{item.icon}</span>
                  <span className={styles.menuLabel}>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default AdminSidebar;
