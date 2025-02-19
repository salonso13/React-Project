import axios from 'axios';
const CHAT_API_URL = 'http://127.0.0.1:8000';
export const sendMessageToChat = async (message) => {
    try {
        const response = await axios.post(
            CHAT_API_URL,
            { prompt: message }, // Enviamos el mensaje al backend
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || "Error al comunicarse con el chat";
    }
};