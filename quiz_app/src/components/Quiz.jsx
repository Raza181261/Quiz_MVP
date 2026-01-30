import { useState } from "react";
import quizData from "../data/quizData";

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleOptionClick = (index) => {
    if (index === quizData[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    const next = currentQuestion + 1;
    if (next < quizData.length) {
      setCurrentQuestion(next);
    } else {
      setShowResult(true);
    }
  };

  return (
    <div className="quiz-box">
      {showResult ? (
        <h2>Your Score: {score} / {quizData.length}</h2>
      ) : (
        <>
          <h3>{quizData[currentQuestion].question}</h3>
          {quizData[currentQuestion].options.map((opt, i) => (
            <button key={i} onClick={() => handleOptionClick(i)}>
              {opt}
            </button>
          ))}
        </>
      )}
    </div>
  );
};

export default Quiz;
