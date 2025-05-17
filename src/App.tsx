import React, { useState, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"; // Gunakan Link untuk navigasi
import Hero from "./Components/Hero";
import AboutUs from "./Components/AboutUs";
import WhyChooseUs from "./Components/WhyChooseUs";
import PopularCourses from "./Components/PopularCourses";
import AllCourses from "./Components/AllCourses";
import CoursesPage from "./CoursesPage"; // Halaman khusus Courses
import SignUpPage from "./SignUpPage"; // Halaman Sign Up
import LoginPage from "./LoginPage"; // Halaman Login
import ForgotPasswordPage from "./ForgotPasswordPage"; // Halaman Forgot Password
import CreateNewPasswordPage from "./CreateNewPasswordPage"; // Halaman Create New Password
import Footer from "./Components/Footer";
import CreateFlashcardPage from "./CreateFlashcardPage";
import "./App.css";
import './MobileApp.css';

const App: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false); // State untuk toggle menu
  const aboutUsRef = useRef<HTMLDivElement>(null); // Referensi untuk bagian "About Us"
  const footerRef = useRef<HTMLDivElement>(null); // Referensi untuk bagian Footer

  const toggleMenu = () => {
    setMenuOpen(!menuOpen); // Toggle menu
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll ke atas dengan animasi halus
  };

  const scrollToAboutUs = () => {
    if (aboutUsRef.current) {
      aboutUsRef.current.scrollIntoView({ behavior: "smooth" }); // Scroll ke bagian "About Us"
    }
  };

  const scrollToFooter = () => {
    if (footerRef.current) {
      footerRef.current.scrollIntoView({ behavior: "smooth" }); // Scroll ke bagian Footer
    }
  };

  return (
    <Router>
      <div>
        {/* Header */}
        <header className="header">
          <nav className="navbar">
            <div className="logo">Flippy</div>
            {/* Tombol Hamburger Menu */}
            <button className="hamburger-menu" onClick={toggleMenu}>
              ☰
            </button>
            {/* Navigasi */}
            <div className={`nav-links ${menuOpen ? "open" : ""}`}>
              <Link to="/" onClick={() => { setMenuOpen(false); scrollToTop(); }}>Home</Link>
              <Link to="/" onClick={() => { setMenuOpen(false); scrollToAboutUs(); }}>About Us</Link>
              <Link to="/courses" onClick={() => setMenuOpen(false)}>Courses</Link>
              <Link to="/" onClick={() => { setMenuOpen(false); scrollToFooter(); }}>Contact</Link>
            </div>
            {/* Tombol Login dan Sign Up */}
            <div className="auth-buttons">
              <Link to="/login">
                <button className="login">Login</button>
              </Link>
              <Link to="/signup">
                <button className="signup">Sign Up</button>
              </Link>
            </div>
          </nav>
        </header>

        {/* Routing */}
        <Routes>
          {/* Halaman Utama */}
          <Route
            path="/"
            element={
              <div>
                <Hero />
                <div ref={aboutUsRef}>
                  <AboutUs />
                </div>
                <WhyChooseUs />
                <PopularCourses />
                <AllCourses />
                <div ref={footerRef}>
                  <Footer />
                </div>
              </div>
            }
          />
          {/* Halaman Courses */}
          <Route path="/courses" element={<CoursesPage />} />
          {/* Halaman Sign Up */}
          <Route path="/signup" element={<SignUpPage />} />
          {/* Halaman Login */}
          <Route path="/login" element={<LoginPage />} />
          {/* Halaman Forgot Password */}
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          {/* Halaman Create New Password */}
          <Route path="/create-new-password" element={<CreateNewPasswordPage />} />
          <Route path="/create-flashcard" element={<CreateFlashcardPage />} />
        </Routes>
        {/* Gambar di kanan bawah */}
        <Link to="/create-flashcard" className="floating-image">
          <img
            src="/Images/CreateFlashCard-Hovering.jpg"
            alt="Create Flash Card"
          />
        </Link>
      </div>
    </Router>
  );
};

export default App;