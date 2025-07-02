const API_BASE_URL = 'http://localhost:7860';

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  timestamp?: Date;
  intent?: string;
  entities?: Record<string, any>;
  actions?: Array<{action: string; reason?: string}>;
  escalation_needed?: boolean;
}

export interface ChatResponse {
  message: string;
  product?: {
    name: string;
    features: string;
    benefits: string;
    image_url: string;
    product_link: string;
    price?: number;
    id?: string;
  };
  intent?: string;
  entities?: Record<string, any>;
  actions?: Array<{action: string; reason?: string}>;
  escalation_needed?: boolean;
}

export const sendMessage = async (message: string, sessionId?: string, userName?: string): Promise<ChatResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        message,
        session_id: sessionId,
        user_name: userName
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error sending message:', error);
    return {
      message: "I'm sorry, I'm having trouble connecting right now. Please try again later or contact us directly.",
      escalation_needed: true
    };
  }
};

export const getInitialGreeting = (): ChatMessage => ({
  sender: 'ai',
  text: "Hi! I'm your Halawa Wax AI assistant WAXBOT. I can help you with:\n\n• 🛍️ Product recommendations\n• 🧴 Aftercare tips\n• ❓ General questions\n\nHow can I assist you today?",
  timestamp: new Date(),
  intent: 'casual_chat'
});

export const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}; 