import React from 'react';
import './Navbar.scss';

const Navbar = ({ activeView, onViewChange }) => {
  const views = [
    { id: 'calendar', label: 'Kalenderansicht' },
    { id: 'projects', label: 'Projektansicht' },
    { id: 'forecast', label: 'Prognosetage' },
    { id: 'income', label: 'Einkommensübersicht' },
    { id: 'social', label: 'Sozialleistungen' },
    { id: 'vgwort', label: 'VG Wort' },
  ];

  return (
    <nav className="navbar">
      <ul>
        {views.map((view) => (
          <li 
            key={view.id}
            className={activeView === view.id ? 'active' : ''}
            onClick={() => onViewChange(view.id)}
          >
            {view.label}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;