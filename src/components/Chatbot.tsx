import React, { useState, useRef, useEffect } from "react";
import { sendMessage, getInitialGreeting, ChatMessage, ChatResponse, generateSessionId } from "../api/chatbot";
// import img from "../../public/images/Exfoliating_Scrub.jpeg";

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([getInitialGreeting()]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<ChatResponse['product'] | null>(null);
  const [sessionId, setSessionId] = useState<string>(generateSessionId());
  const [userName, setUserName] = useState<string>("");
  const [showEscalation, setShowEscalation] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, currentProduct, showEscalation]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      sender: "user",
      text: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setCurrentProduct(null);
    setShowEscalation(false);

    try {
      const response: ChatResponse = await sendMessage(userMessage.text, sessionId, userName);
      const aiMessage: ChatMessage = {
        sender: "ai",
        text: response.message,
        timestamp: new Date(),
        intent: response.intent,
        entities: response.entities,
        actions: response.actions,
        escalation_needed: response.escalation_needed
      };
      setMessages((prev) => [...prev, aiMessage]);
      if (response.product) {
        setCurrentProduct(response.product);
      }
      if (response.escalation_needed) {
        setShowEscalation(true);
      }
      if (!userName && response.intent === 'booking' && response.entities?.contact) {
        const nameMatch = userMessage.text.match(/(?:my name is|i'm|i am|call me)\s+([a-zA-Z]+)/i);
        if (nameMatch) {
          setUserName(nameMatch[1]);
        }
      }
    } catch (error) {
      console.error("Error in chat:", error);
      const errorMessage: ChatMessage = {
        sender: "ai",
        text: "I'm sorry, something went wrong. Please try again.",
        timestamp: new Date(),
        escalation_needed: true
      };
      setMessages((prev) => [...prev, errorMessage]);
      setShowEscalation(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEscalation = () => {
    setShowEscalation(false);
    const escalationMessage: ChatMessage = {
      sender: "ai",
      text: "I'm connecting you with our customer service team. They'll be with you shortly. In the meantime, you can also reach us at:\n\n📞 Phone: (555) 123-4567\n📧 Email: support@halawawax.com\n💬 Live chat available on our website",
      timestamp: new Date(),
      intent: 'escalation'
    };
    setMessages((prev) => [...prev, escalationMessage]);
  };

  const getIntentIcon = (intent?: string) => {
    switch (intent) {
      case 'booking': return '📅';
      case 'product_inquiry': return '🛍️';
      case 'service_details': return '💰';
      case 'order_status': return '📦';
      case 'complaint': return '⚠️';
      case 'aftercare': return '🧴';
      case 'casual_chat': return '👋';
      case 'escalation': return '🆘';
      default: return '��';
    }
  };

  // In renderMessage, if msg.sender === 'ai' and msg.product && msg.product.image_key, render the image above the message
  const renderMessage = (msg: ChatMessage, index: number) => {
    const isUser = msg.sender === 'user';
    const isPoliteRestriction =
      msg.sender === 'ai' &&
      typeof msg.text === 'string' &&
      msg.text.trim().startsWith('Sorry, I can only help with product recommendations, aftercare tips, or general questions.');
    return (
      <div
        key={index}
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div
          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
            isUser
              ? 'bg-blue-500 text-white'
              : isPoliteRestriction
                ? 'bg-yellow-100 text-yellow-900 border border-yellow-300 flex items-center gap-2'
                : 'bg-gray-100 text-gray-800'
          }`}
        >
          {isPoliteRestriction ? (
            <div className="flex items-center gap-2">
              <span className="text-yellow-500 text-xl">ℹ️</span>
              <span className="whitespace-pre-wrap">{msg.text}</span>
            </div>
          ) : isUser ? (
            <div className="whitespace-pre-wrap">{msg.text}</div>
          ) : (
            <div
              className="whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: msg.text }}
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white/90 rounded-2xl shadow-2xl flex flex-col h-[70vh] min-h-[400px] sm:min-h-[500px] md:min-h-[600px] border border-pink-100 sm:h-[80vh] md:h-[80vh] lg:h-[70vh] transition-all duration-300">
      <div className="flex-1 overflow-y-auto p-2 sm:p-4 md:p-6 space-y-3 sm:space-y-4 min-w-0">
        {messages.map((msg, i) => (
          renderMessage(msg, i)
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="px-3 py-2 sm:px-4 sm:py-2 rounded-2xl bg-pink-100 text-pink-900 rounded-bl-sm animate-fade-in">
              <div className="flex items-center gap-2">
                <span className="text-pink-400 text-xl">💬</span>
                <span className="font-medium text-pink-600">Halawa Wax is typing</span>
                <span className="ml-2 flex">
                  <span className="w-2 h-2 bg-pink-400 rounded-full mr-1 animate-fade-dot" style={{ animationDelay: '0s' }}></span>
                  <span className="w-2 h-2 bg-pink-300 rounded-full mr-1 animate-fade-dot" style={{ animationDelay: '0.2s' }}></span>
                  <span className="w-2 h-2 bg-pink-200 rounded-full animate-fade-dot" style={{ animationDelay: '0.4s' }}></span>
                </span>
              </div>
            </div>
          </div>
        )}
        {showEscalation && (
          <div className="flex justify-start">
            <div className="px-3 py-2 sm:px-4 sm:py-2 rounded-2xl bg-red-100 text-red-900 rounded-bl-sm border border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <span>🆘</span>
                <span className="text-sm font-semibold">Need Human Support?</span>
              </div>
              <p className="text-sm mb-3">I can connect you with our customer service team for immediate assistance.</p>
              <button 
                onClick={handleEscalation}
                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors w-full sm:w-auto"
              >
                Connect to Human Agent
              </button>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="p-2 sm:p-4 border-t flex gap-2 bg-white rounded-b-2xl min-w-0">
        <input
          className="flex-1 px-3 py-2 sm:px-4 sm:py-2 rounded-full border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-base min-w-0"
          // On iOS/Android, font-size <16px causes input zoom. See: https://stackoverflow.com/a/52001811
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
        />
        <button 
          type="submit" 
          className={`px-4 py-2 sm:px-6 sm:py-2 rounded-full font-semibold shadow transition border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400
            ${isLoading 
              ? 'bg-gray-300 text-gray-400 cursor-not-allowed' 
              : 'bg-pink-600 text-pink hover:bg-pink-700'}
          `}
          disabled={isLoading}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default Chatbot;