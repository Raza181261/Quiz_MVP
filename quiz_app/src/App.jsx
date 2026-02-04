

import { Routes, Route } from "react-router-dom";
import TeacherDashboard from "./pages/TeacherDashboard";
import CreateQuiz from "./pages/CreateQuiz";
import ViewRecordings from "./pages/ViewRecordings";
import StudentQuiz from "./pages/StudentQuiz";

function App() {
  return (
    <Routes>
      <Route path="/" element={<TeacherDashboard />} />
      <Route path="/teacher/create-quiz" element={<CreateQuiz />} />
      <Route path="/teacher/view-recordings" element={<ViewRecordings />} />
      <Route path="/quiz/:quizId" element={<StudentQuiz />} />
    </Routes>
  );
}

export default App;
