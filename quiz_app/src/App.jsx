// import Quiz from "./components/Quiz";

// function App() {
//   return (
//     <div style={{ padding: "40px" }}>
//       <h1>Mini Quiz Application</h1>
//       <Quiz />
//     </div>
//   );
// }

// export default App;


import { Routes, Route } from "react-router-dom";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentQuiz from "./pages/StudentQuiz";

function App() {
  return (
    <Routes>
      <Route path="/" element={<TeacherDashboard />} />
      <Route path="/quiz/:quizId" element={<StudentQuiz />} />
    </Routes>
  );
}

export default App;
