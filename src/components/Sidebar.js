import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { supabase } from "../lib/supabaseClient";


import {
  faHouseChimneyWindow,
  faDumbbell,
  faPersonRunning,
  faTrophy,
  faHeartPulse
} from '@fortawesome/free-solid-svg-icons';


function Sidebar() {
  return (
    <aside className="Sidebar">
      <div className="nav-item-row">
      <h3>RealFit</h3>
      <button className="logout-button"
        onClick={async () => {
          const { error } = await supabase.auth.signOut();
          if (error) {
            alert(error.message);
          }
        }}
      >
        Log out
      </button>
      </div>


      <nav className="sidebar-nav">

        <NavLink to="/home" className="sidebar-link">
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
