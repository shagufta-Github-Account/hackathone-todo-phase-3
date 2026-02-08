'use client';
import { useState } from 'react';

export default function Chatbot({ userId }: { userId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const currentInput = input;
    const userMessage = { role: 'user', content: currentInput };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // FIX: URL ko encode kiya gaya hai (email handle karne ke liye) aur Port 8000 add kiya hai
      const res = await fetch(`http://localhost:8000/api/${encodeURIComponent(userId)}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: currentInput })
      });

      if (!res.ok) throw new Error('Network response was not ok');

      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Error: Could not reach the server. Make sure backend is running on port 8000." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-[9999]">
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-purple-600 hover:bg-purple-700 p-4 rounded-full text-white shadow-2xl transition-all flex items-center justify-center w-16 h-16 border-none cursor-pointer"
      >
        {isOpen ? (
          <span className="text-xl font-bold">✕</span>
        ) : (
          <span className="text-2xl">💬</span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 h-[450px] bg-white border border-purple-100 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-purple-600 p-4 text-white font-semibold flex justify-between items-center">
            <span>AI Task Assistant</span>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 flex flex-col">
            {messages.length === 0 && (
              <p className="text-center text-gray-400 text-xs mt-10">Ask me to add or list tasks!</p>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${
                    m.role === 'user'
                      ? 'bg-purple-600 text-white rounded-tr-none'
                      : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 p-2 rounded-lg animate-pulse text-xs text-gray-600">AI is typing...</div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t flex gap-2">
            <input
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              className="border border-gray-200 flex-1 p-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
              placeholder="Type here..."
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading}
              className={`${
                isLoading ? 'bg-gray-400' : 'bg-purple-600 hover:bg-purple-700'
              } text-white px-3 py-2 rounded-xl text-sm transition-colors border-none cursor-pointer`}
            >
              Go
            </button>
          </div>
        </div>
      )}
    </div>
  );
}