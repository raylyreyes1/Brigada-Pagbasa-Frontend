import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAssessmentById, updateAssessment, updateAssessmentLevel } from "../services/api";
import "../styles/AssessmentsTest.css";

const LEVELS = ["Nothing", "Letter Level", "Word Level", "Paragraph Level", "Comprehension Level"];
const IMAGES = {
    "Nothing": ["letters1.jpg", "letters2.jpg", "letters3.jpg", "letters4.jpg", "letters5.jpg", "letters6.jpg", "letters7.jpg", "letters8.jpg", "letters9.jpg", "letters10.jpg", "letters11.jpg", "letters12.jpg", "letters13.jpg", "letters14.jpg", "letters15.jpg", "letters16.jpg", "letters17.jpg", "letters18.jpg", "letters19.jpg", "letters20.jpg", "letters21.jpg", "letters22.jpg", "letters23.jpg", "letters24.jpg", "letters25.jpg", "letters26.jpg", "letters27.jpg", "letters28.jpg", "letters29.jpg", "letters30.jpg"],
    "Letter Level": ["words1.jpg", "words2.jpg", "words3.jpg", "words4.jpg", "words5.jpg", "words6.jpg", "words7.jpg", "words8.jpg", "words9.jpg", "words10.jpg", "words11.jpg", "words12.jpg", "words13.jpg", "words14.jpg", "words15.jpg", "words16.jpg", "words17.jpg", "words18.jpg", "words19.jpg", "words20.jpg", "words21.jpg", "words22.jpg", "words23.jpg", "words24.jpg", "words25.jpg", "words26.jpg", "words27.jpg", "words28.jpg", "words29.jpg"],
    "Word Level": ["sentence1.jpg", "sentence2.jpg", "sentence3.jpg", "sentence4.jpg", "sentence5.jpg", "sentence6.jpg", "sentence7.jpg", "sentence8.jpg", "sentence9.jpg", "sentence10.jpg"],
    "Paragraph Level": ["StatementQuestion1.jpg", "StatementQuestion2.jpg", "StatementQuestion3.jpg", "StatementQuestion4.jpg", "StatementQuestion5.jpg", "StatementQuestion6.jpg", "StatementQuestion7.jpg", "StatementQuestion8.jpg", "StatementQuestion9.jpg", "StatementQuestion10.jpg"]
};

function AssessmentsTest() {
    const { assessmentId } = useParams();
    const navigate = useNavigate();
    const [assessment, setAssessment] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const fetchAssessment = async () => {
            console.log("Fetching assessment with ID:", assessmentId); // Debug log
    
            if (!assessmentId) {
                console.error("Error: ID is undefined or null");
                return;
            }
    
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found");
                return;
            }
    
            try {
                const data = await getAssessmentById(token, assessmentId);
                console.log("Fetched assessment data:", data); // Debug log
                setAssessment(data);
            } catch (error) {
                console.error("Error fetching assessment:", error);
            }
        };
        fetchAssessment();
    }, [assessmentId]);
    

    const handleNextImage = () => {
        if (!assessment) return;
        const images = IMAGES[assessment.level] || [];
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    };
    
    const handlePrevImage = () => {
        if (!assessment) return;
        const images = IMAGES[assessment.level] || [];
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };
    
    const handleContinue = async () => {
        if (!assessment) return;
    
        const confirmProceed = window.confirm("Are you sure you want to continue?");
        if (!confirmProceed) return;
    
        const nextLevelIndex = LEVELS.indexOf(assessment.level) + 1;
        if (nextLevelIndex >= LEVELS.length) return;
    
        const newLevel = LEVELS[nextLevelIndex];
        const newStatus = newLevel === "Comprehension Level" ? "Completed" : "Started";
    
        try {
            const token = localStorage.getItem("token");
            console.log("Updating level with:", newLevel); // Debug log
    
            await updateAssessmentLevel(assessmentId, newLevel, token); // Call the correct function
            const response = await updateAssessment(assessmentId, { status: newStatus }, token); // Update status separately
    
            console.log("Update Response:", response); // Debug log
    
            setAssessment(prev => ({ ...prev, level: newLevel, status: newStatus }));
        } catch (error) {
            console.error("Error updating assessment:", error);
        }
    
        if (newLevel === "Comprehension Level") {
            navigate("/dashboard");
        }
    };
    
    
    

    const handleStop = async () => {
        if (!assessment) return;
    
        const confirmStop = window.confirm("Are you sure you want to stop? This will mark the assessment as Completed.");
        if (!confirmStop) return;
    
        try {
            const token = localStorage.getItem("token");
            await updateAssessment(assessmentId, { status: "Completed" }, token);
            setAssessment(prev => ({ ...prev, status: "Completed" }));
        } catch (error) {
            console.error("Error marking assessment as completed:", error);
        }
    
        navigate("/dashboard");
    };
    

    if (!assessment) return <div>Loading...</div>;

    return (
        <div className="assessment-container">
            <h2 className="assessment-title">Assessment #{assessmentId}</h2>

            {assessment.level !== "Comprehension Level" && (
                <>
                    <div className="image-container">
                        <button className="button button-back" onClick={handlePrevImage}>Back</button>
                        <img 
                            src={`/images/${IMAGES[assessment.level][currentImageIndex]}`} 
                            alt="Assessment" 
                            className="assessment-image"
                        />
                        <button className="button button-next" onClick={handleNextImage}>Next</button>
                    </div>
                    <div className="button-container">
                        <button className="button button-stop" onClick={handleStop}>Stop</button>
                        <button className="button button-continue" onClick={handleContinue}>Continue</button>
                    </div>
                </>
            )}

            {assessment.level === "Comprehension Level" && (
                <div className="completed-message">Assessment Completed!</div>
            )}
        </div>
    );
}

export default AssessmentsTest;
