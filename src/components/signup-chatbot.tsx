"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, MessageSquare, Send, X, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { chat, ChatInput } from '@/ai/flows/chatbot-conversation';

type Message = {
  id: string;
  role: 'user' | 'model';
  content: string;
};

export function SignupChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setIsLoading(true);
      chat({ history: [] }).then(response => {
        setMessages([{ id: '0', role: 'model', content: response.response }]);
        setIsLoading(false);
      }).catch(error => {
        console.error('Chatbot error:', error);
        setMessages([{ id: '0', role: 'model', content: "Sorry, I'm having a little trouble right now. Please try again later." }]);
        setIsLoading(false);
      });
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { id: String(messages.length), role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    const chatHistory: ChatInput['history'] = newMessages.map(msg => ({
      role: msg.role,
      content: msg.content,
    }));

    try {
      const response = await chat({ history: chatHistory });
      const botMessage: Message = { id: String(newMessages.length), role: 'model', content: response.response };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage: Message = { id: String(newMessages.length), role: 'model', content: "Sorry, I'm having a little trouble right now. Please try again later." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className={cn("fixed bottom-6 right-6 z-50 transition-all duration-300", isOpen ? "opacity-0 scale-90" : "opacity-100 scale-100")}>
        <Button onClick={() => setIsOpen(true)} size="icon" className="w-16 h-16 rounded-full shadow-lg glow-purple">
          <MessageSquare className="h-8 w-8" />
        </Button>
      </div>

      <div className={cn("fixed bottom-6 right-6 z-50 w-full max-w-sm transition-all duration-300 origin-bottom-right", isOpen ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none")}>
        <Card className="flex flex-col h-[60vh] shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between border-b">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <Bot className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-lg">QuantTrade Assistant</CardTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>
          <CardContent className="flex-grow p-0">
            <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={cn("flex items-start gap-3", message.role === 'user' ? "justify-end" : "justify-start")}>
                    {message.role === 'model' && (
                      <div className="p-2 bg-muted rounded-full">
                        <Bot className="w-5 h-5" />
                      </div>
                    )}
                    <div className={cn("max-w-[75%] rounded-lg p-3 text-sm", message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                      <p>{message.content}</p>
                    </div>
                     {message.role === 'user' && (
                      <div className="p-2 bg-muted rounded-full">
                        <User className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                   <div className="flex items-start gap-3 justify-start">
                      <div className="p-2 bg-muted rounded-full">
                        <Bot className="w-5 h-5" />
                      </div>
                      <div className="bg-muted rounded-lg p-3">
                        <div className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-primary animate-pulse delay-0"></span>
                            <span className="h-2 w-2 rounded-full bg-primary animate-pulse delay-150"></span>
                            <span className="h-2 w-2 rounded-full bg-primary animate-pulse delay-300"></span>
                        </div>
                      </div>
                    </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="p-4 border-t">
            <div className="relative w-full">
              <Input
                placeholder="Ask me anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                disabled={isLoading}
                className="pr-12"
              />
              <Button size="icon" onClick={handleSend} disabled={isLoading} className="absolute top-1/2 right-1.5 -translate-y-1/2 h-7 w-7">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
