import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Assessments() {
    const navigate = useNavigate();
    const [assessments, setAssessments] = useState([]);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser) {
            navigate("/");
            return;
        }
        fetchAssessments();
    }, [navigate]);

    const fetchAssessments = async () => {
        try {
            // Mocked data, replace with API call
            const mockData = [
                { id: 1, title: "Assessment 1", status: "Completed" },
                { id: 2, title: "Assessment 2", status: "Pending" },
            ];
            setAssessments(mockData);
        } catch (error) {
            console.error("Error fetching assessments:", error);
        }
    };

    return (
        <div style={{ display: "flex", height: "100vh" }}>
            <Sidebar />
            <h2>Assessments</h2>
            <ul>
                {assessments.map((assessment) => (
                    <li key={assessment.id}>
                        <strong>{assessment.title}</strong> - {assessment.status}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Assessments;
