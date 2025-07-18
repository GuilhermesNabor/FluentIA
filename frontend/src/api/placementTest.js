import axios from 'axios';

const API_URL = 'http://localhost:5000/api/placement-test';

export const getQuestions = () => {
    return axios.get(API_URL);
};

export const submitResult = (score, token) => {
    return axios.post(`${API_URL}/submit`, 
        { score },
        { headers: { Authorization: `Bearer ${token}` } }
    );
};