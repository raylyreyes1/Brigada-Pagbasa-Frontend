import axios from "axios";

const API_URL = "https://literacy-dapat-backend.vercel.app/";

export const loginUser = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, { email, password });
        localStorage.setItem("token", response.data.token);
        return response;
    } catch (error) {
        console.error("API Error:", error.response?.data || error.message);
        throw error;
    }
};


export const getUserProfile = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/user/profile`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const saveUserProfile = async (token, profileData) => {
    try {
        const response = await axios.put(`${API_URL}/user/profile`, profileData, {
            headers: { 
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
            }
        });
        return response.data;
    } catch (error) {
        console.error("API Save Error:", error.response?.data || error.message);
        throw error;
    }
};

export const getAssessments = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/assessments`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error("API Error:", error.response?.data || error.message);
        throw error;
    }
};

export const createAssessment = async (token, formData) => {
    try {
        const response = await axios.post(`${API_URL}/assessments`, formData, {
            headers: { 
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        console.error("API Error:", error.response?.data || error.message);
        throw error;
    }
};

export const getAssessmentById = async (token, id) => {
    try {
        const response = await axios.get(`${API_URL}/assessments/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const deleteAssessments = async (assessmentIds, token) => {
    try {
        const response = await axios.post(`${API_URL}/assessments/delete`, { ids: assessmentIds }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting assessments:", error.response?.data || error.message);
        throw error;
    }
};

export const updateAssessment = async (id, data, token) => {
    try {
        const response = await axios.put(`${API_URL}/assessments/${id}/status`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error("API Error:", error.response?.data || error.message);
        throw error;
    }
};

export const updateAssessmentLevel = async (id, level, token) => {
    try {
        console.log("Sending update request for level:", { id, level });

        const response = await axios.put(`${API_URL}/assessments/${id}/level`, { level }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log("Response from server:", response.data);
        return response.data;
    } catch (error) {
        console.error("API Error:", error.response?.data || error.message);
        throw error;
    }
};
