import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { aiAPI } from '../utils/api';
import { Button, Card } from '../components/ui';

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello! I'm your AI wellness assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await aiAPI.chatWithAssistant(userMessage);

      // Split AI response into lines
      const lines = response.data.response.split('\n').filter(line => line.trim() !== '');

      // Map lines to styled JSX
      const styledContent = lines.map((line, index) => {
        if (line.startsWith('Summary')) {
          return <p key={index} className="text-xl font-bold my-2">{line}</p>;
        } else if (line.startsWith('Key Details') || line.startsWith('Recommendation')) {
          return <p key={index} className="text-lg font-bold my-1">{line}</p>;
        } else if (line.match(/^(Sleep|Steps|Mood|Stress|General Explanation)/)) {
          return <p key={index} className="text-base font-semibold ml-4 my-1">{line}</p>;
        } else {
          return <p key={index} className="text-base ml-6 my-1">{line}</p>;
        }
      });

      setMessages(prev => [...prev, { role: 'assistant', content: styledContent }]);
    } catch (error) {
      toast.error('Failed to get response');
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50 p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">AI Wellness Assistant</h1>
          <p className="text-gray-600">Get personalized health recommendations and insights</p>
        </motion.div>

        <Card className="h-[calc(100vh-300px)] flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {message.role === 'assistant' ? message.content : <p className="text-sm whitespace-pre-wrap">{message.content}</p>}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </AnimatePresence>

            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl px-4 py-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="border-t p-4">
            <div className="flex space-x-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about your wellness..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                disabled={loading}
              />
              <Button type="submit" variant="primary" disabled={loading || !input.trim()}>
                Send
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AIAssistant;
