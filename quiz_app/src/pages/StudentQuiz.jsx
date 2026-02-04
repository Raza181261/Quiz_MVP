import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { startScreenRecording } from "../utils/screenRecorder";
import "./StudentQuiz.css";

const StudentQuiz = () => {
  const { quizId } = useParams();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const scoreRef = useRef(score); // ✅ Ref to keep latest score
  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  const [permissionGranted, setPermissionGranted] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  // 🔹 Fetch Quiz
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/quiz/${quizId}`);
        setQuiz(res.data);
      } catch (err) {
        console.error(err);
        alert("Quiz not found ❌");
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId]);

  if (loading) return <p>Loading quiz...</p>;
  if (!quiz) return <h2 className="not-found">Quiz not found ❌</h2>;

  // ▶ START RECORDING
  const startRecording = async () => {
    try {
      const recorder = await startScreenRecording(async (blob) => {
        try {
          // 1️⃣ Get presigned URL
          const { data } = await axios.post(
            "http://localhost:8000/api/quiz/r2-upload-url",
            { quizId },
          );

          // 2️⃣ Upload to Cloudflare R2
          await axios.put(data.uploadUrl, blob, {
            headers: {
              "Content-Type": "video/webm",
            },
          });

          // 3️⃣ Save result metadata
          await axios.post("http://localhost:8000/api/quiz/save-result", {
            quizId,
            studentName: "Student",
            score: scoreRef.current, // Use ref to get latest score
            total: quiz.questions.length,
            recordingURL: data.fileUrl,
          });

          alert("Result & recording saved successfully ✅");
        } catch (err) {
          console.error(err);
          alert("Recording upload failed ❌");
        }
      });

      setMediaRecorder(recorder);
      setPermissionGranted(true);
    } catch (err) {
      console.error(err);
      alert("Please allow screen & webcam access");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) mediaRecorder.stop();
  };

  // 🧠 Handle Answer
  const handleAnswer = (optionIndex) => {
    if (optionIndex === quiz.questions[index].correctAnswer) {
      setScore((prev) => prev + 1);
    }

    if (index + 1 < quiz.questions.length) {
      setIndex((prev) => prev + 1);
    } else {
      setFinished(true);
      stopRecording();
    }
  };

  return (
    <div className="student-container">
      <h1 className="quiz-title">{quiz.title}</h1>

      {!permissionGranted ? (
        <div className="permission-box">
          <p>
            This quiz requires <strong>screen</strong> & <strong>webcam</strong>{" "}
            access
          </p>
          <button className="start-btn" onClick={startRecording}>
            Start Quiz
          </button>
        </div>
      ) : finished ? (
        <div className="score-card">
          <h2>Your Score</h2>
          <p>
            {score} / {quiz.questions.length}
          </p>
        </div>
      ) : (
        <div className="question-box">
          <h3 className="question-text">
            Q{index + 1}: {quiz.questions[index].question}
          </h3>

          <div className="options-container">
            {quiz.questions[index].options.map((opt, i) => (
              <button
                key={i}
                className="option-btn"
                onClick={() => handleAnswer(i)}
              >
                {opt}
              </button>
            ))}
          </div>

          <p className="progress">
            Question {index + 1} of {quiz.questions.length}
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentQuiz;
