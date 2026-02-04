

import { useState, useEffect } from "react";
import axios from "axios";
import "./ViewRecordings.css";

const ViewRecordings = () => {
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        const { data } = await axios.get("http://localhost:8000/api/quiz/all-recordings");

        // Automatically fetch presigned URLs for each recording
        const recordingsWithUrls = await Promise.all(
          data.map(async (rec) => {
            const res = await axios.get(`http://localhost:8000/api/quiz/recordings/${rec._id}/presigned`);
            return { ...rec, presignedUrl: res.data.presignedUrl };
          })
        );

        setRecordings(recordingsWithUrls);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch recordings");
      } finally {
        setLoading(false);
      }
    };

    fetchRecordings();
  }, []);

  if (loading) return <p>Loading recordings...</p>;

  return (
    <div className="recordings-container">
      <h1>All Quiz Recordings</h1>
      {recordings.length === 0 ? (
        <p>No recordings found</p>
      ) : (
        <div className="recordings-grid">
          {recordings.map((rec) => (
            <div key={rec._id} className="recording-card">
              <video
                width="100%"
                height="180"
                controls
                src={rec.presignedUrl} // ✅ use presigned URL
              ></video>
              <p className="score-text">
                <strong>Student:</strong> {rec.studentName} |{" "}
                <strong>Score:</strong> {rec.score} / {rec.total}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewRecordings;
