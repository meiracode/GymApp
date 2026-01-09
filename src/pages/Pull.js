import Footer from "../components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPeoplePulling } from "@fortawesome/free-solid-svg-icons";

function Pull() {
  return (
    <div>
      <h1 className="exercises-h1">
        <FontAwesomeIcon icon={faPeoplePulling} className="h1-pull-icon" />
        Pull</h1>
      <p>These exercises target the back muscles (upper/lower) and biceps. 
        It is recommended to pick 4-8 exercises total, incorporating both compound and isolation movements.</p>
      <h2>Back</h2>
      <ul className="exercise-list">
        <li className="list-header">Compound</li>
        <li>Lat Pulldowns</li>
        <li>Bent-Over Rows</li>
        <li>Inverted Rows</li>
        <li>Pull Ups</li>
        <li className="list-header">Isolation</li>
        <li>Cable/Machine Rows</li>
        <li>Back extension</li>
      </ul>
      <h2>Biceps</h2>
      <ul className="exercise-list">
        <li className="list-header">Compound</li>
        <li>Chin Ups</li>
        <li>Lat Pulldowns (Narrow Grip)</li>
        <li className="list-header">Isolation</li>
        <li>Barbell/Dumbell Curls</li>
        <li>Preacher Curls</li>
        <li>Hammer Curls</li>
      </ul>
      <Footer />
    </div>
  );
}

export default Pull;