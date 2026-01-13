import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { supabase } from "../lib/supabaseClient";

import {
  faHouseChimneyWindow,
  faDumbbell,
  faPersonRunning,
  faTrophy,
  faHeartPulse,
} from "@fortawesome/free-solid-svg-icons";

function Sidebar({ open, onClose }) {
  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) alert(error.message);
    onClose?.();
  }

  function closeIfMobile() {
    onClose?.();
  }

  return (
    <aside className={open ? "Sidebar Sidebar--open" : "Sidebar"}>
      <div className="nav-item-row">
        <h3>Navigate</h3>

        <div className="sidebar-top-actions">
          <button className="logout-button" type="button" onClick={handleLogout}>
            Log out
          </button>

          <button className="sidebar-close" type="button" onClick={onClose} aria-label="Close menu">
            ✕
          </button>
        </div>
      </div>

      <nav className="sidebar-nav" onClick={closeIfMobile}>
        <NavLink to="/" className="sidebar-link">
          <FontAwesomeIcon icon={faHouseChimneyWindow} className="sidebar-icon home-icon" />
          <span>Home</span>
        </NavLink>

        <NavLink to="/add-workout" className="sidebar-link">
          <FontAwesomeIcon icon={faDumbbell} className="sidebar-icon add-workout-icon" />
          <span>Workout Log</span>
        </NavLink>

        <NavLink to="/exercises" className="sidebar-link">
          <FontAwesomeIcon icon={faPersonRunning} className="sidebar-icon exercises-icon" />
          <span>Exercise Guide</span>
        </NavLink>

        <NavLink to="/goals" className="sidebar-link">
          <FontAwesomeIcon icon={faTrophy} className="sidebar-icon goals-icon" />
          <span>Goals</span>
        </NavLink>

        <NavLink to="/health-stats" className="sidebar-link">
          <FontAwesomeIcon icon={faHeartPulse} className="sidebar-icon health-stats-icon" />
          <span>Health</span>
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;
