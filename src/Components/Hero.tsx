import { useNavigate } from "react-router-dom";
import "./Hero.css";

const Hero = () => {
  const navigate = useNavigate(); // Hook untuk navigasi

  const handleStartClick = () => {
    navigate("/courses"); // Navigasi ke halaman CoursesPage
  };

  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <h2 className="logo">Flippy</h2>
          <h1>
            Belajar Jadi <span className="highlight">Seru</span>, <br />
            Sekali <span className="highlight">Flip</span> Langsung Paham
          </h1>
          <button className="hero-button" onClick={handleStartClick}>
            Mulai
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;