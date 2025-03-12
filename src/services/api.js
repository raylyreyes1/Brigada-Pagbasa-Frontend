import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const loginUser = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, { email, password });
        console.log("Raw API Response:", response); // Debugging
        console.log("API Response Data:", response.data);
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
                "Content-Type": "multipart/form-data"  // This is necessary for FormData
            }
        });
        console.log("API Save Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("API Save Error:", error.response?.data || error.message);
        throw error;
    }
};

