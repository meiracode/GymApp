import Footer from "../components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPersonRunning } from "@fortawesome/free-solid-svg-icons";




function Legs() {
  return (
    <div>
      <h1 className="exercises-h1">
        <FontAwesomeIcon icon={faPersonRunning} className="legs-title-icon" />
        Legs</h1>
      <p>The legs are comprised of 4 main muscle groups: quads, hamstrings, 
        glutes, and calves. It is recommended to pick 4-8 exercises total, incorporating both compound and isolation movements.</p>

      <h2>
        Quads
      </h2>
      <ul className="exercise-list">
        <li className="list-header">Compound </li>
        <li>Barbell Squat</li>
        <li>Goblet Squat</li>
        <li>Hack Squat</li>
        <li>Leg Press</li>
        <li className="list-header">Isolation </li>
        <li>Quad Extensions</li>
      </ul>
      <h2>Hamstrings</h2>
      <ul className="exercise-list">
        <li className="list-header">Compound </li>
        <li>Deadlift</li>
        <li>Romanian Deadlift (RDL)</li>
        <li>Goodmornings</li>
        <li className="list-header">Isolation </li>
        <li>Seated Hamstring Curl</li>
        <li>Lying Hamstring Curl</li>
      </ul>
      <h2>Glutes</h2>
      <ul className="exercise-list">
        <li className="list-header">Compound </li>
        <li>Hip Thrust</li>
        <li>Bulgarian Split Squats</li>
        <li>Step Ups</li>
        <li>Lunges</li>
        <li className="list-header">Isolation </li>
        <li>KAS Glute Bridge</li>
        <li>Abductions</li>
        <li>Cable Kickbacks</li>
      </ul>
      <Footer />
    </div>
    
  );
}

export default Legs;