import React, { useState, useEffect, useCallback } from 'react';
import '../style/Chat.css';


const chattify = (text) => { // Function to convert text to HTML elements
  const element = document.createElement('div');
  element.innerText = text;
  return element.innerHTML;
};

const Chat = ({ token }) => {
 // State to manage messages, new message, error message, active conversation, and user information
  const [messages, setMessages] = useState(() => JSON.parse(localStorage.getItem('messages')) || []);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');
  const [activeConversation, setActiveConversation] = useState(() => localStorage.getItem('conversationId') || '');
  const [username, setUsername] = useState(() => localStorage.getItem('username') || '');
  const [userId] = useState(() => localStorage.getItem('userId') || '');
  const [conversations, setConversations] = useState(() => JSON.parse(localStorage.getItem('conversations')) || []);

 
  const [conversation] = useState([
    {
      "text": "Hello there, how are you?",
      "avatar": "https://i.pravatar.cc/100",
      "username": "Teacher",
      "conversationId": null
    },
    {
      "text": "Are you there?",
      "avatar": "https://i.pravatar.cc/100",
      "username": "Teacher",
      "conversationId": null
    },
    {
      "text": "Hello Teacher, I hope you are fine.",
      "avatar": "https://i.pravatar.cc/101",
      "username": username,
      "userId": userId,
      "conversationId": null
    }
  ]);

   // Fetch users from API
  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch('https://chatify-api.up.railway.app/users', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Could not fetch users');
   
    } catch {
      setError('Could not fetch users'); // Set error message on failure
    }
  }, [token]);

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  
  const fetchMessages = useCallback(async () => {
    if (!activeConversation) return;

    try {
      const response = await fetch(`https://chatify-api.up.railway.app/messages?conversationId=${activeConversation}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Could not fetch messages');

      const messagesData = await response.json();
      setMessages(messagesData); // Update state with fetched messages
      localStorage.setItem('messages', JSON.stringify(messagesData));

      // Add new conversation to state and localStorage if it doesn't already exist
      if (!conversations.some(convo => convo.id === activeConversation)) {
        const newConversation = { id: activeConversation, name: 'Add new conversation' };
        const updatedConversations = [...conversations, newConversation];
        setConversations(updatedConversations);
        localStorage.setItem('conversations', JSON.stringify(updatedConversations));
      }
    } catch {
      setError('Could not fetch messages');
    }
  }, [activeConversation, token, conversations]);

 
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await fetch('https://chatify-api.up.railway.app/messages', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: chattify(newMessage),
          conversationId: activeConversation,
        }),
      });

      if (!response.ok) throw new Error('Message could not be delivered');

      const { latestMessage } = await response.json();
      setMessages(prevMessages => {
        const updatedMessages = [...prevMessages, { ...latestMessage, userId, username }];
        localStorage.setItem('messages', JSON.stringify(updatedMessages));
        return updatedMessages;
      });

      setNewMessage('');
    } catch {
      setError('Message could not be delivered');
    }
  };

  const handleDeleteMessage = async (messageId) => { 
    try {
      const response = await fetch(`https://chatify-api.up.railway.app/messages/${messageId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`, // Using token for authentication
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Message could not be deleted');

      setMessages(prevMessages => {
        const updatedMessages = prevMessages.filter(message => message.id !== messageId);
        localStorage.setItem('messages', JSON.stringify(updatedMessages));
        return updatedMessages;
      });
    } catch {
      setError('Message could not be deleted');
    }
  };

  const SelectConversation = (conversation) => { 
    setActiveConversation(conversation.id);
    localStorage.setItem('conversationId', conversation.id);
  };

  return (
    <div className="chat-container">
      <div className="chat-main">
        <h2 className="chat-title">Chat: {conversations.find(convo => convo.id === activeConversation)?.name || ''}</h2>
        <div className="chat-messages">
          {conversation.map((message, index) => (
            <div
              key={index}
              className={`message ${message.userId === userId ? 'message-right' : 'message-left'}`}
            >
              <div className={`message-content ${message.userId === userId ? 'message-content-right' : 'message-content-left'}`}>
                <img src={message.avatar} alt="avatar" className="avatar" />
                <div className={`message-text ${message.userId === userId ? 'text-right' : 'text-left'}`}>
                  <div className="message-username">{message.username}</div>
                  <p dangerouslySetInnerHTML={{ __html: chattify(message.text) }}></p>
                </div>
              </div>
            </div>
          ))}
          {messages.map(message => (
            <div
              key={message.id}
              className={`message ${message.userId === userId ? 'message-right' : 'message-left'}`}
            >
              <div className={`message-content ${message.userId === userId ? 'message-content-right' : 'message-content-left'}`}>
                <img src={message.avatar || 'https://i.pravatar.cc/100'} alt="avatar" className="avatar" />
                <div className={`message-text ${message.userId === userId ? 'text-right' : 'text-left'}`}>
                  <div className="message-username">{message.username}</div>
                  <p dangerouslySetInnerHTML={{ __html: chattify(message.text) }}></p>
                  {message.userId === userId && (
                    <button
                      onClick={() => handleDeleteMessage(message.id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="message-input">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="message-field"
          />
          <button
            onClick={handleSendMessage}
            className="send-button"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;