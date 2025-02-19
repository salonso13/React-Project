import { useState, useEffect, useRef } from 'react';
import { sendMessageToChat } from '../../Services';
import './Chat.css';

function Chat() {
  // Estado para almacenar los mensajes del chat tanto del usuario como del bot
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  // Estado para indicar si el bot está procesando la respuesta
  const [loading, setLoading] = useState(false);

  // Referencia para hacer scroll automático al último mensaje
  const chatEndRef = useRef(null);

  // Función para enviar mensajes al chat
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return; // Evita enviar mensajes vacíos

    // Agrega el mensaje del usuario a la lista de mensajes
    setMessages([...messages, { sender: 'user', text: message }]);
    setLoading(true);
    setMessage(''); // Limpia el input después de enviar

    try {
      // Llamada a la API para obtener la respuesta del bot
      const response = await sendMessageToChat(message);
      // Agrega la respuesta del bot a la lista de mensajes
      setMessages((prev) => [...prev, { sender: 'bot', text: response.response }]);
    } catch {
      // En caso de error, muestra un mensaje de error en el chat
      setMessages((prev) => [...prev, { sender: 'bot', text: 'Error al obtener respuesta' }]);
    }

    setLoading(false);
  };

  // Efecto para hacer scroll automático al último mensaje cuando cambia la lista de mensajes
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-container">
      <h1 className="chat-title">Chat con Gemini</h1>

      {/* Contenedor de los mensajes del chat */}
      <div className="chat-box">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-message ${msg.sender}`}>
            <span>{msg.text}</span>
          </div>
        ))}
        <div ref={chatEndRef} /> {/* Elemento para hacer scroll automático */}
      </div>

      {/* Formulario para escribir y enviar mensajes */}
      <form onSubmit={sendMessage} className="chat-form">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Escribe un mensaje..."
          disabled={loading}
          className="chat-input"
        />
        <button type="submit" disabled={loading} className="chat-button">
          {loading ? 'Pensando...' : 'Enviar'} {/* Cuando el usuario envia un mensaje el boton cambia "Enviar" por "Pensando" */}
        </button>
      </form>
    </div>
  );
}

export default Chat;