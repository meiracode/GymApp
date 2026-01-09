import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  faPeoplePulling,
  faPersonHarassing,
  faPersonRunning
} from '@fortawesome/free-solid-svg-icons';

function Exercises() {
  return (
    <div>
      <h1>Exercises</h1>
      <p>It is important to know the functions of each muscle group. Here, we recommend some of 
        the most optimal compound and isolation movements. Use a combination of both to maximize your results.</p>
        <nav>
          <div className="Push">
            
            <NavLink to="/push" className="exercise-link">
              <FontAwesomeIcon icon={faPersonHarassing} className="exercise-icon push-icon" />
              <span>Push Exercises</span>
            </NavLink>
          </div>

          <div className="Pull">
            <NavLink to="/pull" className="exercise-link">
              <FontAwesomeIcon icon={faPeoplePulling} className="exercise-icon pull-icon" />
              <span>Pull Exercises</span>
            </NavLink>
          </div>

          <div className="Legs">
            <NavLink to="/legs" className="exercise-link">
              <FontAwesomeIcon icon={faPersonRunning} className="exercise-icon leg-icon" />
              <span>Leg Exercises</span>
            </NavLink>
          </div>
        </nav>

    </div>
  );
}

export default Exercises;