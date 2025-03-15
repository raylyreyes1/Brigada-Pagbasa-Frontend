import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { createAssessment } from "../services/api";
import "../styles/Assessments.css";

function Assessments() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        studentAge: "",
        studentGender: "",
        studentGradeLevel: "",
        studentCity: "",
        studentSchool: "",
        studentBarangay: "",
        studentRegion: ""
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser || !storedUser.token) {
            navigate("/");
            return;
        }
        setUser(storedUser);
        setLoading(false);
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCreateAssessment = async () => {
        if (!user) return;

        const requiredFields = ["studentAge", "studentGender", "studentGradeLevel", "studentCity", "studentSchool", "studentBarangay", "studentRegion"];
        for (const field of requiredFields) {
            if (!formData[field]) {
                alert(`Please fill in the ${field.replace("student", "").replace(/([A-Z])/g, " $1")}.`);
                return;
            }
        }

        const formattedData = {
            student_age: parseInt(formData.studentAge, 10),
            student_gender: formData.studentGender,
            student_grade_level: formData.studentGradeLevel,
            student_city: formData.studentCity,
            student_school: formData.studentSchool,
            student_barangay: formData.studentBarangay,
            student_region: formData.studentRegion
        };

        setSaving(true);
        try {
            await createAssessment(user.token, formattedData);
            alert("Assessment created successfully!");
            navigate("/dashboard");
        } catch (error) {
            alert(error.message || "Failed to create assessment.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div style={{ display: "flex", height: "100vh" }}>
            <Sidebar />
            <div className="assessment-container">
                <div className="assessment-card">
                    <h1 className="assessment-title">Create Assessment</h1>
                    <div className="assessment-fields">
                        <label>Age:</label>
                        <input type="number" name="studentAge" value={formData.studentAge} onChange={handleChange} />

                        <label>Gender:</label>
                        <select name="studentGender" value={formData.studentGender} onChange={handleChange}>
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Non-Binary">Non-Binary</option>
                            <option value="Other">Other</option>
                        </select>

                        <label>Grade Level:</label>
                        <input type="text" name="studentGradeLevel" value={formData.studentGradeLevel} onChange={handleChange} />

                        <label>City:</label>
                        <input type="text" name="studentCity" value={formData.studentCity} onChange={handleChange} />

                        <label>School:</label>
                        <input type="text" name="studentSchool" value={formData.studentSchool} onChange={handleChange} />

                        <label>Barangay:</label>
                        <input type="text" name="studentBarangay" value={formData.studentBarangay} onChange={handleChange} />

                        <label>Region:</label>
                        <input type="text" name="studentRegion" value={formData.studentRegion} onChange={handleChange} />
                    </div>

                    <div className="assessment-buttons">
                        <button className="cancel-button" onClick={() => navigate("/dashboard")}>Cancel</button>
                        <button className="save-button" onClick={handleCreateAssessment} disabled={saving}>
                            {saving ? "Saving..." : "Create"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Assessments;
