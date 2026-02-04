import { useNavigate } from "react-router-dom";
import "./CreateQuiz.css";

const TeacherDashboard = () => {
  const navigate = useNavigate();

  return (
    
    <div className="dashboard-container">
      <h1>Teacher Dashboard</h1>

      <div className="dashboard-actions">
        <button
          className="create-btn"
          onClick={() => navigate("/teacher/create-quiz")}
        >
          Create New Quiz
        </button>
      </div>

      <div className="dashboard-actions">
        <button
          className="create-btn"
          onClick={() => navigate("/teacher/view-recordings")}
        >
          View Recordings
        </button>
      </div>
    </div>

    
  );
};

export default TeacherDashboard;
