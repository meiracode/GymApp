import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="app-footer">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faArrowLeft} className="back-icon" />
      </button>
    </footer>
  );
}

export default Footer;
