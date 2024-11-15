// Sidebar.jsx
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHouse, 
  faSignOut,
  faChevronLeft,
  faChevronRight, 
  faMessage,
  faMoneyBill,
  faWallet,
} from '@fortawesome/free-solid-svg-icons';
import { Sun, Moon } from 'lucide-react';
import { useState, useRef, useEffect, useContext } from 'react';
import { useWalletContext } from '../../context/WalletContext';
import './SideBar.css';
import ThemeContext from '../../context/ThemeContext';

const Sidebar = () => {
  const { disconnectWallet } = useWalletContext();
  const { selectedTheme, handleThemeToggle } = useContext(ThemeContext);
  const [isExpanded, setIsExpanded] = useState(true);
  const sidebarRef = useRef(null);
  const location = useLocation();
  const [isChecked, setIsChecked] = useState(false);

  /**
   * Changing the checked boolean of the toggle button on click. Also subscribes all onchange method from caller
   */
  function handleToggle() {
    const newChecked = !isChecked;
    setIsChecked(newChecked);
    handleThemeToggle(isChecked);
  }


  const navigationItems = [
    { icon: faHouse, title: "Home", path: "/myhouse" },
    { icon: faWallet, title: "Wallet", path: "/wallet" },
    { icon: faMoneyBill, title: "Jobs", path: "/myjobs" },
    { icon: faMessage, title : "Chat", path: "/chat"},
  ];

  const toggleSidebar = (e) => {
    e.stopPropagation(); // Prevent event from bubbling
    setIsExpanded(!isExpanded);
  };

  

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Only close sidebar on outside click if on mobile
      if (window.innerWidth < 768 && 
          sidebarRef.current && 
          !sidebarRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <aside 
      ref={sidebarRef}
      className={`sidebar-container ${isExpanded ? 'expanded' : 'collapsed'}`}
      role="navigation"
      aria-label="Main Navigation"
    >
      <div className="sidebar-content">
        {/* Header Section */}
        <div className="sidebar-header">
          <div className="logo-container">
            <span className={`logo-text ${!isExpanded ? 'hidden' : ''}`}>
              Taskmate
            </span>
          </div>
          <button 
            onClick={toggleSidebar}
            className="toggle-button"
            aria-label={isExpanded ? 'Collapse Sidebar' : 'Expand Sidebar'}
          >
            <FontAwesomeIcon 
              icon={isExpanded ? faChevronLeft : faChevronRight} 
            />
          </button>
        </div>

        {/* Navigation Section */}
        <nav className="sidebar-nav">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              title={!isExpanded ? item.title : ''}
            >
              <FontAwesomeIcon icon={item.icon} className="nav-icon" />
              <span className={`nav-text ${!isExpanded ? 'hidden' : ''}`}>
                {item.title}
              </span>
            </Link>
          ))}
        </nav>

        {/* Footer Section */}
        <div className="sidebar-footer">
          <button 
              className="theme-toggle"
              onClick={handleToggle}
              aria-label={`Switch to ${selectedTheme === 'light' ? 'dark' : 'light'} mode`}
            >
              {selectedTheme === 'light' ? <Moon /> : <Sun />}
            </button>
          <button 
            onClick={disconnectWallet}
            className="logout-button"
            title={!isExpanded ? 'Logout' : ''}
          >
            <FontAwesomeIcon icon={faSignOut} className="nav-icon" />
            <span className={`nav-text ${!isExpanded ? 'hidden' : ''}`}>
              Logout
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;