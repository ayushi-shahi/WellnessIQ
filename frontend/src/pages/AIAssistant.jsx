import React, { useState, useEffect } from 'react';
import { aiAPI } from '../utils/api';
import { toast } from 'react-toastify';

const AIAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await aiAPI.chatWithAssistant(input);
      const aiMessage = { role: 'assistant', content: response.data.response, cached: response.data.cached };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to get AI response');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">AI Wellness Assistant</h1>
      
      <div className="bg-white rounded-lg shadow-lg h-[600px] flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-20">
              <p className="text-lg mb-4">Ask me anything about health and wellness!</p>
              <p className="text-sm">Examples:</p>
              <ul className="text-sm mt-2 space-y-1">
                <li>"Suggest a 7-day fitness plan"</li>
                <li>"Why am I feeling tired despite sleeping 8 hours?"</li>
                <li>"What foods improve sleep quality?"</li>
              </ul>
            </div>
          )}
          
          {messages.map((message, idx) => (
            <div
              key={idx}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] px-4 py-2 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {message.content}
                {message.cached && (
                  <span className="text-xs opacity-75 ml-2">(cached)</span>
                )}
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 px-4 py-2 rounded-lg">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="border-t p-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
