import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Bot } from 'lucide-react';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your Campus Events assistant. Ask me about events, clubs, registration, or anything else related to our platform. How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const predefinedResponses: Record<string, string> = {
    'hello': 'Hello! How can I assist you with campus events today?',
    'hi': 'Hi there! What would you like to know about campus events?',
    'events': `Our Campus Events system helps you discover and manage events! Here's how it works:\n\n🎯 For Students:\n• Browse upcoming events\n• Register via Google Forms\n📅 Event Discovery:\n• Filter by club/category/date`,
    'clubs': `We have various clubs across departments like IT, CSE, etc. Each has past events, achievements, and recruitment forms.`,
    'register': `To register:\n• Click "Register Now" on any event\n• Fill the Google Form\n• Confirmation will be emailed.`,
    'login': `Login via institutional email. Role-based dashboards available for Club Presidents, Faculty, HOD, Dean, etc.`,
    'system': `React + TypeScript frontend with Google Forms integration, real-time updates, analytics, and multi-role login.`,
    'workflow': `Workflow:\n1. Club President creates\n2. Faculty approves\n3. Venue checks\n4. HOD reviews\n5. Dean (if needed)`,
    'features': `🎯 For Students:\n• Event Discovery\n• Calendar Integration\n👥 For Organizers:\n• Event & Venue Management\n📊 Analytics`,
    'help': `Ask about:\n• Events\n• Clubs\n• Registration\n• System\n• Workflow\n• Features`,
    'contact': 'You can contact us at contact@campusevents.com or visit the Contact page.',
    'recruitment': `Club recruitment has forms with start/end times.\nApply via homepage under "Recruitment".`,
    'default': 'Ask me about events, clubs, registration, login, features, or workflow!',
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = getBotResponse(inputMessage.toLowerCase());
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const getBotResponse = (input: string): string => {
    for (const [keyword, response] of Object.entries(predefinedResponses)) {
      if (input.includes(keyword)) return response;
    }
    return predefinedResponses.default;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    'How do events work?',
    'Tell me about clubs',
    'How to register?',
    'Explain the system',
    'Login help'
  ];

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
    setTimeout(() => handleSendMessage(), 100);
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg transition-all duration-300 ${
          isOpen ? 'bg-error-500 hover:bg-error-600' : 'bg-primary-600 hover:bg-primary-700'
        } text-white flex items-center justify-center`}
        aria-label="Toggle chatbot"
      >
        {isOpen ? <X size={24} /> : <Bot size={24} />}
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-80 h-96 bg-white rounded-xl shadow-2xl border border-neutral-200 flex flex-col animate-slide-up">
          {/* Header with Close */}
          <div className="bg-primary-600 text-white p-4 rounded-t-xl flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                <Bot size={18} />
              </div>
              <div>
                <h3 className="font-semibold">Campus Events Assistant</h3>
                <p className="text-xs text-primary-100">Online • Ready to help</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-red-200">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'bg-neutral-100 text-neutral-900'
                  }`}
                >
                  <div className="flex items-start">
                    {message.sender === 'bot' && (
                      <Bot size={16} className="mr-2 mt-0.5 text-primary-600 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm whitespace-pre-line leading-relaxed">{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-primary-100' : 'text-neutral-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-neutral-100 rounded-lg p-3 max-w-[85%]">
                  <div className="flex items-center">
                    <Bot size={16} className="mr-2 text-primary-600" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Always Visible Quick Questions */}
            <div className="space-y-2 mt-2">
              <p className="text-xs text-neutral-500 text-center">Quick questions:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(question)}
                    className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded-full hover:bg-primary-100 transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-neutral-200">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about events, clubs, registration..."
                className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className={`p-2 rounded-lg transition-colors ${
                  inputMessage.trim()
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                }`}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
