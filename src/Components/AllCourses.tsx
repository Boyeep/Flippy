import { useState, useEffect, useRef } from "react";

const AllCourses = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State untuk dropdown
  const [selectedOption, setSelectedOption] = useState("Semua"); // State untuk opsi yang dipilih
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.3 } // Card dianggap terlihat jika 30% masuk viewport
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const courses = [
    { title: "Aljabar Linear", author: "James", image: "/Images/Aljabar.jpg" },
    { title: "Kalkulus", author: "Daniel", image: "/Images/Aljabar.jpg" },
    { title: "Fisika Dasar", author: "Michael", image: "/Images/Aljabar.jpg" },
  ];

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen); // Toggle state dropdown
  };

  const handleOptionClick = (option: string) => {
    setSelectedOption(option); // Set opsi yang dipilih
    setIsDropdownOpen(false); // Tutup dropdown
  };

  return (
    <section
      className={`all-courses ${isVisible ? "animate" : ""}`}
      ref={sectionRef}
    >
      <h2>
        All <span className="highlight">Courses</span>
      </h2>
      {/* Search Bar */}
      <div className="search-bar">
        <div className="search-container">
          <input
            type="text"
            placeholder="Cari kursus..."
            className="search-input"
          />
          <button className="search-button">
            <img src="/Images/AllCourses-Search.jpg" alt="Search Icon" />
          </button>
        </div>
        {/* Custom Dropdown */}
        <div className="custom-dropdown">
          <div className="dropdown-header" onClick={toggleDropdown}>
            {selectedOption}
            <span className={`dropdown-arrow ${isDropdownOpen ? "open" : ""}`}>
              ▼
            </span>
          </div>
          {isDropdownOpen && (
            <ul className="dropdown-list">
              <li
                className="dropdown-item"
                onClick={() => handleOptionClick("Semua")}
              >
                Semua
              </li>
              <li
                className="dropdown-item"
                onClick={() => handleOptionClick("Matematika")}
              >
                Matematika
              </li>
              <li
                className="dropdown-item"
                onClick={() => handleOptionClick("Sains")}
              >
                Sains
              </li>
            </ul>
          )}
        </div>
      </div>
      {/* Courses List */}
      <div className="courses-list">
        {courses.map((course, index) => (
          <div className="course-item" key={index}>
            <img src={course.image} alt={course.title} />
            <h3>{course.title}</h3>
            <p>Dibuat oleh : {course.author}</p>
            <button className="course-button">Kerjakan</button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AllCourses;