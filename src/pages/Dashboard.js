import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { HeadingLarge } from "baseui/typography";
import { getAssessments, updateAssessment } from "../services/api";

function Dashboard() {
    const [assessments, setAssessments] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found");
                return;
            }
            try {
                const data = await getAssessments(token);
                const sortedData = data.sort((a, b) => a.id - b.id);
                setAssessments(sortedData);
            } catch (error) {
                console.error("Error fetching assessments:", error);
            }
        };
        fetchData();
    }, []);

    const handleAssessmentClick = async (assessment) => {
        if (assessment.status === "Completed") {
            alert("This Assessment has been Completed");
            return;
        }

        if (assessment.status === "Not Started") {
            try {
                const token = localStorage.getItem("token");
                const updatedAssessment = { status: "Started" };
                await updateAssessment(assessment.id, updatedAssessment, token);
                setAssessments((prev) =>
                    prev.map((a) => (a.id === assessment.id ? { ...a, status: "Started" } : a))
                );
            } catch (error) {
                console.error("Error updating assessment:", error);
            }
        }

        navigate(`/assessments/${assessment.id}`);
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
            <div style={{ flex: 1, padding: "20px", background: "#f8f5fc", position: "relative" }}>
                <HeadingLarge>Volunteer</HeadingLarge>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <HeadingLarge>Assessments</HeadingLarge>
                    <button 
                        onClick={() => navigate("/assessments")} 
                        style={{
                            background: "#f48fb1",
                            color: "white",
                            border: "none",
                            borderRadius: "50%",
                            width: "40px",
                            height: "40px",
                            fontSize: "24px",
                            cursor: "pointer"
                        }}
                    >
                        +
                    </button>
                </div>
                {assessments.length > 0 ? (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "20px" }}>
                        {assessments.map((assessment) => (
                            <div 
                                key={assessment.id} 
                                style={{ 
                                    background: getStatusColor(assessment.status),
                                    padding: "20px", 
                                    borderRadius: "10px", 
                                    cursor: "pointer"
                                }}
                                onClick={() => handleAssessmentClick(assessment)}
                            >
                                <HeadingLarge style={{ textAlign: "center", fontSize: "20px", marginTop:"-10px"}}>
                                    Assessment #{assessment.id}
                                </HeadingLarge>
                                <strong>Level:</strong> {assessment.level} <br />
                                <strong>Status:</strong> {assessment.status} <br />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh", fontSize: "18px", color: "#888" }}>
                        No current assessments. Create one using the [+] icon at the top right!
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
