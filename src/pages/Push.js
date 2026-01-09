import Footer from "../components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPersonHarassing } from "@fortawesome/free-solid-svg-icons";

function Push() {
  return (
    <div>
      <h1 className="exercises-h1">
        <FontAwesomeIcon icon={faPersonHarassing} className="h1-push-icon" />
        Push</h1>
      <p>These exercises target chest, triceps, and shoulders.  It is recommended to pick 4-8 exercises total, incorporating both compound and isolation movements.</p>
      <h2>Chest</h2>
      <ul className="exercise-list">
        <li className="list-header">Compound</li>
        <li>Bench Press</li>
        <li>Dumbell Press</li>
        <li>Push ups</li>
        <li>Dips (Chest Focus)</li>
        <li className="list-header">Isolation</li>
        <li>Dumbell Flys</li>
        <li>Cable Flys</li>
      </ul>
      <h2>Triceps</h2>
      <ul className="exercise-list">
        <li className="list-header">Compound</li>
        <li>Dips (Tricep Focus)</li>
        <li>Overhead Dumbell Press</li>
        <li>Diamond Pushups</li>
        <li className="list-header">Isolation</li>
        <li>Skull Crushers</li>
        <li>Tricep Push-Down</li>
      </ul>
      <h2>Shoulders</h2>
      <ul className="exercise-list">
        <li className="list-header">Isolation</li>
        <li>Lateral Raises</li>
        <li>Front Raises</li>
        <li>Rear Delt FLys</li>
        <li>Face Pulls</li>
      </ul>
      <Footer />
    </div>
  );
}

export default Push;