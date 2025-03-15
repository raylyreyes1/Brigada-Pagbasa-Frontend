import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { HeadingLarge } from "baseui/typography";
import { getAssessments, getAssessmentById, deleteAssessments } from "../services/api";

function AdminDashboard() {
    const [assessments, setAssessments] = useState([]);
    const [deleteMode, setDeleteMode] = useState(false);
    const [selectedAssessments, setSelectedAssessments] = useState([]);
    const [selectedAssessment, setSelectedAssessment] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("No authentication token found.");
                const data = await getAssessments(token);
                setAssessments(data.sort((a, b) => a.id - b.id));
            } catch (error) {
                console.error("Error fetching assessments:", error);
            }
        };
        fetchData();
    }, []);

    const toggleDeleteMode = () => {
        setDeleteMode(!deleteMode);
        setSelectedAssessments([]);
    };

    const handleCheckboxChange = (id) => {
        setSelectedAssessments((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const handleDelete = async () => {
        if (selectedAssessments.length === 0) return;
        try {
            const token = localStorage.getItem("token");
            await deleteAssessments(selectedAssessments, token);
            setAssessments((prev) => prev.filter((a) => !selectedAssessments.includes(a.id)));
            setSelectedAssessments([]);
            setDeleteMode(false);
        } catch (error) {
            console.error("Error deleting assessments:", error);
        }
    };

    const handleAssessmentClick = async (assessment) => {
        if (deleteMode) {
            handleCheckboxChange(assessment.id);
            return;
        }
        try {
            const token = localStorage.getItem("token");
            const data = await getAssessmentById(token, assessment.id);
            console.log("Fetched assessment details:", data);
            setSelectedAssessment(data); 
        } catch (error) {
            console.error("Error fetching assessment details:", error);
        }
    };
    
    const getStatusColor = (status) => {
        switch (status) {
            case "Not Started": return "#f0f0f0";
            case "Started": return "#cce5ff";
            case "Completed": return "#d4edda";
            default: return "#e0e0e0";
        }
    };

    return (
        <div style={{ display: "flex", height: "100vh" }}>
            <Sidebar />
            <div style={{ flex: 1, padding: "20px", background: "#f8f5fc" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                    <HeadingLarge>Student Assessments</HeadingLarge>
                    <button
                        onClick={toggleDeleteMode}
                        style={{
                            background: deleteMode ? "#ff4d4d" : "#888",
                            color: "white",
                            border: "none",
                            borderRadius: "50%",
                            width: "40px",
                            height: "40px",
                            fontSize: "20px",
                            cursor: "pointer",
                        }}
                    >
                        🗑
                    </button>
                </div>
                {deleteMode && selectedAssessments.length > 0 && (
                    <button
                        onClick={handleDelete}
                        style={{
                            background: "#ff4d4d",
                            color: "white",
                            border: "none",
                            padding: "10px",
                            borderRadius: "5px",
                            cursor: "pointer",
                            marginBottom: "10px",
                        }}
                    >
                        Delete Selected
                    </button>
                )}
                {assessments.length > 0 ? (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "20px" }}>
                        {assessments.map((assessment) => (
                            <div
                                key={assessment.id}
                                style={{
                                    background: getStatusColor(assessment.status),
                                    padding: "20px",
                                    borderRadius: "10px",
                                    cursor: deleteMode ? "default" : "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                }}
                                onClick={() => handleAssessmentClick(assessment)}
                            >
                                {deleteMode && (
                                    <input
                                        type="checkbox"
                                        checked={selectedAssessments.includes(assessment.id)}
                                        onChange={() => handleCheckboxChange(assessment.id)}
                                        style={{ marginRight: "10px" }}
                                    />
                                )}
                                <div style={{ flex: 1 }}>
                                    <HeadingLarge style={{ textAlign: "center", fontSize: "20px", marginTop: "-10px" }}>
                                        Assessment #{assessment.id}
                                    </HeadingLarge>
                                    <strong>Level:</strong> {assessment.level} <br />
                                    <strong>Status:</strong> {assessment.status} <br />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh", fontSize: "18px", color: "#888" }}>
                        No current assessments. Create one using the [+] icon at the top right!
                    </div>
                )}
            </div>

            {selectedAssessment && (
                <div style={{
                    position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                    background: "white", padding: "20px", borderRadius: "10px", boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
                    width: "400px", zIndex: 1000
                }}>
                    <h2>Student Details</h2>
                    <p><strong>Age:</strong> {selectedAssessment.student_age}</p>
                    <p><strong>Gender:</strong> {selectedAssessment.student_gender}</p>
                    <p><strong>Grade Level:</strong> {selectedAssessment.student_grade_level}</p>
                    <p><strong>City:</strong> {selectedAssessment.student_city}</p>
                    <p><strong>School:</strong> {selectedAssessment.student_school}</p>
                    <p><strong>Barangay:</strong> {selectedAssessment.student_barangay}</p>
                    <p><strong>Region:</strong> {selectedAssessment.student_region}</p>
                    <button
                        onClick={() => setSelectedAssessment(null)}
                        style={{
                            marginTop: "10px", padding: "5px 10px",
                            background: "#ff4d4d", color: "white",
                            border: "none", cursor: "pointer", borderRadius: "5px"
                        }}
                    >
                        Close
                    </button>
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;
