

import { useState } from "react";
import axios from "axios"; // For backend requests
import "./TeacherDashboard.css";

const TeacherDashboard = () => {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([
    { question: "", options: ["", "", "", ""], correctAnswer: 0 },
  ]);
  const [quizLink, setQuizLink] = useState("");

  // Handle question/option changes
  const handleQuestionChange = (qIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].question = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const handleCorrectChange = (qIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].correctAnswer = Number(value);
    setQuestions(newQuestions);
  };

  // Add/Remove questions
  const addQuestion = () => {
    if (questions.length >= 10) return alert("Maximum 10 questions allowed!");
    setQuestions([...questions, { question: "", options: ["", "", "", ""], correctAnswer: 0 }]);
  };

  const removeQuestion = (qIndex) => {
    setQuestions(questions.filter((_, i) => i !== qIndex));
  };

  // Create Quiz (save to MongoDB)
  const createQuiz = async () => {
    if (!title.trim()) return alert("Please enter quiz title");

    for (let q of questions) {
      if (!q.question.trim() || q.options.some(opt => !opt.trim())) {
        return alert("Please fill all questions and options");
      }
    }

    try {
      const res = await axios.post("http://localhost:8000/api/quiz/create", {
        title,
        questions,
      });

      const quizId = res.data.quizId;
      setQuizLink(`${window.location.origin}/quiz/${quizId}`);

      // Reset form
      setTitle("");
      setQuestions([{ question: "", options: ["", "", "", ""], correctAnswer: 0 }]);
      alert("Quiz created successfully ✅");
    } catch (err) {
      console.error(err);
      alert("Error creating quiz. Make sure backend is running.");
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Teacher Dashboard</h1>

      <label>
        Quiz Title:
        <input
          type="text"
          placeholder="Enter quiz title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>

      {questions.map((q, qIndex) => (
        <div key={qIndex} className="question-block">
          <h3>Question {qIndex + 1}</h3>
          <input
            type="text"
            placeholder="Enter question"
            value={q.question}
            onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
          />

          {q.options.map((opt, oIndex) => (
            <input
              key={oIndex}
              type="text"
              placeholder={`Option ${oIndex + 1}`}
              value={opt}
              onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
            />
          ))}

          <label>
            Correct Answer:
            <select value={q.correctAnswer} onChange={(e) => handleCorrectChange(qIndex, e.target.value)}>
              {q.options.map((_, i) => (
                <option key={i} value={i}>Option {i + 1}</option>
              ))}
            </select>
          </label>

          {questions.length > 1 && (
            <button className="remove-btn" onClick={() => removeQuestion(qIndex)}>Remove Question</button>
          )}

          <hr />
        </div>
      ))}

      {questions.length < 10 && <button className="add-btn" onClick={addQuestion}>Add Question</button>}

      <button className="create-btn" onClick={createQuiz}>Create Quiz</button>

      {quizLink && (
        <p className="quiz-link">
          Share this link: <br />
          <a href={quizLink}>{quizLink}</a>
        </p>
      )}
    </div>
  );
};

export default TeacherDashboard;
