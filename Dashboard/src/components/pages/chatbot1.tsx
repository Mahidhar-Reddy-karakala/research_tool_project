import { useState, useRef, useEffect } from 'react';
import { chatMessages } from '@/lib/mockData';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bot, Send, User } from 'lucide-react';
import Markdown from 'react-markdown';

export default function Chatbot() {
  const [messages, setMessages] = useState(chatMessages);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;

    
    // Add user message
    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user' as const,
      content: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    // Simulate AI response after a delay
    setTimeout(async () => {
      const res = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await res.json();
      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant' as const,
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };
  
  
  return (
    <div className="pl-4 flex h-[calc(100vh-8rem)] flex-col">
      <div className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight">Market Assistant</h1>
        <p className="text-muted-foreground">
          Get AI-powered insights and answers for your stock queries
        </p>
      </div>
      
      <Card className="flex flex-1 flex-col">
        <CardHeader className="pb-2">
          <CardTitle>Chat with StockSense AI</CardTitle>
          <CardDescription>
            Ask about stocks, market trends, or analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`flex max-w-[80%] items-start space-x-2 rounded-lg px-3 py-2 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div >
                    <p className="text-sm">
                      <Markdown>{message.content}</Markdown>
                    </p>
                    <span className="mt-1 block text-xs opacity-70">
                      {message.timestamp}
                    </span>
                  </div>
                  {message.role === 'user' && (
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex max-w-[80%] items-start space-x-2 rounded-lg bg-muted px-4 py-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback>
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground"></div>
                    <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:0.2s]"></div>
                    <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:0.4s]"></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
        <CardFooter className="border-t p-4">
          <form onSubmit={handleSubmit} className="flex w-full space-x-2">
            <Input
              placeholder="Ask about stocks, market trends, or technical analysis..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading || !inputValue.trim()}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}



// import { useState, useRef, useEffect } from 'react';
// import { 
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Bot, Send, User } from 'lucide-react';
// import Markdown from 'react-markdown';

// // Mock initial messages
// const initialMessages = [
//   {
//     id: '1',
//     role: 'assistant',
//     content: 'Hello! I\'m your Market Assistant. I can help you with stock analysis, market trends, and investment insights. What would you like to know?',
//     timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//   }
// ];

// export default function Chatbot() {
//   const [messages, setMessages] = useState(initialMessages);
//   const [inputValue, setInputValue] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
  
//   const messagesEndRef = useRef(null);
  
//   // Scroll to bottom when messages change
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);
  
//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!inputValue.trim()) return;
    
//     // Add user message
//     const userMessage = {
//       id: `user-${Date.now()}`,
//       role: 'user',
//       content: inputValue,
//       timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//     };
    
//     setMessages((prev) => [...prev, userMessage]);
//     const currentInput = inputValue;
//     setInputValue('');
//     setIsLoading(true);
    
//     try {
//       // Changed to /analyze to match your Flask endpoint
//       const res = await fetch('http://127.0.0.1:8000/chat', {
//         method: 'POST',
//         headers: { 
//           'Content-Type': 'application/json',
//           'Accept': 'application/json',
//         },
//         body: JSON.stringify({ message: currentInput }),
//       });
      
//       if (!res.ok) {
//         throw new Error(`HTTP error! status: ${res.status}`);
//       }
      
//       const data = await res.json();
//       const assistantMessage = {
//         id: `assistant-${Date.now()}`,
//         role: 'assistant',
//         content: data.reply || data.response || 'Sorry, I couldn\'t process your request.',
//         timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//       };
      
//       setMessages((prev) => [...prev, assistantMessage]);
//     } catch (error) {
//       console.error('Error:', error);
//       const errorMessage = {
//         id: `assistant-${Date.now()}`,
//         role: 'assistant',
//         content: 'Sorry, I\'m having trouble connecting to the server. Please check if the backend is running on port 8000.',
//         timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//       };
//       setMessages((prev) => [...prev, errorMessage]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSubmit(e);
//     }
//   };
  
//   return (
//     <div className="pl-4 flex h-[calc(100vh-8rem)] flex-col">
//       <div className="mb-4">
//         <h1 className="text-3xl font-bold tracking-tight">Market Assistant</h1>
//         <p className="text-muted-foreground">
//           Get AI-powered insights and answers for your stock queries
//         </p>
//       </div>
      
//       <Card className="flex flex-1 flex-col min-h-0">
//         <CardHeader className="pb-2 flex-shrink-0">
//           <CardTitle>Chat with StockSense AI</CardTitle>
//           <CardDescription>
//             Ask about stocks, market trends, or analysis
//           </CardDescription>
//         </CardHeader>
        
//         <CardContent className="flex-1 overflow-hidden p-0">
//           <div className="h-full overflow-y-auto p-4">
//             <div className="space-y-4">
//               {messages.map((message) => (
//                 <div
//                   key={message.id}
//                   className={`flex w-full ${
//                     message.role === 'user' ? 'justify-end' : 'justify-start'
//                   }`}
//                 >
//                   <div
//                     className={`flex items-start space-x-3 max-w-[85%] ${
//                       message.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'
//                     }`}
//                   >
//                     <Avatar className="h-8 w-8 flex-shrink-0">
//                       <AvatarFallback className={message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}>
//                         {message.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
//                       </AvatarFallback>
//                     </Avatar>
                    
//                     <div className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
//                       <div
//                         className={`rounded-2xl px-4 py-3 max-w-full ${
//                           message.role === 'user'
//                             ? 'bg-primary text-primary-foreground rounded-br-md'
//                             : 'bg-muted rounded-bl-md'
//                         }`}
//                       >
//                         <div className="text-sm leading-relaxed break-words whitespace-pre-wrap">
//                           <Markdown>{message.content}</Markdown>
                          
//                         </div>
//                       </div>
//                       <span className="mt-1 text-xs text-muted-foreground px-2">
//                         {message.timestamp}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               ))}
              
//               {isLoading && (
//                 <div className="flex justify-start w-full">
//                   <div className="flex items-start space-x-3 max-w-[85%]">
//                     <Avatar className="h-8 w-8 flex-shrink-0">
//                       <AvatarFallback className="bg-muted">
//                         <Bot className="h-4 w-4" />
//                       </AvatarFallback>
//                     </Avatar>
//                     <div className="flex flex-col items-start">
//                       <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
//                         <div className="flex items-center space-x-2">
//                           <div className="flex space-x-1">
//                             <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]"></div>
//                             <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]"></div>
//                             <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]"></div>
//                           </div>
//                           <span className="text-xs text-muted-foreground">Thinking...</span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}
              
//               <div ref={messagesEndRef} />
//             </div>
//           </div>
//         </CardContent>
        
//         <CardFooter className="border-t p-4 flex-shrink-0">
//           <div className="flex w-full space-x-2">
//             <Input
//               placeholder="Ask about stocks, market trends, or technical analysis..."
//               value={inputValue}
//               onChange={(e) => setInputValue(e.target.value)}
//               onKeyPress={handleKeyPress}
//               disabled={isLoading}
//               className="flex-1"
//             />
//             <Button 
//               onClick={handleSubmit}
//               disabled={isLoading || !inputValue.trim()}
//               className="px-3"
//             >
//               <Send className="h-4 w-4" />
//               <span className="sr-only">Send</span>
//             </Button>
//           </div>
//         </CardFooter>
//       </Card>
//     </div>
//   );
// }