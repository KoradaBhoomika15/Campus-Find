import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Minimize2, Maximize2, Loader2, Sparkles, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
}

const N8N_WEBHOOK_URL = 'https://bhoomikorada9.app.n8n.cloud/webhook/bb257d10-103d-45be-a5f6-2a8d8ae923c4/chat';

export const N8nChatbot: React.FC = () => {
  const { currentUser, items, isChatbotOpen: isOpen, setIsChatbotOpen: setIsOpen } = useApp();
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: "👋 Hi! I'm the CampusFind AI Assistant powered by n8n. Looking for a lost item or want to report something you found?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [isOpen, messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = inputMessage.trim();
    if (!query || isLoading) return;

    const userMsgId = 'user-' + Date.now();
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsgList: ChatMessage[] = [
      ...messages,
      {
        id: userMsgId,
        sender: 'user',
        text: query,
        time: nowTime,
      },
    ];

    setMessages(newMsgList);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Send message to user's n8n webhook
      // We pass the chatInput along with helpful campus context if available
      const payload = {
        chatInput: query,
        message: query,
        sessionId: currentUser ? `user-${currentUser.userId}` : 'guest-session',
        user: {
          name: currentUser?.name || 'Student Guest',
          email: currentUser?.email || 'guest@campus.edu',
          department: currentUser?.department || 'General',
        },
        // Summarize items for quick assistant context
        recentLostCount: items.filter((i) => i.type === 'lost' && i.status === 'Active').length,
        recentFoundCount: items.filter((i) => i.type === 'found' && i.status === 'Active').length,
      };

      let botReply = '';

      // Try direct call or backend proxy for reliable CORS handling
      let response: Response;
      try {
        response = await fetch(N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json, text/plain, */*',
          },
          body: JSON.stringify(payload),
        });
      } catch (directErr) {
        // Fallback to local server proxy in case of browser CORS restriction
        response = await fetch('/api/n8n/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
      }

      if (response.ok) {
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const data = await response.json();
          // Support various n8n chat output key conventions
          botReply =
            data.output ||
            data.text ||
            data.response ||
            data.reply ||
            (data.message && data.message !== 'Error in workflow' ? data.message : '') ||
            (typeof data === 'string' ? data : '');

          if (!botReply && data.message === 'Error in workflow') {
            botReply = "⚠️ Note from n8n: The workflow received the message, but an internal node in your n8n workflow encountered an error. Check the n8n execution log in your cloud dashboard to see which node failed (e.g. LLM credentials, OpenAI/Gemini API key, or memory node).";
          }
        } else {
          botReply = await response.text();
        }
      } else {
        botReply = `Received response status ${response.status} from n8n assistant. Please verify your n8n workflow is active and configured.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: 'bot-' + Date.now(),
          sender: 'bot',
          text: botReply || 'I processed your request, but received an empty response. Feel free to ask again!',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err: any) {
      console.warn('n8n webhook error or CORS block:', err);
      // Fallback message providing clear instructions if webhook is in draft mode or CORS constrained
      setMessages((prev) => [
        ...prev,
        {
          id: 'bot-err-' + Date.now(),
          sender: 'bot',
          text: `⚠️ Could not reach the n8n webhook (${err.message || 'Network error'}).\n\nTips:\n1. Make sure your n8n workflow is set to "Active" (toggle top right in n8n).\n2. If using the "Test Webhook", trigger an execution in n8n or use the Production webhook URL.\n3. Make sure the Webhook node has CORS enabled (Respond to All Domains).`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'bot',
        text: "Chat cleared! How can I help you with lost or found items today?",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2.5 px-4 py-3 bg-[#FEF08A] hover:bg-[#FDE047] text-[#422006] rounded-full shadow-lg border border-[#FACC15]/60 hover:scale-105 active:scale-95 transition-all duration-200 group"
            title="Chat with CampusFind n8n Assistant"
          >
            <div className="relative">
              <Bot className="w-5 h-5 text-[#854D0E] group-hover:rotate-12 transition-transform" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold leading-tight flex items-center gap-1">
                Campus Assistant
                <Sparkles className="w-3 h-3 text-[#B45309]" />
              </span>
              <span className="text-[10px] text-[#854D0E] font-medium leading-none">n8n Connected</span>
            </div>
          </button>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-200 shadow-2xl rounded-2xl border border-[#E9DFCE] bg-[#FFFDF9] flex flex-col overflow-hidden ${
            isExpanded
              ? 'inset-3 sm:inset-10 md:inset-x-auto md:right-6 md:bottom-6 md:w-[500px] md:h-[650px]'
              : 'bottom-20 md:bottom-6 right-4 sm:right-6 w-[calc(100vw-32px)] sm:w-[380px] h-[520px]'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#FEF9C3] via-[#FEF08A] to-[#FDE047] px-4 py-3 border-b border-[#FACC15]/40 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/90 border border-[#FACC15] flex items-center justify-center shadow-xs">
                <Bot className="w-5 h-5 text-[#854D0E]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#422006] flex items-center gap-1.5">
                  CampusFind Assistant
                  <span className="px-1.5 py-0.5 text-[9px] font-semibold bg-[#422006]/10 rounded text-[#422006]">
                    n8n
                  </span>
                </h3>
                <p className="text-[11px] text-[#854D0E] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block animate-pulse" />
                  Live campus lost &amp; found agent
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={clearChat}
                title="Restart chat"
                className="p-1.5 text-[#854D0E] hover:text-[#422006] hover:bg-white/50 rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? 'Minimize size' : 'Expand size'}
                className="hidden sm:block p-1.5 text-[#854D0E] hover:text-[#422006] hover:bg-white/50 rounded-lg transition-colors"
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="p-1.5 text-[#854D0E] hover:text-[#422006] hover:bg-white/50 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick prompts */}
          <div className="bg-[#FAF6EC] px-3 py-2 border-b border-[#EFE8D8] flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
            <span className="text-[#8C8276] whitespace-nowrap font-medium text-[10px]">Quick:</span>
            <button
              onClick={() => {
                setInputMessage('Did someone find a black phone in the library?');
              }}
              className="px-2 py-1 bg-white hover:bg-[#FEF9C3] rounded-full border border-[#E5DAC8] text-[#554E46] whitespace-nowrap transition-colors"
            >
              📱 Lost phone
            </button>
            <button
              onClick={() => {
                setInputMessage('Where is the campus lost and found drop-off desk?');
              }}
              className="px-2 py-1 bg-white hover:bg-[#FEF9C3] rounded-full border border-[#E5DAC8] text-[#554E46] whitespace-nowrap transition-colors"
            >
              📍 Drop-off location
            </button>
            <button
              onClick={() => {
                setInputMessage('How do I claim an item safely?');
              }}
              className="px-2 py-1 bg-white hover:bg-[#FEF9C3] rounded-full border border-[#E5DAC8] text-[#554E46] whitespace-nowrap transition-colors"
            >
              🤝 Claim help
            </button>
          </div>

          {/* Messages list */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FAF8F2]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-lg bg-[#FEF08A] border border-[#FDE047] flex items-center justify-center shrink-0 text-[#854D0E] mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#422006] text-[#FEFCE8] rounded-br-xs shadow-xs'
                      : 'bg-white text-[#2B2520] border border-[#EFE8D8] rounded-bl-xs shadow-xs whitespace-pre-line'
                  }`}
                >
                  <p>{msg.text}</p>
                  <div
                    className={`text-[9px] mt-1 text-right ${
                      msg.sender === 'user' ? 'text-[#FEF08A]/80' : 'text-[#A3998E]'
                    }`}
                  >
                    {msg.time}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-lg bg-[#FEF08A] border border-[#FDE047] flex items-center justify-center shrink-0 text-[#854D0E]">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white text-[#554E46] border border-[#EFE8D8] rounded-2xl rounded-bl-xs px-3.5 py-2 text-xs flex items-center gap-2 shadow-xs">
                  <Loader2 className="w-3.5 h-3.5 text-[#B45309] animate-spin" />
                  <span>Checking with n8n chatbot...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-white border-t border-[#EFE8D8] flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask anything about lost or found items..."
              disabled={isLoading}
              className="flex-1 px-3.5 py-2 text-xs bg-[#FAF8F2] border border-[#E8DEC9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FACC15] focus:bg-white text-[#27221E] placeholder:text-[#A3998E]"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="p-2.5 bg-[#FEF08A] hover:bg-[#FDE047] disabled:opacity-50 text-[#422006] rounded-xl border border-[#FACC15] transition-all shrink-0 cursor-pointer disabled:cursor-not-allowed shadow-xs"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
