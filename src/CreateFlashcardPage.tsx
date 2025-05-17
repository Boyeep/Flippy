import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateFlashcardPage.css";

const CreateFlashcardPage: React.FC = () => {
  const [flashcardData, setFlashcardData] = useState({
    madeBy: "",
    title: "",
    description: "",
    numberOfCards: 1,
  });
  const [currentCardIndex, setCurrentCardIndex] = useState(0); // Track current flashcard
  const navigate = useNavigate(); // For navigation

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFlashcardData({ ...flashcardData, [name]: value });
  };

  const handleNext = () => {
    if (currentCardIndex < flashcardData.numberOfCards) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      handleSubmit(); // Submit when it's the last card
    }
  };

  const handleSubmit = () => {
    console.log("Flashcard Data:", flashcardData);
    // Add logic to save flashcard data
    navigate("/courses"); // Redirect to the course page
  };

  return (
    <div className="create-flashcard-container">
      {/* Only show "Create Flashcard" heading on the first section */}
      {currentCardIndex === 0 && <h1>Create Flashcard</h1>}
      <form onSubmit={(e) => e.preventDefault()} className="flashcard-form">
        {currentCardIndex === 0 && (
          <>
            <label>
              Made By:
              <input
                type="text"
                name="madeBy"
                value={flashcardData.madeBy}
                onChange={handleChange}
                placeholder="Your Name"
                required
              />
            </label>
            <label>
              Flashcard Title:
              <input
                type="text"
                name="title"
                value={flashcardData.title}
                onChange={handleChange}
                placeholder="Enter Title"
                required
              />
            </label>
            <label>
              Description:
              <input
                name="description"
                value={flashcardData.description}
                onChange={handleChange}
                placeholder="What is this flashcard about?"
              />
            </label>
            <label>
              Number of Cards:
              <input
                type="number"
                name="numberOfCards"
                value={flashcardData.numberOfCards}
                onChange={handleChange}
                min={1}
                required
              />
            </label>
          </>
        )}
        {currentCardIndex > 0 && (
          <>
            <h1>Flashcard {currentCardIndex}</h1>
            <label>
              Question:
              <input
                type="text"
                name={`question-${currentCardIndex}`}
                placeholder="Enter Question"
                required
              />
            </label>
            <label>
              Answer:
              <input
                type="text"
                name={`answer-${currentCardIndex}`}
                placeholder="Enter Answer"
                required
              />
            </label>
          </>
        )}
        <button
          type="button"
          className="submit-button"
          onClick={handleNext}
        >
          {currentCardIndex < flashcardData.numberOfCards ? "Continue" : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default CreateFlashcardPage;