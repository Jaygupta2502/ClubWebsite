import React, { useState } from 'react';
import { MessageSquare, Send, Search, User, X } from 'lucide-react';

interface Message {
  id: string;
  sender: string;
  receiver: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

interface MessageCenterProps {
  onClose: () => void;
}

const MessageCenter: React.FC<MessageCenterProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'Faculty',
      receiver: 'Venue Coordinator',
      content: 'Regarding the Tech Symposium venue request...',
      timestamp: new Date(),
      read: false
    },
    {
      id: '2',
      sender: 'Venue Coordinator',
      receiver: 'Faculty',
      content: 'The venue is available for the requested date.',
      timestamp: new Date(Date.now() - 3600000),
      read: true
    },
    {
      id: '3',
      sender: 'HOD',
      receiver: 'Faculty',
      content: 'Please review the event proposal.',
      timestamp: new Date(Date.now() - 7200000),
      read: true
    },
    {
      id: '4',
      sender: 'Dean',
      receiver: 'HOD',
      content: 'Please provide the monthly event report.',
      timestamp: new Date(Date.now() - 8600000),
      read: false
    },
    {
      id: '5',
      sender: 'Director',
      receiver: 'Dean',
      content: 'Review the annual event statistics.',
      timestamp: new Date(Date.now() - 9600000),
      read: false
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSend = () => {
    if (newMessage.trim() && selectedThread) {
      const message: Message = {
        id: Date.now().toString(),
        sender: 'Current User',
        receiver: 'Selected User',
        content: newMessage,
        timestamp: new Date(),
        read: false
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const getThreadMessages = (threadId: string) => {
    return messages.filter(m => 
      (m.sender === messages.find(msg => msg.id === threadId)?.sender && 
       m.receiver === messages.find(msg => msg.id === threadId)?.receiver) ||
      (m.receiver === messages.find(msg => msg.id === threadId)?.sender && 
       m.sender === messages.find(msg => msg.id === threadId)?.receiver)
    );
  };

  const filteredMessages = messages.filter(message => 
    message.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.receiver.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-[90vh]">
      <div className="flex items-center justify-between p-4 border-b border-neutral-200">
        <div className="flex items-center">
          <MessageSquare size={24} className="text-primary-600 mr-3" />
          <h2 className="text-lg font-semibold">Messages</h2>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 h-full">
          {/* Messages List */}
          <div className="md:col-span-1 border-r border-neutral-200 overflow-y-auto">
            <div className="p-4">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
                <input
                  type="text"
                  placeholder="Search messages..."
                  className="input pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                {filteredMessages.map(message => (
                  <div
                    key={message.id}
                    className={`p-3 rounded-lg cursor-pointer ${
                      selectedThread === message.id 
                        ? 'bg-primary-50' 
                        : message.read ? 'bg-white hover:bg-neutral-50' : 'bg-primary-50'
                    }`}
                    onClick={() => setSelectedThread(message.id)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{message.sender}</span>
                      <span className="text-xs text-neutral-500">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-600 truncate">{message.content}</p>
                    <p className="text-xs text-neutral-500 mt-1">To: {message.receiver}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Message Content */}
          <div className="md:col-span-2 flex flex-col h-full">
            {selectedThread ? (
              <>
                <div className="flex-1 overflow-y-auto p-4">
                  {getThreadMessages(selectedThread).map((message, index) => (
                    <div
                      key={index}
                      className={`flex mb-4 ${
                        message.sender === 'Current User' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.sender === 'Current User'
                            ? 'bg-primary-600 text-white'
                            : 'bg-neutral-100'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-neutral-200 p-4">
                  <div className="relative">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="input resize-none pr-12"
                      rows={3}
                    />
                    <button
                      onClick={handleSend}
                      disabled={!newMessage.trim()}
                      className={`absolute bottom-3 right-3 p-2 rounded-full ${
                        newMessage.trim()
                          ? 'bg-primary-600 text-white hover:bg-primary-700'
                          : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                      }`}
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare size={32} className="text-primary-600" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                  <p className="text-neutral-600">
                    Choose a message thread to start chatting
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageCenter;