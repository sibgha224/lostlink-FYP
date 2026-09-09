import React, { useState, useRef, useEffect } from 'react';

const ChatScreen = (props) => {
  // State flow ke mutabiq initial messages
  const [messages, setMessages] = useState([
    { id: 1, sender: 'other', text: 'Hello! I found your item.', time: '10:30 AM', status: 'delivered' },
    { id: 2, sender: 'me', text: 'Thank you! Can we meet at the admin block?', time: '10:32 AM', status: 'delivered' }
  ]);
  
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const claimStatus = "Claim Approved"; // Diagram step: Claim Approved -> Chat Started

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Handle Send: Message Sent -> Message Delivered flow
  const handleSend = () => {
    if (!inputText.trim() && !selectedImage) return;
    
    const newMessage = {
      id: Date.now(),
      sender: 'me',
      text: inputText,
      image: selectedImage ? URL.createObjectURL(selectedImage) : null,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent' // Pehle Sent hoga
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    setSelectedImage(null);

    // Simulation: 1 second baad Message Delivered ho jayega
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg)
      );
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen bg-[#F5F0F0]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Fraunces:opsz,wght@9..144,800&display=swap');
        .font-headings { font-family: 'Fraunces', serif; }
      `}</style>

      {/* HEADER: Claim Approved & Chat Started State */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#e8d0d0] px-4 py-3 flex flex-col shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={props.onBack || (() => window.history.back())} 
              className="p-2 rounded-xl hover:bg-[#fff8f8] text-[#800020] font-bold cursor-pointer">
              ← Back
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-[#800020] text-white flex items-center justify-center font-bold text-sm">
                AR
              </div>
              <div>
                <h2 className="font-bold text-[#2e1a1a] text-base leading-tight">Ali Raza (Finder)</h2>
                <span className="text-xs text-green-600 font-semibold">● Chat Started ({claimStatus})</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MESSAGES AREA */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex justify-center items-center h-full text-center text-[#c07080] font-medium text-sm">
            Abhi tak koi message nahi — sabse pehle message bhejein.
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender === 'me';
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] md:max-w-[50%] rounded-2xl p-3 shadow-sm ${
                  isMe ? 'bg-[#800020] text-white rounded-tr-none' : 'bg-white text-[#2e1a1a] border border-[#e8d0d0] rounded-tl-none'
                }`}>
                  {msg.image && (
                    <div className="mb-2 overflow-hidden rounded-xl">
                      <img src={msg.image} alt="attachment" className="w-full h-36 object-cover" />
                    </div>
                  )}
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                  
                  {/* State Indicators: Sent / Delivered */}
                  <div className={`flex items-center gap-1 mt-1 text-[10px] ${isMe ? 'text-pink-200 justify-end' : 'text-[#c07080] justify-start'}`}>
                    <span>{msg.time}</span>
                    {isMe && (
                      <span className="font-bold">
                        {msg.status === 'delivered' ? '✓✓ Delivered' : '✓ Sent'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* State: Message Typing Indicator */}
        {isTyping && (
          <div className="flex items-center gap-1 text-xs text-[#c07080] italic px-2">
            <span>Message Typing...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* TYPING BOX */}
      <div className="p-3 bg-white border-t border-[#e8d0d0] flex items-center gap-2">
        <label className="cursor-pointer p-2 rounded-xl hover:bg-[#fff8f8] text-[#800020]">
          📎
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={(e) => setSelectedImage(e.target.files[0])}
          />
        </label>

        <input 
          type="text" 
          placeholder="Type a message (Message Typing state)..."
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
            setIsTyping(e.target.value.length > 0);
          }}
          onKeyPress={(e) => e.key === 'Enter' && (handleSend(), setIsTyping(false))}
          className="flex-1 bg-[#F5F0F0] border border-[#e8d0d0] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#800020] text-[#2e1a1a]"
        />

        <button 
          onClick={() => { handleSend(); setIsTyping(false); }}
          className="bg-gradient-to-r from-[#800020] to-[#4a0010] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow cursor-pointer">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatScreen;