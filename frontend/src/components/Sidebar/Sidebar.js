import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="user-info">
        <img className="user-avatar" src="https://pbs.twimg.com/profile_images/1814064924257071104/fBZdi0oJ_400x400.jpg" alt="User Avatar" />
        <h3>Cat McGee</h3>
        <p>catmcgee.eth</p>
      </div>
      <nav className="sidebar-nav">
        <Link to="/seller-dashboard" className="nav-item">Dashboard</Link>
        <Link to="/community" className="nav-item">Chat</Link>
        <Link to="/connect-data" className="nav-item">Manage</Link>
      </nav>
    </aside>
  );
}

export default Sidebar;
